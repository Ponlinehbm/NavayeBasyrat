import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { audioUrl } from './config.js'

const PlayerContext = createContext(null)

const POSITIONS_KEY = 'podcast_positions_v1'

function loadPositions() {
  try { return JSON.parse(localStorage.getItem(POSITIONS_KEY)) || {} } catch { return {} }
}
function savePosition(id, time) {
  const all = loadPositions()
  all[id] = time
  localStorage.setItem(POSITIONS_KEY, JSON.stringify(all))
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  const [episode, setEpisode] = useState(null)
  const [queue, setQueue] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onTime = () => setCurrentTime(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration || 0)
    const onEnded = () => playNextInQueue()
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    const interval = setInterval(() => {
      if (audio.src && !audio.paused) savePosition(audio.dataset.epId, audio.currentTime)
    }, 4000)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      clearInterval(interval)
      audio.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playEpisode = useCallback((ep, queueList = []) => {
    const audio = audioRef.current
    const isSame = episode?.id === ep.id
    setEpisode(ep)
    setQueue(queueList)
    if (!isSame) {
      audio.src = audioUrl(ep.fileId)
      audio.dataset.epId = ep.id
      audio.playbackRate = rate
      const positions = loadPositions()
      const resumeAt = positions[ep.id]
      if (resumeAt) {
        const onceLoaded = () => {
          audio.currentTime = resumeAt
          audio.removeEventListener('loadedmetadata', onceLoaded)
        }
        audio.addEventListener('loadedmetadata', onceLoaded)
      }
    }
    audio.play().catch(() => {})
  }, [episode, rate])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio.src) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [])

  const seekToFraction = useCallback((fraction) => {
    const audio = audioRef.current
    if (!audio.duration) return
    audio.currentTime = fraction * audio.duration
  }, [])

  const skip = useCallback((deltaSec) => {
    const audio = audioRef.current
    if (!audio.duration) return
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + deltaSec), audio.duration)
  }, [])

  const changeRate = useCallback((r) => {
    setRate(r)
    if (audioRef.current) audioRef.current.playbackRate = r
  }, [])

  const playNextInQueue = useCallback(() => {
    if (!episode || queue.length === 0) return
    const idx = queue.findIndex((e) => e.id === episode.id)
    const next = queue[idx + 1]
    if (next) playEpisode(next, queue)
  }, [episode, queue, playEpisode])

  const value = {
    episode, isPlaying, currentTime, duration, rate, isExpanded,
    playEpisode, togglePlay, seekToFraction, skip, changeRate,
    setIsExpanded, playNextInQueue,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer باید داخل PlayerProvider استفاده شه')
  return ctx
}
