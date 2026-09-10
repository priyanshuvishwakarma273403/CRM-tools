import React, { useState } from 'react';
import {
  Building2,
  Users,
  Briefcase,
  Mail,
  Calendar,
  LifeBuoy,
  CreditCard,
  FileText,
  Activity,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

/**
 * Interactive Customer Relationship Tree Graph
 * Implements Section 11: Expandable Customer Entity Graph
 */
export const RelationshipGraph = ({ customerName = 'Acme Global Technologies' }) => {
  const [expandedNodes, setExpandedNodes] = useState({
    contacts: true,
    deals: true,
  });

  const toggleNode = (key) => {
    setExpandedNodes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const graphData = {
    contacts: [
      { id: 'ct-1', name: 'Rachel Green', title: 'VP of Engineering', email: 'rachel@acme.com' },
      { id: 'ct-2', name: 'David Miller', title: 'Chief Procurement Officer', email: 'david.m@acme.com' },
      { id: 'ct-3', name: 'Sanjay Patel', title: 'Director of IT Ops', email: 'sanjay@acme.com' },
    ],
    deals: [
      { id: 'dl-1', title: 'Enterprise Cloud Migration', value: '$185,000', stage: 'Negotiation' },
      { id: 'dl-2', title: 'AI Automation Module Add-on', value: '$45,000', stage: 'Qualified' },
    ],
    emails: [
      { id: 'em-1', title: 'Re: Security SOC2 Compliance Package', date: 'Yesterday' },
      { id: 'em-2', title: 'Draft SLA for Q4 Deployment', date: '3 days ago' },
    ],
    meetings: [
      { id: 'mt-1', title: 'Executive Architecture Review', date: 'Tomorrow, 2:00 PM' },
    ],
    tickets: [
      { id: 'tk-1', title: 'SSO SAML Identity Provider Sync Delay', status: 'In Progress', priority: 'High' },
    ],
    payments: [
      { id: 'pm-1', title: 'Annual Platform License (Paid)', amount: '$120,000', date: 'Aug 2026' },
    ],
    documents: [
      { id: 'dc-1', title: 'Master Services Agreement v2.4.pdf', size: '2.4 MB' },
      { id: 'dc-2', title: 'Data Processing Addendum (DPA).pdf', size: '850 KB' },
    ],
    activities: [
      { id: 'ac-1', title: 'Lead qualified by Sales AI Copilot', time: 'Aug 28' },
    ],
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{customerName}</h3>
            <span className="text-[11px] text-slate-400">Interactive Entity Relationship Graph</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold">
          8 RELATION NODES
        </span>
      </div>

      {/* Tree Visualization */}
      <div className="space-y-2.5 font-sans text-xs">
        {/* Contacts Node */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => toggleNode('contacts')}
            className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Contacts ({graphData.contacts.length})</span>
            </div>
            {expandedNodes.contacts ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedNodes.contacts && (
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {graphData.contacts.map((c) => (
                <div key={c.id} className="py-2 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">{c.name}</strong>
                    <span className="text-slate-400 ml-2">• {c.title}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{c.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deals Node */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => toggleNode('deals')}
            className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>Deals Pipeline ({graphData.deals.length})</span>
            </div>
            {expandedNodes.deals ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedNodes.deals && (
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {graphData.deals.map((d) => (
                <div key={d.id} className="py-2 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">{d.title}</strong>
                    <span className="text-slate-400 ml-2">• Stage: {d.stage}</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{d.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emails Node */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => toggleNode('emails')}
            className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Mail className="w-4 h-4 text-amber-500" />
              <span>Emails & Comms ({graphData.emails.length})</span>
            </div>
            {expandedNodes.emails ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedNodes.emails && (
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {graphData.emails.map((e) => (
                <div key={e.id} className="py-2 flex items-center justify-between">
                  <span className="text-slate-800 dark:text-slate-200">{e.title}</span>
                  <span className="text-slate-400 text-[11px]">{e.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meetings Node */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => toggleNode('meetings')}
            className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>Meetings & Schedule ({graphData.meetings.length})</span>
            </div>
            {expandedNodes.meetings ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedNodes.meetings && (
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              {graphData.meetings.map((m) => (
                <div key={m.id} className="py-2 flex items-center justify-between">
                  <span className="text-slate-800 dark:text-slate-200">{m.title}</span>
                  <span className="text-purple-600 dark:text-purple-400 text-[11px] font-semibold">{m.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Tickets Node */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => toggleNode('tickets')}
            className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <LifeBuoy className="w-4 h-4 text-rose-500" />
              <span>Support Tickets ({graphData.tickets.length})</span>
            </div>
            {expandedNodes.tickets ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedNodes.tickets && (
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              {graphData.tickets.map((t) => (
                <div key={t.id} className="py-2 flex items-center justify-between">
                  <span className="text-slate-800 dark:text-slate-200">{t.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payments Node */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => toggleNode('payments')}
            className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <CreditCard className="w-4 h-4 text-cyan-500" />
              <span>Payments & Ledger ({graphData.payments.length})</span>
            </div>
            {expandedNodes.payments ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedNodes.payments && (
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              {graphData.payments.map((p) => (
                <div key={p.id} className="py-2 flex items-center justify-between">
                  <span className="text-slate-800 dark:text-slate-200">{p.title}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{p.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents Node */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => toggleNode('documents')}
            className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Documents Vault ({graphData.documents.length})</span>
            </div>
            {expandedNodes.documents ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedNodes.documents && (
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              {graphData.documents.map((d) => (
                <div key={d.id} className="py-2 flex items-center justify-between">
                  <span className="text-slate-800 dark:text-slate-200">{d.title}</span>
                  <span className="text-slate-400 text-[11px] font-mono">{d.size}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationshipGraph;
