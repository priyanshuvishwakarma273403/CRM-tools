import React from 'react';
import { ShieldCheck, Lock, Key, Server, Database, Eye } from 'lucide-react';

export const SecurityPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          Security Architecture & Multi-Tenant Data Isolation
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          How NexusCRM protects your enterprise records across backend services and desktop client containers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Stateless JWT Authentication</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Secure, encrypted JWT tokens with refresh token rotation and organization ID claims.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Database className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">TenantContext Data Isolation</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Every database query is scoped to the active tenant, preventing cross-organization data leakage.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Lock className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Local SQLite Encryption</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Offline desktop queues stored in sandboxed local SQLite databases managed by Rust.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Eye className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Immutable Security Audit Logs</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            All administrative actions, logins, exports, and stage changes are permanently recorded.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Key className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Fine-grained user permissions for ADMIN, MANAGER, and SALES_AGENT roles.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Server className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Spring Security Defense</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Built-in protection against CSRF, XSS, SQL Injection, and unauthenticated endpoint access.
          </p>
        </div>
      </div>
    </div>
  );
};
