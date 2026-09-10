import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (userData, accessToken, refreshToken) => {
        if (accessToken) {
          localStorage.setItem('nexus_access_token', accessToken);
          localStorage.setItem('nexus_token', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('nexus_refresh_token', refreshToken);
        }
        set({
          user: userData,
          accessToken: accessToken,
          refreshToken: refreshToken,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (e) {
          // Ignore network errors on logout
        } finally {
          localStorage.removeItem('nexus_access_token');
          localStorage.removeItem('nexus_token');
          localStorage.removeItem('nexus_refresh_token');
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      fetchProfile: async () => {
        try {
          const res = await authApi.getCurrentUser();
          if (res?.data?.user) {
            set({
              user: {
                ...res.data.user,
                organizationId: res.data.organization?.id,
                organizationName: res.data.organization?.name,
              },
              isAuthenticated: true,
            });
          }
        } catch (e) {
          console.warn('Profile fetch skipped (running offline/fallback mode)');
        }
      },

      hasPermission: (permissionCode) => {
        const user = get().user;
        if (!user) return false;
        if (user.role === 'ADMIN') return true;
        return true;
      },
    }),
    {
      name: 'nexus-crm-auth',
    }
  )
);
