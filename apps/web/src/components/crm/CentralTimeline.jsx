import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  Sparkles,
  CheckSquare,
  Briefcase,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ExplainBadge } from './ExplainBadge';

/**
 * Multi-Channel Central Customer Timeline
 * Implements Section 10 of the UI Master Prompt
 */
export const CentralTimeline = () => {
  const [filter, setFilter] = useState('ALL');

  const timelineEvents = [
    {
      id: 'tl-1',
      time: 'Tomorrow, 09:00 AM',
      type: 'AI_PREDICTION',
      title: 'AI recommends proposal follow-up',
      description: 'Model detected 48hr window since executive reviewed proposal. Advise checking on legal signoff.',
      icon: Sparkles,
      color: 'bg-ai-500 text-white',
      badge: 'PROACTIVE AI',
      hasExplain: true,
      explainReasons: [
        { type: 'positive', text: 'Proposal document accessed twice by VP Rachel Green' },
        { type: 'positive', text: 'Previous follow-up was 3 days ago' },
        { type: 'negative', text: 'Competitor mentioned in recent communication' },
      ],
    },
    {
      id: 'tl-2',
      time: 'Today, 15:20',
      type: 'MEETING',
      title: 'Meeting scheduled: Architecture Review',
      description: 'Rachel Green accepted Google Calendar invite for 45-min Zoom technical sync with Solutions Architect.',
      icon: Calendar,
      color: 'bg-purple-500 text-white',
      badge: 'CALENDAR SYNC',
    },
    {
      id: 'tl-3',
      time: 'Today, 13:00',
      type: 'TASK',
      title: 'Salesperson created follow-up',
      description: 'Alex assigned task to draft custom enterprise SLA annex for Acme Global Technologies legal team.',
      icon: CheckSquare,
      color: 'bg-emerald-500 text-white',
      badge: 'MANUAL ACTION',
    },
    {
      id: 'tl-4',
      time: 'Today, 11:10',
      type: 'AI_INTENT',
      title: 'AI detected strong buying intent',
      description: 'NLP intent analysis scored customer email with 92% purchase probability based on contract queries.',
      icon: Sparkles,
      color: 'bg-ai-600 text-white',
      badge: 'NLP CLASSIFIER',
      hasExplain: true,
      explainReasons: [
        { type: 'positive', text: 'Email asked for volume pricing tier for 500+ seats' },
        { type: 'positive', text: 'Customer timeline specified Q4 kickoff' },
      ],
    },
    {
      id: 'tl-5',
      time: 'Today, 09:42',
      type: 'EMAIL',
      title: 'Email received from Rachel Green (VP Engineering)',
      description: '"We reviewed the revised pricing table with our CFO. Can you confirm if the SOC2 Type II report is ready for audit?"',
      icon: Mail,
      color: 'bg-blue-500 text-white',
      badge: 'GMAIL WORKSPACE',
    },
  ];

  const filteredEvents = timelineEvents.filter((e) => {
    if (filter === 'ALL') return true;
    if (filter === 'AI') return e.type.startsWith('AI');
    if (filter === 'COMMS') return e.type === 'EMAIL' || e.type === 'MEETING';
    if (filter === 'TASKS') return e.type === 'TASK';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Omnichannel Relationship Timeline
          </h3>
          <p className="text-xs text-slate-500">
            Real-time chronological log of emails, meetings, salesperson actions, and AI intent detections.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {['ALL', 'AI', 'COMMS', 'TASKS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === tab
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Thread */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filteredEvents.map((event) => {
          const Icon = event.icon;

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Dot Node */}
              <div
                className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white dark:ring-slate-900 ${event.color}`}
              >
                <Icon className="w-3 h-3" />
              </div>

              {/* Event Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-sans">
                      {event.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {event.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {event.description}
                </p>

                {/* Explain Badge for AI events */}
                {event.hasExplain && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 italic">
                      Automated inference by Sales AI Agent
                    </span>
                    <ExplainBadge
                      title={event.title}
                      subject="Acme Global Technologies"
                      confidence={0.92}
                      reasons={event.explainReasons}
                      dataSources={['Gmail Sync', 'Calendar Sync', 'CRM Deal History']}
                      buttonLabel="Why did AI flag this?"
                      size="xs"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CentralTimeline;
