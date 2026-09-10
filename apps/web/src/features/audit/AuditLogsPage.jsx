import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';
import { ShieldCheck, User, Clock, Terminal } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.auditLogs.getAll().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Audit & Compliance Logs"
        subtitle="Immutable security audit trail of tenant user actions, logins, exports, and stage changes."
        breadcrumbs={['CRM', 'Audit Logs']}
      />

      <div className="bg-white dark:bg-slate-900 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 font-semibold text-xs uppercase">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Action Event</th>
              <th className="py-3.5 px-4">Module</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3.5 px-4 text-slate-500">{log.timestamp}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 font-sans">{log.userName}</td>
                <td className="py-3.5 px-4"><span className="px-2 py-0.5 text-[10px] font-bold bg-brand-50 text-brand-700 rounded uppercase">{log.action}</span></td>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300 font-sans">{log.entityName}</td>
                <td className="py-3.5 px-4 text-slate-400">{log.ipAddress}</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-sans">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
