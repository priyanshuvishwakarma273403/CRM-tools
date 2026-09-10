import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Server,
  Database,
  Cpu,
  Shield,
  Workflow,
  Sparkles,
  Layers,
  Zap,
  Info,
  ArrowDown,
} from 'lucide-react';

/**
 * Interactive System Architecture Diagram
 * Implements Section 42 of the UI Master Prompt
 */
export const ArchitectureDiagram = () => {
  const [selectedNode, setSelectedNode] = useState('core');

  const nodes = {
    clients: {
      title: 'Universal Multi-Platform Clients',
      tagline: 'Web (React) • Desktop (Tauri/Rust) • Mobile (Expo iOS/Android)',
      what: 'Zero-business-logic, ultra-responsive native and browser interfaces.',
      why: 'Ensures users can operate CRM OS seamlessly from any device without divergent client databases or sync conflicts.',
      connectsTo: 'API Gateway & Reverse Proxy (/api/v1)',
      icon: Monitor,
    },
    gateway: {
      title: 'Spring Cloud & Security Filter Gateway',
      tagline: 'JWT Authentication • TenantContext • Rate Limiting • CORS',
      what: 'The single ingress point inspecting every inbound HTTP and WebSocket connection.',
      why: 'Enforces Zero-Trust tenant isolation before any business logic or query execution.',
      connectsTo: 'CRM OS Core Services',
      icon: Server,
    },
    core: {
      title: 'Authoritative CRM OS Core (Spring Boot 3.2)',
      tagline: 'Customer 360 • Leads • Deals • Pipeline • Tasks • Invoices',
      what: 'High-throughput modular Java backend managing transactional state and business validation.',
      why: 'Single source of truth prevents duplicate CRM logic across multiple platforms.',
      connectsTo: 'Unified Identity, MCP Server, AI Satellite, and PostgreSQL',
      icon: Layers,
    },
    subsystems: {
      title: 'Integrated Subsystem Engines',
      tagline: 'Passkeys FIDO2 • MCP Gateway • Event Bus • Workflow Engine',
      what: 'Pluggable operating system primitives executing automations and external tool calls.',
      why: 'Transforms a traditional CRUD database into a complete, proactive Business Operating System.',
      connectsTo: 'PostgreSQL 16, Redis Cache, and Kafka STOMP bus',
      icon: Cpu,
    },
    ai: {
      title: 'Autonomous Multi-Agent AI Mesh',
      tagline: 'FastAPI • Model Router • DLP Firewall • 5 Domain Agents',
      what: 'Decoupled Python satellite service performing predictive scoring, NLP intent detection, and Ask My CRM.',
      why: 'Keeps GPU and LLM workloads isolated from core transactional database threads.',
      connectsTo: 'CRM OS Core via safe REST & In-JVM fallback resilience',
      icon: Sparkles,
    },
    data: {
      title: 'Centralized Data Platform',
      tagline: 'PostgreSQL 16 (Flyway V1-V5) • Redis 7 • CloudEvents Bus',
      what: 'Dual-engine persistence layer with portable ANSI SQL migrations and token blacklists.',
      why: 'Ensures immutable audit logging, sub-millisecond cache hits, and zero split-brain state.',
      connectsTo: 'All backend services exclusively',
      icon: Database,
    },
  };

  const active = nodes[selectedNode];
  const ActiveIcon = active.icon;

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Interactive CRM OS System Architecture
          </h3>
          <p className="text-xs text-slate-500">
            Click any architectural tier to inspect its purpose, guarantees, and boundaries.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
          ONE SOURCE OF TRUTH
        </span>
      </div>

      {/* Visual Topology Diagram */}
      <div className="space-y-3 max-w-2xl mx-auto">
        {/* Tier 1: Clients */}
        <div
          onClick={() => setSelectedNode('clients')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            selectedNode === 'clients'
              ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/60 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">1. Client Applications</h4>
              <p className="text-[11px] text-slate-500">Web App (React) • Desktop App (Tauri) • Mobile App (Expo)</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">Zero Local Business DB</span>
        </div>

        <div className="flex justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 2: Gateway */}
        <div
          onClick={() => setSelectedNode('gateway')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            selectedNode === 'gateway'
              ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/60 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">2. Ingress & Security Gateway</h4>
              <p className="text-[11px] text-slate-500">Reverse Proxy • Rate Limiter • JWT Authenticator • TenantContext</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">/api/v1</span>
        </div>

        <div className="flex justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 3: Core & Subsystems Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setSelectedNode('core')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedNode === 'core'
                ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/60 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">3a. Centralized Core</h4>
            </div>
            <p className="text-[11px] text-slate-500">Customer 360, Pipeline, Deals, Invoices, Tasks</p>
          </div>

          <div
            onClick={() => setSelectedNode('ai')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedNode === 'ai'
                ? 'border-ai-500 bg-ai-50/70 dark:bg-ai-950/60 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-ai-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">3b. AI Agent Mesh</h4>
            </div>
            <p className="text-[11px] text-slate-500">Model Router, DLP Firewall, 5 Specialized Agents</p>
          </div>
        </div>

        <div className="flex justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 4: Data Platform */}
        <div
          onClick={() => setSelectedNode('data')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            selectedNode === 'data'
              ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/60 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">4. Centralized Data Platform</h4>
              <p className="text-[11px] text-slate-500">PostgreSQL 16 (Flyway V1-V5) • Redis 7 Session Store • Kafka/STOMP Bus</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Single DB</span>
        </div>
      </div>

      {/* Node Details Callout Box */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <ActiveIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <strong className="text-slate-900 dark:text-slate-100 font-bold">{active.title}</strong>
          <span className="text-slate-400">• {active.tagline}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">What it does</span>
            <p className="text-slate-600 dark:text-slate-300">{active.what}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Why it exists</span>
            <p className="text-slate-600 dark:text-slate-300">{active.why}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Connects To</span>
            <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">{active.connectsTo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
