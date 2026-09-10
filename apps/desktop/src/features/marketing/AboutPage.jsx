import React from 'react';
import { Target, Heart, Shield, Cpu } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          About NexusCRM Desktop
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Engineered to give sales teams back their focus by combining desktop speed, offline autonomy, and multi-tenant security.
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Product Vision</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Traditional web CRM software is often slow, memory-heavy, and completely useless when internet connectivity drops. NexusCRM was built from the ground up as a native desktop application powered by Tauri 2, Rust, and React, backed by an enterprise Spring Boot microservice stack.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <Cpu className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Native Performance</h4>
              <p className="text-[11px] text-slate-500">Sub-second load times and lightweight memory footprint.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Data Sovereignty</h4>
              <p className="text-[11px] text-slate-500">Local offline SQLite storage with secure background synchronization.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
