import { apiClient } from './client';

export const approvalsApi = {
  /**
   * List approvals, optionally filtered by status (PENDING, APPROVED, REJECTED, EXPIRED)
   */
  list: (status = '', page = 0, size = 50) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('size', size);
    return apiClient.get(`/approvals?${params.toString()}`);
  },

  /**
   * Get approval details by ID
   */
  getById: (id) => apiClient.get(`/approvals/${id}`),

  /**
   * Decide on an approval (APPROVED or REJECTED)
   */
  decide: (id, decision, reviewerNotes = '') => {
    return apiClient.post(`/approvals/${id}/decide`, {
      decision,
      reviewerNotes,
    });
  },

  /**
   * Get approval queue statistics
   */
  getStats: () => apiClient.get('/approvals/stats'),
};
