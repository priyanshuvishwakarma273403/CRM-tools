import { apiClient } from './client';

export const usersApi = {
  getAll: () => apiClient.get('/users'),
  getTeam: () => apiClient.get('/users/team'),
  getById: (id) => apiClient.get(`/users/${id}`),
};
