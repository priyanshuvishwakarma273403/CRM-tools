import { apiClient } from './client';

export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    if (res.data?.accessToken) {
      localStorage.setItem('nexus_access_token', res.data.accessToken);
      localStorage.setItem('nexus_token', res.data.accessToken);
      if (res.data.refreshToken) {
        localStorage.setItem('nexus_refresh_token', res.data.refreshToken);
      }
    }
    return res;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    if (res.data?.accessToken) {
      localStorage.setItem('nexus_access_token', res.data.accessToken);
      localStorage.setItem('nexus_token', res.data.accessToken);
      if (res.data.refreshToken) {
        localStorage.setItem('nexus_refresh_token', res.data.refreshToken);
      }
    }
    return res;
  },

  refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('nexus_access_token');
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_refresh_token');
    }
  },

  getCurrentUser: () => apiClient.get('/auth/me'),

  // Multi-Device Sessions
  getSessions: () => apiClient.get('/auth/sessions'),
  revokeSession: (id) => apiClient.delete(`/auth/sessions/${id}`),
  revokeAllOtherSessions: () => apiClient.post('/auth/sessions/revoke-others'),

  // FIDO2 / WebAuthn Passkeys
  getPasskeys: () => apiClient.get('/auth/passkey'),
  getPasskeyRegisterChallenge: () => apiClient.get('/auth/passkey/register/challenge'),
  verifyPasskeyRegister: (data) => apiClient.post('/auth/passkey/register/verify', data),
  getPasskeyLoginChallenge: (email) => apiClient.get('/auth/passkey/login/challenge', { params: { email } }),
  verifyPasskeyLogin: (data) => apiClient.post('/auth/passkey/login/verify', data),
  deletePasskey: (id) => apiClient.delete(`/auth/passkey/${id}`),
};
