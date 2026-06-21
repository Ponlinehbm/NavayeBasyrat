import { useState } from 'react'
import { Icon } from '../components/Icon.jsx'

function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '')
}

export default function CategoryManager({ categories, onChange }) {
  const [name, setName] = useState('')

  const addCategory = () => {
    if (!name.trim()) return
    const id = slugify(name) || `cat-${Date.now()}`
    if (categories.some((c) => c.id === id)) return
    onChange([...categories, { id, name: name.trim() }])
    setName('')
  }

  const removeCategory = (id) => {
    onChange(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="card">
      <div className="field">
        <label>دسته‌بندی‌ها</label>
        <div className="row">
          <input
            placeholder="نام دسته‌بندی جدید"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
          />
          <button type="button" className="btn secondary" onClick={addCategory} style={{ flex: 'none' }}>
            افزودن
          </button>
        </div>
      </div>
      {categories.map((c) => (
        <div className="admin-ep-item" key={c.id}>
          <span className="ep-info">{c.name}</span>
          <div className="actions">
            <button type="button" onClick={() => removeCategory(c.id)}><Icon.Trash /></button>
          </div>
        </div>
      ))}
      {categories.length === 0 && <p className="helper-text">هنوز دسته‌بندی‌ای ساخته نشده.</p>}
    </div>
  )
}
