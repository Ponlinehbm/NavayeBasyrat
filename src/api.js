import { dataUrl } from './config.js'

export async function fetchEpisodes() {
  const res = await fetch(dataUrl(), { cache: 'no-store' })
  if (!res.ok) throw new Error('داده‌ها در دسترس نیست')
  const json = await res.json()
  return {
    categories: json.categories ?? [],
    episodes: (json.episodes ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }
}

export function formatDuration(sec = 0) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
