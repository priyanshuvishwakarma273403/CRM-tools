import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { api } from '../../services/api';
import { Plus, CheckSquare, Clock, Calendar, AlertTriangle, CheckCircle2, User } from 'lucide-react';

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '2026-09-10T15:00',
    priority: 'HIGH',
    status: 'TODO',
    assigneeName: 'Marcus Chen',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await api.tasks.getAll();
    setTasks(data);
  };

  const handleToggle = async (id) => {
    await api.tasks.toggleStatus(id);
    loadTasks();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.tasks.create(formData);
    setIsDrawerOpen(false);
    loadTasks();
  };

  const tabs = ['ALL', 'TODAY', 'UPCOMING', 'OVERDUE', 'COMPLETED'];

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'TODAY') return t.dueDate.includes('2026-09-04') || t.priority === 'URGENT';
    if (activeTab === 'COMPLETED') return t.status === 'COMPLETED';
    if (activeTab === 'OVERDUE') return t.priority === 'URGENT' && t.status !== 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & Follow-ups"
        subtitle="Manage assigned action items, client follow-ups, and sales deliverables."
        breadcrumbs={['CRM', 'Tasks']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>Create Task</Button>}
      />

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === tab ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <Card key={t.id} className="flex items-start justify-between gap-4 p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={t.status === 'COMPLETED'}
                onChange={() => handleToggle(t.id)}
                className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <div>
                <h4 className={`text-sm font-bold ${t.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {t.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-500" /> {new Date(t.dueDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {t.assigneeName || 'Marcus Chen'}</span>
                  {t.relatedName && <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Ref: {t.relatedName}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase ${
                t.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' : t.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {t.priority}
              </span>
              <StatusBadge status={t.status} />
            </div>
          </Card>
        ))}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create Task" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Task Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-lg p-2.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Due Date & Time" type="datetime-local" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-slate-600">Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-200 text-sm rounded-lg p-2">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Task</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
