import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  GitBranch,
  Calendar,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Zap,
  Shield,
  Wrench,
  ChevronDown,
} from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const ReleasesPage = () => {
  const [filterTag, setFilterTag] = useState('All');

  const releases = [
    {
      version: 'v2.4.0',
      date: 'March 2, 2026',
      badge: 'LATEST',
      title: 'Multi-Tenant AI Copilot & Interactive 3D Visualizer',
      description: 'Major release introducing autonomous lead qualification rules, interactive 3D WebGL pipeline sculptures, and bi-directional email syncing.',
      changes: [
        { type: 'FEATURE', text: 'AI Copilot Drawer with streaming responses and lead summarization.' },
        { type: 'FEATURE', text: 'Three.js WebGL visualizations across all product and marketing surfaces.' },
        { type: 'IMPROVEMENT', text: '50% faster Kanban drag-and-drop state reconciliation.' },
        { type: 'SECURITY', text: 'Enhanced JWT refresh token rotation with hardware device fingerprinting.' },
      ],
      commit: '48f902b',
      author: 'nexus-core-team',
    },
    {
      version: 'v2.3.0',
      date: 'February 14, 2026',
      title: 'PostgreSQL Schema Multi-Tenancy & Offline SQLite Sync',
      description: 'Architectural overhaul implementing strict TenantContext isolation across all Spring Boot endpoints and offline queueing for native desktop clients.',
      changes: [
        { type: 'FEATURE', text: 'Full offline SQLite synchronization engine with automatic conflict resolution.' },
        { type: 'FEATURE', text: 'TenantContext Hibernate filter ensuring zero cross-tenant database leakage.' },
        { type: 'IMPROVEMENT', text: 'Sub-30ms database read latency on large customer datasets (100k+ records).' },
        { type: 'FIX', text: 'Resolved race condition during simultaneous deal stage updates.' },
      ],
      commit: '92a1c0d',
      author: 'alex-vance',
    },
    {
      version: 'v2.2.0',
      date: 'January 20, 2026',
      title: 'Custom Objects Engine & Dynamic Form Builder',
      description: 'Enables administrators to define custom CRM entities, polymorphic relationships, and dynamic field validators without redeploying code.',
      changes: [
        { type: 'FEATURE', text: 'Dynamic Custom Object schema engine with typed relations.' },
        { type: 'FEATURE', text: 'Drag-and-drop custom field builder for Leads, Deals, and Customer accounts.' },
        { type: 'IMPROVEMENT', text: 'Export CRM views to formatted CSV and encrypted JSON backups.' },
        { type: 'SECURITY', text: 'Fine-grained attribute-level permission controls for custom properties.' },
      ],
      commit: '77b311e',
      author: 'sarah-jenkins',
    },
    {
      version: 'v2.1.0',
      date: 'December 18, 2025',
      title: 'Visual Kanban Deal Pipelines & Webhook Dispatcher',
      description: 'Introduces customizable pipeline stages, win/loss probability multipliers, and high-frequency HMAC-signed outgoing webhooks.',
      changes: [
        { type: 'FEATURE', text: 'Kanban pipeline board with custom column stages and aggregate sums.' },
        { type: 'FEATURE', text: 'Outbound webhook dispatcher supporting HMAC-SHA256 verification.' },
        { type: 'IMPROVEMENT', text: 'Redesigned Activity Timeline with rich markdown notes and attachments.' },
        { type: 'FIX', text: 'Fixed currency formatting inconsistencies across international locales.' },
      ],
      commit: '55c994f',
      author: 'm-babiy',
    },
    {
      version: 'v2.0.0',
      date: 'November 15, 2025',
      title: 'The Next-Gen Open Source CRM Foundation',
      description: 'The monumental release reimagining Nexus from the ground up: Spring Boot 3.2, React 18, Tailwind CSS, and native Tauri desktop packaging.',
      changes: [
        { type: 'FEATURE', text: 'Ground-up rewrite with Spring Boot 3.2 and React 18 frontend.' },
        { type: 'FEATURE', text: 'Native Tauri desktop builds for macOS, Windows, and Linux.' },
        { type: 'FEATURE', text: 'Customer 360 unified view and immutable chronological audit log.' },
        { type: 'SECURITY', text: 'RBAC system with ADMIN, MANAGER, and AGENT role presets.' },
      ],
      commit: '10e882a',
      author: 'nexus-core-team',
    },
  ];

  const tagBadgeStyles = {
    FEATURE: 'bg-blue-50 text-blue-700 border-blue-200/60',
    IMPROVEMENT: 'bg-purple-50 text-purple-700 border-purple-200/60',
    FIX: 'bg-amber-50 text-amber-700 border-amber-200/60',
    SECURITY: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  };

  const filteredReleases = releases.filter((rel) => {
    if (filterTag === 'All') return true;
    return rel.changes.some((c) => c.type === filterTag);
  });

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <Tag className="w-3.5 h-3.5" />
          <span>Continuous Changelog</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          Release Notes &amp; Changelog
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Discover new features, performance optimizations, and security updates deployed across Nexus cloud and desktop releases.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {['All', 'FEATURE', 'IMPROVEMENT', 'FIX', 'SECURITY'].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium uppercase transition-all cursor-pointer ${
                filterTag === tag
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-black'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Timeline Changelog Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-neutral-200">
          {filteredReleases.map((rel, index) => (
            <div key={rel.version} className="relative pl-10 sm:pl-14">
              {/* Timeline Dot */}
              <div className="absolute left-2 sm:left-4 top-4 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-xs -translate-x-1/2 z-10" />

              {/* Release Card */}
              <Card3D maxTilt={10} ambientFloat={true} floatDelay={index * 150} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs hover:border-neutral-300 transition-all">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-mono font-bold text-neutral-900" style={{ transform: 'translateZ(20px)' }}>
                      {rel.version}
                    </span>
                    {rel.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider" style={{ transform: 'translateZ(20px)' }}>
                        {rel.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rel.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span className="text-neutral-700 font-semibold">{rel.commit}</span>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">
                  {rel.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  {rel.description}
                </p>

                {/* Changes List */}
                <div className="space-y-2.5 bg-neutral-50/70 p-4 rounded-xl border border-neutral-100">
                  {rel.changes
                    .filter((c) => filterTag === 'All' || c.type === filterTag)
                    .map((change, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-700">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border shrink-0 mt-0.5 ${tagBadgeStyles[change.type]}`}
                        >
                          {change.type}
                        </span>
                        <span className="leading-relaxed">{change.text}</span>
                      </div>
                    ))}
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Released by {rel.author}</span>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-sans font-semibold"
                  >
                    View on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card3D>
            </div>
          ))}
        </div>
      </section>

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default ReleasesPage;
