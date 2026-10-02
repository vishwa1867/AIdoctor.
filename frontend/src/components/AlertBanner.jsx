export default function AlertBanner({ message, type = 'info' }) {
  const styles = {
    critical: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', icon: '🚨' },
    warning: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: '⚠️' },
    success: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: '✅' },
    info: { bg: '#eff6ff', color: '#1a73e8', border: '#dbeafe', icon: 'ℹ️' },
  }
  const s = styles[type]

  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <span style={{ fontSize: 16 }}>{s.icon}</span>
      <span style={{ fontSize: 13, color: s.color, fontWeight: 500 }}>{message}</span>
    </div>
  )
}