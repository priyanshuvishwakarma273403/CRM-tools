import { apiClient } from './client';

export const leadsApi = {
  getAll: (params) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/leads${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiClient.get(`/leads/${id}`),
  create: (data) => apiClient.post('/leads', data),
  update: (id, data) => apiClient.put(`/leads/${id}`, data),
  updateStatus: (id, status) => apiClient.patch(`/leads/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/leads/${id}`),
  convert: (id) => apiClient.post(`/leads/${id}/convert`),
};
