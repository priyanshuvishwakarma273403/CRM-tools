import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Cpu,
  Layers,
  Webhook,
  Database,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Blocks,
  Key,
} from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const DevelopersPage = () => {
  const [activeTab, setActiveTab] = useState('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatedEvent, setSimulatedEvent] = useState('deal.won');

  const codeSnippets = {
    curl: `curl -X POST https://api.nexus-crm.internal/api/v1/deals \\
  -H "Authorization: Bearer nx_live_9f82b3a18e" \\
  -H "Content-Type: application/json" \\
  -H "X-Tenant-ID: org_enterprise_88" \\
  -d '{
    "title": "Global AI Infrastructure Expansion",
    "value": 185000,
    "stage": "NEGOTIATION",
    "probability": 85,
    "companyId": "comp_9941a8",
    "customFields": {
      "deployment_type": "KUBERNETES_SELF_HOSTED",
      "sla_tier": "TIER_1_PLATINUM"
    }
  }'`,
    typescript: `import { NexusClient } from '@nexus/sdk';

const nexus = new NexusClient({
  apiKey: process.env.NEXUS_API_KEY,
  tenantId: 'org_enterprise_88',
});

// Create a new high-value deal with custom object associations
const deal = await nexus.deals.create({
  title: 'Global AI Infrastructure Expansion',
  value: 185_000,
  stage: 'NEGOTIATION',
  probability: 85,
  companyId: 'comp_9941a8',
  customFields: {
    deployment_type: 'KUBERNETES_SELF_HOSTED',
    sla_tier: 'TIER_1_PLATINUM',
  },
});

console.log(\`Created Deal #\${deal.id} in pipeline: \${deal.stage}\`);`,
    python: `from nexus_sdk import NexusClient

client = NexusClient(
    api_key="nx_live_9f82b3a18e",
    tenant_id="org_enterprise_88"
)

# Automated deal creation and CRM lead progression
deal = client.deals.create(
    title="Global AI Infrastructure Expansion",
    value=185000,
    stage="NEGOTIATION",
    probability=85,
    company_id="comp_9941a8",
    custom_fields={
        "deployment_type": "KUBERNETES_SELF_HOSTED",
        "sla_tier": "TIER_1_PLATINUM"
    }
)

print(f"Deal synced: {deal.id} with status {deal.stage}")`,
    go: `package main

import (
    "context"
    "fmt"
    "github.com/nexus-crm/sdk-go/nexus"
)

func main() {
    client := nexus.NewClient("nx_live_9f82b3a18e", nexus.WithTenant("org_enterprise_88"))

    deal, err := client.Deals.Create(context.Background(), &nexus.DealParams{
        Title:       "Global AI Infrastructure Expansion",
        Value:       185000.00,
        Stage:       "NEGOTIATION",
        Probability: 85,
        CompanyID:   "comp_9941a8",
    })
    if err != nil {
        panic(err)
    }
    fmt.Printf("Deal created: %s\\n", deal.ID)
}`,
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const webhookPayloads = {
    'deal.won': {
      event: 'deal.won',
      timestamp: '2026-03-05T14:32:00Z',
      tenantId: 'org_enterprise_88',
      data: {
        dealId: 'deal_7719a',
        title: 'Global AI Infrastructure Expansion',
        amount: 185000,
        currency: 'USD',
        owner: 'alex.vance@company.com',
        customer: {
          id: 'cust_901',
          name: 'Nine Dots Ventures',
          tier: 'ENTERPRISE',
        },
      },
    },
    'lead.created': {
      event: 'lead.created',
      timestamp: '2026-03-05T14:30:12Z',
      tenantId: 'org_enterprise_88',
      data: {
        leadId: 'lead_2209b',
        name: 'Sarah Jenkins',
        company: 'Flycoder Advisory',
        source: 'AI_COPILOT_TRIAGE',
        score: 94,
      },
    },
    'customer.stage_changed': {
      event: 'customer.stage_changed',
      timestamp: '2026-03-05T14:28:44Z',
      tenantId: 'org_enterprise_88',
      data: {
        customerId: 'cust_443',
        previousStage: 'ONBOARDING',
        currentStage: 'ACTIVE_RETAINER',
        arrImpact: 42000,
      },
    },
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <Code2 className="w-3.5 h-3.5" />
          <span>Developer Platform &amp; Extensibility</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-4xl mx-auto mb-5">
          Built for developers.<br />Extensible by design.
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Open-source foundation, headless Spring Boot architecture, dynamic custom objects, and sub-millisecond webhooks. Shape your CRM without limitations.
        </p>

        {/* Quick install terminal */}
        <div className="mt-8 max-w-lg mx-auto p-2.5 rounded-xl bg-neutral-950 text-white font-mono text-xs flex items-center justify-between shadow-lg border border-neutral-800">
          <div className="flex items-center gap-2 pl-2">
            <span className="text-indigo-400 select-none">$</span>
            <span className="text-neutral-200">npm install @nexus/sdk</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText('npm install @nexus/sdk');
              alert('Copied to clipboard!');
            }}
            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] font-sans text-neutral-300 transition-colors"
          >
            Copy
          </button>
        </div>
      </section>

      {/* 2. Interactive Code Showcase Tabs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Card3D maxTilt={6} scale={1.01} className="rounded-2xl border border-neutral-800 bg-[#0c0d14] shadow-2xl overflow-hidden text-neutral-300">
          {/* Top Bar with Language Tabs */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 bg-neutral-950">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>

              {['curl', 'typescript', 'python', 'go'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 transition-colors cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Code Window */}
          <div className="p-6 overflow-x-auto text-xs font-mono leading-relaxed bg-[#0c0d14]">
            <pre className="text-neutral-200">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>
        </Card3D>
      </section>

      {/* 3. 6 Core Developer Architectural Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
            ARCHITECTURE &amp; EXTENSIBILITY
          </div>
          <h2 className="text-3xl font-serif font-normal text-neutral-900 tracking-tight">
            Engineered for developers who demand control
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: 'Headless REST & GraphQL', desc: 'Every UI action maps 1-to-1 to high-performance Spring Boot 3.2 APIs. Query exactly what your client needs with typed filters and sorting.', color: 'text-blue-600 bg-blue-50' },
            { icon: Blocks, title: 'Custom Objects Engine', desc: 'Define arbitrary data entities at runtime. Add relations, formula fields, and validation rules without database schema migrations.', color: 'text-emerald-600 bg-emerald-50' },
            { icon: Webhook, title: 'Realtime Event Webhooks', desc: 'Sub-millisecond webhooks delivered with HMAC signatures, exponential backoff retries, and an in-app payload replay inspection log.', color: 'text-purple-600 bg-purple-50' },
            { icon: Database, title: 'Offline SQLite Sync Engine', desc: 'Desktop client leverages sandboxed local SQLite. Queued transactions sync seamlessly with idempotent resolution upon reconnection.', color: 'text-amber-600 bg-amber-50' },
            { icon: ShieldCheck, title: 'Multi-Tenant Isolation', desc: 'Strict TenantContext filters intercept every database statement, eliminating cross-tenant data leakage risks.', color: 'text-rose-600 bg-rose-50' },
            { icon: Key, title: 'Granular Scoped API Keys', desc: 'Generate read-only, webhook-only, or object-restricted API tokens with automatic expiration and audit log attribution.', color: 'text-indigo-600 bg-indigo-50' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <Card3D
                key={i}
                ambientFloat={true}
                floatDelay={i * 150}
                maxTilt={12}
                className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3 hover:border-neutral-300 transition-all h-full"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`} style={{ transform: 'translateZ(18px)' }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">{card.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{card.desc}</p>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Webhook Event Explorer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
              EVENT SIMULATOR
            </div>
            <h2 className="text-3xl font-serif font-normal text-neutral-900 tracking-tight">
              Test real-time event payloads
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Nexus fires webhook events on every state change. Select an event trigger to inspect the exact JSON payload sent to your servers.
            </p>

            <div className="space-y-2 pt-2">
              {['deal.won', 'lead.created', 'customer.stage_changed'].map((ev) => (
                <button
                  key={ev}
                  onClick={() => setSimulatedEvent(ev)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    simulatedEvent === ev
                      ? 'bg-neutral-900 text-white font-bold shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span>{ev}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card3D maxTilt={8} scale={1.01} className="p-6 rounded-2xl bg-neutral-950 text-neutral-300 font-mono text-xs border border-neutral-800 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <span className="text-neutral-500">Payload: {simulatedEvent}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px]">
                  200 OK
                </span>
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-indigo-300">
                <code>{JSON.stringify(webhookPayloads[simulatedEvent], null, 2)}</code>
              </pre>
            </Card3D>
          </div>
        </div>
      </section>

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default DevelopersPage;
