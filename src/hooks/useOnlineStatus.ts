import { useState, useEffect, useCallback } from 'react';

export interface OnlineStatusInfo {
  isOnline: boolean;
  lastSyncedAt: Date | null;
  isSyncing: boolean;
  syncNow: () => Promise<void>;
  pendingOfflineActionsCount: number;
}

export function useOnlineStatus(): OnlineStatusInfo {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(() => new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingOfflineActionsCount, setPendingOfflineActionsCount] = useState<number>(0);

  const performSync = useCallback(async () => {
    if (!navigator.onLine) {
      return;
    }
    setIsSyncing(true);
    try {
      // Check service worker updates if available
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update().catch(() => {});
        }
      }
      
      // Sync local storage state and cached offline bookings
      const offlineQueue = localStorage.getItem('albeth_offline_reservations');
      if (offlineQueue) {
        const queue = JSON.parse(offlineQueue);
        if (Array.isArray(queue) && queue.length > 0) {
          // Process offline queue into active reservations
          const existing = localStorage.getItem('albeth_reservations');
          const currentList = existing ? JSON.parse(existing) : [];
          const merged = [...queue, ...currentList];
          localStorage.setItem('albeth_reservations', JSON.stringify(merged));
          localStorage.removeItem('albeth_offline_reservations');
          setPendingOfflineActionsCount(0);
        }
      }

      // Small network delay simulation to demonstrate responsive live sync
      await new Promise(r => setTimeout(r, 600));
      setLastSyncedAt(new Date());
    } catch {
      // Graceful offline fallback
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      performSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for offline actions
    const offlineQueue = localStorage.getItem('albeth_offline_reservations');
    if (offlineQueue) {
      try {
        const q = JSON.parse(offlineQueue);
        setPendingOfflineActionsCount(Array.isArray(q) ? q.length : 0);
      } catch {
        setPendingOfflineActionsCount(0);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [performSync]);

  return {
    isOnline,
    lastSyncedAt,
    isSyncing,
    syncNow: performSync,
    pendingOfflineActionsCount
  };
}
