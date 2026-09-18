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
  Sliders,
  Settings,
  Bot,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileBox,
  ShieldAlert,
  LifeBuoy,
  BookOpen,
} from 'lucide-react';
import { useTenantStore } from '../../store/useTenantStore';

export const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar, currentOrganization } = useTenantStore();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/app' },
    { label: 'Customer 360', icon: Users, path: '/app/customers', badge: '360' },
    { label: 'Leads', icon: UserCheck, path: '/app/leads' },
    { label: 'Contacts', icon: Users, path: '/app/contacts' },
    { label: 'Companies', icon: Building2, path: '/app/companies' },
    { label: 'Deals Pipeline', icon: Briefcase, path: '/app/deals' },
    { label: 'Tasks', icon: CheckSquare, path: '/app/tasks' },
    { label: 'Activities', icon: Activity, path: '/app/activities' },
    { label: 'Calendar', icon: Calendar, path: '/app/calendar' },
    { label: 'Support Tickets', icon: LifeBuoy, path: '/app/tickets' },
    { label: 'Knowledge RAG', icon: BookOpen, path: '/app/knowledge' },
    { label: 'AI Copilot', icon: Bot, path: '/app/ai-copilot', highlight: true },
    { label: 'Action Approvals', icon: ShieldAlert, path: '/app/approvals' },
    { label: 'Products', icon: Package, path: '/app/products' },
    { label: 'Invoices', icon: FileText, path: '/app/invoices' },
    { label: 'Payments', icon: CreditCard, path: '/app/payments' },
    { label: 'Analytics & BI', icon: BarChart3, path: '/app/reports' },
    { label: 'Sales Forecast', icon: TrendingUp, path: '/app/forecast' },
    { label: 'Workflows', icon: Workflow, path: '/app/workflows' },
    { label: 'Files Vault', icon: FileBox, path: '/app/files' },
    { label: 'Custom Fields', icon: Sliders, path: '/app/custom-fields' },
    { label: 'Audit Logs', icon: ShieldCheck, path: '/app/audit-logs' },
    { label: 'Settings', icon: Settings, path: '/app/settings' },
  ];

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out shrink-0 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
            N
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                Nexus<span className="text-brand-600 dark:text-brand-400">CRM</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 truncate max-w-[140px]">
                {currentOrganization.name}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/app'
              ? location.pathname === '/app' || location.pathname === '/app/' || location.pathname === '/app/dashboard'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform ${
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-400 group-hover:scale-110'
                } ${item.highlight ? 'text-indigo-500 animate-pulse' : ''}`}
              />

              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}

              {!isSidebarCollapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Tenant Card */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {currentOrganization.plan} PLAN
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
        </div>
      )}
    </aside>
  );
};
