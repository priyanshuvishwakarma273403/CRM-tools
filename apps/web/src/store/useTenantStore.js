import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTenantStore = create(
  persist(
    (set) => ({
      darkMode: false,
      isSidebarCollapsed: false,
      commandPaletteOpen: false,
      isNotificationDrawerOpen: false,
      currentOrganization: {
        id: 'org_demo_100',
        name: 'Acme Enterprise Solutions',
        slug: 'acme-corp',
        plan: 'ENTERPRISE',
        currency: '$',
      },

      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.darkMode;
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: newMode };
        }),

      setDarkMode: (enabled) => {
        if (enabled) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ darkMode: enabled });
      },

      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setNotificationDrawerOpen: (open) => set({ isNotificationDrawerOpen: open }),
      setOrganization: (org) => set({ currentOrganization: org }),
    }),
    {
      name: 'nexus-crm-tenant-theme',
    }
  )
);
