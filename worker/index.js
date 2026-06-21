/**
 * Cloudflare Worker — دو وظیفه دارد:
 *
 * 1) GET /file/:fileId
 *    پروکسی امن فایل صوتی از تلگرام. توکن بات هیچوقت سمت کاربر دیده نمی‌شه،
 *    و درخواست‌های Range رو هم پاس می‌ده تا جابه‌جایی روی نوار پخش (seek) درست کار کنه.
 *
 * 2) POST /webhook
 *    وب‌هوک بات تلگرام. وقتی فایل صوتی‌ای رو به بات فوروارد کنی، بات یک قطعه JSON
 *    برمی‌گردونه که می‌تونی مستقیم توی پنل ادمین (بخش «چسباندن سریع») پیست کنی.
 *
 * راه‌اندازی:
 *  - یک متغیر مخفی به اسم BOT_TOKEN توی تنظیمات Worker (Settings → Variables) بساز
 *    و توکن باتت رو (از BotFather) توش بگذار.
 *  - بعد از دیپلوی، با این آدرس وب‌هوک بات رو ست کن (یک بار، توی مرورگر کافیه):
 *    https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<your-worker>.workers.dev/webhook
 */

const MIME_BY_EXT = {
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  opus: 'audio/ogg',
  wav: 'audio/wav',
  flac: 'audio/flac',
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range, Content-Type',
    'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
  }
}

function guessMime(filePath) {
  const ext = (filePath.split('.').pop() || '').toLowerCase()
  return MIME_BY_EXT[ext] || 'application/octet-stream'
}

async function handleFileProxy(fileId, request, env) {
  const tgApi = `https://api.telegram.org/bot${env.BOT_TOKEN}/getFile?file_id=${encodeURIComponent(fileId)}`
  const infoRes = await fetch(tgApi)
  const info = await infoRes.json()

  if (!info.ok) {
    return new Response('فایل پیدا نشد یا file_id نامعتبره', { status: 404, headers: corsHeaders() })
  }

  const filePath = info.result.file_path
  const fileUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN}/${filePath}`

  const upstreamHeaders = {}
  const range = request.headers.get('Range')
  if (range) upstreamHeaders['Range'] = range

  const upstream = await fetch(fileUrl, { headers: upstreamHeaders })

  const headers = new Headers(corsHeaders())
  headers.set('Content-Type', guessMime(filePath))
  headers.set('Accept-Ranges', 'bytes')
  const contentRange = upstream.headers.get('content-range')
  const contentLength = upstream.headers.get('content-length')
  if (contentRange) headers.set('Content-Range', contentRange)
  if (contentLength) headers.set('Content-Length', contentLength)
  headers.set('Cache-Control', 'public, max-age=86400')

  return new Response(upstream.body, { status: upstream.status, headers })
}

async function tgSend(env, chatId, text) {
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

async function handleWebhook(request, env) {
  const update = await request.json().catch(() => null)
  const msg = update?.message
  if (!msg) return new Response('ok')

  const media = msg.audio || msg.voice || msg.document
  const chatId = msg.chat.id

  if (!media) {
    await tgSend(env, chatId, 'یک فایل صوتی (audio) رو از کانالت اینجا فوروارد کن تا اطلاعاتش رو برات استخراج کنم.')
    return new Response('ok')
  }

  const payload = {
    title: msg.audio?.title || msg.audio?.file_name || media.file_name || 'بدون عنوان',
    fileId: media.file_id,
    duration: media.duration || 0,
  }

  const text =
    `این اطلاعات رو توی «چسباندن سریع» پنل ادمین پیست کن:\n\n` +
    `<pre>${JSON.stringify(payload, null, 2)}</pre>`

  await tgSend(env, chatId, text)
  return new Response('ok')
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() })
    }

    if (url.pathname.startsWith('/file/')) {
      const fileId = decodeURIComponent(url.pathname.replace('/file/', ''))
      try {
        return await handleFileProxy(fileId, request, env)
      } catch (e) {
        return new Response('خطای پروکسی: ' + e.message, { status: 500, headers: corsHeaders() })
      }
    }

    if (url.pathname === '/webhook' && request.method === 'POST') {
      return handleWebhook(request, env)
    }

    return new Response('podcast worker is running', { headers: corsHeaders() })
  },
}
