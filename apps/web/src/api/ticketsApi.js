import { apiClient } from './client';

export const ticketsApi = {
  getTickets: (params) => apiClient.get('/tickets', { params }),
  getTicketById: (id) => apiClient.get(`/tickets/${id}`),
  createTicket: (data) => apiClient.post('/tickets', data),
  updateTicket: (id, data) => apiClient.put(`/tickets/${id}`, data),
  updateStatus: (id, status) => apiClient.patch(`/tickets/${id}/status`, { status }),
  assignTicket: (id, assigneeId) => apiClient.patch(`/tickets/${id}/assign`, { assigneeId }),
  getComments: (id) => apiClient.get(`/tickets/${id}/comments`),
  addComment: (id, commentData) => apiClient.post(`/tickets/${id}/comments`, commentData),
  submitCsat: (id, feedbackData) => apiClient.post(`/tickets/${id}/csat`, feedbackData),
  getMetrics: () => apiClient.get('/tickets/metrics'),
};
