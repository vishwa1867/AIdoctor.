import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Diagnosis from './pages/diagnosis'
import History from './pages/History'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/diagnosis/:id" element={<Diagnosis />} />
      <Route path="/history" element={<History />} />
    </Routes>
  )
}

export default App
