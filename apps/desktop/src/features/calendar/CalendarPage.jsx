import React, { useState } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Drawer } from '../../components/ui/Drawer';
import { Input } from '../../components/ui/Input';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Video, User } from 'lucide-react';

export const CalendarPage = () => {
  const [view, setView] = useState('Month');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const events = [
    { id: 1, title: 'Executive Demo with CTO David Kovac', date: '2026-09-05', time: '10:00 AM', type: 'MEETING', related: 'Apex Global' },
    { id: 2, title: 'Follow-up Call with Rachel Green', date: '2026-09-06', time: '02:30 PM', type: 'CALL', related: 'CloudScale' },
    { id: 3, title: 'Technical Architecture Sync with Dr. Thorne', date: '2026-09-08', time: '11:00 AM', type: 'MEETING', related: 'BioGenix' },
    { id: 4, title: 'Q3 Sales Forecast Strategy Review', date: '2026-09-12', time: '04:00 PM', type: 'INTERNAL', related: 'Acme Team' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM Calendar & Meetings"
        subtitle="Schedule client meetings, demos, and synchronize sales follow-up tasks."
        breadcrumbs={['CRM', 'Calendar']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>Schedule Event</Button>}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base">September 2026</span>
          <Button variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {['Day', 'Week', 'Month', 'Agenda'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md ${view === v ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs' : 'text-slate-500'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((evt) => (
          <Card key={evt.id} className="p-4 border-l-4 border-l-brand-600 flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-brand-50 text-brand-700 rounded uppercase">
                {evt.type}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">{evt.title}</h4>
              <p className="text-xs text-slate-500 mt-1">Ref: {evt.related}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> {evt.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {evt.time}</span>
            </div>
          </Card>
        ))}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Schedule Event" size="md">
        <form onSubmit={(e) => { e.preventDefault(); setIsDrawerOpen(false); }} className="space-y-4">
          <Input label="Event Title" required placeholder="Demo Call with Client" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" required defaultValue="2026-09-10" />
            <Input label="Time" type="time" required defaultValue="10:00" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Schedule Event</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
