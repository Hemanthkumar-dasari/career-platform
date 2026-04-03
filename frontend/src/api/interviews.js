import api from './client'

export const startInterview = (data) => api.post('/api/interviews/start', data)
export const submitAnswer = (data) => api.post('/api/interviews/answer', data)
export const listSessions = () => api.get('/api/interviews/')
export const getSession = (id) => api.get(`/api/interviews/${id}`)
