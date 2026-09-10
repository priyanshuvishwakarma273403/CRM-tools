import { apiClient } from './client';

export const calendarApi = {
  getAll: () => apiClient.get('/calendar'),
  getById: (id) => apiClient.get(`/calendar/${id}`),
  create: (data) => apiClient.post('/calendar', data),
  update: (id, data) => apiClient.put(`/calendar/${id}`, data),
  delete: (id) => apiClient.delete(`/calendar/${id}`),
};
