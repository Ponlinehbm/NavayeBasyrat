import { useEffect, useMemo, useState } from 'react'
import { fetchEpisodes } from '../api.js'
import CategoryTabs from './CategoryTabs.jsx'
import EpisodeCard from './EpisodeCard.jsx'
import { Icon } from './Icon.jsx'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchEpisodes()
      .then(({ categories, episodes }) => {
        const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))
        setCategories(categories)
        setEpisodes(episodes.map((e) => ({ ...e, categoryName: catMap[e.categoryId] || '' })))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return episodes.filter((e) => {
      const matchesCat = activeCat === 'all' || e.categoryId === activeCat
      const matchesQuery = !query || e.title.toLowerCase().includes(query.toLowerCase())
      return matchesCat && matchesQuery
    })
  }, [episodes, activeCat, query])

  return (
    <>
      <header className="app-header">
        <div className="brand-row">
          <span className="brand">پادکست<span className="dot">.</span></span>
        </div>
        <div className="search-box">
          <Icon.Search />
          <input
            placeholder="جستجوی اپیزود..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <CategoryTabs categories={categories} active={activeCat} onChange={setActiveCat} />

      <div className="episode-list">
        {loading && <div className="empty-state">در حال بار شدن اپیزودها...</div>}
        {error && <div className="empty-state">مشکلی در دریافت داده‌ها پیش اومد.<br />{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">اپیزودی پیدا نشد.</div>
        )}
        {filtered.map((ep) => (
          <EpisodeCard key={ep.id} episode={ep} queue={filtered} />
        ))}
      </div>
    </>
  )
}
