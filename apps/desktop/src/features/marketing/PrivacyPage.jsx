import React from 'react';

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="text-xs text-slate-500">Effective Date: September 1, 2026</p>
      <div className="prose dark:prose-invert text-xs space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>NexusCRM Platform Inc. ("we", "our", or "us") respects your privacy and is committed to protecting your multi-tenant enterprise data.</p>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Data Storage & Local Persistence</h3>
        <p>NexusCRM Desktop utilizes local SQLite storage on your native hardware for offline queue management. Local records remain isolated within your operating system environment.</p>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Multi-Tenant Isolation</h3>
        <p>Server-side transactions are secured using strict TenantContext filters, ensuring that your organization's records are never exposed to other tenants.</p>
      </div>
    </div>
  );
};
