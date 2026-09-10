import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, CheckCircle } from 'lucide-react';
import { CustomerScanlineVisual } from './CustomerScanlineVisual';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const CustomersPage = () => {
  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION (media_1788611473696.png) */}
      {/* ===================================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-4">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          See how teams<br />build on Nexus
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Real stories from real teams about how they shaped Nexus to fit their workflow and accelerated their growth.
        </p>
      </section>

      {/* ===================================================================== */}
      {/* 2. TRUSTED BY BAR (media_1788611473696.png) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 sm:mb-20">
        <div className="relative border-y border-neutral-200/90 py-4 sm:py-5 flex items-center justify-between">
          {/* Corner Crosshairs */}
          <div className="absolute top-[-9px] left-[-9px] text-neutral-400 font-mono text-sm select-none">
            +
          </div>
          <div className="absolute top-[-9px] right-[-9px] text-neutral-400 font-mono text-sm select-none">
            +
          </div>
          <div className="absolute bottom-[-9px] left-[-9px] text-neutral-400 font-mono text-sm select-none">
            +
          </div>
          <div className="absolute bottom-[-9px] right-[-9px] text-neutral-400 font-mono text-sm select-none">
            +
          </div>

          {/* Left: Label */}
          <div className="hidden sm:flex items-center text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold pr-6 border-r border-neutral-200 select-none">
            TRUSTED BY
          </div>

          {/* Center: Monochrome Logos */}
          <div className="flex-1 flex items-center justify-between gap-6 sm:gap-8 px-4 overflow-x-auto select-none opacity-80 hover:opacity-100 transition-opacity">
            <span className="font-serif text-sm font-semibold tracking-wider text-neutral-700">
              Standard Chartered
            </span>
            <span className="font-bold text-xs tracking-wider uppercase text-neutral-800 border border-neutral-300 rounded-full px-2 py-0.5">
              BAYER
            </span>
            <span className="font-serif italic font-bold text-base text-neutral-800">
              pwc
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-800">
              FORA
            </span>
            <span className="font-sans text-xs font-medium text-neutral-700">
              wazoku
            </span>
            <span className="font-sans text-xs font-semibold text-neutral-800">
              CivicActions
            </span>
            <span className="font-mono text-xs tracking-widest uppercase text-neutral-700">
              OTIIMA
            </span>
            <span className="border border-neutral-300 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-700">
              NIC
            </span>
            <span className="text-xs font-medium text-neutral-800">
              幸せホーム
            </span>
          </div>

          {/* Right: +10K Others */}
          <div className="flex items-center gap-1.5 pl-6 border-l border-neutral-200 text-[11px] font-mono font-semibold text-neutral-500 whitespace-nowrap select-none">
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            <span>+10K OTHERS</span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. CASE STUDY 1: NINE DOTS VENTURES (Full Width) (media_1788611489718.png) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Card3D maxTilt={6} scale={1.01} className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden hover:border-neutral-300 transition-all group">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Graphic */}
            <div className="lg:col-span-6 h-[260px] sm:h-[320px] lg:h-auto min-h-[280px] border-b lg:border-b-0 lg:border-r border-neutral-200/90">
              <CustomerScanlineVisual
                variant="ninedots"
                primaryColor="#4f46e5"
                accentColor="#818cf8"
                caseTag="CASE · 9 MIN"
              />
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-3">
                  REAL ESTATE
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                  A real estate agency on WhatsApp built a CRM around it
                </h2>
                <div className="border-l-2 border-blue-500 pl-4 my-4">
                  <p className="italic text-neutral-600 text-sm sm:text-[15px] font-serif leading-relaxed">
                    “Nexus lets us build a CRM around the business and not the business around the CRM.”
                  </p>
                </div>
              </div>

              <div>
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-6 mb-6">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">
                      150 hrs
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                      SAVED / MONTH
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">
                      2,000+
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                      DAILY MESSAGES
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">
                      Q1 2026
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                      RECORD QUARTER
                    </div>
                  </div>
                </div>

                {/* Author Row */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                      MB
                    </div>
                    <div className="text-xs text-neutral-600">
                      <span className="font-semibold text-neutral-900">Mike Babiy</span> · Founder, Nine Dots Ventures
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card3D>
      </section>

      {/* ===================================================================== */}
      {/* 4. 2-COLUMN GRID (CARDS 2 & 3) (media_1788611496504.png) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 2: Alternative */}
          <Card3D
            maxTilt={8}
            ambientFloat={true}
            floatDelay={0}
            className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:border-neutral-300 transition-all group h-full"
          >
            <div>
              <div className="h-56 w-full border-b border-neutral-100">
                <CustomerScanlineVisual
                  variant="alternative"
                  primaryColor="#f43f5e"
                  accentColor="#fda4af"
                  logoText="Alternative"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  CONSULTING
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-neutral-900 mb-3 group-hover:text-rose-600 transition-colors">
                  From Salesforce to self-hosted Nexus
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  Alternative Partners replaced Salesforce with self-hosted Nexus, using agentic AI to compress migration work.
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">
                    <span className="font-bold text-neutral-900">AI-assisted</span>
                    <span className="text-neutral-400">|</span>
                    <span>SALESFORCE MIGRATION</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">
                    <span className="font-bold text-neutral-900">Self-hosted</span>
                    <span className="text-neutral-400">|</span>
                    <span>FULL OWNERSHIP</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px]">
                  BR
                </div>
                <div className="text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-900">Benjamin Reynolds</span> · Principal and Founder, Alternative Partners
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card3D>

          {/* Card 3: NetZero */}
          <Card3D
            maxTilt={8}
            ambientFloat={true}
            floatDelay={250}
            className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:border-neutral-300 transition-all group h-full"
          >
            <div>
              <div className="h-56 w-full border-b border-neutral-100">
                <CustomerScanlineVisual
                  variant="netzero"
                  primaryColor="#f59e0b"
                  accentColor="#fde68a"
                  logoText="NetZero"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  AGRIBUSINESS
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-neutral-900 mb-3 group-hover:text-amber-600 transition-colors">
                  A CRM that grows with you
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  NetZero uses Nexus as a modular CRM across product lines and countries, with a roadmap into AI-assisted workflows.
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">
                    <span className="font-bold text-neutral-900">3 product lines</span>
                    <span className="text-neutral-400">|</span>
                    <span>ON A SINGLE CRM</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">
                    <span className="font-bold text-neutral-900">No-code</span>
                    <span className="text-neutral-400">|</span>
                    <span>CUSTOMIZATIONS</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px]">
                  OR
                </div>
                <div className="text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-900">Olivier Reinaud</span> · Co-founder, NetZero
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. 2-COLUMN GRID (CARDS 4 & 5) (media_1788611500473.png) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 4: AC&T */}
          <Card3D
            maxTilt={8}
            ambientFloat={true}
            floatDelay={150}
            className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:border-neutral-300 transition-all group h-full"
          >
            <div>
              <div className="h-56 w-full border-b border-neutral-100">
                <CustomerScanlineVisual
                  variant="act"
                  primaryColor="#10b981"
                  accentColor="#6ee7b7"
                  logoText="AC&T"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  EDUCATION
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-neutral-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  A CRM they actually own
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  AC&T and Flycoder moved from a dead vendor export to self-hosted Nexus, with over 90% lower CRM cost and full control.
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">
                    <span className="font-bold text-neutral-900">90%+</span>
                    <span className="text-neutral-400">|</span>
                    <span>LOWER CRM COST</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px]">
                  JC
                </div>
                <div className="text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-900">Joseph Chiang</span> · CRM Engineer, AC&T Education Migration
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card3D>

          {/* Card 5: W3villa */}
          <Card3D
            maxTilt={8}
            ambientFloat={true}
            floatDelay={400}
            className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:border-neutral-300 transition-all group h-full"
          >
            <div>
              <div className="h-56 w-full border-b border-neutral-100">
                <CustomerScanlineVisual
                  variant="w3villa"
                  primaryColor="#4f46e5"
                  accentColor="#818cf8"
                  logoText="W3villa"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  EDTECH
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">
                  When your CRM is the product
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  W3villa shipped W3Grads on Nexus for AI interviews, scoring, and institution-scale workflows without rebuilding CRM plumbing.
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">
                    <span className="font-bold text-neutral-900">Zero</span>
                    <span className="text-neutral-400">|</span>
                    <span>MANUAL WORK AT CORE</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px]">
                  AS
                </div>
                <div className="text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-900">Amrendra Pratap Singh</span> · VP of Engineering, W3villa Technologies
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. CASE STUDY 6: ELEVATE (Full Width) (media_1788611504819.png) */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <Card3D maxTilt={6} scale={1.01} className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden hover:border-neutral-300 transition-all group">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Graphic */}
            <div className="lg:col-span-6 h-[260px] sm:h-[320px] lg:h-auto min-h-[280px] border-b lg:border-b-0 lg:border-r border-neutral-200/90">
              <CustomerScanlineVisual
                variant="elevate"
                primaryColor="#a855f7"
                accentColor="#c084fc"
                logoText="Elevate"
                caseTag="CASE · 8 MIN"
              />
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-3">
                  MANAGEMENT CONSULTING
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 leading-snug mb-4 group-hover:text-purple-600 transition-colors">
                  Nexus as the API backbone of a go-to-market stack
                </h2>
                <div className="border-l-2 border-blue-500 pl-4 my-4">
                  <p className="italic text-neutral-600 text-sm sm:text-[15px] font-serif leading-relaxed">
                    “It is just such a nicer experience than dealing with a Salesforce or a HubSpot. My mission has been to get every tool API-accessible, so everything talks to each other.”
                  </p>
                </div>
              </div>

              <div>
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-6 mb-6">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">
                      1 click
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                      PROPOSAL AUTOMATION
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">
                      4 tools
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                      CONNECTED VIA API
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">
                      API-first
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">
                      TOOL INTEGRATION
                    </div>
                  </div>
                </div>

                {/* Author Row */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      JB
                    </div>
                    <div className="text-xs text-neutral-600">
                      <span className="font-semibold text-neutral-900">Justin Beadle</span> · Director of Digital and Information, Elevate Consulting
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card3D>
      </section>

      {/* ===================================================================== */}
      {/* 7. DOCKED DARK PRE-FOOTER & FOOTER */}
      {/* ===================================================================== */}
      <div>
        <DarkPreFooterSection />
      </div>
    </div>
  );
};

export default CustomersPage;
