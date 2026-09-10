import React from 'react';
import { Shield, Lock, EyeOff, UserCheck, FileText, CheckCircle } from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const PrivacyPage = () => {
  const takeaways = [
    {
      icon: UserCheck,
      title: 'Complete Data Ownership',
      description: 'You own 100% of your customer contacts, deals, notes, and workflows. Nexus will never claim rights or licensing to your proprietary data.',
    },
    {
      icon: EyeOff,
      title: 'Zero Data Monetization',
      description: 'We do not sell, rent, or monetize your customer records or internal CRM usage patterns to advertisers, brokers, or external AI models.',
    },
    {
      icon: Lock,
      title: 'Multi-Tenant Isolation',
      description: 'Every database transaction is guarded by strict organization-level TenantContext filters, mathematically preventing cross-tenant leakage.',
    },
    {
      icon: Shield,
      title: 'Global Privacy Compliance',
      description: 'Built-in support for GDPR, CCPA, and CPRA data subject requests, including one-click customer record export and permanent cryptographic erasure.',
    },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy &amp; Data Governance</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          Nexus Privacy Policy
        </h1>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
          Effective Date: September 1, 2026 · Version 2.4
        </p>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          We believe privacy is an architectural principle, not an afterthought. Read our commitments to keeping your enterprise CRM data confidential and secure.
        </p>
      </section>

      {/* 2. Executive Takeaway Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-6">
          EXECUTIVE SUMMARY
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

      {/* 3. Detailed Legal Clauses */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">1. Information We Collect</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            NexusCRM Platform Inc. ("Nexus", "we", or "us") collects only the minimum information required to provide reliable CRM services:
          </p>
          <ul className="space-y-2 text-xs text-neutral-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Account Credentials:</strong> Name, business email, hashed password, and organization affiliation.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Customer Relationship Records:</strong> Leads, contacts, deals, activities, and custom fields inputted by your team.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Operational Logs:</strong> Timestamps, user-agent details, and IP addresses used solely for fraud prevention and audit logs.</span>
            </li>
          </ul>
        </Card3D>

        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">2. Local Storage &amp; Native Desktop Isolation</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            When using the native Nexus Tauri desktop client on macOS, Windows, or Linux, offline queues and cached views are stored in local SQLite databases sandboxed within the host operating system's application directory. Nexus does not access files outside this sandboxed workspace.
          </p>
        </Card3D>

        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">3. Subprocessors &amp; Hosting Infrastructure</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            For Nexus Cloud customers, our primary infrastructure is hosted in ISO 27001 and SOC 2 certified AWS / GCP data centers with regional EU and US data residency options. We execute strict Data Processing Agreements (DPAs) with all technical subprocessors.
          </p>
        </Card3D>

        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">4. Data Subject Rights &amp; Erasure</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            In compliance with GDPR and CCPA, users have the right to inspect, export, or permanently delete all personal records. Organization administrators can execute a complete tenant data purge at any time from the Settings console.
          </p>
        </Card3D>

        <Card3D maxTilt={5} scale={1.01} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900">5. Contact Our Data Protection Officer (DPO)</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            If you have questions regarding this Privacy Policy or wish to execute a custom Data Processing Agreement (DPA), contact our legal and privacy team at <a href="mailto:privacy@nexus-crm.com" className="text-blue-600 font-semibold underline">privacy@nexus-crm.com</a>.
          </p>
        </Card3D>
      </section>

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default PrivacyPage;
