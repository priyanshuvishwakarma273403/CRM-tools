import React, { useState, useEffect } from 'react';
import { Sparkles, User, Wifi, WifiOff, RefreshCw } from 'lucide-react';

/**
 * Real-time Subtle Event Badge
 * Implements Section 55 of the UI Master Prompt
 */
export const RealtimeUpdateBadge = ({
  message = 'Deal updated by Rahul just now',
  visibleDuration = 4000,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), visibleDuration);
    return () => clearTimeout(timer);
  }, [visibleDuration]);

  if (!show) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-medium shadow-elevated backdrop-blur-xs animate-fade-in border border-slate-700/80">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>{message}</span>
    </div>
  );
};

/**
 * Offline Sync State Bar
 * Implements Section 56 of the UI Master Prompt
 */
export const OfflineSyncBar = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Simulate automatic sync
      setTimeout(() => setPendingChanges(0), 1500);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setPendingChanges(3);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingChanges === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="px-4 py-2 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-command flex items-center gap-3 text-xs font-semibold">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Offline Mode — Changes will sync automatically</span>
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px]">
              {pendingChanges} queued
            </span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
            <span>Connection restored — Synchronized {pendingChanges || 3} changes ✓</span>
          </>
        )}
      </div>
    </div>
  );
};

export default RealtimeUpdateBadge;
