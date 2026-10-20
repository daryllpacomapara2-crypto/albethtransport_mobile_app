import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { 
  User, 
  Wallet, 
  ShieldCheck, 
  PhoneCall, 
  CreditCard, 
  MapPin, 
  Award, 
  Key, 
  HelpCircle, 
  LogOut, 
  Check, 
  ChevronRight,
  ExternalLink,
  Building2,
  Download,
  Smartphone,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';


export const ProfileScreen: React.FC = () => {
  const { currentUser, reservations, setActiveScreen, logoutClient } = useRental();
  const [showTopUpToast, setShowTopUpToast] = useState(false);
  const { isOnline, isSyncing, syncNow, lastSyncedAt } = useOnlineStatus();

  const handleTopUp = () => {
    currentUser.walletBalance += 5000;
    setShowTopUpToast(true);
    setTimeout(() => setShowTopUpToast(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#17171A] text-white overflow-y-auto pb-28">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-b from-[#24242B] to-[#17171A] border-b border-white/5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#17171A]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{currentUser.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 uppercase">
                MEMBER
              </span>
            </div>
            <p className="text-xs text-neutral-400">{currentUser.email}</p>
            <p className="text-xs text-amber-300 font-mono">{currentUser.phone}</p>
          </div>
        </div>

        {/* Member Tier Card in PHP */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-black/40 to-neutral-900 border border-amber-400/30 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{currentUser.membershipTier}</span>
            </div>
            <div className="text-2xl font-black text-white font-mono-numbers">
              ₱{currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-neutral-400">
              Region 8 Rental Balance • {currentUser.points} ALBETH Reward Points
            </div>
          </div>

          <button
            onClick={handleTopUp}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            + Top Up ₱5,000
          </button>
        </div>

        {showTopUpToast && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold text-center animate-fadeIn">
            ✓ Added ₱5,000.00 to ALBETH Client Balance!
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Business Office & Operating Scope */}
        <div className="p-4 rounded-2xl bg-[#202025] border border-amber-400/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>ALBETH TRANSPORT Headquarters</span>
            </div>
            <div className="bg-transparent flex items-center">
              <img src="/car_assets/albeth_logo_transparent.png" alt="ALBETH" className="h-5 w-auto object-contain filter drop-shadow-[0_1px_4px_rgba(255,255,255,0.6)]" />
            </div>
          </div>
          <div className="text-xs text-neutral-200">
            <strong>Business Office:</strong> San Sebastian, Samar, Region 8, Eastern Visayas
          </div>
          <div className="text-[11px] text-amber-300 font-bold">
            ALBETH TRANSPORT (Cars for any occasions)
          </div>
          <div className="text-[11px] text-neutral-400 leading-relaxed">
            Authorized car rental operations across all points of <strong>Region 8 (Eastern Visayas)</strong> including Samar, Northern Samar, Eastern Samar, Leyte, Southern Leyte, and Biliran.
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-4 rounded-2xl bg-[#202025] border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Philippine Driver License:</span>
            <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              {currentUser.driverLicense}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Registered Municipality:</span>
            <span className="font-semibold text-white">{currentUser.address}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Total Completed Rentals:</span>
            <span className="font-bold text-amber-400 font-mono-numbers">
              {currentUser.totalTrips + reservations.filter(r => r.status === 'completed').length} Trips in Region 8
            </span>
          </div>
        </div>

        {/* Mobile App (.APK) & Real-Time Online Sync Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#252530] to-[#1C1C24] border border-amber-500/30 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mobile App & Auto-Sync</h3>
                <p className="text-[11px] text-neutral-400">Android .APK installer & PWA offline cache</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Synced Online
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Offline Mode
                </span>
              )}
            </div>
          </div>

          <p className="text-[11px] text-neutral-300 leading-relaxed">
            Whenever connected online, ALBETH TRANSPORT automatically updates fleet availability, syncs reservations, and refreshes app code seamlessly in the background without needing manual reinstallations.
          </p>

          <div className="flex items-center gap-2 pt-0.5">
            <a
              href="/downloads/ALBETH_TRANSPORT_v1.0.apk"
              download="ALBETH_TRANSPORT_v1.0.apk"
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download .APK (v1.0.0 • 5.6 MB)</span>
            </a>

            <button
              onClick={syncNow}
              disabled={isSyncing || !isOnline}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors disabled:opacity-50"
              title="Force sync with San Sebastian Central Hub"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* 24/7 Roadside Assistance Card */}

        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/15 to-neutral-900 border border-red-500/30 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>24/7 Samar-Leyte Roadside Assistance</span>
          </div>
          <p className="text-xs text-neutral-300">
            Rapid response for fuel drops, tire change, mechanical dispatch, and GPS assistance across all provincial routes in Region 8.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href="tel:+639178824011"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-red-600/80 hover:bg-red-500 px-3 py-2 rounded-xl transition-colors shadow"
            >
              <span>Smart / Globe: +63 917 882 4011</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Settings Links */}
        <div className="space-y-1 rounded-2xl bg-[#202025] border border-white/5 overflow-hidden">
          {[
            { icon: CreditCard, label: 'Payment Options (GCash / Maya / Card)', sub: 'Philippine Peso (₱) Accepted' },
            { icon: Key, label: 'Digital Mobile Key Permissions', sub: 'Active for Assigned Units' },
            { icon: MapPin, label: 'Main Return Hub', sub: 'San Sebastian, Samar (HQ Terminal)' },
            { icon: HelpCircle, label: 'Region 8 Rental Terms & Conditions', sub: 'Self-Drive & Chauffeur Rules' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-400">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-neutral-400">{item.sub}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>
          ))}
        </div>

        {/* Logout / Switch Account */}
        <div className="pt-2">
          <button
            onClick={logoutClient}
            className="w-full py-3 rounded-2xl bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-300 text-xs font-bold flex items-center justify-center gap-2 border border-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account / Back to Onboarding Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
