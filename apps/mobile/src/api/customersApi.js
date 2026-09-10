import { apiClient } from './client';

export const customersApi = {
  getAll: (params) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/customers${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiClient.get(`/customers/${id}`),
  getCustomer360: (id) => apiClient.get(`/customers/${id}/360`),
  create: (data) => apiClient.post('/customers', data),
  update: (id, data) => apiClient.put(`/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/customers/${id}`),
};
