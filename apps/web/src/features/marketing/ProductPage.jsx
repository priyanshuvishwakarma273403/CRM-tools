import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Apple,
  Search,
  Sliders,
  Folder,
  Plus,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Mail,
  FileText,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Layers,
  Database,
  Users,
  Check,
  Building,
  UploadCloud,
  File,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { ThreeProductHeroWing } from './ThreeProductHeroWings';
import {
  ThreeSpeedSphere,
  ThreeSpeedEye,
  ThreeSpeedCross,
} from './ThreeProductSpeedArtifacts';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { ProductNoCodeStickySection } from './ProductNoCodeStickySection';

export const ProductPage = () => {
  const [activeTabTasks, setActiveTabTasks] = useState('Tasks');
  const [activeTabEmails, setActiveTabEmails] = useState('Emails');
  const [activeTabFiles, setActiveTabFiles] = useState('Files');

  // People Table Data (Screenshot 1)
  const peopleData = [
    { name: 'Dario Amodei', company: 'Anthropic', email: 'dario@anthropic.com', phone: '+1 415 555 0101', title: 'CEO', city: 'San Francisco' },
    { name: 'Ryan Roslansky', company: 'LinkedIn', email: 'ryan@linkedin.com', phone: '+1 650 555 0134', title: 'CEO', city: 'Sunnyvale' },
    { name: 'Stewart Butterfield', company: 'Slack', email: 'stewart@slack.com', phone: '+1 415 555 0142', title: 'Co-founder', city: 'San Francisco' },
    { name: 'Ivan Zhao', company: 'Notion', email: 'ivan@notion.com', phone: '+1 628 555 0186', title: 'CEO', city: 'San Francisco' },
    { name: 'Dylan Field', company: 'Figma', email: 'dylan@figma.com', phone: '+1 415 555 0128', title: 'CEO', city: 'San Francisco' },
  ];

  return (
    <div className="bg-white text-neutral-900 overflow-x-clip selection:bg-neutral-900 selection:text-white">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION (Screenshot 1) */}
      {/* ===================================================================== */}
      <section className="relative pt-24 sm:pt-32 lg:pt-36 text-center">
        {/* Flanking 3D Scanline Architectural Wings */}
        <ThreeProductHeroWing side="left" />
        <ThreeProductHeroWing side="right" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-serif font-normal text-neutral-900 tracking-tight leading-[1.06] max-w-4xl mx-auto">
            A CRM for teams<br />that move fast
          </h1>

          <p className="mt-6 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed font-sans">
            Track relationships, manage pipelines, and take action quickly with an intuitive CRM that helps your team move faster from day one with confidence.
          </p>

          {/* Chamfered CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
              }}
              className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Get Started
            </Link>
            <a
              href="#talk"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
              }}
              className="px-6 py-3 border border-neutral-900 hover:bg-neutral-50 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Talk To Us
            </a>
          </div>

          {/* Collaborative Multiplayer Cursors (Screenshot 1) */}
          <div className="relative mt-12 sm:mt-16 max-w-5xl mx-auto">
            {/* Alice Cursor (Orange) */}
            <div className="absolute -top-6 left-6 sm:left-12 z-30 flex items-center gap-1.5 animate-bounce-slow pointer-events-none">
              <svg className="w-4 h-4 fill-amber-500 -rotate-45" viewBox="0 0 24 24">
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500 text-white shadow-xs">
                Alice
              </span>
            </div>

            {/* Cara Cursor (Mint Green) */}
            <div className="absolute top-8 -right-2 sm:right-6 z-30 flex items-center gap-1.5 pointer-events-none">
              <svg className="w-4 h-4 fill-emerald-500 -rotate-45" viewBox="0 0 24 24">
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500 text-white shadow-xs">
                Cara
              </span>
            </div>

            {/* Ben Cursor (Electric Blue) */}
            <div className="absolute -bottom-4 left-1/4 z-30 flex items-center gap-1.5 pointer-events-none">
              <svg className="w-4 h-4 fill-blue-600 -rotate-45" viewBox="0 0 24 24">
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-600 text-white shadow-xs">
                Ben
              </span>
            </div>

            {/* macOS CRM Product Window */}
            <div className="rounded-xl border border-neutral-200/90 bg-white shadow-2xl overflow-hidden text-left relative z-20">
              {/* Window Titlebar */}
              <div className="h-10 bg-neutral-100/90 border-b border-neutral-200 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30" />
                  <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30" />
                </div>
                <div className="text-xs font-semibold text-neutral-600 font-sans">
                  Nexus
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500 font-medium px-2 py-0.5 rounded border border-neutral-200 bg-white">
                    + New
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 border border-neutral-200 bg-white rounded px-1.5 py-0.5">
                    ⌘K
                  </span>
                </div>
              </div>

              {/* Sub-bar / View Selector */}
              <div className="h-11 border-b border-neutral-200 px-4 flex items-center justify-between bg-white text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-100 font-medium text-neutral-800 cursor-pointer">
                    <Apple className="w-3.5 h-3.5 text-neutral-700" />
                    <span>People</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>All People</span>
                    <span className="text-neutral-400 font-normal">5</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-neutral-500 text-xs font-medium">
                  <button className="hover:text-neutral-900 transition-colors">Filter</button>
                  <button className="hover:text-neutral-900 transition-colors">Sort</button>
                  <button className="hover:text-neutral-900 transition-colors">Options</button>
                </div>
              </div>

              {/* People Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-medium">
                    <tr>
                      <th className="py-2.5 px-4 w-10 text-center">
                        <input type="checkbox" className="rounded border-neutral-300" readOnly />
                      </th>
                      <th className="py-2.5 px-4 font-semibold text-neutral-700">Name</th>
                      <th className="py-2.5 px-4 font-semibold text-neutral-700">+ Company</th>
                      <th className="py-2.5 px-4 font-semibold text-neutral-700">Email</th>
                      <th className="py-2.5 px-4 font-semibold text-neutral-700">Phone</th>
                      <th className="py-2.5 px-4 font-semibold text-neutral-700">Job Title</th>
                      <th className="py-2.5 px-4 font-semibold text-neutral-700">City</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-800">
                    {peopleData.map((person, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3 px-4 text-center">
                          <input type="checkbox" className="rounded border-neutral-300" readOnly />
                        </td>
                        <td className="py-3 px-4 font-semibold flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                            {person.name[0]}
                          </div>
                          <span>{person.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px] font-medium">
                            <Building className="w-3 h-3 text-neutral-500" />
                            {person.company}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                          {person.email}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                          {person.phone}
                        </td>
                        <td className="py-3 px-4 font-medium text-neutral-700">
                          {person.title}
                        </td>
                        <td className="py-3 px-4 text-neutral-600">
                          {person.city}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="py-2 px-4 border-t border-neutral-200 bg-neutral-50/60 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="cursor-pointer hover:text-neutral-800">Calculate ⌄</span>
                <span>5 records</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. CORE FEATURES HEADER (Screenshot 2) */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 sm:mt-40 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-wider text-neutral-500 mb-4">
          <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
          <span className="text-neutral-700 font-sans uppercase font-bold text-xs tracking-wider">
            Core Features
          </span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-2xl mx-auto">
          Everything you<br />need, out of the box
        </h2>
      </section>

      {/* ===================================================================== */}
      {/* 3. FEATURE 01 / 07: REPORTS & DASHBOARDS (media_1788610422500.png) */}
      {/* ===================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
          {/* Card Titlebar */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-5 text-xs">
            <div className="flex items-center gap-2 font-medium text-neutral-600">
              <LayoutGrid className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-500">Dashboards</span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-900 font-semibold">Sales performance</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MoreVertical className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-neutral-700" />
              <span className="font-mono text-[10px] text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5 tracking-tight">
                ⌘K
              </span>
            </div>
          </div>

          {/* Top KPI Metrics (Divided 3 columns matching screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 py-1 mb-6">
            <div className="pb-3 sm:pb-0 sm:pr-6">
              <div className="text-xs text-neutral-500 font-normal">Revenue (YTD)</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 mt-1 flex items-baseline gap-2">
                $1.2M
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <span className="text-[10px]">↗</span> 12%
                </span>
              </div>
            </div>

            <div className="py-3 sm:py-0 sm:px-6">
              <div className="text-xs text-neutral-500 font-normal">Avg deal size</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 mt-1 flex items-baseline gap-2">
                $9.4K
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <span className="text-[10px]">↗</span> 5%
                </span>
              </div>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6">
              <div className="text-xs text-neutral-500 font-normal">Win rate</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 mt-1 flex items-baseline gap-2">
                34%
                <span className="text-xs font-semibold text-rose-500 flex items-center gap-0.5">
                  <span className="text-[10px]">↘</span> 3%
                </span>
              </div>
            </div>
          </div>

          {/* Charts Split: Deals by Month (Candle Bars) + Deals by Stage (Donut) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-t border-neutral-100 pt-6">
            {/* Deals by month Bar/Candle Chart */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="text-xs font-bold text-neutral-800 mb-4">
                Deals by month
              </div>

              {/* Chart Grid with Y-Axis and Horizontal Gridlines */}
              <div className="flex items-stretch gap-2.5 h-48 select-none">
                {/* Y-Axis Labels */}
                <div className="w-5 flex flex-col justify-between items-end text-[11px] font-mono text-neutral-400 py-1">
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>

                {/* Chart Area with Grid Lines & 7 Candle Bars */}
                <div className="flex-1 relative flex flex-col justify-between pt-2 pb-6 border-b border-neutral-200">
                  {/* Horizontal Guide Lines */}
                  <div className="absolute inset-x-0 top-[6%] border-b border-dashed border-neutral-100 pointer-events-none" />
                  <div className="absolute inset-x-0 top-[29%] border-b border-dashed border-neutral-100 pointer-events-none" />
                  <div className="absolute inset-x-0 top-[52%] border-b border-dashed border-neutral-100 pointer-events-none" />
                  <div className="absolute inset-x-0 top-[75%] border-b border-dashed border-neutral-100 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-6 border-b border-neutral-200 pointer-events-none" />

                  {/* 7 Vertical Candle Columns */}
                  <div className="absolute inset-x-0 top-0 bottom-6 flex items-end justify-between px-2 sm:px-4">
                    {[
                      { month: 'Jan', count: 12, heightPct: 30 },
                      { month: 'Feb', count: 16, heightPct: 40 },
                      { month: 'Mar', count: 14, heightPct: 35 },
                      { month: 'Apr', count: 22, heightPct: 55 },
                      { month: 'May', count: 27, heightPct: 67.5 },
                      { month: 'Jun', count: 24, heightPct: 60 },
                      { month: 'Jul', count: 31, heightPct: 77.5 },
                    ].map((bar, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center justify-end h-full group"
                      >
                        {/* Always visible count label above bar */}
                        <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 mb-1.5 transition-colors group-hover:text-neutral-900 group-hover:font-semibold">
                          {bar.count}
                        </span>

                        {/* Candle Bar */}
                        <div
                          style={{ height: `${bar.heightPct}%` }}
                          className="w-6 sm:w-8 bg-[#8598f8] hover:bg-[#6c82fa] rounded-t-xs transition-all duration-200 shadow-2xs group-hover:scale-y-[1.02] origin-bottom cursor-pointer"
                        />

                        {/* Month Label positioned below axis */}
                        <span className="absolute -bottom-5 text-[11px] font-normal text-neutral-500">
                          {bar.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deals by stage Donut Chart */}
            <div className="lg:col-span-5 flex flex-col justify-between pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-neutral-100 pt-6 lg:pt-0">
              <div className="text-xs font-bold text-neutral-800 mb-2">
                Deals by stage
              </div>

              {/* Donut Graphic */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-1">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Segment: Inactive base track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="#f8fafc"
                    strokeWidth="11"
                    fill="none"
                  />
                  {/* Segment 1: Coral New */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="#fb7185"
                    strokeWidth="11"
                    strokeDasharray="64 226"
                    strokeDashoffset="0"
                    fill="none"
                    className="transition-all duration-500 hover:opacity-90"
                  />
                  {/* Segment 2: Purple Screening */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="#c084fc"
                    strokeWidth="11"
                    strokeDasharray="72 226"
                    strokeDashoffset="-66"
                    fill="none"
                    className="transition-all duration-500 hover:opacity-90"
                  />
                  {/* Segment 3: Cyan Meeting */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="#38bdf8"
                    strokeWidth="11"
                    strokeDasharray="50 226"
                    strokeDashoffset="-140"
                    fill="none"
                    className="transition-all duration-500 hover:opacity-90"
                  />
                  {/* Segment 4: Amber Other */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="#facc15"
                    strokeWidth="11"
                    strokeDasharray="34 226"
                    strokeDashoffset="-192"
                    fill="none"
                    className="transition-all duration-500 hover:opacity-90"
                  />
                </svg>
                {/* Center KPI */}
                <div className="absolute text-center flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 tracking-tight leading-none">
                    140
                  </div>
                  <div className="text-[11px] text-neutral-400 font-normal mt-1">
                    Total
                  </div>
                </div>
              </div>

              {/* Legend Row matching media_1788610422500.png */}
              <div className="flex items-center justify-between text-xs text-neutral-600 mt-3 pt-3 border-t border-neutral-100">
                <span className="font-mono text-neutral-400 text-[11px] cursor-pointer hover:text-neutral-800 select-none">
                  &lt; 1/2 &gt;
                </span>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[#fb7185]" />
                    <span className="text-neutral-700">New</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[#c084fc]" />
                    <span className="text-neutral-700">Screening</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[#38bdf8]" />
                    <span className="text-neutral-700">Meeting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 01 Tag, Serif Title & Description */}
        <div className="mt-8 text-left max-w-3xl">
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-2 font-mono uppercase tracking-widest text-neutral-900 text-[11px] font-bold">
              <span className="w-2 h-2 bg-blue-600 inline-block rounded-[1px]" />
              <span>REPORTS &amp; DASHBOARDS</span>
            </div>
            <span className="font-mono text-neutral-400 text-xs tracking-wider">
              01 / 07
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-900 tracking-tight mb-3">
            Metrics you can actually trust.
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
            Build custom dashboards from live CRM data. Aggregate anything — deals, accounts, activity — into charts your team actually reads.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. FEATURES 02 / 07 & 03 / 07: TASKS + EMAIL & CALENDAR (Screenshot 3) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature 02: Tasks & Activities */}
          <div className="flex flex-col justify-between">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              {/* Tab Bar */}
              <div className="flex items-center gap-4 border-b border-neutral-100 pb-3 text-xs font-medium text-neutral-500 mb-6 overflow-x-auto">
                {['Timeline', 'Tasks', 'Notes', 'Files', 'Emails', 'Calendar'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabTasks(tab)}
                    className={`pb-1 transition-colors ${activeTabTasks === tab ? 'text-black font-bold border-b-2 border-black' : 'hover:text-black'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TODO List */}
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between font-bold text-neutral-800">
                  <span>TODO <span className="text-neutral-400 font-normal">3</span></span>
                  <button className="text-neutral-500 hover:text-black font-normal">+ Add task</button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-900">Send NDA</div>
                        <div className="text-[11px] text-neutral-500">Loop in legal before sending.</div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-neutral-400 shrink-0">
                      <div>Jul 22, 2026</div>
                      <div className="text-neutral-600 font-medium">Félix Malfait</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-900">Follow up on pricing</div>
                        <div className="text-[11px] text-neutral-500">Send the updated annual quote.</div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-neutral-400 shrink-0">
                      <div>Jul 24, 2026</div>
                      <div className="text-neutral-600 font-medium">Félix Malfait</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-900">Prepare onboarding deck</div>
                        <div className="text-[11px] text-neutral-500">Use the Q3 template.</div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-neutral-400 shrink-0">
                      <div>Jul 26, 2026</div>
                      <div className="text-neutral-600 font-medium">Félix Malfait</div>
                    </div>
                  </div>
                </div>

                {/* DONE */}
                <div className="pt-2">
                  <div className="font-bold text-neutral-800 mb-2">DONE <span className="text-neutral-400 font-normal">1</span></div>
                  <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/30 flex items-start justify-between gap-3 opacity-60">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-900 line-through">Schedule security review</div>
                        <div className="text-[11px] text-neutral-500">Coordinated with the IT team.</div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-neutral-400 shrink-0">
                      <div>Jul 18, 2026</div>
                      <div className="text-neutral-600 font-medium">Félix Malfait</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 02 Description */}
            <div className="mt-6 text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                <span className="w-2 h-2 bg-blue-600 inline-block" />
                <span>Tasks &amp; Activities</span>
                <span className="text-neutral-400 font-mono ml-2">02 / 07</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-4">
                Context lives with the record.
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Create tasks from records
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Assign owners and due dates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Rich notes attached to records
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 03: Email & Calendar */}
          <div className="flex flex-col justify-between">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              {/* Tab Bar */}
              <div className="flex items-center gap-4 border-b border-neutral-100 pb-3 text-xs font-medium text-neutral-500 mb-6 overflow-x-auto">
                {['Timeline', 'Tasks', 'Notes', 'Files', 'Emails', 'Calendar'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabEmails(tab)}
                    className={`pb-1 transition-colors ${activeTabEmails === tab ? 'text-black font-bold border-b-2 border-black' : 'hover:text-black'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Inbox List */}
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between font-bold text-neutral-800">
                  <span>Inbox <span className="text-neutral-400 font-normal">4</span></span>
                  <button className="text-neutral-500 hover:text-black font-normal">+ Compose</button>
                </div>

                <div className="space-y-3">
                  {[
                    { sender: 'Félix', count: 4, subject: 'Partnerships - Q4 Strategy', preview: "Hey team, I've outlined the updated tiering...", date: 'Jun 24, 2026' },
                    { sender: 'Laura', count: 2, subject: 'Proposal Submission', preview: 'Dear Team, I am pleased to share the revised proposal...', date: 'Jun 23, 2026' },
                    { sender: 'Indira', count: 3, subject: 'Follow-up on Discussion', preview: 'Hi, I wanted to follow up on our earlier chat...', date: 'Jun 20, 2026' },
                    { sender: 'Thomas', count: 1, subject: 'Customer Feedback', preview: 'Hello, I wanted to share initial comments from the client...', date: 'Jun 18, 2026' },
                  ].map((email, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 flex items-start justify-between gap-3 hover:bg-neutral-100/60 transition-colors cursor-pointer">
                      <div className="flex items-start gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                            <span>{email.sender}</span>
                            <span className="text-[10px] text-neutral-400 font-normal">{email.count}</span>
                            <span className="font-normal text-neutral-600 truncate max-w-[180px]">{email.subject}</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 truncate max-w-[260px]">{email.preview}</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-neutral-400 shrink-0">{email.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 03 Description */}
            <div className="mt-6 text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                <span className="w-2 h-2 bg-blue-600 inline-block" />
                <span>Email &amp; Calendar</span>
                <span className="text-neutral-400 font-mono ml-2">03 / 07</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-4">
                Every thread, on the right record.
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Connect Google or Microsoft accounts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Emails and events linked to CRM records
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Full communication history in one place
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. FEATURES 04 / 07 & 05 / 07: CUSTOM OBJECTS & PIPELINES (Screenshots 3 & 4) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature 04: Custom Objects & Records */}
          <div className="flex flex-col justify-between">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 text-xs font-semibold text-neutral-800">
                <span>All Companies <span className="text-neutral-400 font-normal">9</span></span>
                <button className="text-neutral-500 hover:text-black font-normal">+ New company</button>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: 'Anthropic', url: 'anthropic.com', owner: 'Dario Amodei', loc: 'San Francisco' },
                  { name: 'Linkedin', url: 'linkedin.com', owner: 'Reid Hoffman', loc: 'Sunnyvale' },
                  { name: 'Slack', url: 'slack.com', owner: 'Stewart Butterfield', loc: 'San Francisco' },
                  { name: 'Notion', url: 'notion.com', owner: 'Ivan Zhao', loc: 'San Francisco' },
                ].map((co, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/60 flex items-center justify-between text-neutral-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-neutral-200 font-bold flex items-center justify-center text-[10px]">
                        {co.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{co.name}</div>
                        <div className="text-[10px] text-neutral-400">{co.url}</div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-neutral-500">
                      <div>{co.owner}</div>
                      <div className="text-[10px] text-neutral-400">{co.loc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 04 Description */}
            <div className="mt-6 text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                <span className="w-2 h-2 bg-blue-600 inline-block" />
                <span>Custom Objects &amp; Graph</span>
                <span className="text-neutral-400 font-mono ml-2">04 / 07</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-4">
                Shape data around your business.
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Custom fields and relationships
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Unified timeline (emails, events, tasks, notes, files)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Email/calendar activity on each record
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 05: Pipeline Management */}
          <div className="flex flex-col justify-between">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 text-xs font-semibold text-neutral-800">
                <span>By Stage <span className="text-neutral-400 font-normal">5 ⌄</span></span>
                <button className="text-neutral-500 hover:text-black font-normal">+ Add deal</button>
              </div>

              {/* Mini Kanban Columns */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                {/* New Column */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                    <span>New</span>
                    <span className="text-neutral-400 font-normal">2</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 space-y-1">
                    <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Building className="w-3 h-3" /> GitHub
                    </div>
                    <div className="font-semibold text-neutral-900 text-[11px]">Enterprise Plan</div>
                    <div className="font-mono text-xs font-bold text-neutral-800">$50k</div>
                  </div>
                </div>

                {/* Meeting Column */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Meeting</span>
                    <span className="text-neutral-400 font-normal">1</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/50 space-y-1">
                    <div className="text-[10px] text-purple-500 flex items-center gap-1">
                      <Building className="w-3 h-3" /> Stripe
                    </div>
                    <div className="font-semibold text-neutral-900 text-[11px]">Design Partner</div>
                    <div className="font-mono text-xs font-bold text-neutral-800">$30k</div>
                  </div>
                </div>

                {/* Customer Column */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Customer</span>
                    <span className="text-neutral-400 font-normal">2</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-1">
                    <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                      <Building className="w-3 h-3" /> Figma
                    </div>
                    <div className="font-semibold text-neutral-900 text-[11px]">Global License</div>
                    <div className="font-mono text-xs font-bold text-neutral-800">$120k</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 05 Description */}
            <div className="mt-6 text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                <span className="w-2 h-2 bg-blue-600 inline-block" />
                <span>Pipeline Management</span>
                <span className="text-neutral-400 font-mono ml-2">05 / 07</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-4">
                Close deals with zero friction.
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Custom deal stages for your process
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Drag-and-drop deals between stages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Track amount and close date
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. FEATURES 06 / 07 & 07 / 07: FILES & DATA IMPORT (Screenshot 4) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature 06: Files */}
          <div className="flex flex-col justify-between">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 border-b border-neutral-100 pb-3 text-xs font-medium text-neutral-500 mb-6 overflow-x-auto">
                {['Timeline', 'Tasks', 'Notes', 'Files', 'Emails', 'Calendar'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabFiles(tab)}
                    className={`pb-1 transition-colors ${activeTabFiles === tab ? 'text-black font-bold border-b-2 border-black' : 'hover:text-black'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-neutral-800">
                  <span>All <span className="text-neutral-400 font-normal">4</span></span>
                  <button className="text-neutral-500 hover:text-black font-normal">+ Add file</button>
                </div>

                {[
                  { name: 'NDA - Anthropic.pdf', date: 'Jul 1, 2026', type: 'PDF', bg: 'bg-red-50 text-red-600' },
                  { name: 'Pricing Q4.xlsx', date: 'Jul 12, 2026', type: 'XLS', bg: 'bg-emerald-50 text-emerald-600' },
                  { name: 'Onboarding deck.pptx', date: 'Jul 18, 2026', type: 'PPT', bg: 'bg-orange-50 text-orange-600' },
                  { name: 'Brand assets.png', date: 'Jul 20, 2026', type: 'PNG', bg: 'bg-blue-50 text-blue-600' },
                ].map((file, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 flex items-center justify-between hover:bg-neutral-100/60 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono ${file.bg}`}>
                        {file.type}
                      </span>
                      <span className="font-semibold text-neutral-900">{file.name}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">{file.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 06 Description */}
            <div className="mt-6 text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                <span className="w-2 h-2 bg-blue-600 inline-block" />
                <span>Files</span>
                <span className="text-neutral-400 font-mono ml-2">06 / 07</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-4">
                Attachments without the chaos.
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Multi-file upload on records
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Rename, download, and delete attachments
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> In-app preview for supported file types
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 07: Data Import */}
          <div className="flex flex-col justify-between">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 text-xs font-bold text-neutral-800">
                <span>Imported data</span>
                <span>Nexus fields</span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { from: 'First Name', ex: 'ex: Dario', to: 'Name', icon: Users },
                  { from: 'Email', ex: 'ex: dario@anthropic.com', to: 'Emails', icon: Mail },
                  { from: 'Company', ex: 'ex: Anthropic', to: 'Company', icon: Building },
                  { from: 'Job Title', ex: 'ex: CEO', to: 'Job Title', icon: Folder },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/50">
                    <div>
                      <div className="font-semibold text-neutral-900">{row.from}</div>
                      <div className="text-[10px] text-neutral-400">{row.ex}</div>
                    </div>
                    <div className="px-3 py-1.5 rounded border border-neutral-200 bg-white text-neutral-800 font-medium flex items-center gap-1.5 shadow-2xs">
                      <row.icon className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{row.to}</span>
                      <ChevronDown className="w-3 h-3 text-neutral-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 07 Description */}
            <div className="mt-6 text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                <span className="w-2 h-2 bg-blue-600 inline-block" />
                <span>Data Import</span>
                <span className="text-neutral-400 font-mono ml-2">07 / 07</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-4">
                From CSV to CRM in minutes.
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> CSV import flow
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> Column to field mapping (including relations)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" /> CSV export anytime
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. CUSTOMIZATION: "GO THE EXTRA MILE WITH NO-CODE" (STICKY PINNED SCROLL) */}
      {/* ===================================================================== */}
      <ProductNoCodeStickySection />

      {/* ===================================================================== */}
      {/* 8. "STOP SETTLING FOR TRADE-OFFS" 3D INTERACTIVE CARDS (Screenshot 5) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 sm:mt-40 mb-24 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-wider text-neutral-500 mb-4">
          <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
          <span className="text-neutral-700 font-sans uppercase font-bold text-xs tracking-wider">
            Stop settling for trade-offs.
          </span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.1] max-w-3xl mx-auto mb-16">
          A modern CRM with<br />an intuitive interface
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Built for speed with 3D Sliced Sphere */}
          <div
            style={{
              clipPath: 'polygon(0 0, 84% 0, 100% 24px, 100% 100%, 0 100%)',
            }}
            className="p-6 sm:p-8 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between hover:border-neutral-400 transition-colors shadow-xs group"
          >
            <div>
              <h3 className="font-bold text-base text-neutral-900">Built for speed</h3>
            </div>
            <div className="my-6">
              <ThreeSpeedSphere />
            </div>
            <div>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Fly through your workspace with shortcuts and short load times.
              </p>
            </div>
          </div>

          {/* Card 2: Real-time data with 3D Sliced Eye */}
          <div
            style={{
              clipPath: 'polygon(0 0, 84% 0, 100% 24px, 100% 100%, 0 100%)',
            }}
            className="p-6 sm:p-8 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between hover:border-neutral-400 transition-colors shadow-xs group"
          >
            <div>
              <h3 className="font-bold text-base text-neutral-900">Real-time data</h3>
            </div>
            <div className="my-6">
              <ThreeSpeedEye />
            </div>
            <div>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                See updates as they happen. Work with your team and agents seamlessly.
              </p>
            </div>
          </div>

          {/* Card 3: Stay in Flow with 3D Sliced Cross */}
          <div
            style={{
              clipPath: 'polygon(0 0, 84% 0, 100% 24px, 100% 100%, 0 100%)',
            }}
            className="p-6 sm:p-8 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between hover:border-neutral-400 transition-colors shadow-xs group"
          >
            <div>
              <h3 className="font-bold text-base text-neutral-900">Stay in Flow</h3>
            </div>
            <div className="my-6">
              <ThreeSpeedCross />
            </div>
            <div>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                AI chat, settings, and records in a side panels for fast, single-screen access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. DARK PRE-FOOTER FAQs & 3D TORUS VORTEX KNOT */}
      {/* ===================================================================== */}
      <DarkPreFooterSection />
    </div>
  );
};

export default ProductPage;
