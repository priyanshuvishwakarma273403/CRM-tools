import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Shield,
  ArrowRight,
  ChevronLeft,
  X,
  Sparkles,
  Link2,
} from 'lucide-react';

/**
 * 5-Step Integration Connection Wizard Modal
 * Implements Section 23 of the UI Master Prompt
 */
export const IntegrationConnectModal = ({
  isOpen = false,
  onClose,
  integration = {
    id: 'gmail',
    name: 'Google Workspace (Gmail & Calendar)',
    icon: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png',
    description: 'Bi-directional email thread synchronization and automatic calendar meeting ingestion.',
  },
}) => {
  const [step, setStep] = useState(1);
  const [selectedPermissions, setSelectedPermissions] = useState(['read_mail', 'sync_calendar']);

  if (!isOpen) return null;

  const togglePermission = (p) => {
    setSelectedPermissions((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const nextStep = () => setStep((s) => Math.min(5, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in text-left">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1.5">
              <Link2 className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Connect {integration.name}
              </h3>
              <p className="text-[11px] text-slate-400">Step {step} of 5</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full">
          <div
            className="h-full bg-brand-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Step 1: Connect Account */}
          {step === 1 && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-600 dark:text-brand-400">
                Step 1 • Identity Authentication
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Authenticate your corporate account
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                CRM OS will initiate an OAuth 2.0 PKCE challenge with Google Workspace. Tokens are encrypted at rest using AES-256-GCM.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Workspace Domain</span>
                  <span className="text-slate-400 text-[11px]">acme-corp.com</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                  Verified SSO
                </span>
              </div>
            </div>
          )}

          {/* Step 2: Choose Permissions */}
          {step === 2 && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-600 dark:text-brand-400">
                Step 2 • Scope Authorization
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Configure granular permissions
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'read_mail', label: 'Read Customer Inbound Emails', desc: 'Sync customer replies directly to timeline' },
                  { id: 'sync_calendar', label: 'Sync Calendar Meetings', desc: 'Ingest customer calls into meeting schedule' },
                  { id: 'send_mail', label: 'Send Outbound Emails via Agent', desc: 'Allows AI Copilot to draft & send messages with approval' },
                ].map((item) => (
                  <label
                    key={item.id}
                    onClick={() => togglePermission(item.id)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3 cursor-pointer hover:border-brand-500 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(item.id)}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-brand-600 focus:ring-0"
                    />
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 block">{item.label}</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review Data Access */}
          {step === 3 && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-600 dark:text-brand-400">
                Step 3 • Zero Trust Inspection
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Review Data Access & DLP Policies
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The CRM OS AI Context Firewall automatically masks credit cards, passwords, and sensitive SSN fields before syncing.
              </p>
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>DLP Protection Enabled</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  All external communication is recorded in the immutable tenant audit log with SHA-256 payload integrity hashing.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-600 dark:text-brand-400">
                Step 4 • Final Confirmation
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Confirm activation
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Click below to finalize the integration handshake and start background synchronization.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Integration:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{integration.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Permissions:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedPermissions.length} Scopes</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Connected */}
          {step === 5 && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Successfully Connected!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {integration.name} is now synchronized with CRM OS. Incoming interactions will automatically appear on customer timelines.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              onClick={prevStep}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 5 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <span>{step === 4 ? 'Confirm & Connect' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs ml-auto"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationConnectModal;
