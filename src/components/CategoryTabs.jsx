export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="category-row">
      <button className={'pill' + (active === 'all' ? ' active' : '')} onClick={() => onChange('all')}>
        همه
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          className={'pill' + (active === c.id ? ' active' : '')}
          onClick={() => onChange(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
