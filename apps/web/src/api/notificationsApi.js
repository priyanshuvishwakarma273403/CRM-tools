import { apiClient } from './client';

export const notificationsApi = {
  getAll: () => apiClient.get('/notifications'),
  markRead: (id) => apiClient.patch(`/notifications/${id}/read`),
};
