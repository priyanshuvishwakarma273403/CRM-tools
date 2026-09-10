import { apiClient } from './client';

export const communicationsApi = {
  getAll: (params) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/communications${query ? `?${query}` : ''}`);
  },
  getCustomerTimeline: (customerId) => apiClient.get(`/communications/customer/${customerId}`),
  getLeadTimeline: (leadId) => apiClient.get(`/communications/lead/${leadId}`),
  logCommunication: (data) => apiClient.post('/communications', data),
};
