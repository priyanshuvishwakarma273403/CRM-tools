import {
  apiClient,
  authApi,
  leadsApi,
  dealsApi,
  contactsApi,
  companiesApi,
  tasksApi,
  activitiesApi,
  calendarApi,
  notificationsApi,
  reportsApi,
  usersApi,
  approvalsApi,
  ticketsApi,
  knowledgeApi,
  developerApi,
} from '../api';

const extractList = (res) => {
  if (!res) return [];
  const payload = res.data !== undefined ? res.data : res;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.content)) return payload.content;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
};

export const api = {
  // Auth API
  auth: {
    login: async (email, password) => {
      const res = await authApi.login({ email, password });
      return res;
    },
    register: async (data) => authApi.register(data),
    logout: async () => authApi.logout(),
    me: async () => authApi.getCurrentUser(),
  },

  // Leads API
  leads: {
    getAll: async (params) => {
      try {
        const res = await leadsApi.getAll(params);
        return extractList(res);
      } catch (e) {
        console.warn('Backend leads API unavailable:', e.message);
        return [];
      }
    },
    getById: async (id) => {
      try {
        const res = await leadsApi.getById(id);
        return res?.data || res;
      } catch (e) {
        return null;
      }
    },
    create: async (lead) => {
      const res = await leadsApi.create(lead);
      return res?.data || res;
    },
    update: async (id, data) => {
      const res = await leadsApi.update(id, data);
      return res?.data || res;
    },
    updateStatus: async (id, status) => {
      const res = await leadsApi.updateStatus(id, status);
      return res?.data || res;
    },
    convert: async (id, request) => {
      const res = await leadsApi.convert(id, request);
      return res?.data || res;
    },
    delete: async (id) => {
      await leadsApi.delete(id);
      return true;
    },
  },

  // Deals API
  deals: {
    getAll: async (params) => {
      try {
        const res = await dealsApi.getPipeline();
        const list = extractList(res);
        if (list.length > 0) return list;
        const pageRes = await dealsApi.getAll(params);
        return extractList(pageRes);
      } catch (e) {
        console.warn('Backend deals API unavailable:', e.message);
        return [];
      }
    },
    getById: async (id) => {
      try {
        const res = await dealsApi.getById(id);
        return res?.data || res;
      } catch (e) {
        return null;
      }
    },
    updateStage: async (id, stageOrPayload) => {
      const payload = typeof stageOrPayload === 'string' ? { stage: stageOrPayload } : stageOrPayload;
      const res = await dealsApi.updateStage(id, payload);
      return res?.data || res;
    },
    create: async (deal) => {
      const res = await dealsApi.create(deal);
      return res?.data || res;
    },
    update: async (id, deal) => {
      const res = await dealsApi.update(id, deal);
      return res?.data || res;
    },
    delete: async (id) => {
      await dealsApi.delete(id);
      return true;
    },
    getPipelineMetrics: async (pipelineId) => {
      const res = await dealsApi.getPipelineMetrics(pipelineId);
      return res?.data || res;
    },
    getForecast: async () => {
      const res = await dealsApi.getRevenueForecast();
      return res?.data || res;
    },
  },

  // Contacts API
  contacts: {
    getAll: async (params) => {
      try {
        const res = await contactsApi.getAll(params);
        return extractList(res);
      } catch (e) {
        console.warn('Backend contacts API unavailable:', e.message);
        return [];
      }
    },
    getById: async (id) => {
      try {
        const res = await contactsApi.getById(id);
        return res?.data || res;
      } catch (e) {
        return null;
      }
    },
    create: async (contact) => {
      const res = await contactsApi.create(contact);
      return res?.data || res;
    },
    update: async (id, contact) => {
      const res = await contactsApi.update(id, contact);
      return res?.data || res;
    },
    delete: async (id) => {
      await contactsApi.delete(id);
      return true;
    },
  },

  // Companies API
  companies: {
    getAll: async (params) => {
      try {
        const res = await companiesApi.getAll(params);
        return extractList(res);
      } catch (e) {
        console.warn('Backend companies API unavailable:', e.message);
        return [];
      }
    },
    getById: async (id) => {
      try {
        const res = await companiesApi.getById(id);
        return res?.data || res;
      } catch (e) {
        return null;
      }
    },
    create: async (company) => {
      const res = await companiesApi.create(company);
      return res?.data || res;
    },
    update: async (id, company) => {
      const res = await companiesApi.update(id, company);
      return res?.data || res;
    },
    delete: async (id) => {
      await companiesApi.delete(id);
      return true;
    },
  },

  // Tasks API
  tasks: {
    getAll: async (params) => {
      try {
        const res = await tasksApi.getAll(params);
        return extractList(res);
      } catch (e) {
        console.warn('Backend tasks API unavailable:', e.message);
        return [];
      }
    },
    getById: async (id) => {
      try {
        const res = await tasksApi.getById(id);
        return res?.data || res;
      } catch (e) {
        return null;
      }
    },
    toggleStatus: async (id) => {
      const res = await tasksApi.complete(id);
      return res?.data || res;
    },
    create: async (task) => {
      const res = await tasksApi.create(task);
      return res?.data || res;
    },
    update: async (id, task) => {
      const res = await tasksApi.update(id, task);
      return res?.data || res;
    },
    delete: async (id) => {
      await tasksApi.delete(id);
      return true;
    },
  },

  // Activities API
  activities: {
    getAll: async (params) => {
      try {
        const res = await activitiesApi.getAll(params);
        return extractList(res);
      } catch (e) {
        console.warn('Backend activities API unavailable:', e.message);
        return [];
      }
    },
    getByEntity: async (type, id) => {
      try {
        const res = await activitiesApi.getByEntity(type, id);
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    create: async (act) => {
      const res = await activitiesApi.create(act);
      return res?.data || res;
    },
  },

  // Calendar API
  calendar: {
    getAll: async () => {
      try {
        const res = await calendarApi.getAll();
        return extractList(res);
      } catch (e) {
        console.warn('Backend calendar API unavailable:', e.message);
        return [];
      }
    },
    create: async (event) => {
      const res = await calendarApi.create(event);
      return res?.data || res;
    },
    update: async (id, event) => {
      const res = await calendarApi.update(id, event);
      return res?.data || res;
    },
    delete: async (id) => {
      await calendarApi.delete(id);
      return true;
    },
  },

  // Support Tickets API
  tickets: {
    getAll: async (params) => {
      try {
        const res = await ticketsApi.getTickets(params);
        return extractList(res);
      } catch (e) {
        console.warn('Backend tickets API unavailable:', e.message);
        return [];
      }
    },
    getById: async (id) => {
      const res = await ticketsApi.getTicketById(id);
      return res?.data || res;
    },
    create: async (data) => {
      const res = await ticketsApi.createTicket(data);
      return res?.data || res;
    },
    updateStatus: async (id, status) => {
      const res = await ticketsApi.updateStatus(id, status);
      return res?.data || res;
    },
    assign: async (id, assigneeId) => {
      const res = await ticketsApi.assignTicket(id, assigneeId);
      return res?.data || res;
    },
    getComments: async (id) => {
      const res = await ticketsApi.getComments(id);
      return extractList(res);
    },
    addComment: async (id, commentData) => {
      const res = await ticketsApi.addComment(id, commentData);
      return res?.data || res;
    },
    getMetrics: async () => {
      const res = await ticketsApi.getMetrics();
      return res?.data || res;
    },
  },

  // Knowledge Base & RAG API
  knowledge: {
    getArticles: async (params) => {
      try {
        const res = await knowledgeApi.getArticles(params);
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    getArticleById: async (id) => {
      const res = await knowledgeApi.getArticleById(id);
      return res?.data || res;
    },
    createArticle: async (data) => {
      const res = await knowledgeApi.createArticle(data);
      return res?.data || res;
    },
    updateArticle: async (id, data) => {
      const res = await knowledgeApi.updateArticle(id, data);
      return res?.data || res;
    },
    deleteArticle: async (id) => {
      await knowledgeApi.deleteArticle(id);
      return true;
    },
    getCategories: async () => {
      const res = await knowledgeApi.getCategories();
      return extractList(res);
    },
    askQuestion: async (question) => {
      const res = await knowledgeApi.askQuestion({ question, topK: 3 });
      return res?.data || res;
    },
  },

  // Products API
  products: {
    getAll: async (params) => {
      try {
        const res = await apiClient.get('/products', { params });
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    create: async (product) => {
      const res = await apiClient.post('/products', product);
      return res?.data || res;
    },
  },

  // Invoices API
  invoices: {
    getAll: async (params) => {
      try {
        const res = await apiClient.get('/invoices', { params });
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    create: async (invoice) => {
      const res = await apiClient.post('/invoices', invoice);
      return res?.data || res;
    },
  },

  // Workflows API
  workflows: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/workflows');
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    create: async (rule) => {
      const res = await apiClient.post('/workflows', rule);
      return res?.data || res;
    },
    update: async (id, rule) => {
      const res = await apiClient.put(`/workflows/${id}`, rule);
      return res?.data || res;
    },
    toggle: async (id) => {
      const res = await apiClient.patch(`/workflows/${id}/toggle`);
      return res?.data || res;
    },
    delete: async (id) => {
      await apiClient.delete(`/workflows/${id}`);
      return true;
    },
    executeManually: async (id, payload) => {
      const res = await apiClient.post(`/workflows/${id}/execute`, payload);
      return res?.data || res;
    },
  },

  // Notifications API
  notifications: {
    getAll: async (params) => {
      try {
        const res = await notificationsApi.getAll(params);
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
  },

  // Audit Logs API
  auditLogs: {
    getAll: async (params) => {
      try {
        const res = await apiClient.get('/audit-logs', { params });
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
  },

  // Approvals API
  approvals: {
    getAll: async (params) => {
      try {
        const res = await approvalsApi.getApprovals(params);
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    submit: async (approval) => {
      const res = await approvalsApi.submit(approval);
      return res?.data || res;
    },
    review: async (id, decision, notes) => {
      const res = await approvalsApi.review(id, { decision, notes });
      return res?.data || res;
    },
  },

  // Users API
  users: {
    getAll: async () => {
      try {
        const res = await usersApi.getAll();
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    getTeam: async () => {
      try {
        const res = await usersApi.getTeam();
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    update: async (id, user) => {
      const res = await usersApi.update(id, user);
      return res?.data || res;
    },
  },

  // Developer Platform API
  developer: {
    getApiKeys: async () => {
      try {
        const res = await developerApi.getApiKeys();
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    createApiKey: async (req) => {
      const res = await developerApi.createApiKey(req);
      return res?.data || res;
    },
    revokeApiKey: async (id) => {
      await developerApi.revokeApiKey(id);
      return true;
    },
    getWebhooks: async () => {
      try {
        const res = await developerApi.getWebhooks();
        return extractList(res);
      } catch (e) {
        return [];
      }
    },
    createWebhook: async (req) => {
      const res = await developerApi.createWebhook(req);
      return res?.data || res;
    },
    deleteWebhook: async (id) => {
      await developerApi.deleteWebhook(id);
      return true;
    },
  },

  // Search API
  search: {
    query: async (q, types = 'ALL', limit = 10) => {
      const res = await apiClient.get('/search', { params: { q, types, limit } });
      return res?.data || res;
    },
  },

  // Reports API
  reports: {
    getDashboard: async () => {
      try {
        const res = await reportsApi.getDashboard();
        return res?.data || res;
      } catch (e) {
        return {
          totalLeads: 0,
          openDeals: 0,
          revenue: 0,
          conversionRate: '0%',
          completedTasks: 0,
        };
      }
    },
  },
};
