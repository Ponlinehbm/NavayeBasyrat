// لایه‌ی نازک روی Telegram WebApp SDK — اگر بیرون از تلگرام باز شه (مثلاً توی مرورگر برای تست)
// هیچ کرش نمی‌کنه، فقط قابلیت‌های تلگرامی غیرفعال می‌مونن.

const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null

export function initTelegram() {
  if (!tg) return
  tg.ready()
  tg.expand()
  try {
    tg.setHeaderColor('#14110f')
    tg.setBackgroundColor('#14110f')
  } catch (e) { /* در نسخه‌های قدیمی کلاینت ممکنه نباشه */ }
}

export function hapticTap() {
  tg?.HapticFeedback?.impactOccurred?.('light')
}

export function hapticSelect() {
  tg?.HapticFeedback?.selectionChanged?.()
}

export function setBackButton(onClick) {
  if (!tg) return () => {}
  tg.BackButton.show()
  tg.BackButton.onClick(onClick)
  return () => {
    tg.BackButton.offClick(onClick)
    tg.BackButton.hide()
  }
}

export function getTelegramUser() {
  return tg?.initDataUnsafe?.user ?? null
}

export const isInsideTelegram = !!tg
