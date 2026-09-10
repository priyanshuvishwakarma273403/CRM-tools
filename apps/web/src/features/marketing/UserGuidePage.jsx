import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  CheckCircle,
  Command,
  LayoutGrid,
  Users,
  Workflow,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const UserGuidePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeShortcutCategory, setActiveShortcutCategory] = useState('Navigation');

  const modules = [
    {
      id: 'getting-started',
      icon: Compass,
      title: 'Workspace Setup & Team Invites',
      category: 'Foundation',
      readTime: '4 min read',
      description: 'Configure your organization name, branding colors, default currency, invite team members, and configure multi-tenant isolation.',
      topics: ['Creating your tenant workspace', 'Inviting sales reps & managers', 'Setting timezone and currency'],
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'pipelines',
      icon: LayoutGrid,
      title: 'Pipelines, Deals & Kanban Boards',
      category: 'Sales Core',
      readTime: '6 min read',
      description: 'Customize pipeline stages, set win probabilities, drag-and-drop deals across stages, and auto-calculate weighted pipeline totals.',
      topics: ['Customizing stages & probability', 'Kanban drag-and-drop mechanics', 'Deal loss reasons & win notes'],
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'customer-360',
      icon: Users,
      title: 'Customer 360 & Activity Timeline',
      category: 'Relationships',
      readTime: '5 min read',
      description: 'Unify company accounts, contacts, call notes, emails, and meetings in an immutable chronological timeline view.',
      topics: ['Linking contacts to companies', 'Activity log entries & notes', 'Custom field attributes'],
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'automations',
      icon: Workflow,
      title: 'Visual Workflows & AI Copilot',
      category: 'Automation',
      readTime: '8 min read',
      description: 'Build trigger-action automations, auto-assign incoming leads based on rules, and let AI draft personalized outreach messages.',
      topics: ['Trigger conditions & delays', 'Webhook actions & alerts', 'AI Copilot prompt commands'],
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics, Quotas & Revenue Forecast',
      category: 'Intelligence',
      readTime: '5 min read',
      description: 'Monitor individual rep quota attainment, deal conversion funnel velocities, and projected monthly/quarterly revenue forecasts.',
      topics: ['Sales performance dashboards', 'Funnel conversion velocity', 'Exporting CSV/PDF reports'],
      color: 'text-rose-600 bg-rose-50',
    },
    {
      id: 'security',
      icon: ShieldCheck,
      title: 'Roles, Permissions & Security Audits',
      category: 'Governance',
      readTime: '6 min read',
      description: 'Manage ADMIN, MANAGER, and AGENT role boundaries, review immutable security audit logs, and configure API access tokens.',
      topics: ['Role-based access matrix', 'Audit log inspection & exports', 'Scoped API token generation'],
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  const shortcuts = {
    Navigation: [
      { key: 'G D', description: 'Go to Dashboard' },
      { key: 'G L', description: 'Go to Leads pipeline' },
      { key: 'G C', description: 'Go to Customers 360' },
      { key: 'G P', description: 'Go to Products directory' },
      { key: 'G S', description: 'Go to Settings' },
    ],
    Actions: [
      { key: 'Cmd + K', description: 'Open Global Command Palette' },
      { key: 'N L', description: 'Create New Lead' },
      { key: 'N D', description: 'Create New Deal' },
      { key: 'N T', description: 'Create New Task' },
      { key: 'Esc', description: 'Close modal / drawer' },
    ],
    Views: [
      { key: 'V K', description: 'Switch to Kanban view' },
      { key: 'V T', description: 'Switch to Table / List view' },
      { key: 'F', description: 'Open active Filter drawer' },
      { key: '/', description: 'Focus search bar' },
    ],
  };

  const filteredModules = modules.filter(
    (m) =>
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation &amp; User Manual</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          Nexus User Guide
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Master pipelines, customer 360 views, AI copilot workflows, and team collaboration shortcuts.
        </p>

        {/* Search input */}
        <div className="mt-8 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guide (e.g. Kanban, Workflows, Export, Permissions)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-xs"
          />
        </div>
      </section>

      {/* 2. Structured Guide Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-200">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
            {filteredModules.length} Modules Available
          </div>
          <span className="text-xs text-neutral-400 font-mono">Updated for Nexus v2.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <Card3D
                key={mod.id}
                ambientFloat={true}
                floatDelay={index * 150}
                maxTilt={12}
                className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between h-full hover:border-neutral-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.color}`} style={{ transform: 'translateZ(20px)' }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      {mod.readTime}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono uppercase text-blue-600 font-bold mb-1">
                    {mod.category}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                    {mod.description}
                  </p>

                  {/* Topic Checklist */}
                  <div className="space-y-2 border-t border-neutral-100 pt-4 mb-6">
                    {mod.topics.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/docs"
                  className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors"
                >
                  <span>Read full walkthrough</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* 3. Interactive Keyboard Shortcuts Cheat Sheet */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">
            <Command className="w-3.5 h-3.5" />
            <span>PRODUCTIVITY MULTIPLIER</span>
          </div>
          <h2 className="text-3xl font-serif font-normal text-neutral-900 tracking-tight">
            Keyboard shortcuts cheat sheet
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Nexus is built for high-velocity power users. Navigate the entire CRM without touching your mouse.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Object.keys(shortcuts).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveShortcutCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeShortcutCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Shortcuts List Card */}
        <Card3D maxTilt={6} scale={1.01} className="max-w-2xl mx-auto rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
          {shortcuts[activeShortcutCategory].map((sc, i) => (
            <div key={i} className="px-6 py-3.5 flex items-center justify-between text-xs">
              <span className="text-neutral-700 font-medium">{sc.description}</span>
              <kbd className="px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono text-[11px] text-neutral-800 shadow-2xs font-bold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </Card3D>
      </section>

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default UserGuidePage;
