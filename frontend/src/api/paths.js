import api from './client'

export const generatePath = (data) => api.post('/api/paths/generate', data)
export const listPaths = () => api.get('/api/paths/')
export const getPath = (id) => api.get(`/api/paths/${id}`)
