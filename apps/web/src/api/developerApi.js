import { apiClient } from './client';

export const developerApi = {
  listApiKeys: () => apiClient.get('/developer/api-keys'),
  createApiKey: (data) => apiClient.post('/developer/api-keys', data),
  revokeApiKey: (id) => apiClient.delete(`/developer/api-keys/${id}`),
  listWebhooks: () => apiClient.get('/developer/webhooks'),
  createWebhook: (data) => apiClient.post('/developer/webhooks', data),
  deleteWebhook: (id) => apiClient.delete(`/developer/webhooks/${id}`),
  testWebhook: (id) => apiClient.post(`/developer/webhooks/${id}/test`),
  getWebhookDeliveries: (id, params) => apiClient.get(`/developer/webhooks/${id}/deliveries`, { params }),
};
