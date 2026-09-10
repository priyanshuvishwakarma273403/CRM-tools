import { apiClient } from './client';

export const contactsApi = {
  getAll: (params) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/contacts${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiClient.get(`/contacts/${id}`),
  create: (data) => apiClient.post('/contacts', data),
  update: (id, data) => apiClient.put(`/contacts/${id}`, data),
  delete: (id) => apiClient.delete(`/contacts/${id}`),
};
