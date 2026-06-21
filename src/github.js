import { CONFIG } from './config.js'

const API_BASE = 'https://api.github.com'

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  }
}

// base64 امن برای یونیکد (فارسی) — btoa ساده با کاراکترهای غیر لاتین کار نمی‌کنه
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return btoa(binary)
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export async function testToken(token) {
  const res = await fetch(`${API_BASE}/user`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error('توکن نامعتبره یا دسترسی نداره')
  return res.json()
}

export async function getEpisodesFile(token) {
  const url = `${API_BASE}/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.DATA_PATH}?ref=${CONFIG.GITHUB_BRANCH}`
  const res = await fetch(url, { headers: authHeaders(token) })
  if (!res.ok) {
    if (res.status === 404) {
      return { sha: null, data: { categories: [], episodes: [] } }
    }
    throw new Error('خوندن فایل داده با خطا مواجه شد (' + res.status + ')')
  }
  const json = await res.json()
  const text = base64ToUtf8(json.content)
  return { sha: json.sha, data: JSON.parse(text) }
}

export async function saveEpisodesFile(token, data, sha, message) {
  const url = `${API_BASE}/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.DATA_PATH}`
  const body = {
    message: message || 'بروزرسانی اپیزودها از پنل ادمین',
    content: utf8ToBase64(JSON.stringify(data, null, 2)),
    branch: CONFIG.GITHUB_BRANCH,
  }
  if (sha) body.sha = sha
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'ذخیره با خطا مواجه شد (' + res.status + ')')
  }
  return res.json()
}
