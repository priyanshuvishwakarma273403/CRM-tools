import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Terminal, ShieldCheck, Zap, Layers, Cpu, ArrowUpRight } from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';

export const AboutPage = () => {
  return (
    <div className="pt-24 sm:pt-32 pb-16 bg-white min-h-screen text-neutral-900">
      {/* Editorial Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-wider text-neutral-500 mb-4">
          <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
          <span className="text-neutral-700 font-sans uppercase font-bold text-xs tracking-wider">
            Why Nexus
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] mb-6">
          The story behind Nexus.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Traditional CRMs are slow, bloated, and closed off behind prohibitive lock-ins.
          We designed Nexus to give modern revenue teams full freedom, radical speed, and architectural sovereignty.
        </p>
      </section>

      {/* Philosophy Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-blue-600 mb-6 shadow-xs">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-normal text-neutral-900 mb-2">
                Speed as a feature
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Interactions execute sub-100ms. With local optimistic updates and global shortcuts (⌘K), your CRM moves as fast as you think.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-neutral-200/60 font-mono text-xs text-neutral-400">
              01 / FLOW STATE
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-indigo-600 mb-6 shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-normal text-neutral-900 mb-2">
                Total Customization
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Add custom objects, dynamic relations, and automated trigger pipelines in minutes without writing a single line of backend boilerplate.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-neutral-200/60 font-mono text-xs text-neutral-400">
              02 / NO-CODE EXTENSIBILITY
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-emerald-600 mb-6 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-normal text-neutral-900 mb-2">
                Open &amp; Self-Hostable
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Own your data. Run Nexus in your private cloud, on-premises, or in our secure managed infrastructure with zero vendor lock-in.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-neutral-200/60 font-mono text-xs text-neutral-400">
              03 / DATA SOVEREIGNTY
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="p-10 sm:p-14 rounded-3xl border border-neutral-200 bg-white shadow-xs">
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-4">
            Our Architecture Principle
          </span>
          <blockquote className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 leading-snug">
            “One centralized Spring Boot backend, one source of truth with PostgreSQL, and lightning-fast clients across Web, Desktop, and Mobile.”
          </blockquote>
          <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs">
                NX
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Nexus Core Engineering</div>
                <div className="text-[11px] text-neutral-500">Distributed &amp; Open Systems</div>
              </div>
            </div>
            <Link
              to="/product"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700"
            >
              Explore Product <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Docked Dark Pre-Footer */}
      <div className="mt-32">
        <DarkPreFooterSection />
      </div>
    </div>
  );
};

export default AboutPage;

