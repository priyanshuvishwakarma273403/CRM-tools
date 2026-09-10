import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid,
  Mail,
  MessageSquare,
  CreditCard,
  Database,
  Webhook,
  ArrowUpRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';

const integrations = [
  {
    name: 'Google Workspace',
    category: 'Productivity',
    desc: 'Two-way sync for Gmail threads, calendar events, and contacts automatically.',
    icon: Mail,
    badge: 'Official',
    color: 'bg-red-50 text-red-600',
  },
  {
    name: 'Microsoft 365',
    category: 'Productivity',
    desc: 'Seamless Outlook email logging, meeting bookings, and Active Directory SSO.',
    icon: Mail,
    badge: 'Official',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Slack',
    category: 'Communication',
    desc: 'Real-time notifications for closed won deals, pipeline milestones, and lead alerts.',
    icon: MessageSquare,
    badge: 'Popular',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    name: 'Stripe',
    category: 'Billing',
    desc: 'Sync customer subscriptions, invoices, and payment histories directly into Deals.',
    icon: CreditCard,
    badge: 'Verified',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    name: 'PostgreSQL Direct Sync',
    category: 'Developer',
    desc: 'Direct relational database access with real-time logical replication streaming.',
    icon: Database,
    badge: 'Core',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    name: 'Webhooks & Zapier',
    category: 'Developer',
    desc: 'Trigger actions and listen for 40+ event types with signed HTTP payloads.',
    icon: Webhook,
    badge: 'Extensible',
    color: 'bg-amber-50 text-amber-600',
  },
];

export const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIntegrations = integrations.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 sm:pt-32 pb-16 bg-white min-h-screen text-neutral-900">
      {/* Editorial Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-wider text-neutral-500 mb-4">
          <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
          <span className="text-neutral-700 font-sans uppercase font-bold text-xs tracking-wider">
            Apps &amp; Ecosystem
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] mb-6">
          Connect your stack.<br />Extend your CRM.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Plug Nexus into your email provider, billing engine, messaging channels, and internal developer tools.
        </p>

        {/* Filter + Search Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 text-xs font-medium">
            {['All', 'Productivity', 'Communication', 'Billing', 'Developer'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/70 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>
      </section>

      {/* App Cards Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((app, idx) => {
            const Icon = app.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${app.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-semibold">
                      {app.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {app.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-neutral-400">{app.category}</span>
                  <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Connect <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Docked Dark Pre-Footer */}
      <div className="mt-32">
        <DarkPreFooterSection />
      </div>
    </div>
  );
};

export default ResourcesPage;

