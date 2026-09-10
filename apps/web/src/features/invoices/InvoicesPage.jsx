import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { api } from '../../services/api';
import { FileText, Plus, Download, Printer } from 'lucide-react';

export const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.invoices.getAll().then(setInvoices);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices & Billing"
        subtitle="Generate client billing invoices, track receivables, and export PDFs."
        breadcrumbs={['CRM', 'Invoices']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Create Invoice</Button>}
      />

      <div className="bg-white dark:bg-slate-900 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 font-semibold text-xs uppercase">
              <th className="py-3.5 px-4">Invoice #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-4 font-bold text-brand-600 dark:text-brand-400">{inv.invoiceNumber}</td>
                <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  {inv.companyName}
                  <div className="text-xs text-slate-400 font-normal">{inv.customerName}</div>
                </td>
                <td className="py-4 px-4 text-xs text-slate-500">{inv.issueDate}</td>
                <td className="py-4 px-4 text-xs text-slate-500">{inv.dueDate}</td>
                <td className="py-4 px-4 font-black text-slate-900 dark:text-slate-100">${Number(inv.total).toLocaleString()}</td>
                <td className="py-4 px-4"><StatusBadge status={inv.status} /></td>
                <td className="py-4 px-4 text-right">
                  <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>PDF</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
