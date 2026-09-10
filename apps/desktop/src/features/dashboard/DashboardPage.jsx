import React from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { StatsCard } from '../../components/crm/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { Avatar } from '../../components/ui/Avatar';
import {
  DollarSign,
  Briefcase,
  UserCheck,
  Percent,
  Download,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Bot,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const revenueData = [
    { month: 'Jan', revenue: 42000, forecast: 45000 },
    { month: 'Feb', revenue: 58000, forecast: 55000 },
    { month: 'Mar', revenue: 74000, forecast: 70000 },
    { month: 'Apr', revenue: 68000, forecast: 75000 },
    { month: 'May', revenue: 92000, forecast: 88000 },
    { month: 'Jun', revenue: 115000, forecast: 110000 },
  ];

  const leadSourcesData = [
    { name: 'Website', value: 40, color: '#3b82f6' },
    { name: 'LinkedIn', value: 25, color: '#6366f1' },
    { name: 'Referrals', value: 20, color: '#10b981' },
    { name: 'Cold Call', value: 15, color: '#f59e0b' },
  ];

  const todaysTasks = [
    { id: 'task_1', title: 'Send revised SLA proposal to Apex Global', time: '3:00 PM', priority: 'URGENT', done: false },
    { id: 'task_2', title: 'Follow up with Rachel on CloudScale security approval', time: '11:30 AM', priority: 'HIGH', done: false },
    { id: 'task_4', title: 'Review quarterly sales performance metrics with team', time: '5:00 PM', priority: 'HIGH', done: true },
  ];

  const recentLeads = [
    { id: 'lead_1', name: 'Sophia Martine', company: 'Nexus Biotech', status: 'QUALIFIED', score: 88 },
    { id: 'lead_2', name: 'Liam O\'Connor', company: 'FinNet Solutions', status: 'PROPOSAL', score: 92 },
    { id: 'lead_3', name: 'Hannah Zhang', company: 'CyberGuard Inc', status: 'CONTACTED', score: 74 },
  ];

  const highValueDeals = [
    { id: 'deal_3', name: 'BioGenix Compliance & Analytics Module', company: 'BioGenix Labs', value: '$240,000', stage: 'DEMO' },
    { id: 'deal_1', name: 'Apex Global Enterprise CRM Rollout', company: 'Apex Global', value: '$185,000', stage: 'PROPOSAL' },
    { id: 'deal_2', name: 'CloudScale Multi-Tenant Integration', company: 'CloudScale Dynamics', value: '$92,000', stage: 'NEGOTIATION' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Sales & Executive Dashboard"
        subtitle="Good morning, Alex. Here's what's happening with your business today."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<CalendarIcon className="w-4 h-4" />}>
              Last 30 Days
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue (Won)"
          value="$385,000"
          change="+14.8%"
          isPositive={true}
          icon={DollarSign}
        />
        <StatsCard
          title="Open Deals Pipeline"
          value="$517,000"
          change="+22.4%"
          isPositive={true}
          icon={Briefcase}
        />
        <StatsCard
          title="New Qualified Leads"
          value="28"
          change="+18.2%"
          isPositive={true}
          icon={UserCheck}
        />
        <StatsCard
          title="Pipeline Conversion Rate"
          value="24.5%"
          change="-1.4%"
          isPositive={false}
          icon={Percent}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Revenue Overview & Target Forecast</h3>
              <p className="text-xs text-slate-500">Monthly actual closed-won vs target revenue projection</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              +14.8% YoY
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Actual Revenue" />
                <Area type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorForecast)" name="Target Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Sources Distribution */}
        <Card className="flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Lead Sources</h3>
            <p className="text-xs text-slate-500">Inbound lead channel breakdown</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadSourcesData} innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {leadSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {leadSourcesData.map((src, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }}></span>
                  <span className="text-slate-700 dark:text-slate-300">{src.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{src.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Tasks Widget */}
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              Today's High Priority Tasks
            </h3>
            <button onClick={() => navigate('/tasks')} className="text-xs font-semibold text-brand-600 hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {todaysTasks.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  defaultChecked={t.done}
                  className="mt-1 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div className="flex-1">
                  <p className={`text-xs font-semibold ${t.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {t.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.time}
                    </span>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                      {t.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent High-Scoring Leads */}
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Recent High-Score Leads
            </h3>
            <button onClick={() => navigate('/leads')} className="text-xs font-semibold text-brand-600 hover:underline">
              View leads
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={lead.name} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{lead.name}</h4>
                    <p className="text-[11px] text-slate-500">{lead.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={lead.status} />
                  <span className="px-2 py-0.5 text-xs font-black bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-md">
                    {lead.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* High-Value Deals Requiring Attention */}
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Deals Requiring Attention
            </h3>
            <button onClick={() => navigate('/deals')} className="text-xs font-semibold text-brand-600 hover:underline">
              View pipeline
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {highValueDeals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => navigate('/deals')}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-amber-300 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{deal.name}</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{deal.value}</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                  <span>{deal.company}</span>
                  <StatusBadge status={deal.stage} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Assistant Callout Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-700 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Nexus AI Sales Intelligence</h3>
            <p className="text-xs text-brand-100 mt-0.5">
              Ask your AI assistant: "Which high-value leads are ready for follow-up today?" or generate custom proposals instantly.
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/ai-copilot')}
          variant="secondary"
          className="shrink-0 bg-white text-brand-700 hover:bg-brand-50 border-none font-bold"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Open AI Copilot
        </Button>
      </div>
    </div>
  );
};
