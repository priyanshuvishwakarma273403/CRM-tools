import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Plus, Command, User, LogOut, Shield } from 'lucide-react';
import { useTenantStore } from '../../store/useTenantStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';

export const Topbar = ({ onOpenQuickCreate }) => {
  const { darkMode, toggleDarkMode, setCommandPaletteOpen, setNotificationDrawerOpen, currentOrganization } =
    useTenantStore();
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      {/* Left Search Bar Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm w-48 sm:w-72 md:w-96 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate text-xs sm:text-sm">Search CRM or press <kbd className="font-semibold text-brand-600 dark:text-brand-400">Ctrl + K</kbd></span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Create Action Button */}
        <button
          onClick={onOpenQuickCreate}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-medium text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Real-time Notification Bell */}
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <Avatar name={user?.name || 'Alex Vance'} src={user?.avatarUrl} size="md" />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {user?.name || 'Alex Vance'}
              </span>
              <span className="text-[11px] font-medium text-slate-500">{user?.role || 'ADMIN'}</span>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[11px] font-semibold">
                  <Shield className="w-3 h-3" />
                  {currentOrganization.name}
                </div>
              </div>

              <div className="py-1">
                <a
                  href="/settings"
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile Settings
                </a>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
