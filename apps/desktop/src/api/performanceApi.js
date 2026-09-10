import { apiClient } from './client';

export const performanceApi = {
  findDuplicates: (data) => apiClient.post('/performance/dedup', data),
  simulateMonteCarlo: (data) => apiClient.post('/performance/monte-carlo-forecast', data),
};
