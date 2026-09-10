import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ThreeWhyHeroGraphic } from './ThreeWhyHeroGraphic';
import { DarkPreFooterSection } from './DarkPreFooterSection';

export const WhyPage = () => {
  return (
    <div className="bg-[#0b0c10] min-h-screen text-white selection:bg-indigo-600 selection:text-white pt-24 sm:pt-32">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION (media_1788610888355.png) */}
      {/* ===================================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-12">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-white tracking-tight leading-[1.08] max-w-3xl mx-auto mb-6">
          The future of CRM<br />is built, not bought.
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed mb-12">
          CRM was a database you filled on Fridays. AI turned it into the system that runs your go-to-market. To differentiate, you have to build what your competitors can't buy.
        </p>

        {/* Dynamic Scanline Graphic (Electric Blue Wings + Center White Pillar) */}
        <div className="w-full max-w-5xl mx-auto">
          <ThreeWhyHeroGraphic />
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. THE SHIFT (media_1788610903451.png) */}
      {/* ===================================================================== */}
      <section className="relative border-t border-neutral-800/80 mt-16 pt-20 sm:pt-28 pb-20">
        {/* Subtle Crosshairs */}
        <div className="absolute top-[-9px] left-6 sm:left-16 text-neutral-600 font-mono text-sm select-none">
          +
        </div>
        <div className="absolute top-[-9px] right-6 sm:right-16 text-neutral-600 font-mono text-sm select-none">
          +
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tag */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-neutral-400 mb-6">
            <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
            <span className="text-neutral-300 font-sans text-xs tracking-wider">
              The shift
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight leading-[1.12] max-w-3xl mb-12">
            CRM was a ledger. AI turned<br />it into an operating system.
          </h2>

          {/* 2-Column Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 text-sm sm:text-[15px] text-neutral-400 leading-relaxed font-normal">
            <div>
              <p>
                For twenty years, CRM meant the same thing: a place to log calls, track deals, and pull reports on Friday. The real work happened in people's heads, in Slack threads, in hallway conversations. The CRM kept score. Nobody expected more from it.
              </p>
            </div>
            <div>
              <p>
                AI agents are starting to draft outreach, score leads, research accounts, write follow-ups, update deal stages. Every one of these actions reads from and writes to the CRM. The scoreboard became the playbook. The database became the brain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. WHAT THIS MEANS (media_1788610903451.png & media_1788610911765.png) */}
      {/* ===================================================================== */}
      <section className="relative border-t border-neutral-800/80 pt-20 sm:pt-28 pb-20">
        <div className="absolute top-[-9px] left-6 sm:left-16 text-neutral-600 font-mono text-sm select-none">
          +
        </div>
        <div className="absolute top-[-9px] right-6 sm:right-16 text-neutral-600 font-mono text-sm select-none">
          +
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tag */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-neutral-400 mb-6">
            <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
            <span className="text-neutral-300 font-sans text-xs tracking-wider">
              What this means
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight leading-[1.12] max-w-3xl mb-12">
            Differentiation now lives<br />in the code you own.
          </h2>

          {/* 2-Column Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 text-sm sm:text-[15px] text-neutral-400 leading-relaxed font-normal">
            <div>
              <p>
                You don't buy your deployment pipeline off the shelf. You don't rent your data warehouse from a vendor who decides the schema. You build it, you own it, you iterate on it every week. CRM is going the same way. The teams that treat it as infrastructure they own will compound an advantage every quarter.
              </p>
            </div>
            <div>
              <p>
                Tuesday your team learns that deals with a technical champion close 3x faster. Wednesday you add the field, wire up the scoring, adjust the workflow. By Thursday your agents are acting on it. That feedback loop is the edge. And it only works if the CRM is yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. THE OPPORTUNITY (media_1788610911765.png) */}
      {/* ===================================================================== */}
      <section className="relative border-t border-neutral-800/80 pt-20 sm:pt-28 pb-20">
        <div className="absolute top-[-9px] left-6 sm:left-16 text-neutral-600 font-mono text-sm select-none">
          +
        </div>
        <div className="absolute top-[-9px] right-6 sm:right-16 text-neutral-600 font-mono text-sm select-none">
          +
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tag */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-neutral-400 mb-6">
            <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
            <span className="text-neutral-300 font-sans text-xs tracking-wider">
              The opportunity
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight leading-[1.12] max-w-3xl mb-12">
            Build it in an afternoon. AI<br />made the gap that small.
          </h2>

          {/* 2-Column Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 text-sm sm:text-[15px] text-neutral-400 leading-relaxed font-normal">
            <div>
              <p>
                A year ago, customizing your CRM meant hiring a Salesforce consultant, learning Apex, waiting months. The gap between &ldquo;I want this&rdquo; and &ldquo;it&apos;s live&rdquo; was measured in quarters and invoices. So people settled. They bent their process to fit the tool and called it adoption.
              </p>
            </div>
            <div>
              <p>
                Now a developer can describe what they want to Claude Code and have a working app in an afternoon. A custom object, a scoring workflow, a new view, an integration. The bottleneck isn&apos;t building anymore. It&apos;s whether your platform lets you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. KINETIC EDITORIAL TYPOGRAPHY BANNER (media_1788610926484.png) */}
      {/* Top row moves RIGHT, Bottom row moves LEFT */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-y border-neutral-800/80 py-14 sm:py-20 bg-[#0a0a0d] select-none">
        <div className="w-full flex flex-col gap-6 sm:gap-8 font-black tracking-tight leading-none whitespace-nowrap overflow-hidden">
          {/* Row 1: Moving to the RIGHT */}
          <div className="flex overflow-hidden w-full">
            <div className="animate-marquee-right flex items-baseline gap-8 sm:gap-14 text-4xl sm:text-7xl lg:text-8xl">
              {[...Array(4)].map((_, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-indigo-500 font-sans tracking-tighter">RESULTS</span>
                  <span className="text-white font-serif font-normal">SAME CRM</span>
                  <span className="text-neutral-400 font-serif italic text-3xl sm:text-6xl font-light">
                    same output
                  </span>
                  <span className="text-indigo-400 font-sans tracking-tighter">SAME RESULTS</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Row 2: Moving to the LEFT */}
          <div className="flex overflow-hidden w-full">
            <div className="animate-marquee-left flex items-baseline gap-8 sm:gap-14 text-4xl sm:text-7xl lg:text-8xl opacity-90">
              {[...Array(4)].map((_, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-white font-serif font-normal">SAME CRM</span>
                  <span className="text-neutral-400 font-sans font-normal text-3xl sm:text-6xl">
                    same output
                  </span>
                  <span className="text-indigo-500 font-sans tracking-tighter">SAME RESULT</span>
                  <span className="text-white font-serif font-normal">SAME CRM</span>
                  <span className="text-neutral-400 font-sans font-normal text-3xl sm:text-6xl">
                    same output
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. FINAL CALL TO ACTION (media_1788610934971.png) */}
      {/* ===================================================================== */}
      <section className="relative border-b border-neutral-800/80 py-28 sm:py-40 text-center">
        <div className="absolute top-[-9px] left-6 sm:left-16 text-neutral-600 font-mono text-sm select-none">
          +
        </div>
        <div className="absolute top-[-9px] right-6 sm:right-16 text-neutral-600 font-mono text-sm select-none">
          +
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-white tracking-tight leading-[1.08] mb-4">
            Build a CRM your<br />competitors can't buy.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-normal mb-8">
            Open-source, AI-ready, and yours to shape.
          </p>

          <Link
            to="/register"
            style={{
              clipPath:
                'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
            }}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
          >
            Get Started
          </Link>
        </div>
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

export default WhyPage;
