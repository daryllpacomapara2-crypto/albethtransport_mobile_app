import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Sparkles,
  Share2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { isOnline, lastSyncedAt, isSyncing, syncNow, pendingOfflineActionsCount } = useOnlineStatus();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/downloads/ALBETH_TRANSPORT_v1.0.apk';
    link.download = 'ALBETH_TRANSPORT_v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 4000);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#18181D] border border-white/10 rounded-3xl p-6 text-neutral-100 shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-blue-600/20 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-inner">
              <img 
                src="/car_assets/albeth_logo_transparent.png" 
                alt="ALBETH TRANSPORT" 
                className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(255,255,255,0.7)]" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">Install Mobile App</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                ALBETH TRANSPORT (Cars for any occasions)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Online & Auto-Sync Engine Status Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#22222A] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-4 h-4" />
                  <span>Online & Auto-Syncing</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline Mode (Cached Fleet)</span>
                </div>
              )}
            </div>

            <button
              onClick={syncNow}
              disabled={isSyncing || !isOnline}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {isOnline
              ? `Connected to ALBETH Central Hub @ San Sebastian, Samar. All fleet status, reservations, and rates sync automatically whenever online.`
              : `Operating offline. You can browse all 4 fleet units, view vehicle specs, and draft reservations. They will sync automatically when back online.`}
          </p>

          {lastSyncedAt && (
            <p className="text-[10px] text-neutral-500">
              Last synced: {lastSyncedAt.toLocaleTimeString()}
              {pendingOfflineActionsCount > 0 && ` • ${pendingOfflineActionsCount} offline action(s) queued`}
            </p>
          )}
        </div>

        {/* Option 1: Native Android .APK Installer */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-b from-[#25252F] to-[#1C1C24] border border-amber-500/30 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Android Option</span>
              </div>
              <h3 className="text-sm font-bold text-white">Download Standalone .APK Installer</h3>
              <p className="text-xs text-neutral-400">
                Direct Android Application Package (.apk) with embedded offline storage and real-time auto-sync.
              </p>
            </div>
            <span className="px-2 py-1 rounded-lg bg-amber-400/10 text-amber-300 text-xs font-mono font-bold">
              5.6 MB
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
            <div className="flex items-center gap-1.5 bg-black/30 p-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Signed & Safe Package</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 p-2 rounded-xl">
              <Layers className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Auto-Syncs Online</span>
            </div>
          </div>

          <button
            onClick={handleDownloadApk}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            {downloadStarted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Downloading ALBETH_TRANSPORT_v1.0.apk...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download .APK Installer (v1.0.0)</span>
              </>
            )}
          </button>
          
          <p className="text-[10px] text-neutral-400 text-center">
            Compatible with Android 7.0+ (Nougat through Android 15). Enable "Install unknown apps" if prompted.
          </p>
        </div>

        {/* Option 2: Install as Progressive Web App (PWA) / One-Tap */}
        <div className="mt-3 p-4 rounded-2xl bg-[#22222A] border border-white/5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>One-Tap Mobile Installation (PWA)</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Install directly to your home screen with zero file management and instant auto-updates.
              </p>
            </div>
          </div>

          {isInstalled ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Already installed in standalone mode on this device!</span>
            </div>
          ) : isInstallable ? (
            <button
              onClick={install}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Add to Home Screen (Instant Install)</span>
            </button>
          ) : isIOS ? (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-neutral-300 space-y-1">
              <p className="font-semibold text-blue-300">How to install on iPhone & iPad (Safari):</p>
              <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-neutral-300">
                <li>Tap the <strong>Share</strong> icon (box with upward arrow) in the Safari toolbar.</li>
                <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top-right corner.</li>
              </ol>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Automatic sync enabled on home screen</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied!' : 'Share / Copy Link'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
          <span>ALBETH TRANSPORT • Region 8, Philippines</span>
          <span>Head Office: San Sebastian, Samar</span>
        </div>
      </div>
    </div>
  );
};
