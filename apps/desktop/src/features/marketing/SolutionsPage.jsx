import React from 'react';
import { Target, Building2, Rocket, Briefcase, Headphones, TrendingUp } from 'lucide-react';

export const SolutionsPage = () => {
  const solutions = [
    { icon: Target, title: 'Enterprise Sales Teams', desc: 'Accelerate deal cycles with drag-and-drop Kanban pipelines and probability forecasts.' },
    { icon: Building2, title: 'Small & Medium Businesses', desc: 'Manage your customer relationships without expensive cloud subscriptions.' },
    { icon: Rocket, title: 'High-Growth Startups', desc: 'Scale from 1 to 50 users seamlessly with built-in multi-tenancy.' },
    { icon: Briefcase, title: 'Agencies & Consultants', desc: 'Organize client accounts, retain contact histories, and log activities.' },
    { icon: Headphones, title: 'Customer Support', desc: 'Track customer inquiries and maintain an immutable chronological timeline.' },
    { icon: TrendingUp, title: 'Revenue Operations', desc: 'Gain complete visibility into team conversion rates and forecast accuracy.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          CRM Solutions Tailored for Every Growing Business
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Whether you are a solo founder or leading an enterprise sales team, NexusCRM fits your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {solutions.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
