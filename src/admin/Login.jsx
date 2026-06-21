import { useState } from 'react'
import { testToken } from '../github.js'

export default function Login({ onSuccess }) {
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await testToken(token)
      sessionStorage.setItem('gh_pat', token)
      onSuccess(token)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <h1>ورود به پنل ادمین</h1>
        <p>برای ویرایش اپیزودها به یک GitHub Personal Access Token نیاز داری.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>GitHub Personal Access Token</label>
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        {error && <p className="helper-text" style={{ color: 'var(--danger)' }}>{error}</p>}
        <button className="btn" disabled={busy || !token}>{busy ? 'در حال بررسی...' : 'ورود'}</button>
      </form>

      <div className="card">
        <p className="helper-text">
          راهنما: وارد GitHub شو → Settings → Developer settings → Fine-grained tokens → یک توکن جدید بساز
          و فقط دسترسی «Contents: Read and write» رو برای همین ریپازیتوری فعال کن.
          این توکن فقط توی همین تب مرورگرت (sessionStorage) نگه داشته می‌شه و با بستن تب پاک می‌شه؛
          هیچ‌جا ذخیره یا ارسال نمی‌شه به‌جز مستقیم به GitHub API.
        </p>
      </div>
    </div>
  )
}
