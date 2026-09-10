import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCheck, Plus, CheckSquare, Menu } from 'lucide-react';

export const MobileBottomNav = ({ onOpenQuickCreate, onOpenMobileMenu }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40 flex items-center justify-around px-2 shadow-lg">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/leads"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`
        }
      >
        <UserCheck className="w-5 h-5" />
        <span>Leads</span>
      </NavLink>

      {/* Floating Center Action Button */}
      <button
        onClick={onOpenQuickCreate}
        className="-mt-5 w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-900 transition-all"
        title="Quick Add"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`
        }
      >
        <CheckSquare className="w-5 h-5" />
        <span>Tasks</span>
      </NavLink>

      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium text-slate-500 dark:text-slate-400 transition-colors"
      >
        <Menu className="w-5 h-5" />
        <span>More</span>
      </button>
    </div>
  );
};
