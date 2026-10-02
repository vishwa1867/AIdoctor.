export default function SymptomSelector({ symptoms, selected, onToggle, search, onSearch }) {
  const filtered = symptoms.filter(s => s.replace(/_/g, ' ').includes(search.toLowerCase()))

  return (
    <div>
      <input
        placeholder="Search symptoms..."
        value={search}
        onChange={e => onSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', background: '#f8faff', border: '1px solid #eef2ff', borderRadius: 10, fontSize: 13, outline: 'none', marginBottom: 14, color: '#1a1a2e' }}
      />
      <div style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {filtered.map(s => (
          <button key={s} onClick={() => onToggle(s)} style={{
            padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
            background: selected.includes(s) ? '#1a73e8' : '#f8faff',
            border: `1px solid ${selected.includes(s) ? '#1a73e8' : '#eef2ff'}`,
            color: selected.includes(s) ? '#fff' : '#64748b',
            fontWeight: selected.includes(s) ? 500 : 400
          }}>{s.replace(/_/g, ' ')}</button>
        ))}
      </div>
    </div>
  )
}