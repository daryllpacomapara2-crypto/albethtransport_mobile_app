import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  MapPin, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  X,
  LogIn,
  UserPlus,
  Download
} from 'lucide-react';


export const OnboardingScreen: React.FC = () => {
  const { setActiveScreen, setActiveTab, loginClient, registerClient, currentUser } = useRental();
  const [authMode, setAuthMode] = useState<'presentation' | 'login' | 'register'>('presentation');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('maria.santos@email.ph');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+63 ');
  const [regEmail, setRegEmail] = useState('');
  const [regLicense, setRegLicense] = useState('');
  const [regAddress, setRegAddress] = useState('San Sebastian, Samar');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartDirect = () => {
    setActiveScreen('main');
    setActiveTab('fleet');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoginLoading(true);
    try {
      await loginClient(loginIdentifier, loginPassword);
      setActiveScreen('main');
      setActiveTab('fleet');
    } catch (err: any) {
      setErrorMsg('Login failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 8) {
      setErrorMsg('Please provide a valid Philippine mobile number');
      return;
    }
    if (!regLicense.trim()) {
      setErrorMsg("Please enter your Philippine Driver's License number");
      return;
    }

    setRegLoading(true);
    try {
      await registerClient({
        name: regName,
        phone: regPhone,
        email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '')}@client.ph`,
        driverLicense: regLicense,
        address: regAddress
      });
      setActiveScreen('main');
      setActiveTab('fleet');
    } catch (err: any) {
      setErrorMsg('Registration failed. Please check your details.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#18181D] text-white overflow-hidden select-none">
      {/* Top Graphic Area with Mitsubishi Mirage G4 image and cinematic gradient */}
      <div className="relative flex-[1.4] w-full min-h-[300px] overflow-hidden bg-neutral-950">
        <img
          src="/car_assets/mirage_g4_onboard.jpg"
          alt="ALBETH Mitsubishi Mirage G4"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Subtle cinematic gradient vignette matching Flutter onboarding */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181D] via-black/40 to-black/60" />

        {/* Brand & Business Office Location Badge */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-neutral-100">
              ALBETH TRANSPORT
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-300 bg-black/60 backdrop-blur-md border border-amber-400/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>San Sebastian, Samar</span>
          </span>
        </div>

        {/* Region 8 Exclusive Operation Notice */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-semibold">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Region 8, Philippines (Any Point Coverage)</span>
          </div>

          <span className="text-[10px] text-neutral-300 bg-white/10 px-2 py-0.5 rounded-full hidden sm:inline-block">
            Standard Rates in PHP (₱)
          </span>
        </div>
      </div>

      {/* Bottom Content Area: Presentation OR Login Portal OR Register Portal */}
      <div className="relative flex-1 flex flex-col justify-between p-5 sm:p-6 bg-[#18181D] z-10 overflow-y-auto">
        {authMode === 'presentation' && (
          <div className="h-full flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ALBETH TRANSPORT (Cars for any occasions)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                ALBETH TRANSPORT <br />
                <span className="text-amber-400">(Cars for any occasions)</span>
              </h1>

              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-sm">
                Self-drive & chauffeur rentals across Region 8 (Any Point) with real-time GPS return tracking.
              </p>
            </div>

            {/* Portal Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAuthMode('login')}
                  className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>Client Login</span>
                </button>

                <button
                  onClick={() => setAuthMode('register')}
                  className="py-3 px-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Create Account</span>
                </button>
              </div>

              <button
                onClick={handleStartDirect}
                className="group w-full h-12 bg-white hover:bg-neutral-100 active:scale-[0.98] text-neutral-950 font-extrabold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Explore Fleet & Standard Rates</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="/downloads/ALBETH_TRANSPORT_v1.0.apk"
                download="ALBETH_TRANSPORT_v1.0.apk"
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 border border-amber-500/30 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Android .APK Installer (v1.0.0 • 5.6 MB)</span>
              </a>

              <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 pt-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LTO Verified</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>San Sebastian Hub</span>
                </div>
                <span>•</span>
                <span>Rates in PHP (₱)</span>
              </div>

              {/* ALBETH TRANSPORT Official Transparent Logo at the bottom */}
              <div className="pt-2 pb-1 flex flex-col items-center justify-center">
                <div className="bg-transparent flex items-center justify-center hover:scale-105 transition-transform">
                  <img
                    src="/car_assets/albeth_logo_transparent.png"
                    alt="ALBETH TRANSPORT (Cars for any occasions)"
                    className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.75)]"
                  />
                </div>
                <p className="text-xs font-extrabold text-amber-400 mt-1 tracking-wide text-center">
                  ALBETH TRANSPORT (Cars for any occasions)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Client Login Portal */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="h-full flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Client Login</h3>
                  <p className="text-xs text-neutral-400">Access your ALBETH bookings & GPS keys</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('presentation')}
                  className="p-1.5 rounded-full bg-white/10 text-neutral-300 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    Email or Philippine Mobile (+63)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. 0917XXXXXXX or client@email.ph"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Demo auto-fill option */}
              <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-300 flex items-center justify-between">
                <span>Quick VIP Demo: Maria Santos (Samar)</span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('maria.santos@email.ph');
                    setLoginPassword('password123');
                  }}
                  className="font-bold underline text-white"
                >
                  Auto-fill
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{loginLoading ? 'Signing in...' : 'Sign In to ALBETH'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="hover:text-white"
                >
                  New Client? <span className="text-amber-400 font-bold underline">Create Account</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartDirect}
                  className="hover:text-neutral-200"
                >
                  Browse as Guest &gt;
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Client Registration Portal */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="h-full flex flex-col justify-between space-y-2.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Create Client Account</h3>
                  <p className="text-[11px] text-neutral-400">Rent vehicles across Region 8 (Any Point)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('presentation')}
                  className="p-1.5 rounded-full bg-white/10 text-neutral-300 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-300">Client Full Name *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-300">Philippine Mobile *</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-300">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="client@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-300">LTO Driver License *</label>
                  <input
                    type="text"
                    value={regLicense}
                    onChange={e => setRegLicense(e.target.value)}
                    placeholder="e.g. N01-20-XXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-300">Municipality / City (Region 8)</label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={e => setRegAddress(e.target.value)}
                  placeholder="e.g. San Sebastian, Samar / Catbalogan / Tacloban"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <p className="text-[10px] text-neutral-400 leading-tight">
                By creating an account, you agree to ALBETH TRANSPORT rental policies for Region 8, Eastern Visayas.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{regLoading ? 'Registering Account...' : 'Complete Client Registration'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="hover:text-white"
                >
                  Already registered? <span className="text-amber-400 font-bold underline">Login</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartDirect}
                  className="hover:text-neutral-200"
                >
                  Browse as Guest &gt;
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
