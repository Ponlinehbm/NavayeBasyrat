import { usePlayer } from '../PlayerContext.jsx'
import { Icon } from './Icon.jsx'
import Waveform from './Waveform.jsx'
import { formatDuration } from '../api.js'

const SPEEDS = [1, 1.25, 1.5, 1.75, 2]

export default function FullPlayer() {
  const {
    episode, isPlaying, currentTime, duration, rate, isExpanded,
    togglePlay, seekToFraction, skip, changeRate, setIsExpanded,
  } = usePlayer()

  if (!isExpanded || !episode) return null
  const progress = duration ? currentTime / duration : 0

  return (
    <div className="full-player">
      <div className="full-player-top">
        <button className="icon-btn" onClick={() => setIsExpanded(false)} aria-label="بستن">
          <Icon.ChevronDown />
        </button>
        <span className="helper-text">{episode.categoryName}</span>
        <span style={{ width: 38 }} />
      </div>

      <div className="full-cover-wrap">
        <div className="full-cover">
          {episode.cover ? <img src={episode.cover} alt="" /> : <Icon.Mic size={40} />}
        </div>
      </div>

      <div className="full-meta">
        <p className="full-title">{episode.title}</p>
        <span className="full-cat">{episode.categoryName}</span>
      </div>

      <Waveform episodeId={episode.id} progress={progress} onScrub={seekToFraction} />

      <div className="time-row">
        <span>{formatDuration(currentTime)}</span>
        <span>{formatDuration(duration)}</span>
      </div>

      <div className="transport">
        <button className="icon-btn" onClick={() => skip(-15)} aria-label="۱۵ ثانیه عقب">
          <Icon.Back15 />
        </button>
        <button className="play-fab" onClick={togglePlay} aria-label="پخش/توقف">
          {isPlaying ? <Icon.Pause size={26} /> : <Icon.Play size={26} />}
        </button>
        <button className="icon-btn" onClick={() => skip(15)} aria-label="۱۵ ثانیه جلو">
          <Icon.Forward15 />
        </button>
      </div>

      <div className="speed-row">
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={'speed-chip' + (rate === s ? ' active' : '')}
            onClick={() => changeRate(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}
