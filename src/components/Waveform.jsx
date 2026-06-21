import { useMemo, useRef } from 'react'

// تولید الگوی موج تصادفی ولی ثابت برای هر اپیزود (بر اساس id) — صرفاً تزئینیه،
// نه تحلیل واقعی فایل صوتی (که بدون پردازش سمت سرور ممکن نیست).
function seededBars(seed, count) {
  let s = 0
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 100000
  const bars = []
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280
    const rnd = s / 233280
    bars.push(0.25 + rnd * 0.75)
  }
  return bars
}

export default function Waveform({ episodeId, progress, onScrub, barCount = 46 }) {
  const trackRef = useRef(null)
  const bars = useMemo(() => seededBars(episodeId || 'x', barCount), [episodeId, barCount])
  const playedCount = Math.round(progress * barCount)

  const handlePointer = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect()
    const fraction = Math.min(Math.max(0, (clientX - rect.left) / rect.width), 1)
    onScrub(fraction)
  }

  return (
    <div
      className="waveform"
      ref={trackRef}
      onClick={(e) => handlePointer(e.clientX)}
      onTouchStart={(e) => handlePointer(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointer(e.touches[0].clientX)}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          className={'bar' + (i < playedCount ? ' played' : '')}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  )
}
