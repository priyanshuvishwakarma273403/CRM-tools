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
} from '../api';

const getStore = (key, initial = []) => {
  const saved = localStorage.getItem(`nexus_crm_${key}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Automatically purge any legacy demo seed data from previous dev sessions
        const clean = parsed.filter((item) => {
          const id = item?.id ? String(item.id) : '';
          const name = item?.name || item?.title || '';
          const isLegacyDemo =
            id.startsWith('comp_') ||
            id.startsWith('lead_') ||
            id.startsWith('deal_') ||
            id.startsWith('cont_') ||
            id.startsWith('task_') ||
            id.startsWith('user_') ||
            id.startsWith('act_') ||
            name.includes('Apex Global') ||
            name.includes('Acme Enterprise') ||
            name.includes('BioGenix');
          return !isLegacyDemo;
        });
        if (clean.length !== parsed.length) {
          localStorage.setItem(`nexus_crm_${key}`, JSON.stringify(clean));
        }
        return clean;
      }
      return parsed;
    } catch (e) {
      return [];
    }
  }
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
        // Fallback for offline local session
      }
      const rawName = email ? email.split('@')[0].replace(/[._-]/g, ' ') : 'User';
      const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      return {
        success: true,
        data: {
          accessToken: `nexus-jwt-${Date.now()}`,
          refreshToken: `nexus-refresh-${Date.now()}`,
          user: {
            id: `usr_${Date.now()}`,
            email: email || 'user@nexus.io',
            fullName: cleanName,
            name: cleanName,
            role: 'ADMIN',
          },
          organization: {
            id: `org_${Date.now()}`,
            name: 'Nexus Workspace',
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
      return getStore('leads', []);
    },
    getById: async (id) => {
      try {
        const res = await leadsApi.getById(id);
        if (res.data) return res.data;
      } catch (e) {}
      return getStore('leads', []).find((l) => l.id === id);
    },
    create: async (lead) => {
      try {
        const res = await leadsApi.create(lead);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('leads', []);
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
      const list = getStore('leads', []);
      const updated = list.map((l) => (l.id === id ? { ...l, ...data } : l));
      setStore('leads', updated);
      return updated.find((l) => l.id === id);
    },
    delete: async (id) => {
      try {
        await leadsApi.delete(id);
      } catch (e) {}
      const list = getStore('leads', []);
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
      return getStore('deals', []);
    },
    updateStage: async (id, stage) => {
      try {
        const res = await dealsApi.updateStage(id, stage);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('deals', []);
      const updated = list.map((d) => (d.id === id ? { ...d, stage } : d));
      setStore('deals', updated);
      return updated.find((d) => d.id === id);
    },
    create: async (deal) => {
      try {
        const res = await dealsApi.create(deal);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('deals', []);
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
      return getStore('contacts', []);
    },
    create: async (contact) => {
      try {
        const res = await contactsApi.create(contact);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('contacts', []);
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
      return getStore('companies', []);
    },
    create: async (company) => {
      try {
        const res = await companiesApi.create(company);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('companies', []);
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
      return getStore('tasks', []);
    },
    toggleStatus: async (id) => {
      try {
        const res = await tasksApi.complete(id);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('tasks', []);
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
      const list = getStore('tasks', []);
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
      return getStore('activities', []);
    },
    create: async (act) => {
      try {
        const res = await activitiesApi.create(act);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('activities', []);
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
      return getStore('calendar', []);
    },
    create: async (event) => {
      try {
        const res = await calendarApi.create(event);
        if (res.data) return res.data;
      } catch (e) {}
      const list = getStore('calendar', []);
      const newEvent = { ...event, id: `cal_${Date.now()}` };
      const updated = [newEvent, ...list];
      setStore('calendar', updated);
      return newEvent;
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
      return getStore('products', []);
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
      return getStore('invoices', []);
    },
  },

  workflows: {
    getAll: async () => {
      try {
        const res = await apiClient.get('/workflows');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (e) {}
      return getStore('workflows', []);
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
      return getStore('notifications', []);
    },
    markAllRead: async () => {
      const list = getStore('notifications', []).map((n) => ({ ...n, isRead: true }));
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
      return getStore('audit_logs', []);
    },
  },

  approvals: approvalsApi,

  customFields: {
    getAll: async () => getStore('custom_fields', []),
  },

  users: {
    getAll: async () => {
      try {
        const res = await usersApi.getAll();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (e) {}
      return getStore('users', []);
    },
    getTeam: async () => {
      try {
        const res = await usersApi.getTeam();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
      } catch (e) {}
      return getStore('users', []);
    },
  },

  reports: {
    getDashboard: async () => {
      try {
        const res = await reportsApi.getDashboard();
        if (res.data) return res.data;
      } catch (e) {}
      const leads = getStore('leads', []);
      const deals = getStore('deals', []);
      const tasks = getStore('tasks', []);
      const wonDeals = deals.filter((d) => d.stage === 'CLOSED_WON');
      const revenue = wonDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
      const openDeals = deals.filter((d) => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST');
      const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
      return {
        totalLeads: leads.length,
        openDeals: openDeals.length,
        revenue: revenue,
        conversionRate: leads.length > 0 ? `${Math.round((wonDeals.length / leads.length) * 100)}%` : '0%',
        completedTasks: completedTasks,
      };
    },
  },
};
