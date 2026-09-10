import React from 'react';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Terms of Service</h1>
      <p className="text-xs text-slate-500">Effective Date: September 1, 2026</p>
      <div className="prose dark:prose-invert text-xs space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>Welcome to NexusCRM Desktop Platform. By accessing or using our software, APIs, or native desktop applications, you agree to these Terms.</p>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Desktop Application License</h3>
        <p>NexusCRM grants you a non-exclusive, non-transferable license to install and run the Tauri desktop application on supported Windows, macOS, and Linux hardware.</p>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Acceptable Use</h3>
        <p>You agree not to reverse engineer, decompile, or attempt to extract source code or cross-tenant data from the API services.</p>
      </div>
    </div>
  );
};
