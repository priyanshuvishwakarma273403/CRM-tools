import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Drawer } from '../../components/ui/Drawer';
import { api } from '../../services/api';
import { Workflow, Plus, Zap, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export const WorkflowsPage = () => {
  const [workflows, setWorkflows] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('Lead status becomes Qualified');
  const [condition, setCondition] = useState('Lead score > 70');
  const [action, setAction] = useState('Create Task + Send Notification');

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    const data = await api.workflows.getAll();
    setWorkflows(data);
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
    <div className="space-y-6">
      <PageHeader
        title="Workflow Automation Engine"
        subtitle="Configure event triggers, conditional logic rules, and automated tenant actions."
        breadcrumbs={['CRM', 'Workflows']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>Create Workflow Rule</Button>}
      />

      <div className="space-y-4">
        {workflows.map((wf) => (
          <Card key={wf.id} className="p-5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{wf.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">Executed {wf.runsCount} times</span>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full border border-emerald-200">
                ACTIVE
              </span>
            </div>

            {/* Visual Node Execution Pipeline */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase text-brand-600 dark:text-brand-400">1. TRIGGER</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{wf.trigger}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">2. CONDITION</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{wf.condition}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400">3. AUTOMATED ACTIONS</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {Array.isArray(wf.actions) ? wf.actions.join(', ') : wf.actions}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create Workflow Automation Rule" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Workflow Rule Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. High Lead Score Task Creator" />
          <Input label="Trigger Event" value={trigger} onChange={(e) => setTrigger(e.target.value)} />
          <Input label="Condition Logic" value={condition} onChange={(e) => setCondition(e.target.value)} />
          <Input label="Automated Action" value={action} onChange={(e) => setAction(e.target.value)} />
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Automation</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
