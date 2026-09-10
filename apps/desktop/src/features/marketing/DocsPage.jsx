import React from 'react';
import { BookOpen, Terminal, Code, Cpu } from 'lucide-react';

export const DocsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Documentation & Desktop Guides</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Technical specifications, Tauri native desktop IPC architecture, and Spring Boot API endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Start Guide</h3>
          <p className="text-xs text-slate-500">Installation walkthroughs for Windows MSI, macOS DMG, and Linux AppImage.</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Code className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">REST API Specs</h3>
          <p className="text-xs text-slate-500">Spring Boot REST API endpoint definitions (`/api/v1/leads`, `/api/v1/deals`, `/api/v1/sync`).</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Cpu className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Rust Tauri IPC Commands</h3>
          <p className="text-xs text-slate-500">Documentation for `save_offline_record`, `sync_offline_queue`, and `print_invoice_pdf` handlers.</p>
        </div>
      </div>
    </div>
  );
};
