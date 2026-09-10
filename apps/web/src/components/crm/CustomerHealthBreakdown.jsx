import React, { useState } from 'react';
import { HeartPulse, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

/**
 * Customer Health Score Component with Contextual "Why?" Breakdown
 * Implements Section 3 & 71 of UI Master Prompt
 */
export const CustomerHealthBreakdown = ({
  score = 72,
  tier = 'Healthy',
  factors = [
    { text: 'High engagement across executive stakeholders', points: '+15', type: 'positive' },
    { text: 'Recent contract renewal purchase completed', points: '+20', type: 'positive' },
    { text: 'Active bi-weekly communication rhythm', points: '+10', type: 'positive' },
    { text: 'One unresolved Tier-2 technical support ticket', points: '−8', type: 'negative' },
  ],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (s) => {
    if (s >= 80) return { badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', ring: 'text-emerald-500' };
    if (s >= 60) return { badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', ring: 'text-blue-500' };
    if (s >= 40) return { badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', ring: 'text-amber-500' };
    return { badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', ring: 'text-rose-500' };
  };

  const style = getStatusColor(score);

  return (
    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Customer Health Score
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {score}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${style.badge}`}>
              {tier}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          <span>Why?</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Health Analysis Breakdown */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-slide-up">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Factor Influence</span>
            <span>Impact</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {factors.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-2">
                  {f.type === 'positive' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{f.text}</span>
                </div>
                <span
                  className={`font-mono text-xs font-black ${
                    f.type === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {f.points}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right">
            <span className="text-[11px] text-slate-400 italic">Calculated in real-time from event stream telemetry</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHealthBreakdown;
