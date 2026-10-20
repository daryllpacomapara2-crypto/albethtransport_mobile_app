import React, { useState, useEffect } from 'react';
import { useRental } from '../context/RentalContext';
import { 
  Car, 
  Navigation, 
  CalendarClock, 
  User, 
  Smartphone, 
  Maximize2, 
  Wifi, 
  WifiOff,
  BatteryMedium,
  Radio,
  Download
} from 'lucide-react';
import { AppTab } from '../types/rental';
import { InstallModal } from './InstallModal';
import { OfflineIndicator } from './OfflineIndicator';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { 
    activeTab, 
    setActiveTab, 
    activeScreen, 
    setActiveScreen, 
    viewDeviceFrame, 
    setViewDeviceFrame,
    activeReservation,
    systemAlert,
    setSystemAlert,
    isInstallModalOpen,
    setIsInstallModalOpen
  } = useRental();

  const [currentTime, setCurrentTime] = useState('09:41');
  const { isOnline } = useOnlineStatus();

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // Clear system alert toast after 3.5s
  useEffect(() => {
    if (systemAlert) {
      const t = setTimeout(() => setSystemAlert(null), 3500);
      return () => clearTimeout(t);
    }
  }, [systemAlert]);

  const navItems: { tab: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'fleet', label: 'Fleet', icon: Car },
    { tab: 'gps', label: 'GPS Return', icon: Navigation },
    { tab: 'reservations', label: 'My Bookings', icon: CalendarClock },
    { tab: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0D0D10] flex flex-col items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Top Floating Control Toolbar for Desktop Viewers */}
      <header className="w-full max-w-md mx-auto mb-3 px-4 py-2 hidden md:flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2.5">
          <div className="bg-transparent flex items-center justify-center">
            <img src="/car_assets/albeth_logo_transparent.png" alt="ALBETH" className="h-7 w-auto object-contain filter drop-shadow-[0_1px_6px_rgba(255,255,255,0.6)]" />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-neutral-100 block text-xs">ALBETH TRANSPORT</span>
            <span className="text-[10px] text-amber-400 font-semibold block">(Cars for any occasions)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 border border-amber-500/40 text-amber-300 font-semibold transition-all shadow-sm"
            title="Download .APK Installer or Install App"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.APK / Install</span>
          </button>

          <button
            onClick={() => setViewDeviceFrame(!viewDeviceFrame)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 font-semibold transition-colors"
          >
            {viewDeviceFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Screen</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Device Enclosure */}
      <div
        className={`relative w-full overflow-hidden transition-all duration-300 flex flex-col ${
          viewDeviceFrame
            ? 'max-w-[420px] h-[100dvh] md:h-[860px] md:max-h-[92vh] md:rounded-[48px] md:border-[10px] md:border-[#27272F] md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] bg-[#17171A]'
            : 'max-w-2xl h-[100dvh] md:h-[90vh] md:rounded-3xl border border-white/10 bg-[#17171A]'
        }`}
      >
        {/* Dynamic Island / Mobile Status Bar */}
        <div className="shrink-0 h-11 px-6 bg-transparent flex items-center justify-between text-white text-xs font-semibold select-none z-50">
          <span className="font-mono">{currentTime}</span>

          {/* Dynamic Island Center Pill */}
          <div className="w-24 h-5 bg-black rounded-full border border-white/10 flex items-center justify-center gap-1.5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700" />
            {activeReservation && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center gap-1 hover:opacity-80 transition"
              title={isOnline ? "Online: Auto-Syncing with San Sebastian Hub" : "Offline: Cached Data"}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
            <Radio className="w-3.5 h-3.5 text-amber-400 opacity-90" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Global Toast Notification */}
        {systemAlert && (
          <div className="absolute top-12 left-4 right-4 z-[3000] p-3 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-amber-400/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="truncate">{systemAlert}</span>
          </div>
        )}


        {/* Active Screen Area */}
        <main className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
          {children}
        </main>

        {/* Bottom Mobile Navigation Bar (Only visible when inside main app screens) */}
        {activeScreen === 'main' && (
          <nav aria-label="Main Navigation" className="shrink-0 h-20 bg-neutral-950/95 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-around z-40 select-none pb-2">
            {navItems.map(item => {
              const isActive = activeTab === item.tab;
              const Icon = item.icon;
              const hasBadge = item.tab === 'reservations' && activeReservation !== null;

              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                    isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    {hasBadge && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-neutral-950 animate-pulse" />
                    )}
                  </div>
                  <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Home Indicator line */}
        <div className="shrink-0 h-4 bg-transparent flex items-center justify-center pb-1">
          <div className="w-32 h-1 bg-white/20 rounded-full" />
        </div>

        {/* In-App Mobile APK & PWA Install Modal */}
        <InstallModal 
          isOpen={isInstallModalOpen} 
          onClose={() => setIsInstallModalOpen(false)} 
        />

        {/* Global Offline/Online Connectivity & Auto-Sync Indicator */}
        <OfflineIndicator />
      </div>
    </div>
  );
};

