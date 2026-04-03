import api from './client'

export const generateProjects = (data) => api.post('/api/projects/generate', data)
