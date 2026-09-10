import { apiClient } from './client';

export const aiApi = {
  scoreLead: (data) => apiClient.post('/ai/lead-score', data),
  assessDealRisk: (data) => apiClient.post('/ai/deal-risk', data),
  queryCopilot: (query) => apiClient.post('/ai/copilot', { query }),
  draftEmail: (data) => apiClient.post('/ai/email-draft', data),
  executeAgent: (data) => apiClient.post('/ai/agent/execute', data),
  executeSpecificAgent: (type, data) => apiClient.post(`/ai/agent/${type}`, data),
  askCrm: (query) => apiClient.post('/ai/ask-crm', { query }),
};
