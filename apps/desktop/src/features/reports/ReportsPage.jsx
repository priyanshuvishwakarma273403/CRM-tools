import React from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart3, TrendingUp, Download, Filter, Users, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, FunnelChart, Funnel, LabelList } from 'recharts';

export const ReportsPage = () => {
  const teamPerformance = [
    { name: 'Marcus Chen', revenue: 277000, deals: 3 },
    { name: 'Sarah Jenkins', revenue: 68000, deals: 1 },
    { name: 'Elena Rostova', revenue: 240000, deals: 1 },
  ];

  const conversionFunnel = [
    { value: 100, name: 'Leads (100)', fill: '#3b82f6' },
    { value: 65, name: 'Qualified (65)', fill: '#6366f1' },
    { value: 40, name: 'Demo (40)', fill: '#8b5cf6' },
    { value: 25, name: 'Proposal (25)', fill: '#ec4899' },
    { value: 15, name: 'Won (15)', fill: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Business Intelligence"
        subtitle="Deep sales analytics, agent performance breakdown, and funnel velocity."
        breadcrumbs={['CRM', 'Reports']}
        actions={<Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export Analytics</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Sales Performance Bar Chart */}
        <Card className="p-5">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
            Sales Performance by Account Executive
          </h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Won/Pipeline Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Conversion Funnel */}
        <Card className="p-5">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
            Sales Conversion Funnel Velocity
          </h3>
          <div className="space-y-3 pt-4">
            {conversionFunnel.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{step.name}</span>
                  <span>{step.value}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${step.value}%`, backgroundColor: step.fill }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
