import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Terminal, Code, Cpu, Search, Sparkles, ChevronRight, Copy, Check } from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';

export const DocsPage = () => {
  const [copied, setCopied] = useState(false);

  const copySnippet = () => {
    navigator.clipboard.writeText('curl -X GET "https://api.nexus-crm.internal/api/v1/leads" -H "Authorization: Bearer <TOKEN>"');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 sm:pt-32 pb-16 bg-white min-h-screen text-neutral-900">
      {/* Editorial Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-wider text-neutral-500 mb-4">
          <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
          <span className="text-neutral-700 font-sans uppercase font-bold text-xs tracking-wider">
            Documentation &amp; Guides
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] mb-6">
          Everything you need to build &amp; scale.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Comprehensive developer guides, REST API references, and workflow automation tutorials.
        </p>

        {/* Global Search Bar */}
        <div className="mt-8 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search docs, APIs, or keyboard shortcuts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-neutral-400"
          />
        </div>
      </section>

      {/* 3 Main Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">User Guide</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Step-by-step walkthroughs for pipeline management, custom views, bulk editing, and team workspaces.
              </p>
            </div>
            <Link
              to="/docs"
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Browse Guide <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Code className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">Developer API</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Spring Boot REST endpoints for `/api/v1/leads`, `/api/v1/deals`, webhooks, and headless connectors.
              </p>
            </div>
            <Link
              to="/developers"
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Explore API Reference <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">Desktop &amp; Rust IPC</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tauri 2 IPC command architecture, background SQLite synchronization, and native OS notifications.
              </p>
            </div>
            <Link
              to="/download"
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Desktop Specs <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Code Snippet Example Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-2xl border border-neutral-800 bg-[#0d0e15] p-6 text-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              <span className="font-mono text-neutral-400 ml-2 text-[11px]">curl — REST API Endpoint</span>
            </div>
            <button
              onClick={copySnippet}
              className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed py-2">
            <code>
              <span className="text-blue-400">curl</span> -X GET <span className="text-emerald-400">"https://api.nexus-crm.internal/api/v1/leads"</span> \<br />
              &nbsp;&nbsp;-H <span className="text-amber-400">"Authorization: Bearer &lt;TOKEN&gt;"</span> \<br />
              &nbsp;&nbsp;-H <span className="text-amber-400">"Content-Type: application/json"</span>
            </code>
          </pre>
        </div>
      </section>

      {/* Docked Dark Pre-Footer */}
      <div className="mt-32">
        <DarkPreFooterSection />
      </div>
    </div>
  );
};

export default DocsPage;

