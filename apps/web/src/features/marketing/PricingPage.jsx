import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PricingPage = () => {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Free Starter',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Essential CRM capabilities for small teams and solo founders.',
      features: [
        'Up to 5 Users',
        '2,500 Lead & Contact Records',
        'Deals Kanban Pipeline',
        'Local SQLite Offline Storage',
        'Basic Analytics Dashboard',
        'Community Support',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Professional',
      priceMonthly: 29,
      priceAnnual: 22,
      description: 'Complete CRM automation for growing sales organizations.',
      features: [
        'Up to 25 Users',
        '50,000 Lead & Contact Records',
        'Advanced Visual Workflows',
        'Multi-Tenant Tenant Isolation',
        'Revenue Forecasting Engine',
        'Full REST API & Webhooks Access',
        'Priority 24/7 Support',
      ],
      cta: 'Start 14-Day Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      priceMonthly: 79,
      priceAnnual: 59,
      description: 'Dedicated multi-tenant infrastructure for large enterprises.',
      features: [
        'Unlimited Users & Records',
        'Custom Roles & Audit Logging',
        'Dedicated PostgreSQL / Redis Instance',
        'SAML / SSO Authentication',
        'Custom Native Desktop Branding',
        'Dedicated SLA & Success Manager',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Simple, Transparent Pricing for Every Sales Team
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No hidden fees or unexpected usage charges. Switch between monthly and annual billing at any time.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-xs font-bold mt-4">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-full transition-all ${!annual ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${annual ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl p-8 bg-white dark:bg-slate-900 flex flex-col justify-between transition-all ${
              plan.highlighted
                ? 'border-2 border-indigo-600 shadow-2xl relative ring-4 ring-indigo-500/10'
                : 'border border-slate-200 dark:border-slate-800'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most Popular Choice
              </div>
            )}

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>

              <div className="my-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  ${annual ? plan.priceAnnual : plan.priceMonthly}
                </span>
                <span className="text-xs text-slate-500 font-semibold"> / user / month</span>
              </div>

              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-6">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link to="/register">
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full py-3 font-bold text-xs"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
