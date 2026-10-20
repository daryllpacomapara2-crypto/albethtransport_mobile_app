import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, isSyncing, syncNow } = useOnlineStatus();
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowReconnectedToast(true);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (showReconnectedToast) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-emerald-600/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-emerald-400/30 animate-bounce">
        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
        <span>Connected to ALBETH Central Hub — Fleet data synced!</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-blue-600/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-white shadow-xl border border-blue-400/30">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Syncing fleet & reservations online...</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-neutral-950 shadow-2xl border border-amber-300/40">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-950"></span>
        </span>
        <WifiOff className="w-4 h-4 text-neutral-950" />
        <span>Offline Mode — Changes will auto-sync when online</span>
        <button
          onClick={syncNow}
          className="ml-1 px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-[10px] font-bold uppercase transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
};
