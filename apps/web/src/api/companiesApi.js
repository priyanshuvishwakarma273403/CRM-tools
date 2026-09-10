import { apiClient } from './client';

export const companiesApi = {
  getAll: (params) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/companies${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiClient.get(`/companies/${id}`),
  create: (data) => apiClient.post('/companies', data),
  update: (id, data) => apiClient.put(`/companies/${id}`, data),
  delete: (id) => apiClient.delete(`/companies/${id}`),
};
