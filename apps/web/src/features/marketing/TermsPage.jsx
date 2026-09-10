import React from 'react';
import { Scale, CheckCircle, ShieldCheck, Clock, FileText, AlertTriangle } from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const TermsPage = () => {
  const takeaways = [
    {
      icon: Scale,
      title: 'Open Core Transparency',
      description: 'Nexus core software is open-source. Paid cloud plans provide managed high-availability infrastructure, automated backups, and 24/7 support.',
    },
    {
      icon: Clock,
      title: '99.9% Uptime Guarantee',
      description: 'We guarantee a 99.9% monthly uptime SLA for all Professional and Enterprise cloud subscriptions with automatic billing credit compensation.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Data Security',
      description: 'Your data is strictly partitioned via TenantContext filters and encrypted in transit (TLS 1.3) and at rest (AES-256).',
    },
    {
      icon: FileText,
      title: 'No Lock-in & Full Export',
      description: 'You can export 100% of your customer records, custom objects, and activity logs in standard CSV or encrypted JSON format at any time.',
    },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <Scale className="w-3.5 h-3.5" />
          <span>Legal Terms &amp; Conditions</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          Nexus Terms of Service
        </h1>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
          Effective Date: September 1, 2026 · Version 2.4
        </p>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          These terms govern your access to Nexus Cloud services, the Tauri native desktop application, and developer APIs.
        </p>
      </section>

      {/* 2. Executive Takeaway Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-6">
          TERMS AT A GLANCE
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {takeaways.map((t, i) => {
            const Icon = t.icon;
            return (
              <Card3D
                key={i}
                ambientFloat={true}
                floatDelay={i * 150}
                maxTilt={12}
                className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-3 shadow-2xs hover:border-neutral-300 transition-all h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center" style={{ transform: 'translateZ(18px)' }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">{t.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{t.description}</p>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* 3. Detailed Legal Articles */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">1. Acceptance of Terms &amp; Scope</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            By creating a Nexus account, downloading the desktop application, or invoking the REST/GraphQL APIs, you agree to be bound by these Terms of Service. If you are accepting on behalf of an enterprise or organization, you represent that you possess the necessary authority to bind that entity.
          </p>
        </Card3D>

        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">2. Cloud Subscription &amp; Billing Cycles</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Subscriptions are billed on a monthly or annual basis depending on your selection at checkout. All fees are transparently displayed without hidden per-contact surge charges. Invoices and tax receipts are available on-demand in the Organization Billing settings.
          </p>
        </Card3D>

        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">3. Acceptable Use &amp; Platform Security</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            You agree not to engage in unauthorized security probing, distributed denial of service (DDoS) attacks, or attempt to bypass the multi-tenant <code className="text-[11px] font-mono bg-neutral-100 px-1 rounded">TenantContext</code> isolation boundaries. Abuse of webhook dispatches or outbound email spam will result in immediate API key suspension.
          </p>
        </Card3D>

        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">4. Service Level Agreement (SLA) Commitments</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Nexus warrants that the Cloud infrastructure will maintain at least 99.9% uptime during each monthly billing cycle. In the event of an SLA breach, affected customers will be credited up to 25% of their monthly subscription fee upon request submitted to support within 30 days of the incident.
          </p>
        </Card3D>

        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">5. Termination &amp; Data Portability</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            You may terminate your organization account at any time. Upon cancellation, you retain a 30-day grace period to download full encrypted archive backups of all CRM records before permanent cryptographic shredding occurs.
          </p>
        </Card3D>
      </section>

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default TermsPage;
