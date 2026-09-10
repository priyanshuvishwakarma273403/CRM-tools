import React, { useState } from 'react';
import {
  Workflow,
  Zap,
  Filter,
  CheckSquare,
  Bell,
  Sparkles,
  Mail,
  ArrowDown,
  Play,
  RotateCcw,
  Bug,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sliders,
} from 'lucide-react';

/**
 * Visual Workflow Builder & Execution Viewer
 * Implements Section 24 & 25 of the UI Master Prompt
 */
export const WorkflowVisualBuilder = ({
  workflowName = 'Enterprise High-Score Lead Conversion Flow',
  triggerName = 'New Lead Created',
  conditionRule = 'Lead Score > 80 AND Annual Revenue > $500K',
}) => {
  const [activeTab, setActiveTab] = useState('BUILDER'); // 'BUILDER' or 'EXECUTION'
  const [executionRunning, setExecutionRunning] = useState(false);
  const [currentExecutionStep, setCurrentExecutionStep] = useState(0);

  const workflowSteps = [
    {
      id: 'step-1',
      stage: 'WHEN (TRIGGER)',
      title: 'New Lead Created',
      icon: Zap,
      color: 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
      description: 'Triggered when a lead record enters the CRM via Webhook or API',
      input: '{ event: "lead.created", leadId: "lead-4812", source: "Inbound Web" }',
      output: '{ leadName: "Marcus Vance", company: "BioGenix Labs", score: 88 }',
      duration: '18ms',
    },
    {
      id: 'step-2',
      stage: 'IF (CONDITION)',
      title: 'Lead Score > 80',
      icon: Filter,
      color: 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
      description: 'Evaluates computed score & company revenue threshold',
      input: '{ score: 88, threshold: 80, annualRevenue: 1200000 }',
      output: '{ conditionMet: true, priorityClass: "TIER_1" }',
      duration: '24ms',
    },
    {
      id: 'step-3',
      stage: 'THEN (ACTION)',
      title: 'Create Task for Account Executive',
      icon: CheckSquare,
      color: 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
      description: 'Creates priority outreach task assigned to rep Elena Rostova',
      input: '{ assignedTo: "rep-elena", dueInHours: 4, priority: "URGENT" }',
      output: '{ taskId: "tsk-9912", status: "PENDING" }',
      duration: '42ms',
    },
    {
      id: 'step-4',
      stage: 'AND (NOTIFY)',
      title: 'Notify Sales Manager via Slack',
      icon: Bell,
      color: 'border-purple-400 bg-purple-50/50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
      description: 'Dispatches real-time notification to #sales-enterprise channel',
      input: '{ channel: "#sales-enterprise", leadScore: 88 }',
      output: '{ delivered: true, timestamp: "2026-09-05T10:15:00Z" }',
      duration: '65ms',
    },
    {
      id: 'step-5',
      stage: 'AI (COPILOT)',
      title: 'Generate Personalized Outreach Draft',
      icon: Sparkles,
      color: 'border-ai-400 bg-ai-50/50 dark:bg-ai-950/30 text-ai-600 dark:text-ai-400',
      description: 'Domain agent drafts custom intro email referencing recent company funding',
      input: '{ persona: "CTO", companyFocus: "Genomics Pipeline", tone: "Executive" }',
      output: '{ subject: "Accelerating BioGenix Genomics Pipeline", tokenCost: "$0.003" }',
      duration: '380ms',
    },
    {
      id: 'step-6',
      stage: 'MCP (GATEWAY)',
      title: 'Dispatch Email via Google Workspace MCP',
      icon: Mail,
      color: 'border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400',
      description: 'Invokes external MCP tool: mcp.gmail.send_email with audit logging',
      input: '{ recipient: "marcus@biogenix.com", auditId: "mcp-audit-771" }',
      output: '{ messageId: "msg-gmail-8812", status: "DELIVERED" }',
      duration: '190ms',
    },
  ];

  const handleRunExecution = () => {
    setActiveTab('EXECUTION');
    setExecutionRunning(true);
    setCurrentExecutionStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < workflowSteps.length) {
        setCurrentExecutionStep(step);
      } else {
        clearInterval(interval);
        setExecutionRunning(false);
      }
    }, 450);
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card text-left space-y-5">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{workflowName}</h3>
            <span className="text-xs text-slate-400">Trigger: {triggerName} • Condition: {conditionRule}</span>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('BUILDER')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'BUILDER' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Visual Flow
            </button>
            <button
              onClick={() => setActiveTab('EXECUTION')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'EXECUTION' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Live Execution Trace
            </button>
          </div>

          <button
            onClick={handleRunExecution}
            disabled={executionRunning}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${executionRunning ? 'animate-spin' : ''}`} />
            <span>{executionRunning ? 'Testing Flow...' : 'Test & Run'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Visual Workflow Node Flow */}
      {activeTab === 'BUILDER' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                        {step.stage}
                      </span>
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${step.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{step.description}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Node #{idx + 1}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Execution Trace View (Section 25: Trigger -> Condition -> Action -> AI -> MCP -> Result) */}
      {activeTab === 'EXECUTION' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>Total Execution Duration: <strong className="font-mono">719ms</strong></span>
              <span className="text-slate-400">•</span>
              <span>Trace ID: <strong className="font-mono">trc-wf-4091a</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunExecution}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Replay
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {workflowSteps.map((step, idx) => {
              const isFinished = idx <= currentExecutionStep;
              const isCurrent = idx === currentExecutionStep && executionRunning;

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 shadow-xs'
                      : isFinished
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      : 'border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/30 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{step.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{step.duration}</span>
                  </div>

                  {/* Input / Output Inspection */}
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 overflow-x-auto">
                      <span className="text-slate-400 block mb-0.5">Input:</span>
                      <code>{step.input}</code>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 overflow-x-auto">
                      <span className="text-emerald-600 dark:text-emerald-400 block mb-0.5">Output:</span>
                      <code>{step.output}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowVisualBuilder;
