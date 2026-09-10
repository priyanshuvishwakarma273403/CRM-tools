import React from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PaymentsPage = () => {
  const payments = [
    { id: 'pay_1', invoice: 'INV-2026-001', amount: 70000, date: '2026-08-29 10:15', method: 'WIRE_TRANSFER', txn: 'TXN-984201859', status: 'SUCCESS' },
    { id: 'pay_2', invoice: 'INV-2026-000', amount: 24500, date: '2026-07-15 14:20', method: 'CREDIT_CARD (Stripe Abstraction)', txn: 'TXN-741209845', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Transactions"
        subtitle="Payment provider gateway abstraction (Stripe, Razorpay, Bank Transfer)."
        breadcrumbs={['CRM', 'Payments']}
      />

      <Card className="p-4 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-brand-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Modular Payment Abstraction Engine</h4>
            <p className="text-xs text-slate-500">Stripe and Razorpay webhooks can be dynamically connected to this payment service layer.</p>
          </div>
        </div>
      </Card>

      <div className="bg-white dark:bg-slate-900 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 font-semibold text-xs uppercase">
              <th className="py-3.5 px-4">Transaction ID</th>
              <th className="py-3.5 px-4">Invoice #</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {payments.map((pay) => (
              <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-4 px-4 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{pay.txn}</td>
                <td className="py-4 px-4 font-semibold text-brand-600">{pay.invoice}</td>
                <td className="py-4 px-4 font-black text-emerald-600">${pay.amount.toLocaleString()}</td>
                <td className="py-4 px-4 text-xs text-slate-500">{pay.method}</td>
                <td className="py-4 px-4 text-xs text-slate-400">{pay.date}</td>
                <td className="py-4 px-4"><StatusBadge status={pay.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
