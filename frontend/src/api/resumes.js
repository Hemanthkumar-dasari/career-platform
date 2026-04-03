import api from './client'

export const analyzeResume = (formData) =>
  api.post('/api/resumes/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const listResumes = () => api.get('/api/resumes/')
