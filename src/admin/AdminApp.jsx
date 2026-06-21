import { useEffect, useState } from 'react'
import Login from './Login.jsx'
import CategoryManager from './CategoryManager.jsx'
import EpisodeForm from './EpisodeForm.jsx'
import EpisodeTable from './EpisodeTable.jsx'
import { getEpisodesFile, saveEpisodesFile } from '../github.js'
import { CONFIG } from '../config.js'

export default function AdminApp() {
  const [token, setToken] = useState(() => sessionStorage.getItem('gh_pat'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sha, setSha] = useState(null)
  const [data, setData] = useState({ categories: [], episodes: [] })
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async (t) => {
    setLoading(true)
    setError(null)
    try {
      const { sha, data } = await getEpisodesFile(t)
      setSha(sha)
      setData(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (token) load(token) }, [token])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200) }

  const persist = async (nextData, message) => {
    setSaving(true)
    try {
      const res = await saveEpisodesFile(token, nextData, sha, message)
      setSha(res.content.sha)
      setData(nextData)
      showToast('ذخیره شد ✓')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEpisode = (ep) => {
    const exists = data.episodes.some((e) => e.id === ep.id)
    const episodes = exists
      ? data.episodes.map((e) => (e.id === ep.id ? ep : e))
      : [...data.episodes, ep]
    persist({ ...data, episodes }, exists ? `ویرایش اپیزود: ${ep.title}` : `افزودن اپیزود: ${ep.title}`)
    setEditing(null)
  }

  const handleDelete = (id) => {
    if (!confirm('حذف این اپیزود مطمئنی؟')) return
    persist({ ...data, episodes: data.episodes.filter((e) => e.id !== id) }, 'حذف اپیزود')
  }

  const handleCategoriesChange = (categories) => {
    persist({ ...data, categories }, 'بروزرسانی دسته‌بندی‌ها')
  }

  const logout = () => {
    sessionStorage.removeItem('gh_pat')
    setToken(null)
  }

  if (!token) return <Login onSuccess={setToken} />
  if (loading) return <div className="admin-shell"><p className="helper-text">در حال بار شدن...</p></div>

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <h1>پنل ادمین پادکست</h1>
        <p>ریپازیتوری: {CONFIG.GITHUB_OWNER}/{CONFIG.GITHUB_REPO} — هر تغییر مستقیم به صورت یک کامیت ذخیره می‌شه.</p>
      </div>

      {error && <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>}

      <CategoryManager categories={data.categories} onChange={handleCategoriesChange} />

      <EpisodeForm
        categories={data.categories}
        editing={editing}
        onSave={handleSaveEpisode}
        onCancel={() => setEditing(null)}
      />

      <EpisodeTable
        episodes={data.episodes}
        categories={data.categories}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      <button className="btn secondary" onClick={logout}>خروج</button>

      {saving && <div className="toast">در حال ذخیره...</div>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
