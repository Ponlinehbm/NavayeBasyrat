import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { PlayerProvider } from './PlayerContext.jsx'
import HomePage from './components/HomePage.jsx'
import MiniPlayer from './components/MiniPlayer.jsx'
import FullPlayer from './components/FullPlayer.jsx'
import { initTelegram } from './telegram.js'
import './styles/global.css'

function MiniApp() {
  useEffect(() => { initTelegram() }, [])
  return (
    <PlayerProvider>
      <div className="app-shell">
        <HomePage />
        <MiniPlayer />
        <FullPlayer />
      </div>
    </PlayerProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MiniApp />
  </React.StrictMode>
)
