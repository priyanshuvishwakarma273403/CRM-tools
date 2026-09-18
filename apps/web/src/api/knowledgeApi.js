import { apiClient } from './client';

export const knowledgeApi = {
  getArticles: (params) => apiClient.get('/knowledge/articles', { params }),
  getArticleById: (id) => apiClient.get(`/knowledge/articles/${id}`),
  getArticleBySlug: (slug) => apiClient.get(`/knowledge/articles/slug/${slug}`),
  createArticle: (data) => apiClient.post('/knowledge/articles', data),
  updateArticle: (id, data) => apiClient.put(`/knowledge/articles/${id}`, data),
  updateStatus: (id, status) => apiClient.patch(`/knowledge/articles/${id}/status`, { status }),
  deleteArticle: (id) => apiClient.delete(`/knowledge/articles/${id}`),
  getCategories: () => apiClient.get('/knowledge/categories'),
  searchArticles: (queryData) => apiClient.post('/knowledge/search', queryData),
  askQuestion: (askData) => apiClient.post('/knowledge/ask', askData),
};
