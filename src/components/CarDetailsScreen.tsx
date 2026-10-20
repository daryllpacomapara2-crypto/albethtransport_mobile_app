import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { CarCard, MoreCard } from './CarCard';
import { 
  ArrowLeft, 
  Info, 
  MapPin, 
  ShieldCheck, 
  Gauge, 
  Fuel, 
  Calendar, 
  Key, 
  CheckCircle2, 
  Share2,
  Navigation,
  Compass,
  Users
} from 'lucide-react';
import { Car } from '../types/rental';

export const CarDetailsScreen: React.FC = () => {
  const { 
    selectedCar, 
    setSelectedCar, 
    setActiveScreen, 
    currentUser, 
    cars, 
    setBookingCar,
    setActiveTab 
  } = useRental();

  const [mapScale, setMapScale] = useState(false);

  const currentCar = selectedCar || cars[0];

  // Generate more car recommendations like in original Flutter code (Car-1, Car-2, Car-3)
  const alternateCars: Car[] = cars
    .filter(c => c.id !== currentCar.id)
    .slice(0, 3);

  const handleOpenGpsMap = () => {
    setActiveTab('gps');
    setActiveScreen('main');
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1E] text-white overflow-y-auto pb-24">
      {/* Header bar matching Flutter AppBar */}
      <div className="sticky top-0 z-20 bg-[#1A1A1E]/90 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('main')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 font-bold text-base text-neutral-100">
          <Info className="w-4 h-4 text-amber-400" />
          <span>Vehicle Specifications</span>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${currentCar.model} - ALBETH TRANSPORT Samar`,
                text: `Rent ${currentCar.model} in Region 8, Eastern Visayas!`
              }).catch(() => {});
            }
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Top Car Card */}
        <div>
          <CarCard car={currentCar} variant="light" />
        </div>

        {/* User Card + Interactive Map Card (Recreates Flutter Row in card_details_page.dart) */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Driver / VIP Card */}
          <div className="bg-[#242429] p-4 rounded-[22px] border border-white/5 shadow-md flex flex-col items-center justify-center text-center">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400/50 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#242429]" />
            </div>
            <div className="mt-2.5">
              <h4 className="font-bold text-sm text-neutral-100">{currentUser.name}</h4>
              <p className="text-xs text-amber-400 font-extrabold font-mono-numbers">
                ₱{currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-neutral-400 mt-0.5 inline-block">Client Wallet Balance</span>
            </div>
          </div>

          {/* Interactive Map Thumbnail with Zoom Animation (Recreates Flutter maps.png card) */}
          <div
            onClick={handleOpenGpsMap}
            onMouseEnter={() => setMapScale(true)}
            onMouseLeave={() => setMapScale(false)}
            className="group cursor-pointer relative h-full min-h-[140px] rounded-[22px] overflow-hidden border border-white/10 shadow-md bg-neutral-900"
          >
            <img
              src="/car_assets/maps.png"
              alt="Live GPS Return Map"
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                mapScale ? 'scale-125' : 'scale-100'
              }`}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Live GPS badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/30 text-[10px] font-semibold text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>San Sebastian Hub</span>
            </div>

            {/* Bottom info banner */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="truncate">Region 8 GPS Return</span>
                </p>
                <p className="text-[10px] text-neutral-300">Tap for Return Navigation</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Navigation className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Key Specifications HUD */}
        <div className="bg-[#242429] p-4 rounded-[22px] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Precise Unit Specifications
            </h4>
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md font-mono">
              Plate: {currentCar.plateNumber}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <Users className="w-5 h-5 mx-auto text-amber-400 mb-1" />
              <div className="text-xs font-bold text-neutral-100">{currentCar.seats} Passenger</div>
              <div className="text-[10px] text-neutral-400">Capacity</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <Gauge className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <div className="text-xs font-bold text-neutral-100">
                {currentCar.transmission === 'Automatic' ? 'Automatic (AT)' : 'Manual (MT)'}
              </div>
              <div className="text-[10px] text-neutral-400">Transmission</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <Fuel className="w-5 h-5 mx-auto text-blue-400 mb-1" />
              <div className="text-xs font-bold text-neutral-100">{currentCar.fuelCapacity} Liters</div>
              <div className="text-[10px] text-neutral-400">Fuel Tank</div>
            </div>
          </div>

          {/* Engine & Type specs */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-400">Vehicle Type:</span>
              <span className="text-white font-bold">{currentCar.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Engine / Powertrain:</span>
              <span className="text-amber-300 font-medium">{currentCar.engineType}</span>
            </div>
          </div>

          {/* Features pills */}
          <div className="pt-1">
            <div className="text-xs text-neutral-400 mb-2">Included Unit Equipment:</div>
            <div className="flex flex-wrap gap-1.5">
              {currentCar.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 text-neutral-300 border border-white/5 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live GPS Telemetry Status for Return */}
        <div className="bg-gradient-to-r from-amber-500/10 via-neutral-900 to-black p-4 rounded-[22px] border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Region 8 GPS Telemetry Verified</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {currentCar.currentGps.lat.toFixed(4)}, {currentCar.currentGps.lng.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-neutral-300">
            Current location: <span className="text-white font-medium">{currentCar.currentGps.address}</span>.
            Vehicle is equipped with automatic GPS drop-off return verification at San Sebastian, Samar HQ & any point in Region 8.
          </p>
        </div>

        {/* More Fleet Recommendations */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-200">Other Available Units</h4>
            <span className="text-xs text-neutral-400">Samar & Leyte Fleet</span>
          </div>
          <div className="space-y-2">
            {alternateCars.map((altCar, index) => (
              <MoreCard
                key={altCar.id}
                car={altCar}
                label={`Option #${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Booking Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#1A1A1E]/95 backdrop-blur-lg border-t border-white/10 z-30 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-400 font-medium">Standard Daily Rate</div>
          <div className="text-xl font-black text-white flex items-baseline gap-1 font-mono-numbers">
            ₱{currentCar.pricePerDay.toLocaleString()}
            <span className="text-xs font-normal text-neutral-400">/day</span>
            <span className="text-xs font-semibold text-amber-400 ml-1.5">(₱{currentCar.pricePerHour}/hr)</span>
          </div>
        </div>

        <button
          onClick={() => setBookingCar(currentCar)}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
            currentCar.isAvailable
              ? 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-neutral-950 shadow-amber-400/20'
              : 'bg-neutral-800 text-neutral-400 border border-white/10 hover:bg-neutral-700'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>{currentCar.isAvailable ? 'Book This Unit' : 'View Reservation'}</span>
        </button>
      </div>
    </div>
  );
};
