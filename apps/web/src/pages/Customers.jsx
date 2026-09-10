import React, { useState, useEffect } from 'react';
import { customersApi } from '../api';
import {
  Users,
  Building2,
  Phone,
  Mail,
  Award,
  TrendingUp,
  ShieldAlert,
  HeartPulse,
  ExternalLink,
  Calendar,
  Search,
  CheckCircle2,
  Briefcase,
  FileText,
  LifeBuoy,
  CreditCard,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { CustomerHealthBreakdown } from '../components/crm/CustomerHealthBreakdown';
import { RelationshipGraph } from '../components/crm/RelationshipGraph';
import { CentralTimeline } from '../components/crm/CentralTimeline';
import { ExplainBadge } from '../components/crm/ExplainBadge';

const INITIAL_CUSTOMERS = [
  {
    id: 'c1',
    name: 'Acme Global Technologies',
    company: 'Acme Corporation Inc.',
    industry: 'Enterprise Software',
    tier: 'ENTERPRISE',
    status: 'ACTIVE',
    healthScore: 92,
    healthTier: 'Healthy',
    annualRecurringRevenue: 1200000,
    churnProbability: 0.04,
    lifecycle: 'Active Customer',
    owner: 'Alex Vance',
    lastContactedAt: '2 days ago',
    contactsCount: 3,
    openDealsCount: 2,
    healthFactors: [
      { text: 'Executive sponsorship locked across VP Engineering', points: '+15', type: 'positive' },
      { text: 'Annual platform license renewed on schedule', points: '+20', type: 'positive' },
      { text: 'Zero unresolved support tickets in 60 days', points: '+10', type: 'positive' },
      { text: 'Contract renewal expansion currently in negotiation', points: '+12', type: 'positive' },
    ],
  },
  {
    id: 'c2',
    name: 'Zenith Logistics Ltd',
    company: 'Zenith Supply Chain Corp',
    industry: 'Supply Chain & Freight',
    tier: 'VIP',
    status: 'AT_RISK',
    healthScore: 48,
    healthTier: 'At Risk',
    annualRecurringRevenue: 650000,
    churnProbability: 0.42,
    lifecycle: 'Renewal Pending',
    owner: 'Elena Rostova',
    lastContactedAt: '14 days ago',
    contactsCount: 2,
    openDealsCount: 1,
    healthFactors: [
      { text: 'Historical multi-year customer since 2024', points: '+10', type: 'positive' },
      { text: 'No executive communication recorded for 14 days', points: '−15', type: 'negative' },
      { text: 'Unresolved Tier-2 ticket #TK-402 on API rate limiting', points: '−12', type: 'negative' },
      { text: 'Competitor evaluation mentioned in support thread', points: '−8', type: 'negative' },
    ],
  },
  {
    id: 'c3',
    name: 'Nexus Dynamics',
    company: 'Nexus Capital Group',
    industry: 'Fintech & Payments',
    tier: 'PREMIUM',
    status: 'ACTIVE',
    healthScore: 84,
    healthTier: 'Healthy',
    annualRecurringRevenue: 480000,
    churnProbability: 0.08,
    lifecycle: 'Expansion',
    owner: 'Alex Vance',
    lastContactedAt: 'Yesterday',
    contactsCount: 4,
    openDealsCount: 1,
    healthFactors: [
      { text: 'Daily active usage in top 5th percentile', points: '+18', type: 'positive' },
      { text: 'Expansion add-on deal in discovery stage', points: '+14', type: 'positive' },
      { text: 'Minor billing currency inquiry resolved', points: '+5', type: 'positive' },
    ],
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('c1');
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await customersApi.getAll();
      const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      if (list && list.length > 0) {
        // Merge with our rich local presentation models
        setCustomers((prev) =>
          prev.map((c) => {
            const remote = list.find((item) => item.id === c.id || item.name === c.name);
            return remote ? { ...c, ...remote } : c;
          })
        );
      }
    } catch (err) {
      console.warn('Operating in offline/cached customer mode:', err.message);
    }
  };

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'Overview', label: 'Overview', icon: Building2 },
    { id: 'Timeline', label: 'Omnichannel Timeline', icon: Calendar },
    { id: 'Graph', label: 'Entity Relationship Graph', icon: Layers },
    { id: 'Deals', label: 'Deals Pipeline', icon: Briefcase },
    { id: 'Documents', label: 'Documents & Contracts', icon: FileText },
    { id: 'AI Insights', label: 'AI Intelligence', icon: Sparkles },
  ];

  return (
    <div className="space-y-6 text-left p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-brand-600 dark:text-brand-400">
            Enterprise Customer 360
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-display">
            Accounts &amp; Relationships
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic relationship intelligence uniting timelines, entity graphs, contracts, and predictive health.
          </p>
        </div>

        {/* Quick Search & Customer Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Main Customer 360 Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Account Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Accounts ({filteredCustomers.length})
          </div>

          <div className="space-y-2">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === currentCustomer.id;

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-card ring-1 ring-brand-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {cust.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                          {cust.name}
                        </strong>
                        <span className="text-[11px] text-slate-400">{cust.industry}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                        cust.healthScore >= 80
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : cust.healthScore >= 60
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {cust.healthScore}/100
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>ARR: <strong className="font-mono text-slate-800 dark:text-slate-200">${(cust.annualRecurringRevenue / 1000).toFixed(0)}k</strong></span>
                    <span>Owner: {cust.owner}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer 360 Deep View (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Customer Header Bar (Section 10) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-display">
                    {currentCustomer.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                    {currentCustomer.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentCustomer.company} • Account Lead: <strong className="text-slate-700 dark:text-slate-300">{currentCustomer.owner}</strong> • Last Contact: {currentCustomer.lastContactedAt}
                </p>
              </div>

              <div className="shrink-0">
                <ExplainBadge
                  title="Account Health & Intent Summary"
                  subject={currentCustomer.name}
                  confidence={0.92}
                  reasons={currentCustomer.healthFactors}
                  dataSources={['PostgreSQL Ledger', 'Gmail Threads', 'Calendar Sync', 'Support Tickets']}
                  buttonLabel="Explain Account"
                  size="sm"
                />
              </div>
            </div>

            {/* Health Score Breakdown Card Embedded */}
            <CustomerHealthBreakdown
              score={currentCustomer.healthScore}
              tier={currentCustomer.healthTier}
              factors={currentCustomer.healthFactors}
            />

            {/* Customer 360 Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Viewports */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Annual Recurring Revenue</span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-slate-100">
                  ${(currentCustomer.annualRecurringRevenue).toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-600 block mt-1">+12% expansion pipeline</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Relationship Status</span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {currentCustomer.lifecycle}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Multi-year contract</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Churn Risk Probability</span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-slate-100">
                  {(currentCustomer.churnProbability * 100).toFixed(0)}%
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Monte Carlo Model</span>
              </div>
            </div>
          )}

          {activeTab === 'Timeline' && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <CentralTimeline />
            </div>
          )}

          {activeTab === 'Graph' && (
            <RelationshipGraph customerName={currentCustomer.name} />
          )}

          {activeTab === 'Deals' && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
                <span className="text-slate-900 dark:text-slate-100">Active Deals Pipeline</span>
                <span className="text-brand-600 dark:text-brand-400 font-mono">2 Opportunities</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 block">Enterprise Cloud Rollout</strong>
                    <span className="text-slate-400 text-[11px]">Stage: Negotiation • Probability: 80%</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">$185,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 block">AI Copilot Add-On Module</strong>
                    <span className="text-slate-400 text-[11px]">Stage: Qualified • Probability: 50%</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">$45,000</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 block">Master Services Agreement (MSA) v2.4.pdf</strong>
                    <span className="text-[11px] text-slate-400">Signed Aug 2024 • Valid through 2027</span>
                  </div>
                </div>
                <button className="text-brand-600 font-bold hover:underline">Download</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 block">Data Processing Addendum (GDPR/DPA).pdf</strong>
                    <span className="text-[11px] text-slate-400">Executed by Legal Compliance Officer</span>
                  </div>
                </div>
                <button className="text-brand-600 font-bold hover:underline">Download</button>
              </div>
            </div>
          )}

          {activeTab === 'AI Insights' && (
            <div className="p-5 rounded-2xl border border-ai-200 dark:border-ai-900/60 bg-ai-50/40 dark:bg-ai-950/20 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-ai-700 dark:text-ai-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Autonomous Domain Agent Recommendations</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                "Customer exhibits high buying intent for volume seat expansion. Advise scheduling the Q4 Executive Sponsor Review before October 1 to lock in the multi-year SLA tier."
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button className="px-3.5 py-1.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors">
                  Draft Sponsor Check-in Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
