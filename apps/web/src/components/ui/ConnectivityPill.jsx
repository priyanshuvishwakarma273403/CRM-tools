import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

export const ConnectivityPill = () => {
  const [status, setStatus] = useState('online'); // online, offline, syncing, error

  useEffect(() => {
    const handleOnline = () => setStatus('online');
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const config = {
    online: {
      label: 'ONLINE',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-500',
      icon: Wifi,
    },
    offline: {
      label: 'OFFLINE (SQLite Caching)',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      dot: 'bg-amber-500 animate-ping',
      icon: WifiOff,
    },
    syncing: {
      label: 'SYNCING...',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      dot: 'bg-indigo-500 animate-spin',
      icon: RefreshCw,
    },
    error: {
      label: 'SYNC ERROR',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500',
      icon: AlertTriangle,
    },
  };

  const current = config[status] || config.online;
  const IconComponent = current.icon;

  return (
    <div
      className={`flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${current.color}`}
      title={status === 'offline' ? 'Changes saved locally to SQLite queue. Will auto-sync when online.' : 'Connected to Nexus API'}
    >
      <span className={`w-2 h-2 rounded-full ${current.dot}`} />
      <span className="tracking-wider">{current.label}</span>
    </div>
  );
};
