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
} from '../api';

import {
  INITIAL_LEADS,
  INITIAL_CONTACTS,
  INITIAL_COMPANIES,
  INITIAL_DEALS,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_PRODUCTS,
  INITIAL_INVOICES,
  INITIAL_WORKFLOWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CUSTOM_FIELDS,
  INITIAL_USERS,
} from './seedData';

const getStore = (key, initial) => {
  const saved = localStorage.getItem(`nexus_crm_${key}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return initial;
    }
  }
  localStorage.setItem(`nexus_crm_${key}`, JSON.stringify(initial));
  return initial;
};

const setStore = (key, data) => {
  localStorage.setItem(`nexus_crm_${key}`, JSON.stringify(data));
};

export const api = {
  // Auth API
  auth: {
    login: async (email, password) => {
      try {
        const res = await authApi.login({ email, password });
        if (res.data?.accessToken) {
          return res;
        }
      } catch (e) {
        // Fallback for offline demo mode
      }
      return {
        success: true,
        data: {
          accessToken: 'jwt-demo-token-12345',
          refreshToken: 'refresh-demo-token-12345',
          user: {
            id: 'usr-demo-1',
            email,
            fullName: 'Alex Vance',
            role: 'ADMIN',
          },
          organization: {
            id: 'org-demo-1',
            name: 'Acme Corporation',
          },
        },
      };
    },
    register: async (data) => authApi.register(data),
    logout: async () => authApi.logout(),
  },

  // Leads API
  leads: {
    getAll: async () => {
      try {
        const res = await leadsApi.getAll();
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('leads', INITIAL_LEADS);
    },
    getById: async (id) => {
      try {
        const res = await leadsApi.getById(id);
        if (res.data) return res.data;
      } catch (e) {}
      return getStore('leads', INITIAL_LEADS).find((l) => l.id === id);
    },
    create: async (lead) => {
      try {
        const res = await leadsApi.create(lead);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('leads', INITIAL_LEADS);
      const newLead = {
        ...lead,
        id: `lead_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        leadScore: lead.leadScore || 65,
      };
      const updated = [newLead, ...list];
      setStore('leads', updated);
      return newLead;
    },
    update: async (id, data) => {
      try {
        const res = await leadsApi.update(id, data);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('leads', INITIAL_LEADS);
      const updated = list.map((l) => (l.id === id ? { ...l, ...data } : l));
      setStore('leads', updated);
      return updated.find((l) => l.id === id);
    },
    delete: async (id) => {
      try {
        await leadsApi.delete(id);
      } catch (e) {}
      const list = getStore('leads', INITIAL_LEADS);
      const updated = list.filter((l) => l.id !== id);
      setStore('leads', updated);
      return true;
    },
  },

  // Deals API
  deals: {
    getAll: async () => {
      try {
        const res = await dealsApi.getPipeline();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
      } catch (e) {}
      return getStore('deals', INITIAL_DEALS);
    },
    updateStage: async (id, stage) => {
      try {
        const res = await dealsApi.updateStage(id, stage);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('deals', INITIAL_DEALS);
      const updated = list.map((d) => (d.id === id ? { ...d, stage } : d));
      setStore('deals', updated);
      return updated.find((d) => d.id === id);
    },
    create: async (deal) => {
      try {
        const res = await dealsApi.create(deal);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('deals', INITIAL_DEALS);
      const newDeal = {
        ...deal,
        id: `deal_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updated = [newDeal, ...list];
      setStore('deals', updated);
      return newDeal;
    },
  },

  // Contacts API
  contacts: {
    getAll: async () => {
      try {
        const res = await contactsApi.getAll();
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('contacts', INITIAL_CONTACTS);
    },
    create: async (contact) => {
      try {
        const res = await contactsApi.create(contact);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('contacts', INITIAL_CONTACTS);
      const newContact = { ...contact, id: `cont_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
      const updated = [newContact, ...list];
      setStore('contacts', updated);
      return newContact;
    },
  },

  // Companies API
  companies: {
    getAll: async () => {
      try {
        const res = await companiesApi.getAll();
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('companies', INITIAL_COMPANIES);
    },
    create: async (company) => {
      try {
        const res = await companiesApi.create(company);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('companies', INITIAL_COMPANIES);
      const newCompany = { ...company, id: `comp_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
      const updated = [newCompany, ...list];
      setStore('companies', updated);
      return newCompany;
    },
  },

  // Tasks API
  tasks: {
    getAll: async () => {
      try {
        const res = await tasksApi.getAll();
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('tasks', INITIAL_TASKS);
    },
    toggleStatus: async (id) => {
      try {
        const res = await tasksApi.complete(id);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('tasks', INITIAL_TASKS);
      const updated = list.map((t) =>
        t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED' } : t
      );
      setStore('tasks', updated);
      return updated;
    },
    create: async (task) => {
      try {
        const res = await tasksApi.create(task);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('tasks', INITIAL_TASKS);
      const newTask = { ...task, id: `task_${Date.now()}` };
      const updated = [newTask, ...list];
      setStore('tasks', updated);
      return newTask;
    },
  },

  // Activities API
  activities: {
    getAll: async () => {
      try {
        const res = await activitiesApi.getAll();
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('activities', INITIAL_ACTIVITIES);
    },
    create: async (act) => {
      try {
        const res = await activitiesApi.create(act);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('activities', INITIAL_ACTIVITIES);
      const newAct = { ...act, id: `act_${Date.now()}`, createdAt: new Date().toISOString() };
      const updated = [newAct, ...list];
      setStore('activities', updated);
      return newAct;
    },
  },

  // Calendar API
  calendar: {
    getAll: async () => {
      try {
        const res = await calendarApi.getAll();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (e) {}
      return [
        { id: 'cal-1', title: 'Executive Demo with CTO David Kovac', date: '2026-09-06', time: '10:00 AM', type: 'MEETING', related: 'Acme Technologies' },
        { id: 'cal-2', title: 'Follow-up Call with Rachel Green', date: '2026-09-07', time: '02:30 PM', type: 'CALL', related: 'Nexus Global' },
      ];
    },
    create: async (event) => {
      try {
        const res = await calendarApi.create(event);
        if (res.data) return res.data;
      } catch (e) {}
      return { ...event, id: `cal_${Date.now()}` };
    },
  },

  // Products, Invoices, Workflows, Notifications, Users
  products: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/products');
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('products', INITIAL_PRODUCTS);
    },
  },

  invoices: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/invoices');
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('invoices', INITIAL_INVOICES);
    },
  },

  workflows: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/workflows');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (e) {}
      return getStore('workflows', INITIAL_WORKFLOWS);
    },
  },

  notifications: {
    getAll: async () => {
      try {
        const res = await notificationsApi.getAll();
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('notifications', INITIAL_NOTIFICATIONS);
    },
    markAllRead: async () => {
      const list = getStore('notifications', INITIAL_NOTIFICATIONS).map((n) => ({ ...n, isRead: true }));
      setStore('notifications', list);
      return list;
    },
  },

  auditLogs: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/audit-logs');
        if (res.data) {
          const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
          if (list.length > 0) return list;
        }
      } catch (e) {}
      return getStore('audit_logs', INITIAL_AUDIT_LOGS);
    },
  },

  customFields: {
    getAll: async () => getStore('custom_fields', INITIAL_CUSTOM_FIELDS),
  },

  users: {
    getAll: async () => {
      try {
        const res = await usersApi.getAll();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (e) {}
      return getStore('users', INITIAL_USERS);
    },
    getTeam: async () => {
      try {
        const res = await usersApi.getTeam();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (e) {}
      return getStore('users', INITIAL_USERS);
    },
  },

  reports: {
    getDashboard: async () => {
      try {
        const res = await reportsApi.getDashboard();
        if (res.data) return res.data;
      } catch (e) {}
      return {
        totalLeads: 128,
        openDeals: 24,
        revenue: 248000,
        conversionRate: '18.6%',
        completedTasks: 18,
      };
    },
  },
};
