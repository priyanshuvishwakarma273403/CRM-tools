import { apiClient } from './client';

export const activitiesApi = {
  getAll: (params) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/activities${query ? `?${query}` : ''}`);
  },
  create: (data) => apiClient.post('/activities', data),
};
