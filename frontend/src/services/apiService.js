import axios from 'axios'
const API = axios.create({ baseURL: 'http://localhost:5043/api' })
const ML = axios.create({ baseURL: 'http://localhost:8000' })

export const startConsultation = (patientName) => API.post('/consultation/start', { patientName })
export const getAllConsultations = () => API.get('/consultation')
export const getConsultation = (id) => API.get(`/consultation/${id}`)
export const addMessage = (id, sender, content) => API.post(`/consultation/${id}/message`, { sender, content })
export const predictDisease = (id, symptoms) => API.post(`/consultation/${id}/predict`, { symptoms })
export const endConsultation = (id) => API.post(`/consultation/${id}/end`)
export const generateSummary = (id) => API.post(`/summary/${id}/generate`)
export const getSummary = (id) => API.get(`/summary/${id}`)
export const getSymptoms = () => ML.get('/symptoms')
export const explainDisease = (disease, severity, treatment) => ML.post('/explain', { disease, severity, treatment })