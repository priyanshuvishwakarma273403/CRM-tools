import React from 'react';
import { Drawer } from '../ui/Drawer';
import { useTenantStore } from '../../store/useTenantStore';
import { INITIAL_NOTIFICATIONS } from '../../services/seedData';
import { Bell, CheckCheck, UserPlus, ArrowRightLeft, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';

export const NotificationDrawer = () => {
  const { isNotificationDrawerOpen, setNotificationDrawerOpen } = useTenantStore();

  const getIcon = (type) => {
    switch (type) {
      case 'LEAD_ASSIGNED':
        return <UserPlus className="w-4 h-4 text-brand-600" />;
      case 'DEAL_STAGE_CHANGE':
        return <ArrowRightLeft className="w-4 h-4 text-amber-600" />;
      case 'PAYMENT_RECEIVED':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <Drawer
      isOpen={isNotificationDrawerOpen}
      onClose={() => setNotificationDrawerOpen(false)}
      title="Tenant & Sales Notifications"
      size="md"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase text-slate-500">
          Real-time Activity Stream
        </span>
        <Button variant="ghost" size="sm" leftIcon={<CheckCheck className="w-4 h-4" />}>
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {INITIAL_NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-xl border transition-all ${
              notif.isRead
                ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-900 border-brand-200 dark:border-brand-900 shadow-subtle'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{notif.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};
