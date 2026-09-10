import React from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  Monitor,
  Apple,
  Terminal,
  BarChart3,
  Workflow,
  Lock,
  WifiOff,
  Layers,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HomePage = () => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>NexusCRM Desktop Platform 1.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span className="font-semibold text-slate-500">Offline-First Native App</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Everything your sales team needs to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
              close more deals faster.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The multi-tenant CRM engineered for speed, privacy, and offline productivity. Track leads, automate pipelines, manage accounts, and forecast revenue with native desktop performance.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold shadow-lg shadow-indigo-600/25">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/download">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold">
                <Download className="w-4 h-4 mr-2 text-indigo-600" />
                Download Desktop App
              </Button>
            </Link>
          </div>

          {/* Platform badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4 text-indigo-500" /> Windows 10/11</span>
            <span className="flex items-center gap-1.5"><Apple className="w-4 h-4 text-indigo-500" /> macOS (Apple & Intel)</span>
            <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4 text-indigo-500" /> Linux (AppImage & Deb)</span>
          </div>

          {/* Live Desktop Frame Showcase */}
          <div className="mt-12 lg:mt-16 max-w-6xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 shadow-2xl overflow-hidden p-2">
            {/* Desktop window topbar */}
            <div className="h-9 bg-slate-950 rounded-t-xl px-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-2 text-[11px] font-medium text-slate-400">NexusCRM Desktop v1.0.0 — Acme Enterprise Solutions</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                OFFLINE SYNC READY
              </div>
            </div>

            {/* Application Mock Body */}
            <div className="bg-slate-900 text-left p-4 sm:p-6 grid grid-cols-12 gap-4 rounded-b-xl min-h-[420px]">
              {/* Mini Sidebar */}
              <div className="col-span-3 hidden sm:block bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <div className="w-6 h-6 rounded bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">N</div>
                  <span className="text-xs font-bold text-white">NexusCRM</span>
                </div>
                <div className="space-y-1 text-[11px] font-medium text-slate-400">
                  <div className="px-2 py-1.5 rounded bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-between">
                    <span>Dashboard</span>
                  </div>
                  <div className="px-2 py-1.5 hover:bg-slate-900 rounded">Leads (28)</div>
                  <div className="px-2 py-1.5 hover:bg-slate-900 rounded">Contacts</div>
                  <div className="px-2 py-1.5 hover:bg-slate-900 rounded">Deals Kanban</div>
                  <div className="px-2 py-1.5 hover:bg-slate-900 rounded">Workflows</div>
                  <div className="px-2 py-1.5 hover:bg-slate-900 rounded">Reports & BI</div>
                </div>
              </div>

              {/* Main Content Preview */}
              <div className="col-span-12 sm:col-span-9 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Revenue</span>
                    <p className="text-lg font-black text-white">$385,000</p>
                    <span className="text-[10px] text-emerald-400 font-bold">+14.8% YoY</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Pipeline Deals</span>
                    <p className="text-lg font-black text-white">$517,000</p>
                    <span className="text-[10px] text-indigo-400 font-bold">15 Open Deals</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Conversion Rate</span>
                    <p className="text-lg font-black text-white">24.5%</p>
                    <span className="text-[10px] text-emerald-400 font-bold">+2.1% Target</span>
                  </div>
                </div>

                {/* Pipeline visual */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="text-xs font-bold text-white">Active Sales Pipeline</span>
                    <span className="text-[10px] text-slate-400 font-mono">Stage Velocity: High</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
                      <div className="text-indigo-400 font-bold">QUALIFIED</div>
                      <div className="text-white font-semibold mt-1">Apex Global</div>
                      <div className="text-[10px] text-slate-400">$185,000</div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
                      <div className="text-amber-400 font-bold">DEMO</div>
                      <div className="text-white font-semibold mt-1">BioGenix Labs</div>
                      <div className="text-[10px] text-slate-400">$240,000</div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
                      <div className="text-purple-400 font-bold">PROPOSAL</div>
                      <div className="text-white font-semibold mt-1">CloudScale</div>
                      <div className="text-[10px] text-slate-400">$92,000</div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
                      <div className="text-emerald-400 font-bold">CLOSED WON</div>
                      <div className="text-white font-semibold mt-1">FinNet Systems</div>
                      <div className="text-[10px] text-slate-400">$128,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built for performance, privacy, and team efficiency.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Why high-growth sales teams choose NexusCRM Desktop over traditional browser dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Offline-First SQLite Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Keep closing deals even without an internet connection. Changes sync automatically to PostgreSQL when back online.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Tauri 2 Native Speed</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Lightweight Rust binary execution with instant startup, zero memory overhead, and native OS notifications.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise Multi-Tenancy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict organization-level data isolation, role-based security policies, and complete audit logging.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Lead Intelligence</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Turn cold leads into qualified opportunities.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Automate lead scoring, track activity timelines, assign account owners, and nurture high-score prospects before your competition does.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated Lead Scoring (0–100)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Chronological Event Activity Stream</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> One-Click Slide-Over Drawer Creation</li>
            </ul>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold">Recent High-Score Leads</span>
              <span className="text-[10px] text-indigo-400 font-bold">Auto-Scored</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl flex items-center justify-between border border-slate-800">
              <div>
                <h4 className="text-xs font-bold">Sophia Martine</h4>
                <p className="text-[10px] text-slate-400">Nexus Biotech • VP Operations</p>
              </div>
              <span className="px-2 py-1 text-xs font-black bg-indigo-950 text-indigo-400 rounded border border-indigo-800">Score 88</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl flex items-center justify-between border border-slate-800">
              <div>
                <h4 className="text-xs font-bold">Liam O'Connor</h4>
                <p className="text-[10px] text-slate-400">FinNet Solutions • CTO</p>
              </div>
              <span className="px-2 py-1 text-xs font-black bg-indigo-950 text-indigo-400 rounded border border-indigo-800">Score 92</span>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold">Visual Workflow Engine</span>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">ACTIVE</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl space-y-2 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Workflow className="w-4 h-4" /> Trigger: Lead Score &gt; 80
              </div>
              <div className="pl-6 border-l-2 border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>Condition: Industry equals 'SaaS Enterprise'</p>
                <p className="text-emerald-400 font-semibold">Action: Auto-assign to Senior Account Exec</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Workflow Automation</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Automate repetitive tasks with visual rules.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Create Trigger $\rightarrow$ Condition $\rightarrow$ Action rules to eliminate manual data entry, send follow-up notifications, and route deals seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Download Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-800/50 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black">Ready to experience native CRM desktop speed?</h2>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Download NexusCRM for Windows, macOS, or Linux. Completely free for up to 5 team members.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/download">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold border-none shadow-md">
                <Download className="w-4 h-4 mr-2" /> Download Desktop App
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
