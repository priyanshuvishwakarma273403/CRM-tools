import { apiClient } from './client';

export const tasksApi = {
  getAll: (params) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/tasks${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiClient.get(`/tasks/${id}`),
  create: (data) => apiClient.post('/tasks', data),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  complete: (id) => apiClient.patch(`/tasks/${id}/complete`),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
};
