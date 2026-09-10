import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThreeVortexLoop } from './ThreeVortexLoop';

/**
 * The 7 Exact FAQ questions matching the user's uploaded screenshots from Twenty.com,
 * localized for Nexus.
 */
const PRE_FOOTER_FAQS = [
  {
    q: 'Is Nexus really open-source?',
    a: 'Yes. Nexus core is 100% open-source under the Apache 2.0 license. You can inspect every line of source code, run it on your own hardware or cloud VPC, fork it, and build custom domain agents without any proprietary restrictions.',
  },
  {
    q: 'How long does it take to get started?',
    a: 'Less than two minutes. Create your organization account, instantly import existing accounts and contacts via CSV or REST/GraphQL API, and deploy your workspace immediately.',
  },
  {
    q: 'Can I migrate from Salesforce or HubSpot?',
    a: 'Yes. Nexus includes built-in one-click migration tools and bi-directional synchronization connectors for Salesforce, HubSpot, and Pipedrive. You can test Nexus side-by-side or complete a cutover in minutes.',
  },
  {
    q: 'Do I need a developer to customize Nexus?',
    a: 'No. Non-technical operators can add custom objects, create custom fields, design pipeline kanban stages, and build automated agent triggers completely through our intuitive visual UI.',
  },
  {
    q: 'Can developers extend Nexus with code?',
    a: 'Absolutely. Developers can create custom microservices, plug in Model Context Protocol (MCP) servers, write custom webhook listeners, and leverage standard Spring Boot, PostgreSQL, and GraphQL endpoints.',
  },
  {
    q: 'Does Nexus work with Claude, ChatGPT, and Cursor?',
    a: 'Yes. Nexus natively implements the Model Context Protocol (MCP). You can connect Claude Desktop, ChatGPT tools, and Cursor IDE directly to your Nexus customer graph for real-time querying and updates.',
  },
  {
    q: 'What does Nexus cost?',
    a: 'Nexus Community Edition is completely free and self-hosted forever. For managed enterprise cloud hosting, SSO/SAML, dedicated SLA, and compliance support, we offer transparent per-seat pricing with no hidden lock-in.',
  },
];

export const DarkPreFooterSection = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <section className="w-full bg-[#0a0a0c] text-white relative overflow-hidden border-t border-neutral-900 pt-20 sm:pt-28 pb-16 sm:pb-24 select-none">
      {/* Ambient background glow behind the 3D vortex */}
      <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-[10%] top-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* MOBILE ONLY: 3D Torus Vortex rendered directly in the BACKGROUND behind the FAQs */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-30">
        <div className="w-[120vw] max-w-[500px] h-full flex items-center justify-center relative shrink-0">
          <ThreeVortexLoop className="w-full h-full min-h-[550px]" />
        </div>
        {/* Subtle top & bottom gradient to blend into dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-transparent to-[#0a0a0c] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column: Heading, Chamfered CTAs, and Accordion FAQs */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            {/* Tag Badge with horizontal dash matching screenshot 1 */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-neutral-300 mb-6">
              <span className="w-3.5 h-[2px] bg-blue-500 inline-block" />
              <span className="text-neutral-300 font-sans text-xs">Any Questions?</span>
            </div>

            {/* Editorial Serif Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-normal tracking-tight text-white leading-[1.08] mb-6">
              Stop fighting custom.
              <br />
              <span className="text-neutral-200">Start building, with Nexus</span>
            </h2>

            {/* Chamfered Buttons matching 20.com / Nexus design */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                to="/login"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
                }}
                className="px-6 py-2.5 bg-white text-neutral-900 hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Get Started
              </Link>
              <a
                href="#talk"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
                }}
                className="px-6 py-2.5 border border-neutral-700 hover:border-neutral-400 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Talk To Us
              </a>
            </div>

            {/* Accordion List with [ ] icon and [+] / [−] toggle buttons matching screenshots 1 & 2 */}
            <div className="border-t border-neutral-800/80 divide-y divide-neutral-800/80">
              {PRE_FOOTER_FAQS.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="transition-colors">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full py-4 sm:py-5 flex items-center justify-between text-left group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 pr-4">
                        <span className="font-mono text-neutral-500 text-xs select-none">
                          [ ]
                        </span>
                        <span className="text-sm sm:text-base font-normal tracking-tight text-neutral-300 group-hover:text-white transition-colors">
                          {faq.q}
                        </span>
                      </div>
                      <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center font-mono text-xs text-neutral-400 group-hover:text-white border border-neutral-800 rounded bg-neutral-900/60 transition-colors">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-5 pl-7 pr-4 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans pt-1">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Torus Vortex sculpture running continuously on Laptop (DESKTOP ONLY) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative lg:sticky lg:top-24 pt-4 lg:pt-0">
            <div className="w-full relative">
              <ThreeVortexLoop />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
