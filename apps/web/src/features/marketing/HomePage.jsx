import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
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
  Cpu,
  Database,
  Globe,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Search,
  Bot,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Code2,
  Check,
  Building2,
  Briefcase,
  Sliders,
  LifeBuoy,
  Smartphone,
  ArrowUpRight,
  Filter,
  ArrowUp,
  Plus,
  Folder,
  CheckSquare,
  X,
  Box,
  Grid,
  Layout,
  Command,
  Mail,
  Download,
  Trash2,
  MousePointer,
  Play,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ArchitectureDiagram } from '../../components/crm/ArchitectureDiagram';
import { StickyStepsSection } from './StickyStepsSection';
import { ProductionShowcaseSection } from './ProductionShowcaseSection';
import { CustomerQuotesSection } from './CustomerQuotesSection';
import { ThreeHeroWave } from './ThreeHeroWave';
import { ThreeMonolith } from './ThreeMonolith';
import { ThreeDiamond, ThreeLightning, ThreeLock } from './ThreeTradeoffArtifacts';
import { DarkPreFooterSection } from './DarkPreFooterSection';

// ============================================================================
// DITHER & SCANLINE VECTOR ILLUSTRATIONS (Nexus Editorial Aesthetic)
// ============================================================================

/** Electric Blue Horizontal Waveform Scanlines flanking the Hero section */
const ScanlineWaveform = ({ side = 'left' }) => {
  const isLeft = side === 'left';
  return (
    <svg
      className={`absolute top-28 ${isLeft ? '-left-8 sm:left-0' : '-right-8 sm:right-0'} w-48 sm:w-72 lg:w-88 h-[440px] pointer-events-none z-0 opacity-85 select-none`}
      viewBox="0 0 280 440"
      fill="none"
    >
      {Array.from({ length: 52 }).map((_, i) => {
        const y = 8 + i * 8.2;
        const rad = (i / 52) * Math.PI * 1.8;
        const baseWidth = Math.sin(rad) > 0 ? Math.sin(rad) * 210 + 35 : 25;
        const len = Math.min(270, Math.max(15, baseWidth));
        const x1 = isLeft ? 0 : 280 - len;
        const x2 = isLeft ? len : 280;
        return (
          <line
            key={i}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeDasharray={i % 4 === 0 ? '14 3 6 3' : i % 2 === 0 ? '8 3' : '18 4 4 2'}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

/** High-contrast dark scanline skyscraper / tower for "The Problem" section */
const DitherSkyscraper = () => (
  <svg className="w-full h-80 sm:h-96 select-none" viewBox="0 0 340 380" fill="none">
    {Array.from({ length: 65 }).map((_, i) => {
      const y = 8 + i * 5.6;
      const leftBoundary = 15;
      const rightBoundary = 325;
      const towerLeft = 145 - Math.min(65, i * 1.0);
      const towerRight = 245 + Math.min(55, i * 0.8);
      return (
        <g key={i}>
          <line
            x1={leftBoundary}
            y1={y}
            x2={towerLeft}
            y2={y}
            stroke="#171717"
            strokeWidth="2"
            strokeDasharray={i % 4 === 0 ? '4 3 12 3' : '7 4'}
            opacity={0.8}
          />
          <line
            x1={towerLeft}
            y1={y}
            x2={towerRight}
            y2={y}
            stroke="#000000"
            strokeWidth="3.2"
            strokeDasharray={i > 20 ? (i % 5 === 0 ? '16 4 22 4 16' : '100') : '45 10 35'}
          />
          <line
            x1={towerRight}
            y1={y}
            x2={rightBoundary}
            y2={y}
            stroke="#171717"
            strokeWidth="2"
            strokeDasharray={i % 3 === 0 ? '6 3 10 3' : '5 4'}
            opacity={0.7}
          />
        </g>
      );
    })}
  </svg>
);

/** Blue dither diamond for "Production grade quality" */
const DitherDiamond = () => (
  <svg className="w-48 h-36 mx-auto select-none" viewBox="0 0 200 150" fill="none">
    {Array.from({ length: 26 }).map((_, i) => {
      const y = 14 + i * 4.8;
      const progress = i < 9 ? i / 9 : 1 - (i - 9) / 17;
      const halfWidth = Math.max(10, progress * 82);
      return (
        <line
          key={i}
          x1={100 - halfWidth}
          y1={y}
          x2={100 + halfWidth}
          y2={y}
          stroke="#2563eb"
          strokeWidth="2.4"
          strokeDasharray={i % 3 === 0 ? '5 2 9 3' : i % 2 === 0 ? '7 2' : '11 2 4 2'}
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

/** Blue dither lightning bolt for "AI for rapid iterations" */
const DitherLightning = () => (
  <svg className="w-48 h-36 mx-auto select-none" viewBox="0 0 200 150" fill="none">
    {Array.from({ length: 28 }).map((_, i) => {
      const y = 10 + i * 4.6;
      let centerX;
      let width;
      if (i < 13) {
        centerX = 118 - i * 1.6;
        width = 16 + i * 2.2;
      } else if (i === 13) {
        centerX = 108;
        width = 46;
      } else {
        centerX = 90 + (i - 13) * 0.7;
        width = Math.max(6, 38 - (i - 13) * 2.1);
      }
      return (
        <line
          key={i}
          x1={centerX - width / 2}
          y1={y}
          x2={centerX + width / 2}
          y2={y}
          stroke="#2563eb"
          strokeWidth="2.4"
          strokeDasharray={i % 3 === 0 ? '4 2 8 2' : i % 2 === 0 ? '6 2' : '9 2'}
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

/** Blue dither padlock (unlocked) for "Control without drag" */
const DitherLock = () => (
  <svg className="w-48 h-36 mx-auto select-none" viewBox="0 0 200 150" fill="none">
    {Array.from({ length: 11 }).map((_, i) => {
      const y = 12 + i * 4.2;
      return (
        <g key={`shackle-${i}`}>
          <line x1={78} y1={y} x2={90} y2={y} stroke="#2563eb" strokeWidth="2.4" strokeDasharray="4 2" />
          {i > 2 && <line x1={110} y1={y} x2={122} y2={y} stroke="#2563eb" strokeWidth="2.4" strokeDasharray="5 2" />}
        </g>
      );
    })}
    {Array.from({ length: 16 }).map((_, i) => {
      const y = 60 + i * 4.4;
      const corner = i < 2 ? (2 - i) * 6 : i > 13 ? (i - 13) * 7 : 0;
      return (
        <line
          key={`body-${i}`}
          x1={70 + corner}
          y1={y}
          x2={130 - corner}
          y2={y}
          stroke="#2563eb"
          strokeWidth="2.4"
          strokeDasharray={i === 6 || i === 7 ? '18 8 18' : i % 2 === 0 ? '7 2' : '11 2 4 2'}
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

/** Magenta / Rose scanline sphere / globe for the "In production" W3villa card (Screenshot 5) */
const DitherGlobeSphere = () => (
  <svg className="w-52 h-44 mx-auto select-none" viewBox="0 0 200 170" fill="none">
    {Array.from({ length: 32 }).map((_, i) => {
      const y = 10 + i * 4.8;
      const rad = (i / 32) * Math.PI;
      const radius = Math.sin(rad) * 60;
      const cx = 100;
      return (
        <g key={i}>
          <line
            x1={cx - radius}
            y1={y}
            x2={cx + radius}
            y2={y}
            stroke="#f43f5e"
            strokeWidth="2.4"
            strokeDasharray={i % 3 === 0 ? '8 3 14 3' : i % 2 === 0 ? '4 2 10 2' : '16 4'}
            strokeLinecap="round"
          />
          {i >= 12 && i <= 16 && (
            <line
              x1={cx + radius + 4}
              y1={y - 8}
              x2={cx + radius + 24}
              y2={y - 12}
              stroke="#fb7185"
              strokeWidth="2.8"
              strokeDasharray="6 2"
            />
          )}
        </g>
      );
    })}
  </svg>
);

/** Background architectural scanlines for building blocks and developer cards */
const ArchitecturalScanlineBg = () => (
  <svg className="w-full h-full select-none pointer-events-none opacity-40" viewBox="0 0 500 400" fill="none">
    {Array.from({ length: 48 }).map((_, i) => {
      const y = 8 + i * 8.2;
      return (
        <line
          key={i}
          x1={20}
          y1={y}
          x2={480}
          y2={y}
          stroke="#171717"
          strokeWidth="1.6"
          strokeDasharray={i % 4 === 0 ? '18 6 30 6' : i % 2 === 0 ? '8 4' : '12 4 4 4'}
        />
      );
    })}
  </svg>
);

export const HomePage = () => {
  const [demoTab, setDemoTab] = useState('pipeline');
  const [selectedCompany, setSelectedCompany] = useState('Anthropic');

  const companiesList = [
    { name: 'Anthropic', url: 'anthropic.com', createdBy: 'Dario Amodei', address: '18 Rue De Nav...', owner: 'Dario Amodei', icp: true },
    { name: 'Linkedin', url: 'linkedin.com', createdBy: 'Reid Hoffman', address: '1226 Moises C...', owner: 'Ryan Roslansky', icp: false },
    { name: 'Slack', url: 'slack.com', createdBy: 'Stewart Butterfield', address: '1316 Dameon ...', owner: 'Stewart Butterfield', icp: true },
    { name: 'Notion', url: 'notion.com', createdBy: 'Ivan Zhao', address: '1162 Sammy C...', owner: 'Ivan Zhao', icp: false },
    { name: 'Figma', url: 'figma.com', createdBy: 'Dylan Field', address: '110 Oswald Ju...', owner: 'Dylan Field', icp: true },
    { name: 'Github', url: 'github.com', createdBy: 'Chris Wanstrath', address: '3891 Ranchvie...', owner: 'Thomas Dohmke', icp: true },
    { name: 'Airbnb', url: 'airbnb.com', createdBy: 'Joe Gebbia', address: '4517 Washingt...', owner: 'Brian Chesky', icp: true },
    { name: 'Stripe', url: 'stripe.com', createdBy: 'Patrick Collison', address: '2118 Thornridg...', owner: 'Patrick Collison', icp: true },
    { name: 'Sequoia', url: 'sequoia.com', createdBy: 'Roelof Botha', address: '1316 Dameon ...', owner: 'Roelof Botha', icp: true },
    { name: 'Google', url: 'google.com', createdBy: 'Sundar Pichai', address: '4140 Parker Rd.', owner: 'Sundar Pichai', icp: true },
  ];

  return (
    <div className="bg-white text-neutral-900 overflow-x-clip selection:bg-neutral-900 selection:text-white">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION */}
      {/* ===================================================================== */}
      <section className="relative pt-24 sm:pt-32 lg:pt-36 text-center">
        <ThreeHeroWave side="left" />
        <ThreeHeroWave side="right" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-5xl sm:text-7xl lg:text-[82px] font-serif font-normal text-neutral-900 tracking-tight leading-[1.04] max-w-4xl mx-auto">
            Build your Enterprise<br />CRM at AI Speed
          </h1>

          <p className="mt-6 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed font-sans">
            Nexus gives technical teams the building blocks for a custom CRM that meets complex business needs and quickly adapts as the business evolves.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/login"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
              }}
              className="px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-sm inline-flex items-center justify-center"
            >
              Get Started
            </Link>

            <a
              href="#problem"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
              }}
              className="px-6 py-3 border border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-bold tracking-wider uppercase transition-colors shadow-xs inline-flex items-center justify-center"
            >
              Talk To Us
            </a>
          </div>

          {/* Floating macOS Mockup Window */}
          <div className="mt-14 sm:mt-18 relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden text-left relative">
              <div className="h-9 bg-neutral-100/90 border-b border-neutral-200/80 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="text-xs font-medium text-neutral-500 font-sans">Nexus CRM OS</span>
                <div className="w-12"></div>
              </div>

              <div className="h-11 border-b border-neutral-200 px-4 flex items-center justify-between bg-white text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-100 font-medium text-neutral-800 cursor-pointer">
                    <Apple className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Apple</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-neutral-400">
                    <Search className="w-3.5 h-3.5 cursor-pointer hover:text-neutral-700" />
                    <Sliders className="w-3.5 h-3.5 cursor-pointer hover:text-neutral-700" />
                  </div>

                  <button className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[11px] font-medium">
                    <MessageSquare className="w-3 h-3" />
                    <span>New chat</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-neutral-800 font-semibold pl-1">
                    <Folder className="w-3.5 h-3.5 text-blue-600" />
                    <span>Companies</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 rounded bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    <span>New</span>
                  </button>
                  <span className="text-[10px] font-mono text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5 hidden sm:inline">
                    ⌘K
                  </span>
                </div>
              </div>

              <div className="flex min-h-[460px]">
                <div className="w-48 sm:w-52 border-r border-neutral-200 bg-neutral-50/60 p-3 space-y-4 text-xs font-medium text-neutral-600 hidden md:block shrink-0">
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-2">
                      Favorites
                    </div>
                    <div className="px-2 py-1 rounded text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 truncate cursor-pointer">
                      <span className="text-amber-500 font-bold">$</span>
                      <span className="truncate">Sales Dashboard</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-1">
                      Workspace
                    </div>
                    <div className="px-2 py-1.5 rounded-md bg-neutral-200/70 text-neutral-900 font-semibold flex items-center gap-2 cursor-pointer">
                      <Folder className="w-3.5 h-3.5 text-blue-600" />
                      <span>Companies</span>
                    </div>
                    <div className="px-2 py-1.5 rounded text-neutral-600 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer">
                      <Users className="w-3.5 h-3.5" />
                      <span>People</span>
                    </div>
                    <div className="px-2 py-1.5 rounded text-neutral-600 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Opportunities</span>
                    </div>
                    <div className="px-2 py-1.5 rounded text-neutral-600 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Tasks</span>
                    </div>
                    <div className="px-2 py-1.5 rounded text-neutral-600 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Notes</span>
                    </div>
                    <div className="px-2 py-1.5 rounded text-neutral-600 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Dashboards</span>
                    </div>
                    <div className="px-2 py-1.5 rounded text-neutral-600 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer">
                      <Workflow className="w-3.5 h-3.5 text-amber-600" />
                      <span>Workflows</span>
                    </div>
                  </div>

                  <div className="pt-8 px-2">
                    <Link
                      to="/login"
                      className="text-neutral-500 hover:text-neutral-900 flex items-center justify-between text-[11px]"
                    >
                      <span>Sign In Workspace</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-x-auto">
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 text-xs">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 font-semibold text-neutral-900">
                        <span>☰ All Companies</span>
                        <span className="text-neutral-400 font-normal">9</span>
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
                      <span className="cursor-pointer hover:text-neutral-900">Filter</span>
                      <span className="cursor-pointer hover:text-neutral-900">Sort</span>
                      <span className="cursor-pointer hover:text-neutral-900">Options</span>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs font-sans mt-1">
                    <thead>
                      <tr className="text-neutral-400 border-b border-neutral-100 text-[11px]">
                        <th className="py-2 px-3 font-normal">Companies +</th>
                        <th className="py-2 px-3 font-normal">🔗 Url</th>
                        <th className="py-2 px-3 font-normal">👤 Created By</th>
                        <th className="py-2 px-3 font-normal">📍 Address</th>
                        <th className="py-2 px-3 font-normal">👤 Account Owner</th>
                        <th className="py-2 px-3 font-normal">🎯 ICP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-[11px]">
                      {companiesList.map((row) => (
                        <tr
                          key={row.name}
                          onClick={() => setSelectedCompany(row.name)}
                          className={`cursor-pointer transition-colors ${
                            selectedCompany === row.name ? 'bg-neutral-50 font-medium' : 'hover:bg-neutral-50/60'
                          }`}
                        >
                          <td className="py-2 px-3 text-neutral-900 flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedCompany === row.name}
                              onChange={() => {}}
                              className="rounded-xs border-neutral-300 w-3 h-3 text-neutral-900 focus:ring-0"
                            />
                            <span>{row.name}</span>
                          </td>
                          <td className="py-2 px-3 text-neutral-500 font-mono text-[10px]">{row.url}</td>
                          <td className="py-2 px-3 text-neutral-700">{row.createdBy}</td>
                          <td className="py-2 px-3 text-neutral-500">{row.address}</td>
                          <td className="py-2 px-3 text-neutral-700">{row.owner}</td>
                          <td className="py-2 px-3">
                            {row.icp ? (
                              <span className="text-neutral-900 font-semibold">✓ True</span>
                            ) : (
                              <span className="text-neutral-400">✕ False</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pt-3 text-[11px] text-neutral-400 cursor-pointer hover:text-neutral-700 flex items-center gap-1">
                    <span>Calculate</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Floating AI Card */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-[320px] sm:w-[390px] bg-white rounded-xl border border-neutral-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.12)] p-3 z-30 text-left animate-slide-up">
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                  </div>

                  <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-md text-[10px] font-semibold">
                    <button className="px-2 py-0.5 rounded text-neutral-600 hover:text-neutral-900">
                      Editor
                    </button>
                    <button className="px-2 py-0.5 rounded bg-white text-neutral-900 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      <span>AI Chat</span>
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 p-3 rounded-lg bg-neutral-50/80 border border-neutral-100 space-y-3">
                  <p className="text-xs text-neutral-800 leading-relaxed font-normal">
                    Scaffold a launch-ops CRM in my workspace with rockets, launches, payloads, customers, and launch sites, with relevant actions for each.
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 truncate">
                      <span className="px-1.5 py-0.5 bg-neutral-200/60 rounded truncate">~/code/my-nexus...</span>
                      <span className="px-1 py-0.5 bg-neutral-200/60 rounded">⊞ ma...</span>
                      <span className="text-neutral-400">Mythos</span>
                    </div>

                    <Link
                      to="/login"
                      className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 shrink-0"
                      aria-label="Send Prompt"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. "TRUSTED BY" CROSSHAIR CONTAINER */}
      {/* ===================================================================== */}
      <section className="relative my-20 sm:my-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative border-y border-neutral-200 py-6 px-4 sm:px-8 bg-white">
          <span className="absolute -top-2.5 -left-1 text-blue-600 font-mono text-xs font-bold select-none">+</span>
          <span className="absolute -top-2.5 -right-1 text-blue-600 font-mono text-xs font-bold select-none">+</span>
          <span className="absolute -bottom-2.5 -left-1 text-blue-600 font-mono text-xs font-bold select-none">+</span>
          <span className="absolute -bottom-2.5 -right-1 text-blue-600 font-mono text-xs font-bold select-none">+</span>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center">
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase pr-6 border-r border-neutral-200 shrink-0">
                TRUSTED BY
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-8 sm:gap-12 text-neutral-700 font-bold text-sm tracking-tight opacity-80">
              <span className="tracking-tighter text-base">BAYER</span>
              <span className="font-serif tracking-widest text-base">pwc</span>
              <span className="font-serif tracking-normal text-base uppercase">FORA</span>
              <span className="tracking-tight text-base font-sans">wazoku</span>
              <span className="tracking-tight text-sm font-sans font-medium">CivicActions</span>
              <span className="tracking-widest text-xs font-mono">OTIIMA</span>
              <span className="border border-neutral-400 px-1.5 py-0.5 text-[10px] font-mono">NIC</span>
              <span className="text-xs">幸せホーム</span>
            </div>

            <div className="text-xs font-mono text-neutral-500 pl-4 border-l border-neutral-200 hidden lg:block shrink-0">
              👥 +10K OTHERS
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. "■ The Problem." SECTION */}
      {/* ===================================================================== */}
      <section id="problem" className="max-w-6xl mx-auto px-4 sm:px-6 my-20 sm:my-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200/80 overflow-hidden">
            <ThreeMonolith />
          </div>

          <div className="lg:col-span-6 text-left space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
              <span>The Problem.</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-neutral-900 tracking-tight leading-[1.15]">
              A custom CRM gives your org an edge, but building one comes with tradeoffs
            </h2>

            <div className="pt-4 space-y-6">
              <div>
                <h3 className="font-bold text-base text-neutral-900">The Giant Monolith</h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                  Proprietary languages, slow deployment cycles, and &ldquo;black box&rdquo; logic.
                </p>
              </div>

              <div className="border-b border-dashed border-neutral-200"></div>

              <div>
                <h3 className="font-bold text-base text-neutral-900">The In-house Burden</h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                  It&rsquo;s fragile. V1 ships quickly, but maintaining and making changes is a long term burden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. "■ Stop settling for trade-offs." SECTION */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-20 sm:my-32 text-left">
        <div className="space-y-3 mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span>Stop settling for trade-offs.</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-neutral-900 tracking-tight leading-[1.12] max-w-3xl">
            Assemble, iterate and adapt a robust CRM, that&rsquo;s quick to flex
          </h2>

          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed font-sans">
            Compose your CRM and internal apps with a single extensibility toolkit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative pt-3 group">
            <div className="inline-flex items-center px-4 py-1.5 rounded-t-lg border-t border-l border-r border-neutral-200 bg-white text-xs font-bold text-neutral-900 relative -mb-[1px] z-10 shadow-xs">
              Production grade quality
            </div>
            <div className="rounded-b-xl rounded-tr-xl border border-neutral-200 bg-white p-6 flex flex-col justify-between min-h-[380px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] group-hover:border-neutral-300 transition-colors">
              <div className="my-auto py-4">
                <ThreeDiamond />
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed pt-4 border-t border-neutral-100">
                W3villa used Nexus as a production-grade framework for the data model, permissions, authentication, and workflow engine they would otherwise have rebuilt themselves.
              </p>
            </div>
          </div>

          <div className="relative pt-3 group">
            <div className="inline-flex items-center px-4 py-1.5 rounded-t-lg border-t border-l border-r border-neutral-200 bg-white text-xs font-bold text-neutral-900 relative -mb-[1px] z-10 shadow-xs">
              AI for rapid iterations
            </div>
            <div className="rounded-b-xl rounded-tr-xl border border-neutral-200 bg-white p-6 flex flex-col justify-between min-h-[380px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] group-hover:border-neutral-300 transition-colors">
              <div className="my-auto py-4">
                <ThreeLightning />
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed pt-4 border-t border-neutral-100">
                Alternative Partners used agentic AI to compress what would typically be weeks of Salesforce migration work into something a single person could oversee.
              </p>
            </div>
          </div>

          <div className="relative pt-3 group">
            <div className="inline-flex items-center px-4 py-1.5 rounded-t-lg border-t border-l border-r border-neutral-200 bg-white text-xs font-bold text-neutral-900 relative -mb-[1px] z-10 shadow-xs">
              Control without drag
            </div>
            <div className="rounded-b-xl rounded-tr-xl border border-neutral-200 bg-white p-6 flex flex-col justify-between min-h-[380px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] group-hover:border-neutral-300 transition-colors">
              <div className="my-auto py-4">
                <ThreeLock />
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed pt-4 border-t border-neutral-100">
                AC&amp;T moved to a self-hosted Nexus instance with no vendor risk, no forced migration, and CRM costs reduced by more than 90%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. STICKY PINNED SCROLL: STEPS 01, 02, 03 (Scroll-jacked up/down motion) */}
      {/* ===================================================================== */}
      <StickyStepsSection />

      {/* ===================================================================== */}
      {/* 8. "■ Skip the clunky UX that always comes with custom." (Screenshot 4) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-24 sm:my-36 text-left border-t border-neutral-100 pt-16">
        <div className="space-y-3 mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span>Skip the clunky UX that always comes with custom.</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-neutral-900 tracking-tight leading-[1.1]">
            Make your GTM team happy with a CRM they&rsquo;ll love
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel 1: Kanban Opportunity Board */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="text-xs font-bold text-neutral-800 pb-3 border-b border-neutral-200">
                All opportunities (9)
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-rose-600 uppercase">Identified 3</span>
                  <div className="p-2.5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-1">
                    <strong className="text-xs text-neutral-900 block">Github</strong>
                    <span className="text-[10px] font-mono text-neutral-600">$6,562.04</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-1">
                    <strong className="text-xs text-neutral-900 block">Figma</strong>
                    <span className="text-[10px] font-mono text-neutral-600">$8,562.04</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Qualified 1</span>
                  <div className="p-2.5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-1 relative">
                    <strong className="text-xs text-neutral-900 block">Notion</strong>
                    <span className="text-[10px] font-mono text-neutral-600">$2,650</span>
                    <MousePointer className="w-3.5 h-3.5 text-blue-600 absolute -bottom-1 -right-1 fill-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-900 border-t border-neutral-200 mt-4">
              <span className="text-blue-600">✦</span>
              <span>Familiar, modern interface</span>
            </div>
          </div>

          {/* Panel 2: Live Multiplayer Realtime Table */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-medium pb-3 border-b border-neutral-200 overflow-x-auto">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">Type is Customer</span>
                <span className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">Employees &gt; 500</span>
              </div>

              <div className="pt-3 space-y-2 relative text-xs">
                <div className="p-2 bg-white rounded-lg border border-neutral-200 flex items-center justify-between relative">
                  <span>Anthropic</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">Customer</span>
                  <span className="absolute -top-3 right-8 bg-amber-400 text-neutral-900 px-1.5 py-0.2 rounded text-[9px] font-bold shadow-xs">
                    ALICE ▼
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-neutral-200 flex items-center justify-between relative">
                  <span>Slack</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">Customer</span>
                  <span className="absolute -left-2 top-2 bg-orange-500 text-white px-1.5 py-0.2 rounded text-[9px] font-bold shadow-xs">
                    TOM ▶
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-neutral-200 flex items-center justify-between relative">
                  <span>Notion</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">Customer</span>
                  <span className="absolute -bottom-2 right-12 bg-purple-500 text-white px-1.5 py-0.2 rounded text-[9px] font-bold shadow-xs">
                    BOB ▲
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-900 border-t border-neutral-200 mt-4">
              <span className="text-blue-600">✦</span>
              <span>Live data and AI built</span>
            </div>
          </div>

          {/* Panel 3: Command Palette Fast Actions */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="p-2 bg-white rounded-lg border border-neutral-200 text-xs text-neutral-400 mb-3 flex items-center gap-2">
                <Search className="w-3 h-3" />
                <span>Type anything...</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="p-2 rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Send email</span>
                </div>
                <div className="p-2 rounded-md bg-neutral-200/70 font-semibold flex items-center justify-between text-neutral-900">
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Export selection as CSV</span>
                  </div>
                  <MousePointer className="w-3.5 h-3.5 text-neutral-900 fill-neutral-900" />
                </div>
                <div className="p-2 rounded-md hover:bg-neutral-100 flex items-center gap-2 text-neutral-700">
                  <Trash2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Delete 8 records</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-900 border-t border-neutral-200 mt-4">
              <span className="text-blue-600">✦</span>
              <span>Fast path to action</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. "■ In production." PINNED SHOWCASE (W3villa, AC&T, NetZero) */}
      {/* ===================================================================== */}
      <ProductionShowcaseSection />

      {/* ===================================================================== */}
      {/* 10. "■ They are the real sales" (1/3, 2/3, 3/3 Dither Helix Quotes) */}
      {/* ===================================================================== */}
      <CustomerQuotesSection />

      {/* ===================================================================== */}
      {/* 10. INTERACTIVE ARCHITECTURE */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-20 sm:my-32 text-left">
        <div className="border-t border-neutral-200 pt-16">
          <div className="mb-10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
              <span>Core Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 tracking-tight">
              One Centralized Backend. Universal Clients.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Desktop, Web, and Mobile communicate through a single authoritative Java Spring Boot core with multi-tenant database isolation, Model Context Protocol, and real-time event streaming.
            </p>
          </div>

          <ArchitectureDiagram />
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 11. COMPARISON TABLE */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-20 sm:my-32 text-left">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span>Market Benchmark</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 tracking-tight">
            How Nexus Compares
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Capability</th>
                <th className="py-3 px-4 text-neutral-900 font-black">Nexus</th>
                <th className="py-3 px-4">Traditional CRMs</th>
                <th className="py-3 px-4">In-House Builds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900">Centralized Source of Truth</td>
                <td className="py-3 px-4 text-blue-600 font-bold">✓ Single Database</td>
                <td className="py-3 px-4 text-neutral-400">Varies</td>
                <td className="py-3 px-4 text-neutral-400">Fragile sync logic</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900">Model Context Protocol (MCP)</td>
                <td className="py-3 px-4 text-blue-600 font-bold">✓ Native Gateway</td>
                <td className="py-3 px-4 text-neutral-400">✗ None</td>
                <td className="py-3 px-4 text-neutral-400">Custom Glue Code</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900">Contextual Explainability</td>
                <td className="py-3 px-4 text-blue-600 font-bold">✓ Factor Breakdown</td>
                <td className="py-3 px-4 text-neutral-400">Black-box number</td>
                <td className="py-3 px-4 text-neutral-400">None</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900">Offline-First Desktop App</td>
                <td className="py-3 px-4 text-blue-600 font-bold">✓ Native Tauri/Rust</td>
                <td className="py-3 px-4 text-neutral-400">Web only / Slow</td>
                <td className="py-3 px-4 text-neutral-400">Requires connection</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900">Developer APIs &amp; Webhooks</td>
                <td className="py-3 px-4 text-blue-600 font-bold">✓ Scoped API Keys</td>
                <td className="py-3 px-4 text-neutral-400">Enterprise Addon</td>
                <td className="py-3 px-4 text-neutral-400">Ad-hoc REST endpoints</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 12. PREDICTABLE PRICING PLANS */}
      {/* ===================================================================== */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 my-20 sm:my-32 text-left">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
            <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
            <span>Predictable Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 tracking-tight">
            Simple, transparent plans for modern teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-neutral-200 bg-white space-y-4">
            <div>
              <h3 className="font-bold text-base text-neutral-900">Community Edition</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Self-hosted local development &amp; small teams.</p>
            </div>
            <div className="text-3xl font-black text-neutral-900 font-mono">$0</div>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> Up to 3 active users</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> Core Customer 360 &amp; Pipeline</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> PostgreSQL / H2 persistence</li>
            </ul>
            <Link to="/login">
              <button className="w-full py-2.5 rounded-md border border-neutral-900 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
                Start Free
              </button>
            </Link>
          </div>

          <div className="p-6 rounded-xl border-2 border-neutral-900 bg-white space-y-4 relative">
            <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-neutral-900 text-white font-bold text-[10px] tracking-wider uppercase">
              POPULAR
            </span>
            <div>
              <h3 className="font-bold text-base text-neutral-900">Growth OS</h3>
              <p className="text-xs text-neutral-500 mt-0.5">For scaling startups and revenue teams.</p>
            </div>
            <div className="text-3xl font-black text-neutral-900 font-mono">
              $49 <span className="text-xs font-normal text-neutral-400">/ user / mo</span>
            </div>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> Unlimited customers &amp; deals</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> All 5 AI Domain Agents</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> MCP Gateway &amp; Visual Workflows</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> PostgreSQL 16 dual persistence</li>
            </ul>
            <Link to="/login">
              <button className="w-full py-2.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors">
                Start Free Trial
              </button>
            </Link>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 bg-white space-y-4">
            <div>
              <h3 className="font-bold text-base text-neutral-900">Enterprise OS</h3>
              <p className="text-xs text-neutral-500 mt-0.5">For enterprise security, SSO, and custom SLA.</p>
            </div>
            <div className="text-3xl font-black text-neutral-900 font-mono">
              $149 <span className="text-xs font-normal text-neutral-400">/ user / mo</span>
            </div>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> Everything in Growth OS</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> SAML/OIDC SSO &amp; Passkeys</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> Dedicated Kafka &amp; Redis clusters</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-900" /> 99.99% Uptime SLA &amp; 24/7 Support</li>
            </ul>
            <Link to="/login">
              <button className="w-full py-2.5 rounded-md border border-neutral-900 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
                Talk to Sales
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 13. PRE-FOOTER FAQs & 3D TORUS VORTEX KNOT (hilta rahe ekdam acche se) */}
      {/* ===================================================================== */}
      <DarkPreFooterSection />
    </div>
  );
};

export default HomePage;
