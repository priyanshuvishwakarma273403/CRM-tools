import React from 'react';
import { UserCheck, Users, Briefcase, CheckSquare, BarChart3, Workflow, Shield, WifiOff } from 'lucide-react';

export const FeaturesPage = () => {
  const features = [
    {
      icon: UserCheck,
      title: 'Lead Qualification & Scoring',
      desc: 'Capture, score, and automatically assign leads based on revenue potential and custom industry rules.',
    },
    {
      icon: Users,
      title: 'Contacts & Account Directory',
      desc: 'Comprehensive multi-tenant customer profiles with full contact interaction timelines and company associations.',
    },
    {
      icon: Briefcase,
      title: 'Deals Kanban Pipeline',
      desc: 'Visual drag-and-drop deal management with close probabilities, expected close dates, and aggregate totals.',
    },
    {
      icon: CheckSquare,
      title: 'Tasks & Activities Stream',
      desc: 'Chronological team activity feed and task priority tracking with instant desktop reminder notifications.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Forecast Engine',
      desc: 'Recharts-driven team sales velocity reporting and probability-weighted revenue projection charts.',
    },
    {
      icon: Workflow,
      title: 'Visual Automation Builder',
      desc: 'Node-based Trigger-Condition-Action automation engine for eliminating manual data entry.',
    },
    {
      icon: WifiOff,
      title: 'Offline SQLite Synchronization',
      desc: 'Native desktop offline database allowing full CRUD capabilities without an active internet connection.',
    },
    {
      icon: Shield,
      title: 'Multi-Tenant Security Isolation',
      desc: 'Strict organization-level tenant contexts, role-based access controls (RBAC), and immutable audit logs.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          Full-Spectrum CRM Features Built for Desktop Performance
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Discover how NexusCRM equips your sales and operations teams with native tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
