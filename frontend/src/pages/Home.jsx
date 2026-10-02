import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startConsultation } from '../services/apiService'

function Home() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleStart = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await startConsultation(name)
      navigate(`/diagnosis/${res.data.id}`)
    } catch {
      alert('Make sure backend is running on port 5043!')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Left Blue Panel */}
      <div style={{ width: '45%', background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏥</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>MediAssist AI</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Clinical Decision Support</div>
          </div>
        </div>

        <div>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '5px 14px', fontSize: 12, marginBottom: 20 }}>● Powered by Machine Learning</div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>AI-Powered<br />Medical Diagnosis</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 36 }}>
            Our ML model analyzes patient symptoms in real-time and predicts diseases with 94% accuracy — helping doctors make faster, smarter decisions.
          </p>
          <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
            {[{ val: '94.2%', label: 'ML Accuracy' }, { val: '41', label: 'Symptoms' }, { val: '1.8s', label: 'Avg Speed' }, { val: '12+', label: 'Diseases' }].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Doctor image */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src="src\assets\doctorVisitBG.png" alt="doctor" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} onError={e => { e.target.style.background = 'rgba(255,255,255,0.2)' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Dr. Ananya Sharma</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>General Physician · On Duty</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>48 patients today · 4.9★ rating</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Built for Quad One Technologies · Healthcare IT · 2026</div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Start Consultation</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 32 }}>Enter patient details to begin AI-powered diagnosis</p>

          <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>Patient Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              style={{ width: '100%', padding: '12px 16px', background: '#f8faff', border: '1px solid #eef2ff', borderRadius: 10, fontSize: 14, outline: 'none', marginBottom: 20, color: '#1a1a2e' }}
            />

            <button onClick={handleStart} disabled={loading} style={{
              width: '100%', padding: 14, background: loading ? '#93c5fd' : '#1a73e8',
              border: 'none', borderRadius: 10, color: '#fff',
              fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 12
            }}>
              {loading ? 'Starting...' : 'Start Consultation →'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => navigate('/dashboard')} style={{ padding: 11, background: '#fff', border: '1px solid #eef2ff', borderRadius: 10, color: '#1a73e8', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>📊 Dashboard</button>
              <button onClick={() => navigate('/history')} style={{ padding: 11, background: '#fff', border: '1px solid #eef2ff', borderRadius: 10, color: '#1a73e8', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>📋 History</button>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[{ icon: '🧠', label: 'ML Powered', sub: 'Random Forest' }, { icon: '⚡', label: 'Real-time', sub: 'SignalR' }, { icon: '🔒', label: 'Secure', sub: 'Healthcare IT' }].map(f => (
              <div key={f.label} style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{f.label}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home