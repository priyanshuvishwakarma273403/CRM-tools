import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/authApi';

export const useAuthStore = create((set, get) => ({
  user: null,
  organization: null,
  isAuthenticated: false,
  isLoading: true,

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const response = await authApi.getCurrentUser();
        if (response?.data) {
          set({
            user: response.data.user,
            organization: response.data.organization,
            isAuthenticated: true,
          });
        } else {
          await get().logout();
        }
      }
    } catch (err) {
      console.warn('Session restoration failed:', err?.message);
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response?.data) {
      const { accessToken, refreshToken, user, organization } = response.data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      set({ user, organization, isAuthenticated: true });
    }
    return response;
  },

  logout: async () => {
    try {
      await authApi.logout().catch(() => {});
      await SecureStore.deleteItemAsync('accessToken').catch(() => {});
      await SecureStore.deleteItemAsync('refreshToken').catch(() => {});
    } finally {
      set({ user: null, organization: null, isAuthenticated: false });
    }
  },
}));
