export default function PredictionCard({ result }) {
  const severityColor = { Mild: '#16a34a', Moderate: '#d97706', Critical: '#dc2626' }
  const severityBg = { Mild: '#f0fdf4', Moderate: '#fffbeb', Critical: '#fef2f2' }

  return (
    <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Predicted Disease</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>{result.predictedDisease}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ background: severityBg[result.severity], color: severityColor[result.severity], padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
          {result.severity} Severity
        </span>
        <span style={{ background: '#eff6ff', color: '#1a73e8', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
          {result.confidence}% Confidence
        </span>
      </div>
    </div>
  )
}