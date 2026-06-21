import { Icon } from './Icon.jsx'
import { formatDuration } from '../api.js'
import { usePlayer } from '../PlayerContext.jsx'

export default function EpisodeCard({ episode, queue }) {
  const { episode: current, isPlaying, playEpisode, togglePlay } = usePlayer()
  const isCurrent = current?.id === episode.id

  const handlePlay = () => {
    if (isCurrent) togglePlay()
    else playEpisode(episode, queue)
  }

  return (
    <button className="episode-card" onClick={handlePlay}>
      <div className="ep-cover">{episode.cover ? <img src={episode.cover} alt="" /> : <Icon.Mic />}</div>
      <div className="ep-info">
        <p className="ep-title">{episode.title}</p>
        <div className="ep-meta">
          <span>{episode.categoryName}</span>
          <span>·</span>
          <span className="dur">{formatDuration(episode.duration)}</span>
        </div>
      </div>
      <div className="ep-play-btn">
        {isCurrent && isPlaying ? <Icon.Pause size={16} /> : <Icon.Play size={16} />}
      </div>
    </button>
  )
}
