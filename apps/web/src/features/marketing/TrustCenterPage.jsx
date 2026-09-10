import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Server,
  Database,
  Eye,
  CheckCircle,
  FileText,
  AlertCircle,
  Activity,
  Award,
  ArrowRight,
  ExternalLink,
  Download,
} from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const TrustCenterPage = () => {
  const certifications = [
    {
      title: 'SOC 2 Type II',
      status: 'Certified',
      badge: 'Annual Audit',
      description: 'Independently audited by top-tier firms verifying Security, Availability, and Confidentiality controls.',
    },
    {
      title: 'ISO/IEC 27001',
      status: 'Compliant',
      badge: 'Certified',
      description: 'Globally recognized standard for Information Security Management Systems (ISMS) across all operations.',
    },
    {
      title: 'GDPR & CCPA',
      status: 'Verified',
      badge: 'Privacy Law',
      description: 'Full data sovereignty compliance with European and California consumer privacy standards.',
    },
    {
      title: 'HIPAA Ready',
      status: 'BAA Available',
      badge: 'Healthcare Ready',
      description: 'Support for Business Associate Agreements (BAAs) with dedicated encrypted storage tiers.',
    },
  ];

  const securityPillars = [
    {
      icon: Database,
      title: 'TenantContext Data Isolation',
      color: 'text-blue-600 bg-blue-50',
      description: 'Every SQL statement and cache lookup is automatically scoped by active organization ID at the Hibernate and database query planner level.',
    },
    {
      icon: Lock,
      title: 'AES-256 & TLS 1.3 Encryption',
      color: 'text-emerald-600 bg-emerald-50',
      description: 'Data at rest is secured with hardware-accelerated AES-256 encryption. All traffic in transit is enforced with TLS 1.3 with Perfect Forward Secrecy.',
    },
    {
      icon: Eye,
      title: 'Immutable Security Audit Logs',
      color: 'text-purple-600 bg-purple-50',
      description: 'Every user login, field change, bulk record export, and API token creation is permanently written to an append-only audit ledger.',
    },
    {
      icon: Server,
      title: 'Local SQLite Desktop Sandboxing',
      color: 'text-amber-600 bg-amber-50',
      description: 'Native desktop clients store offline operational queues in operating system sandboxed local SQLite databases managed by Rust.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Controls (RBAC)',
      color: 'text-rose-600 bg-rose-50',
      description: 'Fine-grained permission boundaries separating ADMIN, MANAGER, and SALES_AGENT capabilities with field-level visibility rules.',
    },
    {
      icon: Activity,
      title: 'Continuous Penetration Testing',
      color: 'text-indigo-600 bg-indigo-50',
      description: 'Quarterly gray-box and black-box penetration tests conducted by independent cybersecurity firms alongside a public bug bounty.',
    },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Nexus Trust &amp; Security Center</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          Enterprise Security &amp; Compliance
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          How Nexus protects your mission-critical customer data with zero-trust architecture, multi-tenant isolation, and continuous third-party audits.
        </p>

        {/* Live System Status Banner */}
        <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono shadow-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">All Systems Operational · 99.99% Uptime (Past 90 Days)</span>
        </div>
      </section>

      {/* 2. Compliance & Certifications */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-6">
          CERTIFICATIONS &amp; ASSURANCE
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, i) => (
            <Card3D
              key={cert.title}
              ambientFloat={true}
              floatDelay={i * 150}
              maxTilt={12}
              className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs hover:border-neutral-300 transition-all h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase" style={{ transform: 'translateZ(15px)' }}>
                  {cert.status}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">{cert.badge}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">{cert.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{cert.description}</p>
            </Card3D>
          ))}
        </div>
      </section>

      {/* 3. Security Architecture Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
            DEFENSE IN DEPTH
          </div>
          <h2 className="text-3xl font-serif font-normal text-neutral-900 tracking-tight">
            Security embedded at every layer
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Built from day one with architectural constraints that make unauthorized access mathematically impossible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <Card3D
                key={i}
                ambientFloat={true}
                floatDelay={i * 150}
                maxTilt={12}
                className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-3 shadow-2xs hover:border-neutral-300 transition-all h-full"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.color}`} style={{ transform: 'translateZ(18px)' }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">{p.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{p.description}</p>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* 4. Whitepaper & Vulnerability Disclosure */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card3D maxTilt={10} className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4" style={{ transform: 'translateZ(18px)' }}>
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Nexus Security Whitepaper
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                Deep dive into our multi-tenant database partitioning, cryptographic key hierarchies, and disaster recovery SLA guarantees.
              </p>
            </div>
            <button
              onClick={() => alert('Security Whitepaper download initiated (PDF).')}
              style={{ transform: 'translateZ(20px)' }}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Whitepaper (PDF)</span>
            </button>
          </Card3D>

          <Card3D maxTilt={10} className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4" style={{ transform: 'translateZ(18px)' }}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Responsible Vulnerability Disclosure
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                We reward security researchers who report potential vulnerabilities responsibly. Reports are acknowledged within 2 hours by our security team.
              </p>
            </div>
            <Link
              to="/contact"
              style={{ transform: 'translateZ(20px)' }}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-900 text-neutral-900 text-xs font-semibold tracking-wide transition-colors"
            >
              <span>Submit Security Report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card3D>
        </div>
      </section>

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default TrustCenterPage;
