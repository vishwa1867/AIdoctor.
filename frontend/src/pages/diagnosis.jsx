import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSymptoms, predictDisease, endConsultation, generateSummary, getSummary, addMessage } from '../services/apiService'

function Diagnosis() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState([])
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ending, setEnding] = useState(false)
  const [messages, setMessages] = useState([])
  const [msgInput, setMsgInput] = useState('')
  const [sender, setSender] = useState('Doctor')
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('symptoms')

  useEffect(() => {
    getSymptoms().then(res => setSymptoms(res.data.symptoms)).catch(() => {})
  }, [])

  const toggleSymptom = s => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const handlePredict = async () => {
    if (!selected.length) return alert('Select at least one symptom!')
    setLoading(true)
    try {
      const res = await predictDisease(id, selected)
      setResult(res.data)
      await addMessage(id, 'System', `Symptoms analyzed: ${selected.join(', ')}`)
    } catch { alert('Make sure ML service is running on port 8000!') }
    setLoading(false)
  }

  const handleSendMessage = async () => {
    if (!msgInput.trim()) return
    const msg = { sender, content: msgInput, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, msg])
    try { await addMessage(id, sender, msgInput) } catch {}
    setMsgInput('')
  }

  const handleGenerateSummary = async () => {
    setSummaryLoading(true)
    try {
      const res = await generateSummary(id)
      setSummary(res.data)
      setActiveTab('summary')
    } catch { alert('Make sure backend is running!') }
    setSummaryLoading(false)
  }

  const handleEnd = async () => {
    setEnding(true)
    try { await endConsultation(id) } catch {}
    navigate('/history')
  }

  const filtered = symptoms.filter(s => s.replace(/_/g, ' ').includes(search.toLowerCase()))
  const severityColor = { Mild: '#16a34a', Moderate: '#d97706', Critical: '#dc2626' }
  const severityBg = { Mild: '#f0fdf4', Moderate: '#fffbeb', Critical: '#fef2f2' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8faff', width: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #eef2ff', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10 }}>
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
            { icon: '🧠', label: 'Diagnose', path: '/', active: true },
            { icon: '👥', label: 'Patients', path: '/history' },
            { icon: '📋', label: 'History', path: '/history' },
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

      {/* Main Content */}
      <div style={{ marginLeft: 220, flex: 1, padding: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a2e' }}>🧠 AI Diagnosis</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>Consultation #{id} · Real-time ML Analysis</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleGenerateSummary} disabled={summaryLoading} style={{
              padding: '10px 18px', background: '#eff6ff', border: '1px solid #dbeafe',
              borderRadius: 10, color: '#1a73e8', cursor: 'pointer', fontSize: 13, fontWeight: 500
            }}>
              {summaryLoading ? '⏳ Generating...' : '📄 Generate Summary'}
            </button>
            <button onClick={handleEnd} disabled={ending} style={{
              padding: '10px 18px', background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, color: '#dc2626', cursor: 'pointer', fontSize: 13, fontWeight: 500
            }}>
              {ending ? 'Saving...' : '✓ End & Save'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', border: '1px solid #eef2ff', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[
            { key: 'symptoms', label: '🔬 Symptoms & Diagnosis' },
            { key: 'transcript', label: '💬 Consultation Notes' },
            { key: 'summary', label: '📄 AI Summary' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: activeTab === tab.key ? '#1a73e8' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#64748b',
              transition: 'all 0.15s'
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Tab: Symptoms & Diagnosis */}
        {activeTab === 'symptoms' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Symptom Selector */}
            <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Select Symptoms</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>{selected.length} selected</div>
              <input placeholder="Search symptoms..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: '#f8faff', border: '1px solid #eef2ff', borderRadius: 10, fontSize: 13, outline: 'none', marginBottom: 14, color: '#1a1a2e' }} />
              <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {filtered.map(s => (
                  <button key={s} onClick={() => toggleSymptom(s)} style={{
                    padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                    background: selected.includes(s) ? '#1a73e8' : '#f8faff',
                    border: `1px solid ${selected.includes(s) ? '#1a73e8' : '#eef2ff'}`,
                    color: selected.includes(s) ? '#fff' : '#64748b',
                    fontWeight: selected.includes(s) ? 500 : 400
                  }}>{s.replace(/_/g, ' ')}</button>
                ))}
              </div>
              {selected.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Selected symptoms:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selected.map(s => (
                      <span key={s} onClick={() => toggleSymptom(s)} style={{ background: '#eff6ff', color: '#1a73e8', borderRadius: 20, padding: '3px 10px', fontSize: 11, cursor: 'pointer', border: '1px solid #dbeafe' }}>
                        {s.replace(/_/g, ' ')} ✕
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={handlePredict} disabled={loading} style={{
                width: '100%', padding: 13, background: loading ? '#93c5fd' : '#1a73e8',
                border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14
              }}>
                {loading ? '⏳ Analyzing...' : '🧠 Analyze Symptoms'}
              </button>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {result ? (
                <>
                  <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Predicted Disease</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>{result.predictedDisease}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: severityBg[result.severity], color: severityColor[result.severity], padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        {result.severity} Severity
                      </span>
                      <span style={{ background: '#eff6ff', color: '#1a73e8', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1px solid #dbeafe' }}>
                        {result.confidence}% Confidence
                      </span>
                    </div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>Top 5 Predictions</div>
                    {result.top5Predictions?.map((p, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: i === 0 ? '#1a73e8' : '#475569', fontWeight: i === 0 ? 600 : 400 }}>{p.disease}</span>
                          <span style={{ fontSize: 12, color: i === 0 ? '#1a73e8' : '#94a3b8', fontWeight: 500 }}>{p.confidence}%</span>
                        </div>
                        <div style={{ background: '#f1f5f9', borderRadius: 4, height: 6 }}>
                          <div style={{ width: `${p.confidence}%`, height: 6, borderRadius: 4, background: i === 0 ? '#1a73e8' : '#bfdbfe' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>💊 Recommended Treatment</div>
                    {result.treatment?.map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, padding: 10, background: '#f8faff', borderRadius: 8, border: '1px solid #eef2ff' }}>
                        <span style={{ color: '#1a73e8', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                        <span style={{ fontSize: 13, color: '#475569' }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 48, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🧬</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>Ready to Diagnose</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>Select symptoms and click Analyze to get AI-powered diagnosis with treatment recommendations</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Consultation Notes / Transcript */}
        {activeTab === 'transcript' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Chat Messages */}
            <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>💬 Consultation Notes</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Record doctor-patient conversation</div>

              {/* Sender Toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['Doctor', 'Patient'].map(s => (
                  <button key={s} onClick={() => setSender(s)} style={{
                    padding: '6px 16px', borderRadius: 20, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                    background: sender === s ? '#1a73e8' : '#fff',
                    borderColor: sender === s ? '#1a73e8' : '#eef2ff',
                    color: sender === s ? '#fff' : '#64748b'
                  }}>{s === 'Doctor' ? '👨‍⚕️' : '🧑'} {s}</button>
                ))}
              </div>

              {/* Messages */}
              <div style={{ minHeight: 280, maxHeight: 280, overflowY: 'auto', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 60 }}>No notes yet. Start recording the consultation.</div>
                ) : messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'Doctor' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 3, paddingLeft: 4, paddingRight: 4 }}>{m.sender}</div>
                    <div style={{
                      maxWidth: '80%', padding: '10px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                      background: m.sender === 'Doctor' ? '#1a73e8' : '#f0f6ff',
                      color: m.sender === 'Doctor' ? '#fff' : '#1a1a2e',
                      borderBottomRightRadius: m.sender === 'Doctor' ? 2 : 12,
                      borderBottomLeftRadius: m.sender === 'Patient' ? 2 : 12,
                    }}>{m.content}</div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder={`Type ${sender}'s message...`}
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  style={{ flex: 1, padding: '10px 14px', background: '#f8faff', border: '1px solid #eef2ff', borderRadius: 10, fontSize: 13, outline: 'none', color: '#1a1a2e' }}
                />
                <button onClick={handleSendMessage} style={{ padding: '10px 16px', background: '#1a73e8', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Send</button>
              </div>
            </div>

            {/* Live Transcript */}
            <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>📝 Live Transcript</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Auto-formatted consultation record</div>
              <div style={{ minHeight: 320, background: '#f8faff', borderRadius: 10, padding: 16, border: '1px solid #eef2ff' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 60 }}>Transcript will appear here as you add notes</div>
                ) : messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < messages.length - 1 ? '1px solid #eef2ff' : 'none' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: m.sender === 'Doctor' ? '#1a73e8' : '#475569', marginRight: 8 }}>[{m.sender}]</span>
                    <span style={{ fontSize: 13, color: '#334155' }}>{m.content}</span>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{new Date(m.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
              <button onClick={handleGenerateSummary} disabled={summaryLoading || messages.length === 0} style={{
                width: '100%', marginTop: 14, padding: 12,
                background: messages.length === 0 ? '#f1f5f9' : '#1a73e8',
                border: 'none', borderRadius: 10,
                color: messages.length === 0 ? '#94a3b8' : '#fff',
                fontWeight: 600, cursor: messages.length === 0 ? 'not-allowed' : 'pointer', fontSize: 14
              }}>
                {summaryLoading ? '⏳ Generating Summary...' : '📄 Generate AI Summary'}
              </button>
            </div>
          </div>
        )}

        {/* Tab: AI Summary */}
        {activeTab === 'summary' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {summary ? (
              <>
                {/* Doctor Summary */}
                <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍⚕️</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>Doctor's Summary</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Clinical — detailed & structured</div>
                    </div>
                  </div>
                  <div style={{ background: '#f8faff', borderRadius: 10, padding: 16, border: '1px solid #eef2ff', fontSize: 13, color: '#334155', lineHeight: 1.8 }}>
                    {summary.doctorSummary || 'No doctor summary generated yet.'}
                  </div>
                </div>

                {/* Patient Summary */}
                <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, background: '#f0fdf4', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧑</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>Patient's Summary</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Simple & easy to understand</div>
                    </div>
                  </div>
                  <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 16, border: '1px solid #bbf7d0', fontSize: 13, color: '#334155', lineHeight: 1.8 }}>
                    {summary.patientSummary || 'No patient summary generated yet.'}
                  </div>
                </div>

                {/* Key Info */}
                {result && (
                  <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>📋 Consultation Summary</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                      {[
                        { label: 'Disease', val: result.predictedDisease, color: '#1a73e8', bg: '#eff6ff' },
                        { label: 'Severity', val: result.severity, color: severityColor[result.severity], bg: severityBg[result.severity] },
                        { label: 'Confidence', val: `${result.confidence}%`, color: '#1a73e8', bg: '#eff6ff' },
                        { label: 'Messages', val: messages.length, color: '#16a34a', bg: '#f0fdf4' },
                      ].map(s => (
                        <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: 14, textAlign: 'center' }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ gridColumn: 'span 2', background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 60, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>📄</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>No Summary Yet</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>Add consultation notes and generate an AI summary</div>
                <button onClick={() => setActiveTab('transcript')} style={{ padding: '10px 24px', background: '#1a73e8', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                  Go to Consultation Notes →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Diagnosis