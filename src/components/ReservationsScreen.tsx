import React, { useState, useEffect } from 'react';
import { useRental } from '../context/RentalContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Power, 
  Navigation, 
  CheckCircle2, 
  RotateCcw, 
  PlusCircle, 
  FileText, 
  ArrowRight,
  AlertCircle,
  Car as CarIcon
} from 'lucide-react';
import { Reservation } from '../types/rental';

export const ReservationsScreen: React.FC = () => {
  const { 
    reservations, 
    activeReservation, 
    cars, 
    toggleCarLock, 
    toggleCarEngine, 
    extendReservation, 
    cancelReservation, 
    setReturnModalReservation, 
    setSelectedCar, 
    setActiveTab,
    setActiveScreen 
  } = useRental();

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [extendHours, setExtendHours] = useState<number>(3);
  const [showExtendDialogForId, setShowExtendDialogForId] = useState<string | null>(null);

  // Live countdown timer for active reservation
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');

  useEffect(() => {
    if (!activeReservation) {
      setTimeLeftStr('');
      return;
    }

    const updateTimer = () => {
      const returnTime = new Date(activeReservation.returnDateTime).getTime();
      const now = Date.now();
      const diff = returnTime - now;

      if (diff <= 0) {
        setTimeLeftStr('Return Overdue / Due Now');
      } else {
        const hours = Math.floor(diff / (1000 * 3600));
        const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeftStr(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeReservation]);

  const filteredReservations = reservations.filter(r => {
    if (filter === 'active') return r.status === 'active';
    if (filter === 'completed') return r.status === 'completed';
    return true;
  });

  const handleTrackCar = (reservation: Reservation) => {
    const car = cars.find(c => c.id === reservation.carId) || reservation.car;
    setSelectedCar(car);
    setActiveTab('gps');
    setActiveScreen('main');
  };

  return (
    <div className="flex flex-col h-full bg-[#17171A] text-white overflow-y-auto pb-24">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-white/5 bg-[#17171A]/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
            ALBETH TRANSPORT
          </span>
          <h2 className="text-xl font-extrabold text-white">Manage Reservations</h2>
        </div>

        <button
          onClick={() => {
            setActiveTab('fleet');
            setActiveScreen('main');
          }}
          className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400 text-neutral-950 hover:bg-amber-300 transition-colors"
        >
          + Book Another
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          {(['all', 'active', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all capitalize ${
                filter === tab
                  ? 'bg-white text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Bookings' : tab}
            </button>
          ))}
        </div>

        {/* Highlighted Active Reservation Card */}
        {activeReservation && (filter === 'all' || filter === 'active') && (
          <div className="relative rounded-[26px] p-5 bg-gradient-to-br from-[#24242B] to-[#1C1C22] border-2 border-amber-400/40 shadow-2xl overflow-hidden space-y-4">
            {/* Ambient amber glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Status */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  Active Rental In Progress
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                {activeReservation.bookingCode}
              </span>
            </div>

            {/* Car visual + Model info */}
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div>
                <h3 className="text-xl font-black text-white">{activeReservation.car.model}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Plate: <span className="text-neutral-200 font-mono font-semibold">{activeReservation.car.plateNumber}</span>
                </p>
                <div className="mt-2 text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Countdown: {timeLeftStr}</span>
                </div>
              </div>

              <img
                src={activeReservation.car.image}
                alt={activeReservation.car.model}
                className="w-28 sm:w-32 h-16 object-contain drop-shadow-xl"
              />
            </div>

            {/* Pickup & Return Station Route summary */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs relative z-10">
              <div className="flex items-center gap-2 text-neutral-300">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-neutral-400">Pickup:</span>
                <span className="font-semibold text-white truncate">{activeReservation.pickupStationName}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-neutral-400">Return Bay:</span>
                <span className="font-semibold text-white truncate">{activeReservation.returnStationName}</span>
              </div>
            </div>

            {/* Live Remote Controls for active car */}
            <div className="grid grid-cols-2 gap-2 relative z-10">
              <button
                onClick={() => toggleCarLock(activeReservation.carId)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-neutral-200 flex items-center justify-center gap-1.5 transition-all"
              >
                {activeReservation.car.currentGps.isLocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Doors Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Doors Unlocked</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleCarEngine(activeReservation.carId)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-neutral-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <Power className={`w-3.5 h-3.5 ${activeReservation.car.currentGps.engineOn ? 'text-emerald-400' : 'text-neutral-400'}`} />
                <span>{activeReservation.car.currentGps.engineOn ? 'Engine Running' : 'Engine Off'}</span>
              </button>
            </div>

            {/* Key Action Buttons: Track GPS / Return / Extend */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1 relative z-10">
              <button
                onClick={() => handleTrackCar(activeReservation)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Live GPS Map</span>
              </button>

              <button
                onClick={() => setReturnModalReservation(activeReservation)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Return Vehicle Now</span>
              </button>

              <button
                onClick={() => setShowExtendDialogForId(showExtendDialogForId === activeReservation.id ? null : activeReservation.id)}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Extend</span>
              </button>
            </div>

            {/* Inline Extend Rental Expansion Drawer */}
            {showExtendDialogForId === activeReservation.id && (
              <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-400/30 space-y-3 animate-fadeIn relative z-10 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Extend Rental Duration</span>
                  <span className="text-amber-400 font-semibold font-mono-numbers">+₱{(extendHours * activeReservation.car.pricePerHour).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 4, 12, 24].map(h => (
                    <button
                      key={h}
                      onClick={() => setExtendHours(h)}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        extendHours === h
                          ? 'bg-amber-400 text-neutral-950'
                          : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                      }`}
                    >
                      +{h}h
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    extendReservation(activeReservation.id, extendHours);
                    setShowExtendDialogForId(null);
                  }}
                  className="w-full py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold shadow"
                >
                  Confirm +{extendHours} Hours Extension
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty state if no bookings in filter */}
        {filteredReservations.length === 0 && (
          <div className="text-center py-12 space-y-3 bg-white/5 rounded-3xl p-6 border border-white/5">
            <CarIcon className="w-12 h-12 mx-auto text-neutral-500" />
            <h4 className="text-base font-bold text-neutral-300">No Reservations Found</h4>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              You do not have any {filter !== 'all' ? filter : ''} rentals yet. Explore our luxury fleet to book in real-time.
            </p>
            <button
              onClick={() => {
                setActiveTab('fleet');
                setActiveScreen('main');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs shadow-md mt-2"
            >
              Browse Fleet
            </button>
          </div>
        )}

        {/* List of Other / Completed / Past Reservations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Booking History & Receipts
          </h4>

          {filteredReservations
            .filter(r => r.status !== 'active' || filter === 'all')
            .map(res => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-[#202025] border border-white/5 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      res.status === 'completed'
                        ? 'bg-neutral-400'
                        : res.status === 'active'
                        ? 'bg-emerald-400'
                        : 'bg-red-400'
                    }`} />
                    <span className="text-xs font-bold uppercase text-neutral-300">
                      {res.status === 'completed' ? 'Completed & Returned' : res.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{res.bookingCode}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-base text-white">{res.car.model}</h4>
                    <p className="text-xs text-neutral-400">
                      {new Date(res.pickupDateTime).toLocaleDateString()} • {res.totalHours} hrs
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-amber-400 font-mono-numbers">
                      ₱{res.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[10px] text-neutral-400">Paid in Full</span>
                  </div>
                </div>

                {/* Return inspection badge if available */}
                {res.returnInspection && (
                  <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>GPS Return Verified at {res.returnStationName}</span>
                    </div>
                    <div className="text-[11px] text-neutral-300 font-mono flex items-center justify-between">
                      <span>Verified GPS Dist: {res.returnInspection.verifiedGpsDistanceMeters}m</span>
                      <span>Final Odo: {res.returnInspection.finalOdometerKm} km</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
