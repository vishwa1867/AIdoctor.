import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllConsultations } from '../services/apiService'

function History() {
  const [consultations, setConsultations] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getAllConsultations().then(res => setConsultations(res.data)).catch(() => {})
  }, [])

  const severityColor = { Mild: '#16a34a', Moderate: '#d97706', Critical: '#dc2626' }
  const severityBg = { Mild: '#f0fdf4', Moderate: '#fffbeb', Critical: '#fef2f2' }
  const filtered = consultations.filter(c => c.patientName?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8faff', width: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #eef2ff', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'fixed', top: 0, left: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #eef2ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#1a73e8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏥</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>MediAssist AI</div>
              <div style={{ fontSize: 11, color: '#1a73e8' }}>Clinical Support</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 0', flex: 1 }}>
          {[
            { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
            { icon: '🧠', label: 'Diagnose', path: '/' },
            { icon: '👥', label: 'Patients', path: '/history' },
            { icon: '📋', label: 'History', path: '/history', active: true },
            { icon: '⚙️', label: 'Settings', path: '/' },
          ].map(item => (
            <div key={item.label} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
              fontSize: 13, cursor: 'pointer',
              color: item.active ? '#1a73e8' : '#64748b',
              background: item.active ? '#eff6ff' : 'transparent',
              borderLeft: item.active ? '3px solid #1a73e8' : '3px solid transparent',
              fontWeight: item.active ? 500 : 400
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ marginLeft: 220, flex: 1, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a2e' }}>Consultation History</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>{consultations.length} total consultations</p>
          </div>
          <button onClick={() => navigate('/')} style={{ background: '#1a73e8', border: 'none', borderRadius: 10, color: '#fff', padding: '10px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
            + New Consultation
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Total', val: consultations.length, color: '#1a73e8', bg: '#eff6ff', icon: '📋' },
            { label: 'Critical', val: consultations.filter(c => c.severity === 'Critical').length, color: '#dc2626', bg: '#fef2f2', icon: '🚨' },
            { label: 'Moderate', val: consultations.filter(c => c.severity === 'Moderate').length, color: '#d97706', bg: '#fffbeb', icon: '⚠️' },
            { label: 'Mild', val: consultations.filter(c => c.severity === 'Mild').length, color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
          ].map(m => (
            <div key={m.label} style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 40, height: 40, background: m.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{m.icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.val}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Table */}
        <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eef2ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>All Consultations</span>
            <input placeholder="🔍 Search patient..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 14px', background: '#f8faff', border: '1px solid #eef2ff', borderRadius: 8, fontSize: 13, outline: 'none', width: 220, color: '#1a1a2e' }} />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faff', borderBottom: '1px solid #eef2ff' }}>
                {['#', 'Patient', 'Disease', 'Severity', 'Confidence', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontSize: 11, color: '#94a3b8', fontWeight: 500, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f8faff', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8' }}>{i + 1}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={`/patients/p${(i % 4) + 1}.jpg`} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eef2ff' }} onError={e => { e.target.style.display = 'none' }} />
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#1a73e8' }}>{c.patientName?.[0]?.toUpperCase()}</div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{c.patientName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>{c.predictedDisease || '—'}</td>
                  <td style={{ padding: '13px 16px' }}>
                    {c.severity
                      ? <span style={{ background: severityBg[c.severity], color: severityColor[c.severity], padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{c.severity}</span>
                      : '—'}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#1a73e8', fontWeight: 500 }}>{c.confidence ? `${c.confidence}%` : '—'}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ background: c.status === 'Active' ? '#f0fdf4' : '#f8faff', color: c.status === 'Active' ? '#16a34a' : '#94a3b8', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(c.startedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>No consultations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default History