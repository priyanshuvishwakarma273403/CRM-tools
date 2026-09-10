import React, { useState } from 'react';
import { HelpCircle, Sparkles, Database, CheckCircle2, AlertTriangle, ArrowUpRight, X } from 'lucide-react';

/**
 * Contextual "Explain This" Component
 * Implements Section 3, 16, 65, 70: Product Education & AI Transparency
 */
export const ExplainBadge = ({
  title = 'AI Recommendation',
  subject = 'Follow up with Acme Corp',
  confidence = 0.89,
  reasons = [
    { type: 'positive', text: '3 recent customer emails exchanged this week' },
    { type: 'positive', text: '1 executive discovery meeting scheduled' },
    { type: 'positive', text: 'Proposal document opened twice in 48 hours' },
    { type: 'negative', text: 'No response for 4 days on contract terms' },
  ],
  dataSources = ['CRM Core', 'Gmail Workspace', 'Google Calendar', 'Analytics BI'],
  recommendedAction = 'Send targeted follow-up addressing budget validation question',
  buttonLabel = 'Explain',
  size = 'sm',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`inline-flex items-center gap-1 font-semibold rounded-lg transition-all duration-150 border ${
          size === 'xs'
            ? 'px-2 py-0.5 text-[10px] bg-ai-50 dark:bg-ai-950/60 text-ai-700 dark:text-ai-300 border-ai-200 dark:border-ai-900 hover:bg-ai-100'
            : 'px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        title="View explainability evidence"
      >
        <Sparkles className="w-3 h-3 text-ai-600 dark:text-ai-400" />
        <span>{buttonLabel}</span>
      </button>

      {/* Slide-over Explainability Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-command text-left space-y-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ai-50 dark:bg-ai-950/80 text-ai-600 dark:text-ai-400 flex items-center justify-center border border-ai-200 dark:border-ai-900/50">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{subject}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Confidence Metric */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Model Confidence & Evidence Weight
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-ai-600 dark:bg-ai-400 rounded-full"
                    style={{ width: `${Math.round(confidence * 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black text-ai-700 dark:text-ai-300 font-mono">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Why? Factor Drivers Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Why? Factor Breakdown
              </h4>
              <ul className="space-y-2 text-xs">
                {reasons.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80"
                  >
                    {r.type === 'positive' ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                        +
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                        −
                      </span>
                    )}
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{r.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transparent Data Sources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Audited Data Sources
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {dataSources.map((source, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700"
                  >
                    <Database className="w-3 h-3 text-slate-400" />
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Next Action */}
            {recommendedAction && (
              <div className="p-3.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50">
                <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider block mb-1">
                  Recommended Next Action
                </span>
                <p className="text-xs text-brand-900 dark:text-brand-100 font-medium">
                  {recommendedAction}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExplainBadge;
