import api from './api';

export const tournamentService = {
  list: (params) => api.get('/tournaments', { params }),
  playerDashboard: () => api.get('/tournaments/player/dashboard'),
  mine: () => api.get('/tournaments/organizer/mine'),
  create: (payload) => api.post('/tournaments', payload, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, payload) => api.put(`/tournaments/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } }),
  detail: (id) => api.get(`/tournaments/${id}`),
  register: (id, payload) => api.post(`/registrations/tournaments/${id}`, payload),
  registrations: () => api.get('/registrations/organizer'),
  updateRegistration: (id, payload) => api.patch(`/registrations/${id}/status`, payload),
  save: (id) => api.post(`/tournaments/${id}/save`),
  report: (id, payload) => api.post(`/reports/tournaments/${id}`, payload)
};
