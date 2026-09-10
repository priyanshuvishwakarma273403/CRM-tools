import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CheckCircle2, ArrowRight, Building, Users, Target, Download } from 'lucide-react';

export const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    teamSize: '5-20',
    primaryGoal: 'SALES_PIPELINE',
    inviteEmails: '',
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm">N</div>
            <span className="font-extrabold text-sm">Workspace Onboarding</span>
          </div>
          <span className="text-xs font-mono text-indigo-400">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What size is your sales organization?</h2>
            <p className="text-xs text-slate-400">This configures multi-tenant workspace quotas and default dashboard metrics.</p>
            <div className="space-y-2 pt-2">
              {['1-5 members (Solo / Startup)', '5-20 members (Growing Team)', '20-100 members (Enterprise)'].map((size) => (
                <div
                  key={size}
                  onClick={() => setData({ ...data, teamSize: size })}
                  className={`p-4 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    data.teamSize === size ? 'border-indigo-500 bg-indigo-950/60 text-white' : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What is your primary CRM objective?</h2>
            <p className="text-xs text-slate-400">We will tailor your initial sales pipeline stages and automation templates.</p>
            <div className="space-y-2 pt-2">
              {[
                { id: 'SALES_PIPELINE', title: 'Manage B2B Sales Deals & Pipeline' },
                { id: 'LEAD_NURTURE', title: 'Inbound Lead Qualification & Scoring' },
                { id: 'ACCOUNT_MANAGEMENT', title: 'Customer Accounts & Contract Invoicing' },
              ].map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => setData({ ...data, primaryGoal: obj.id })}
                  className={`p-4 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    data.primaryGoal === obj.id ? 'border-indigo-500 bg-indigo-950/60 text-white' : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {obj.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Workspace Ready!</h2>
            <p className="text-xs text-slate-400">
              Your multi-tenant workspace is fully provisioned. You can access the Web Dashboard now or download the native Desktop app.
            </p>
            <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> SQLite Local Cache Engine initialized
              </div>
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Multi-Tenant Role Isolation Active
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            Skip for now
          </button>
          <Button onClick={handleNext} variant="primary" className="px-6 py-2.5 text-xs font-bold">
            {step === 3 ? 'Launch CRM Dashboard' : 'Continue'} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
