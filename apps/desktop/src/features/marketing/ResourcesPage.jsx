import React from 'react';
import { HelpCircle, FileText, Video, Sparkles } from 'lucide-react';

export const ResourcesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Help Center & Resources</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Everything you need to master CRM pipeline management and automated workflow rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <HelpCircle className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Knowledge Base</h3>
          <p className="text-xs text-slate-500">Step-by-step solutions to common setup, multi-tenant RBAC, and offline questions.</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Video className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Video Tutorials</h3>
          <p className="text-xs text-slate-500">Watch deal pipeline setup and workflow rule builder demonstrations.</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Release Changelog</h3>
          <p className="text-xs text-slate-500">View what's new in NexusCRM Desktop Version 1.0.0 release.</p>
        </div>
      </div>
    </div>
  );
};
