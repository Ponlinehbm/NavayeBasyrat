import { usePlayer } from '../PlayerContext.jsx'
import { Icon } from './Icon.jsx'

export default function MiniPlayer() {
  const { episode, isPlaying, currentTime, duration, togglePlay, setIsExpanded } = usePlayer()
  if (!episode) return null

  const progress = duration ? currentTime / duration : 0

  return (
    <div className="mini-player">
      <div className="mini-progress"><div style={{ width: `${progress * 100}%` }} /></div>
      <div className="ep-cover">{episode.cover ? <img src={episode.cover} alt="" /> : <Icon.Mic />}</div>
      <div className="ep-info" onClick={() => setIsExpanded(true)}>
        <p className="ep-title">{episode.title}</p>
        <div className="ep-meta">{episode.categoryName}</div>
      </div>
      <button className="icon-btn" onClick={togglePlay} aria-label="پخش/توقف">
        {isPlaying ? <Icon.Pause /> : <Icon.Play />}
      </button>
    </div>
  )
}
