import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllConsultations } from '../services/apiService'

const Sidebar = ({ navigate, active }) => (
  <div style={{ width: 220, background: '#fff', borderRight: '1px solid #eef2ff', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10 }}>
    <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #eef2ff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src=" \\assets\istockphoto-177373093-612x612.jpglogo" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
        <div style={{ width: 36, height: 36, background: '#9cc7ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🩺</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>MediAssist AI</div>
          <div style={{ fontSize: 11, color: '#1a73e8' }}>Clinical Support</div>
        </div>
      </div>
    </div>
    <div style={{ padding: '12px 0', flex: 1 }}>
      {[
        { icon: '', label: 'Dashboard', path: '/dashboard' },
        { icon: '', label: 'Diagnose', path: 'diagnosis' },
        { icon: '', label: 'Patients', path: '/history' },
        { icon: '', label: 'Appointments', path: '/history' },
        { icon: '', label: 'Analytics', path: '/history' },
        { icon: '', label: 'Alerts', path: '/history', badge: 3 },
        { icon: '', label: 'History', path: '/history' },
        { icon: '', label: 'Settings', path: '/history' },
      ].map(item => (
        <div key={item.label} onClick={() => navigate(item.path)} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 20px', fontSize: 13, cursor: 'pointer',
          color: active === item.label ? '#1a73e8' : '#64748b',
          background: active === item.label ? '#eff6ff' : 'transparent',
          borderLeft: active === item.label ? '3px solid #1a73e8' : '3px solid transparent',
          fontWeight: active === item.label ? 500 : 400,
          transition: 'all 0.15s'
        }}>
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          {item.label}
          {item.badge && <span style={{ marginLeft: 'auto', background: '#fee2e2', color: '#dc2626', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 600 }}>{item.badge}</span>}
        </div>
      ))}
    </div>
    <div style={{ padding: '16px 20px', borderTop: '1px solid #eef2ff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src=" \assets\doctorVisitBG.png" alt="doctor" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e8f5' }} onError={e => e.target.style.display = 'none'} />
        <div style={{ width: 34, height: 34, background: '#1a73e8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>DR</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>Dr. Vishwa</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>General Physician</div>
        </div>
      </div>
    </div>
  </div>
)

function Dashboard() {
  const [consultations, setConsultations] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getAllConsultations().then(res => setConsultations(res.data)).catch(() => {})
  }, [])

  const critical = consultations.filter(c => c.severity === 'Critical').length
  const severityColor = { Mild: '#16a34a', Moderate: '#d97706', Critical: '#dc2626' }
  const severityBg = { Mild: '#f0fdf4', Moderate: '#fffbeb', Critical: '#fef2f2' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8faff', width: '100%' }}>
      <Sidebar navigate={navigate} active="Dashboard" />

      <div style={{ marginLeft: 220, flex: 1, padding: 28, minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a2e' }}>Good morning Dr. Ananya </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>{new Date().toDateString()} — Clinical Overview</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 500, border: '1px solid #bbf7d0' }}>● ML Live</span>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}></span>
              <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: '#dc2626', borderRadius: '50%', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span>
            </div>
            <img src="/doctor-avatar.png" alt="dr" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e8f5' }} onError={e => { e.target.outerHTML = '<div style="width:36px;height:36px;background:#1a73e8;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600">DR</div>' }} />
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Patients', val: consultations.length, sub: '↑ 12 this week', color: '#1a73e8', icon: '👥', bg: '#eff6ff' },
            { label: 'Critical Cases', val: critical, sub: 'Needs attention', color: '#dc2626', icon: '', bg: '#fef2f2' },
            { label: 'ML Accuracy', val: '94.2%', sub: '↑ 1.3% this month', color: '#1a73e8', icon: '', bg: '#eff6ff' },
            { label: 'Avg Diagnosis', val: '1.8s', sub: 'Real-time ML', color: '#16a34a', icon: '', bg: '#f0fdf4' },
          ].map(m => (
            <div key={m.label} style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.val}</div>
                  <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4 }}>{m.sub}</div>
                </div>
                <div style={{ width: 42, height: 42, background: m.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{m.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Recent Patients */}
          <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>Recent Patients</span>
              <span onClick={() => navigate('/history')} style={{ fontSize: 12, color: '#1a73e8', cursor: 'pointer' }}>View all →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { name: 'Rahul Kumar', age: 32, disease: 'Dengue', severity: 'Critical', img: '/patients/p1.jpg' },
                { name: 'Priya Sharma', age: 28, disease: 'Pneumonia', severity: 'Moderate', img: '/patients/p2.jpg' },
                { name: 'Arjun Mehta', age: 45, disease: 'Viral Fever', severity: 'Mild', img: '/patients/p3.jpg' },
                { name: 'Sneha Nair', age: 23, disease: 'Allergy', severity: 'Mild', img: '/patients/p4.jpg' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f8faff', borderRadius: 10, border: '1px solid #eef2ff' }}>
                  <img src={p.img} alt={p.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e8f5', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#1a73e8', display: 'none', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{p.name[0]}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.disease} · {p.age}y</div>
                    <span style={{ background: severityBg[p.severity], color: severityColor[p.severity], padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 500 }}>{p.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor on Duty */}
          <div style={{ background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <img src="src\assets\doctorVisitBG.png" alt="Doctor on Duty" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.height = '180px' }} />
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Doctor on Duty</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Dr. Ananya Sharma</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>General Physician</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div><div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>48</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Patients</div></div>
                <div><div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>4.9★</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Rating</div></div>
                <div><div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>12y</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Experience</div></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Disease Predictions */}
          <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Top Predicted Diseases</div>
            {[
              { name: 'Viral Fever', pct: 82, color: '#1a73e8' },
              { name: 'Flu', pct: 67, color: '#1a73e8' },
              { name: 'Dengue', pct: 45, color: '#dc2626' },
              { name: 'Pneumonia', pct: 28, color: '#dc2626' },
              { name: 'Typhoid', pct: 18, color: '#d97706' },
            ].map(d => (
              <div key={d.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#475569' }}>{d.name}</span>
                  <span style={{ fontSize: 12, color: d.color, fontWeight: 500 }}>{d.pct}%</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${d.pct}%`, height: 6, borderRadius: 4, background: d.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Active Alerts</div>
            {[
              { dot: '#dc2626', msg: 'Rahul Kumar — Critical case. Immediate attention!', time: '2 mins ago', bg: '#fef2f2' },
              { dot: '#d97706', msg: 'Priya Sharma — Moderate risk flagged by ML.', time: '14 mins ago', bg: '#fffbeb' },
              { dot: '#16a34a', msg: 'Arjun Mehta — Diagnosis complete. Mild case.', time: '28 mins ago', bg: '#f0fdf4' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: 10, background: a.bg, borderRadius: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.dot, marginTop: 4, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{a.msg}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Symptoms */}
          <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Common Symptoms Today</div>
            <div>
              {['Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Joint pain', 'Chest pain', 'Dizziness', 'Skin rash', 'Breathlessness', 'Vomiting', 'Dehydration'].map(s => (
                <span key={s} style={{ display: 'inline-flex', background: '#eff6ff', color: '#1a73e8', borderRadius: 20, padding: '4px 12px', fontSize: 11, margin: '3px', fontWeight: 500, border: '1px solid #dbeafe' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Consultation History Table */}
        <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>Recent Consultations</span>
            <button onClick={() => navigate('/')} style={{ background: '#1a73e8', border: 'none', borderRadius: 8, color: '#fff', padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>+ New Consultation</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eef2ff' }}>
                {['Patient', 'Disease', 'Severity', 'Confidence', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', fontSize: 11, color: '#94a3b8', fontWeight: 500, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {consultations.slice(0, 5).map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f8faff', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#1a73e8' }}>{c.patientName?.[0]?.toUpperCase()}</div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{c.patientName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#475569' }}>{c.predictedDisease || '—'}</td>
                  <td style={{ padding: '12px' }}>
                    {c.severity ? <span style={{ background: severityBg[c.severity], color: severityColor[c.severity], padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{c.severity}</span> : '—'}
                  </td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#1a73e8', fontWeight: 500 }}>{c.confidence ? `${c.confidence}%` : '—'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: c.status === 'Active' ? '#f0fdf4' : '#f8faff', color: c.status === 'Active' ? '#16a34a' : '#94a3b8', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '12px', fontSize: 12, color: '#94a3b8' }}>{new Date(c.startedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {consultations.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 30, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>No consultations yet — start your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard