import { apiClient } from './client';

export const leadsApi = {
  getLeads: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/leads${query ? `?${query}` : ''}`);
  },
  getLeadById: (id) => apiClient.get(`/leads/${id}`),
  createLead: (data) => apiClient.post('/leads', data),
  updateLead: (id, data) => apiClient.put(`/leads/${id}`, data),
  updateStatus: (id, status) => apiClient.patch(`/leads/${id}/status`, { status }),
  deleteLead: (id) => apiClient.delete(`/leads/${id}`),
  convertLead: (id, conversionData) => apiClient.post(`/leads/${id}/convert`, conversionData),
};
