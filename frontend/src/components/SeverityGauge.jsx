export default function SeverityGauge({ severity }) {
  const levels = ['Mild', 'Moderate', 'Critical']
  const colors = { Mild: '#16a34a', Moderate: '#d97706', Critical: '#dc2626' }
  const idx = levels.indexOf(severity)

  return (
    <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 14 }}>Severity Level</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {levels.map((l, i) => (
          <div key={l} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 8, borderRadius: 4,
              background: i <= idx ? colors[severity] : '#eef2ff',
              marginBottom: 6, transition: 'all 0.3s'
            }} />
            <div style={{ fontSize: 11, color: i === idx ? colors[severity] : '#94a3b8', fontWeight: i === idx ? 600 : 400 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}