import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Building2,
  Briefcase,
  CheckSquare,
  Activity,
  Calendar,
  Package,
  FileText,
  CreditCard,
  BarChart3,
  TrendingUp,
  Workflow,
  ShieldCheck,
  Settings,
  Bot,
  ChevronLeft,
  ChevronRight,
  Layers,
  Inbox,
  HelpCircle,
} from 'lucide-react';
import { useTenantStore } from '../../store/useTenantStore';

export const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar, currentOrganization } = useTenantStore();
  const location = useLocation();

  const sections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'Leads', icon: UserCheck, path: '/leads', badge: '5' },
        { label: 'Contacts', icon: Users, path: '/contacts' },
        { label: 'Companies', icon: Building2, path: '/companies' },
        { label: 'Deals Pipeline', icon: Briefcase, path: '/deals', badge: '15' },
      ],
    },
    {
      title: 'WORK',
      items: [
        { label: 'Tasks', icon: CheckSquare, path: '/tasks', badge: '4' },
        { label: 'Calendar', icon: Calendar, path: '/calendar' },
        { label: 'Activities', icon: Activity, path: '/activities' },
        { label: 'AI Copilot', icon: Bot, path: '/ai-copilot', highlight: true },
      ],
    },
    {
      title: 'BUSINESS',
      items: [
        { label: 'Products', icon: Package, path: '/products' },
        { label: 'Invoices', icon: FileText, path: '/invoices' },
        { label: 'Reports & BI', icon: BarChart3, path: '/reports' },
        { label: 'Forecast', icon: TrendingUp, path: '/forecast' },
      ],
    },
    {
      title: 'AUTOMATION',
      items: [{ label: 'Workflows', icon: Workflow, path: '/workflows' }],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Audit Logs', icon: ShieldCheck, path: '/audit-logs' },
        { label: 'Settings', icon: Settings, path: '/settings' },
      ],
    },
  ];

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out shrink-0 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
            N
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                Nexus<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 truncate max-w-[140px]">
                {currentOrganization.name}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Grouped Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                {sec.title}
              </div>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:scale-110'
                    } ${item.highlight ? 'text-indigo-500 animate-pulse' : ''}`}
                  />

                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}

                  {!isSidebarCollapsed && item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Plan Card */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {currentOrganization.plan} PLAN
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      )}
    </aside>
  );
};
