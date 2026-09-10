import React, { useState, useEffect } from 'react';
import {
  Bot,
  Search,
  ShieldCheck,
  Wrench,
  BarChart2,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowDown,
  RefreshCw,
} from 'lucide-react';

/**
 * Visual Step-by-Step AI Agent Execution Runner
 * Implements Section 18 of the UI Master Prompt
 */
export const AgentExecutionStepper = ({
  agentName = 'Sales Strategist Agent',
  taskPrompt = 'Find at-risk enterprise renewal opportunities in Q4 and suggest retention proposals',
  onComplete,
}) => {
  const steps = [
    { id: 1, title: 'Agent Started', icon: Bot, duration: '120ms', detail: 'Initialized agent context with tenant ID: org-demo-1' },
    { id: 2, title: 'Understanding Request', icon: Sparkles, duration: '240ms', detail: 'Parsed user intent: CHURN_RISK_ANALYSIS for Q4 pipeline' },
    { id: 3, title: 'Searching CRM Data', icon: Search, duration: '410ms', detail: 'Scanned 142 customer accounts & active deals via PostgreSQL Flyway schema' },
    { id: 4, title: 'Checking Permissions & DLP', icon: ShieldCheck, duration: '95ms', detail: 'Verified RBAC role (SALES_ADMIN). AI Context Firewall redacted PII' },
    { id: 5, title: 'Calling Tool: crm.get_customer_360', icon: Wrench, duration: '310ms', detail: 'Retrieved interaction history and support ticket SLA breaches for Zenith Logistics' },
    { id: 6, title: 'Analyzing Data & Monte Carlo Risk', icon: BarChart2, duration: '520ms', detail: 'Computed churn probability: 42%. Identified 14-day silence window' },
    { id: 7, title: 'Generating Recommendation', icon: Sparkles, duration: '380ms', detail: 'Drafted tailored executive check-in email and 10% renewal SLA credit offer' },
    { id: 8, title: 'Completed & Logged', icon: CheckCircle2, duration: '85ms', detail: 'Action dispatched to Action Approval Center queue (Pending human review)' },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
      if (onComplete) onComplete();
    }
  }, [currentStepIndex, isRunning]);

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsRunning(true);
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card text-left space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ai-50 dark:bg-ai-950/80 text-ai-600 dark:text-ai-400 flex items-center justify-center border border-ai-200 dark:border-ai-900/50">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{agentName}</h3>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isRunning
                    ? 'bg-ai-100 text-ai-700 dark:bg-ai-950 dark:text-ai-300 animate-pulse'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {isRunning ? 'Executing Steps...' : 'Execution Finished'}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 italic">"{taskPrompt}"</p>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Replay Execution"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>Replay</span>
        </button>
      </div>

      {/* Stepper Timeline */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                isCurrent
                  ? 'border-ai-400 bg-ai-50/70 dark:bg-ai-950/40 shadow-xs'
                  : isDone
                  ? 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 opacity-90'
                  : 'border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/30 opacity-40'
              }`}
            >
              {/* Step Icon Badge */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-ai-600 text-white animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-ai-900 dark:text-ai-100'
                        : isDone
                        ? 'text-slate-900 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{step.duration}</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentExecutionStepper;
