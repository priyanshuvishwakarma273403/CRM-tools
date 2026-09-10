import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { WorkflowVisualBuilder } from '../../components/crm/WorkflowVisualBuilder';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';
import { Workflow, Plus, Zap, Play, CheckCircle2 } from 'lucide-react';

/**
 * Visual Workflow Automation Builder & Engine View
 * Implements Section 24 & 25 of the UI Master Prompt
 */
export const WorkflowsPage = () => {
  const [workflows, setWorkflows] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('Lead status becomes Qualified');
  const [condition, setCondition] = useState('Lead score > 80');
  const [action, setAction] = useState('Create Priority Task + AI Outreach Draft + MCP Gmail Dispatch');

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    const data = await api.workflows.getAll();
    setWorkflows(data || []);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.workflows.create({
      name,
      trigger,
      condition,
      actions: [action],
    });
    setIsDrawerOpen(false);
    loadWorkflows();
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Visual Workflow Automation Engine"
        subtitle="Configure event triggers, conditional business rules, generative AI steps, and MCP tool executions."
        breadcrumbs={['CRM OS', 'Automations', 'Workflows']}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Create Workflow
          </Button>
        }
      />

      {/* Flagship Interactive Visual Builder & Execution Trace Viewer (Section 24 & 25) */}
      <WorkflowVisualBuilder
        workflowName="Enterprise Lead Qualification &amp; MCP Outreach Flow"
        triggerName="New Lead Created (Webhook / Inbound)"
        conditionRule="Lead Score &gt; 80 AND Annual Revenue &gt; $500,000"
      />

      {/* Saved Organization Workflow Rules */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Active Tenant Workflow Automation Rules ({workflows.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {wf.name}
                  </strong>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ACTIVE
                </span>
              </div>
              <div className="text-xs text-slate-500 space-y-1 pt-1 font-sans">
                <div>Trigger: <strong className="text-slate-700 dark:text-slate-300">{wf.trigger}</strong></div>
                <div>Condition: <span className="font-mono">{wf.condition}</span></div>
                <div>Action: {Array.isArray(wf.actions) ? wf.actions.join(', ') : wf.actions}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Workflow Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Create Visual Workflow Rule"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Workflow Rule Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. VIP Churn Recovery & Alert"
          />
          <Input label="Trigger Event" value={trigger} onChange={(e) => setTrigger(e.target.value)} />
          <Input label="Condition Logic" value={condition} onChange={(e) => setCondition(e.target.value)} />
          <Input label="Automated Action Pipeline" value={action} onChange={(e) => setAction(e.target.value)} />
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Automation Rule
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default WorkflowsPage;
