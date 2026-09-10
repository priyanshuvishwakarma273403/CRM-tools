import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  CheckCircle,
  Star,
  MapPin,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Award,
  Zap,
  Building2,
  Code2,
  Sparkles,
} from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const PartnersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactModalPartner, setContactModalPartner] = useState(null);

  const categories = [
    'All',
    'System Integrators',
    'AI & Automations',
    'Migration Specialists',
    'Consulting & Strategy',
  ];

  const partners = [
    {
      id: 'w3villa',
      name: 'W3villa Technologies',
      category: 'AI & Automations',
      location: 'New Delhi, IN & San Francisco, US',
      rating: '4.9',
      reviewCount: 48,
      deployments: '45+ deployments',
      rate: '$85 - $120 / hr',
      badge: 'Premier Partner',
      tagline: 'Custom AI agent pipelines, headless CRM integrations, and interview automation on Nexus.',
      specialties: ['AI Copilot Agents', 'Custom Object Architecture', 'Full-stack Node/React'],
      logoBg: 'bg-blue-600 text-white',
      initials: 'W3',
    },
    {
      id: 'flycoder',
      name: 'Flycoder Advisory',
      category: 'Migration Specialists',
      location: 'London, UK & Singapore',
      rating: '5.0',
      reviewCount: 32,
      deployments: '28+ deployments',
      rate: '$110 - $160 / hr',
      badge: 'Certified Specialist',
      tagline: 'Enterprise legacy CRM migration, dead vendor extraction, and 90%+ lower infrastructure cost.',
      specialties: ['Salesforce Migration', 'HubSpot Data Pipeline', 'Data Cleanliness & Deduplication'],
      logoBg: 'bg-emerald-600 text-white',
      initials: 'FC',
    },
    {
      id: 'netzero-advisory',
      name: 'NetZero Advisory',
      category: 'Consulting & Strategy',
      location: 'Paris, FR & Zurich, CH',
      rating: '4.9',
      reviewCount: 39,
      deployments: '32+ deployments',
      rate: '$130 - $190 / hr',
      badge: 'Premier Partner',
      tagline: 'Multi-country agribusiness and industrial revenue operations built on self-hosted Nexus.',
      specialties: ['Multi-Tenant Org Strategy', 'Industrial Sales Funnels', 'European Data Compliance'],
      logoBg: 'bg-amber-600 text-white',
      initials: 'NZ',
    },
    {
      id: 'alternative',
      name: 'Alternative Solutions',
      category: 'System Integrators',
      location: 'Austin, TX & New York, US',
      rating: '5.0',
      reviewCount: 56,
      deployments: '50+ deployments',
      rate: '$140 - $200 / hr',
      badge: 'Premier Partner',
      tagline: 'AI-assisted enterprise migrations, self-hosted Docker/K8s clusters, and complete data ownership.',
      specialties: ['Kubernetes Self-Hosting', 'Enterprise SSO/SAML', 'High-Throughput Webhooks'],
      logoBg: 'bg-rose-600 text-white',
      initials: 'AS',
    },
    {
      id: 'cloudscale',
      name: 'CloudScale Systems',
      category: 'System Integrators',
      location: 'Berlin, DE & Toronto, CA',
      rating: '4.8',
      reviewCount: 26,
      deployments: '22+ deployments',
      rate: '$120 - $175 / hr',
      badge: 'Certified Specialist',
      tagline: 'Dedicated PostgreSQL infrastructure, automated backup failovers, and multi-tenant scaling.',
      specialties: ['Dedicated Database Clusters', 'PostgreSQL Fine-tuning', 'Terraform & Helm Deploys'],
      logoBg: 'bg-indigo-600 text-white',
      initials: 'CS',
    },
    {
      id: 'devstudio',
      name: 'DevStudio AI',
      category: 'AI & Automations',
      location: 'Tokyo, JP & Sydney, AU',
      rating: '4.9',
      reviewCount: 41,
      deployments: '38+ deployments',
      rate: '$95 - $145 / hr',
      badge: 'Certified Specialist',
      tagline: 'Autonomous AI lead triage, WhatsApp / WeChat omnichannel bridges, and custom UI components.',
      specialties: ['Omnichannel Messengers', 'Autonomous Lead Scoring', 'Custom React Widgets'],
      logoBg: 'bg-purple-600 text-white',
      initials: 'DS',
    },
  ];

  const filteredPartners = partners.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <Award className="w-3.5 h-3.5" />
          <span>Nexus Partner Network</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          Certified Partners to scale your CRM
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Connect with trusted implementation architects, migration specialists, and custom engineering teams to customize Nexus to your exact business workflow.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by partner name, specialty (e.g. AI Copilot, Migration)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Partner Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-200">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Showing {filteredPartners.length} Verified Partners
          </div>
          <a
            href="#apply"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            Become a Partner <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((p, index) => (
            <Card3D
              key={p.id}
              ambientFloat={true}
              floatDelay={index * 150}
              maxTilt={12}
              className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between h-full hover:border-neutral-300 transition-all group"
            >
              <div>
                {/* Header with Avatar & Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm font-mono shadow-xs ${p.logoBg}`}
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      {p.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span className="truncate max-w-[180px]">{p.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge & Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono font-bold uppercase" style={{ transform: 'translateZ(15px)' }}>
                    <ShieldCheck className="w-3 h-3" />
                    {p.badge}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    {p.category}
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-xs text-neutral-600 leading-relaxed mb-4 line-clamp-2">
                  {p.tagline}
                </p>

                {/* Specialties Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-neutral-100 text-[10px] font-mono text-neutral-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Meta & Action */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{p.rating}</span>
                    <span className="text-neutral-400 font-normal">({p.reviewCount})</span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    {p.deployments}
                  </div>
                </div>

                <button
                  onClick={() => setContactModalPartner(p)}
                  style={{ transform: 'translateZ(25px)' }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  Work with Partner
                </button>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* 3. Why Partner with Nexus Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200 mt-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
            PARTNER BENEFITS
          </div>
          <h2 className="text-3xl font-serif font-normal text-neutral-900 tracking-tight">
            Why join the Nexus Partner Network?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-3">
            Deliver transformative CRM solutions with total code freedom, direct core access, and recurring revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: '25% Revenue Share', desc: 'Earn lifetime recurring commissions on cloud seats, or retain 100% of your self-hosted consulting contracts.', color: 'text-blue-600 bg-blue-50' },
            { icon: Code2, title: 'Direct Core Access', desc: 'Private Slack channel with core maintainers. Influence the product roadmap and get priority PR reviews.', color: 'text-emerald-600 bg-emerald-50' },
            { icon: Sparkles, title: 'Qualified Client Leads', desc: 'Receive enterprise implementation and migration inquiries directly routed to your region and specialty.', color: 'text-purple-600 bg-purple-50' },
            { icon: Award, title: 'Co-Marketing & Badging', desc: 'Featured placement on the Nexus homepage, customer case studies, and official Certified Partner badges.', color: 'text-amber-600 bg-amber-50' },
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <Card3D
                key={i}
                ambientFloat={true}
                floatDelay={i * 200}
                maxTilt={10}
                className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3 h-full hover:border-neutral-300"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.color}`} style={{ transform: 'translateZ(18px)' }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">{b.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{b.desc}</p>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* 4. Partner Tiers Section */}
      <section id="apply" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
            TIERS &amp; REQUIREMENTS
          </div>
          <h2 className="text-3xl font-serif font-normal text-neutral-900 tracking-tight">
            Find the right partnership tier
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card3D maxTilt={12} className="p-8 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between h-full hover:border-neutral-300">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2">
                TIER 01
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Registered Partner</h3>
              <p className="text-xs text-neutral-600 mb-6">
                For independent consultants, solo agencies, and developers exploring Nexus.
              </p>
              <ul className="space-y-3 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Access to Partner Portal &amp; Docs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>15% recurring cloud commission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Listing in Partner Directory</span>
                </li>
              </ul>
            </div>
            <button style={{ transform: 'translateZ(20px)' }} className="mt-8 w-full py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
              Apply as Registered
            </button>
          </Card3D>

          <Card3D maxTilt={14} className="p-8 rounded-2xl bg-neutral-900 text-white flex flex-col justify-between relative shadow-xl ring-2 ring-blue-500 h-full">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold uppercase" style={{ transform: 'translateZ(25px)' }}>
              MOST POPULAR
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                TIER 02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Certified Implementation</h3>
              <p className="text-xs text-neutral-300 mb-6">
                For proven digital agencies and system integrators deploying multi-tenant clients.
              </p>
              <ul className="space-y-3 text-xs text-neutral-200">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>20% recurring cloud commission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Direct Slack channel with core engineering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Official Certified Partner Badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Monthly client lead routing</span>
                </li>
              </ul>
            </div>
            <button style={{ transform: 'translateZ(25px)' }} className="mt-8 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
              Apply for Certified
            </button>
          </Card3D>

          <Card3D maxTilt={12} className="p-8 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between h-full hover:border-neutral-300">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2">
                TIER 03
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Premier Solutions Architect</h3>
              <p className="text-xs text-neutral-600 mb-6">
                For elite consultancy firms handling Fortune 500 migrations and global rollouts.
              </p>
              <ul className="space-y-3 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>25% recurring cloud commission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Co-branded case study publications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dedicated Partner Success Manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Guaranteed SLA for customer escalations</span>
                </li>
              </ul>
            </div>
            <button style={{ transform: 'translateZ(20px)' }} className="mt-8 w-full py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
              Apply for Premier
            </button>
          </Card3D>
        </div>
      </section>

      {/* Modal for contacting partner */}
      {contactModalPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-neutral-200 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${contactModalPartner.logoBg}`}
                >
                  {contactModalPartner.initials}
                </div>
                <h3 className="font-bold text-base text-neutral-900">
                  Connect with {contactModalPartner.name}
                </h3>
              </div>
              <button
                onClick={() => setContactModalPartner(null)}
                className="text-neutral-400 hover:text-neutral-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-600 mb-5 leading-relaxed">
              We will introduce your organization directly to {contactModalPartner.name}'s lead engagement director.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Introduction request sent to ${contactModalPartner.name}!`);
                setContactModalPartner(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Your Name</label>
                <input
                  required
                  type="text"
                  placeholder="Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Work Email</label>
                <input
                  required
                  type="email"
                  placeholder="sarah@company.com"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Project Scope</label>
                <textarea
                  rows={3}
                  required
                  placeholder="We are migrating 25 sales seats from Salesforce to self-hosted Nexus..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider transition-colors mt-2 cursor-pointer"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default PartnersPage;
