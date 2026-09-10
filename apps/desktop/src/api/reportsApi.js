import { apiClient } from './client';

export const reportsApi = {
  getDashboard: () => apiClient.get('/reports/dashboard'),
};
