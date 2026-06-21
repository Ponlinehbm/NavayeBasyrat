import { useEffect, useState } from 'react'

const EMPTY = { id: '', title: '', description: '', categoryId: '', fileId: '', duration: 0, cover: '', order: 0 }

export default function EpisodeForm({ categories, editing, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [pasteBox, setPasteBox] = useState('')
  const [pasteError, setPasteError] = useState(null)

  useEffect(() => {
    setForm(editing || { ...EMPTY, id: `ep-${Date.now()}`, categoryId: categories[0]?.id || '' })
    setPasteBox('')
    setPasteError(null)
  }, [editing, categories])

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const applyPaste = () => {
    try {
      const parsed = JSON.parse(pasteBox)
      setForm((f) => ({
        ...f,
        title: parsed.title || f.title,
        fileId: parsed.fileId || f.fileId,
        duration: parsed.duration ?? f.duration,
      }))
      setPasteError(null)
    } catch {
      setPasteError('متن وارد شده JSON معتبر نیست. باید همون پیامی باشه که بات تلگرام برات فرستاده.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.fileId || !form.categoryId) return
    onSave({ ...form, duration: Number(form.duration) || 0, order: Number(form.order) || 0 })
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field">
        <label>چسباندن سریع (از پاسخ بات تلگرام)</label>
        <textarea
          placeholder="فایل صوتی رو توی تلگرام به بات فوروارد کن، بات یک JSON برمی‌گردونه — همونو اینجا پیست کن"
          value={pasteBox}
          onChange={(e) => setPasteBox(e.target.value)}
        />
        {pasteError && <p className="helper-text" style={{ color: 'var(--danger)' }}>{pasteError}</p>}
        <button type="button" className="btn secondary" onClick={applyPaste} disabled={!pasteBox}>
          تجزیه و پر کردن فرم
        </button>
      </div>

      <div className="field">
        <label>عنوان اپیزود</label>
        <input value={form.title} onChange={(e) => update('title', e.target.value)} required />
      </div>

      <div className="field">
        <label>توضیحات</label>
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} />
      </div>

      <div className="row">
        <div className="field">
          <label>دسته‌بندی</label>
          <select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} required>
            <option value="" disabled>انتخاب کن</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>مدت زمان (ثانیه)</label>
          <input type="number" min="0" value={form.duration} onChange={(e) => update('duration', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Telegram File ID</label>
        <input value={form.fileId} onChange={(e) => update('fileId', e.target.value)} required />
      </div>

      <div className="row">
        <div className="field">
          <label>کاور (لینک تصویر — اختیاری)</label>
          <input value={form.cover} onChange={(e) => update('cover', e.target.value)} />
        </div>
        <div className="field">
          <label>ترتیب نمایش</label>
          <input type="number" value={form.order} onChange={(e) => update('order', e.target.value)} />
        </div>
      </div>

      <div className="row" style={{ marginTop: 6 }}>
        <button className="btn" type="submit">{editing ? 'ذخیره تغییرات' : 'افزودن اپیزود'}</button>
        {editing && <button type="button" className="btn secondary" onClick={onCancel}>انصراف</button>}
      </div>
    </form>
  )
}
