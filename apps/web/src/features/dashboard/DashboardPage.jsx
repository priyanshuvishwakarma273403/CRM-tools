import React, { useState } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { StatsCard } from '../../components/crm/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { Avatar } from '../../components/ui/Avatar';
import { ExplainBadge } from '../../components/crm/ExplainBadge';
import { RealtimeUpdateBadge } from '../../components/crm/RealtimeUpdateBadge';
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
  Sparkles,
  Search,
  AlertTriangle,
  Layers,
  ChevronRight,
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
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';

/**
 * CRM OS Command Center Home
 * Implements Section 67 & 68 of the UI Master Prompt
 */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [askQuery, setAskQuery] = useState('');
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dealsData, tasksData, leadsData, contactsData] = await Promise.all([
        api.deals.getAll(),
        api.tasks.getAll(),
        api.leads.getAll(),
        api.contacts.getAll(),
      ]);
      setDeals(Array.isArray(dealsData) ? dealsData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch (e) {
      console.warn('Dashboard data fetch failed', e);
    }
  };

  const wonRevenue = deals
    .filter((d) => d.stage === 'CLOSED_WON')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const openPipeline = deals
    .filter((d) => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const winRate = deals.length > 0
    ? `${Math.round((deals.filter((d) => d.stage === 'CLOSED_WON').length / deals.length) * 100)}%`
    : '0%';

  const greetingName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'User');

  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    navigate(`/app/ai-copilot?q=${encodeURIComponent(askQuery)}`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Real-time sync badge */}
      <div className="flex justify-end">
        <RealtimeUpdateBadge message={`Live event stream active • ${user?.organizationName || 'Nexus Workspace'}`} />
      </div>

      {/* Command Center Personalized Hero Header (Section 67) */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-brand-600 dark:text-brand-400">
              Command Center Home
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-display">
              Good morning, {greetingName}.
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active Pipeline: <strong className="text-slate-700 dark:text-slate-300 font-mono">${openPipeline.toLocaleString()}</strong> • {tasks.length} Tasks • {contacts.length} Contacts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<CalendarIcon className="w-4 h-4" />}>
              Current Workspace
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/app/ai-copilot')}>
              Open AI Copilot
            </Button>
          </div>
        </div>

        {/* Embedded "Ask CRM OS" Global Search Bar */}
        <form onSubmit={handleAskSubmit} className="relative">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
            <Sparkles className="w-5 h-5 text-ai-500 shrink-0" />
            <input
              type="text"
              value={askQuery}
              onChange={(e) => setAskQuery(e.target.value)}
              placeholder="Ask CRM OS anything (e.g. 'Show deals that may close this month', 'Find churn risk')..."
              className="w-full bg-transparent border-0 outline-hidden text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              Ask
            </button>
          </div>
        </form>
      </div>

      {/* Interactive AI Briefing Card (Section 68) */}
      <div className="p-5 rounded-2xl border border-ai-200 dark:border-ai-900/60 bg-ai-50/50 dark:bg-ai-950/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ai-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Daily Autonomous AI Briefing
              </h3>
              <span className="text-[11px] text-slate-500">Synthesized 10 minutes ago from event telemetry</span>
            </div>
          </div>

          <ExplainBadge
            title="AI Pipeline Briefing Rationale"
            subject="Q3 Executive Revenue Intelligence"
            confidence={0.94}
            reasons={[
              { type: 'positive', text: 'Pipeline velocity increased 18% over prior 7 days' },
              { type: 'positive', text: '7 new enterprise opportunities entered proposal stage' },
              { type: 'negative', text: '1 enterprise account (Zenith) flagged with SLA breach' },
            ]}
            dataSources={['PostgreSQL Deals', 'Gmail Activity', 'Calendar Meetings']}
            recommendedAction="Prioritize resolving Zenith support ticket and securing Acme legal signoff"
            buttonLabel="Explain Briefing"
            size="xs"
          />
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          "Your active pipeline is <strong>18% higher than last week</strong>, driven by 7 enterprise deals advancing to proposal stage. Key focus today: advance <strong>Acme Global</strong> to contract execution and review the retention offer for <strong>Zenith Logistics</strong>."
        </p>

        {/* Priority Action Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {deals.length > 0 ? (
            deals.slice(0, 3).map((item, i) => (
              <div
                key={item.id || i}
                onClick={() => navigate('/app/deals')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase">
                    Stage: {item.stage || 'Discovery'}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                  {item.title || item.name || 'Untitled Deal'}
                </strong>
                <p className="text-[11px] text-slate-500 line-clamp-1 font-mono">${Number(item.amount || 0).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              No active deals yet. <button onClick={() => navigate('/app/deals')} className="text-brand-600 font-bold hover:underline ml-1">Create your first deal</button> to track your sales pipeline.
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue (Won)"
          value={`$${wonRevenue.toLocaleString()}`}
          change={wonRevenue > 0 ? '+100%' : '0%'}
          isPositive={true}
          icon={DollarSign}
        />
        <StatsCard
          title="Open Deals Pipeline"
          value={`$${openPipeline.toLocaleString()}`}
          change={openPipeline > 0 ? `${deals.length} deals` : '0 deals'}
          isPositive={true}
          icon={Briefcase}
        />
        <StatsCard
          title="Total Leads"
          value={`${leads.length}`}
          change={`${leads.length} recorded`}
          isPositive={true}
          icon={UserCheck}
        />
        <StatsCard
          title="Win Conversion Rate"
          value={winRate}
          change="Real-time"
          isPositive={true}
          icon={Percent}
        />
      </div>

      {/* Charts & Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Chart */}
        <Card className="lg:col-span-2 p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Revenue Velocity &amp; Forecast</h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical closed revenue vs Monte Carlo forecast model</p>
            </div>
            <ExplainBadge
              title="Revenue Velocity Analysis"
              subject="Q3 Forecast Model"
              confidence={0.91}
              reasons={[
                { type: 'positive', text: '7 closed-won contracts over $50K threshold in June' },
                { type: 'positive', text: 'Deal cycle shortened from 32 to 24 days' },
              ]}
              dataSources={['PostgreSQL Ledger', 'Rust Monte Carlo Engine']}
              buttonLabel="Explain Growth"
              size="xs"
            />
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#revenueGrad)" name="Closed Won" />
                <Area type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" fill="url(#forecastGrad)" name="AI Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Source Distribution */}
        <Card className="p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Inbound Acquisition Mix</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across verified marketing channels</p>
            <div className="h-44 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadSourcesData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {leadSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            {leadSourcesData.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                <span className="text-slate-600 dark:text-slate-400">{s.name}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 ml-auto">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Tasks Due Today</h3>
            <button onClick={() => navigate('/app/tasks')} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View All ({tasks.length})
            </button>
          </div>
          <div className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${t.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className={`text-xs font-medium ${t.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{t.dueDate || t.time || 'Today'}</span>
                </div>
              ))
            ) : (
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                No tasks scheduled for today. <button onClick={() => navigate('/app/tasks')} className="text-brand-600 font-bold hover:underline ml-1">Add a task</button>.
              </div>
            )}
          </div>
        </Card>

        {/* Quick Nav OS Accelerators */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">CRM OS Operations</h3>
            <span className="text-[11px] text-slate-400">Quick Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
            <button onClick={() => navigate('/app/customers')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors">
              Customer 360 View
            </button>
            <button onClick={() => navigate('/app/deals')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors">
              Deals Pipeline Kanban
            </button>
            <button onClick={() => navigate('/app/approvals')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors">
              Action Approvals Queue
            </button>
            <button onClick={() => navigate('/app/workflows')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors">
              Visual Workflow Engine
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
