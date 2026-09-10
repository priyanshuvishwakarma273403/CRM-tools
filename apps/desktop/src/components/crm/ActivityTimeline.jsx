import React from 'react';
import { Phone, Mail, Calendar, FileText, ArrowRightLeft, MessageSquare } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export const ActivityTimeline = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'CALL':
        return <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'MEETING':
        return <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'NOTE':
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'STATUS_CHANGE':
        return <ArrowRightLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((act, idx) => (
          <li key={act.id || idx}>
            <div className="relative pb-8">
              {idx !== activities.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ring-8 ring-white dark:ring-slate-900 border border-slate-200 dark:border-slate-700">
                    {getIcon(act.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-card">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{act.title}</p>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(act.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Avatar name={act.performedBy || 'Marcus Chen'} size="sm" />
                    <span className="text-xs font-semibold text-slate-500">{act.performedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
