import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { disease: 'Viral Fever', count: 24 },
  { disease: 'Flu', count: 18 },
  { disease: 'Dengue', count: 12 },
  { disease: 'Pneumonia', count: 8 },
  { disease: 'Typhoid', count: 6 },
]

export default function TrendChart() {
  return (
    <div style={{ background: '#fff', border: '1px solid #eef2ff', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Disease Trend This Week</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={28}>
          <XAxis dataKey="disease" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eef2ff', fontSize: 12 }} />
          <Bar dataKey="count" fill="#1a73e8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}