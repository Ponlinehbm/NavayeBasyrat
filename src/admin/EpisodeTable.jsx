import { Icon } from '../components/Icon.jsx'
import { formatDuration } from '../api.js'

export default function EpisodeTable({ episodes, categories, onEdit, onDelete }) {
  const catName = (id) => categories.find((c) => c.id === id)?.name || '—'

  if (episodes.length === 0) {
    return <div className="card"><p className="helper-text">هنوز اپیزودی اضافه نشده.</p></div>
  }

  return (
    <div className="card">
      {episodes.map((ep) => (
        <div className="admin-ep-item" key={ep.id}>
          <div className="ep-info">
            <p className="ep-title">{ep.title}</p>
            <div className="ep-meta">
              <span>{catName(ep.categoryId)}</span>
              <span>·</span>
              <span className="dur">{formatDuration(ep.duration)}</span>
            </div>
          </div>
          <div className="actions">
            <button type="button" onClick={() => onEdit(ep)}>ویرایش</button>
            <button type="button" onClick={() => onDelete(ep.id)}><Icon.Trash /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
