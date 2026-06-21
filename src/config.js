// ⚠️ این تنها فایلی است که برای راه‌اندازی حتماً باید دستی پر کنی.

export const CONFIG = {
  // نام کاربری گیت‌هاب و نام ریپازیتوری — برای خواندن/نوشتن data/episodes.json
  GITHUB_OWNER: 'YOUR_GITHUB_USERNAME',
  GITHUB_REPO: 'YOUR_REPO_NAME',
  GITHUB_BRANCH: 'main',
  DATA_PATH: 'data/episodes.json',

  // آدرس Cloudflare Worker (بعد از دیپلوی، از پنل Cloudflare کپی کن)
  // مثال: https://podcast-proxy.username.workers.dev
  WORKER_URL: 'https://YOUR-WORKER.workers.dev',
}

// آدرس خام فایل داده برای خوندن سریع (از طریق jsDelivr CDN — کش می‌شه و سریع‌تره)
export function dataUrl() {
  return `https://cdn.jsdelivr.net/gh/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}@${CONFIG.GITHUB_BRANCH}/${CONFIG.DATA_PATH}?t=${Date.now()}`
}

// آدرس استریم فایل صوتی از طریق پروکسی امن (توکن بات هرگز توی فرانت‌اند نیست)
export function audioUrl(fileId) {
  return `${CONFIG.WORKER_URL}/file/${encodeURIComponent(fileId)}`
}
