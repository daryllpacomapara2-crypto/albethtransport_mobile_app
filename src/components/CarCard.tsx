import React from 'react';
import { Car } from '../types/rental';
import { useRental } from '../context/RentalContext';
import { Navigation, Shield, ArrowRight, Zap, Users, Gauge } from 'lucide-react';

interface CarCardProps {
  car: Car;
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({ car, variant = 'light', compact = false }) => {
  const { setSelectedCar, setActiveScreen, setBookingCar, setActiveTab } = useRental();

  const handleOpenDetails = () => {
    setSelectedCar(car);
    setActiveScreen('car-details');
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookingCar(car);
  };

  const handleGpsPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCar(car);
    setActiveTab('gps');
    setActiveScreen('main');
  };

  if (variant === 'dark') {
    return (
      <div
        onClick={handleOpenDetails}
        className="cursor-pointer bg-[#212020] hover:bg-[#282727] text-white p-4 rounded-2xl shadow-lg border border-white/5 transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-neutral-300">
              {car.category}
            </span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-400 text-neutral-950">
              {car.transmission === 'Automatic' ? 'AT' : 'MT'}
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
              {car.seats} Seats
            </span>
            {!car.isAvailable && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ACTIVE
              </span>
            )}
          </div>
          <h4 className="text-base font-bold truncate text-white group-hover:text-amber-400 transition-colors">
            {car.model}
          </h4>
          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1">
              <img src="/car_assets/gps.png" alt="GPS" className="w-3.5 h-3.5 opacity-80" />
              <span>&gt; {car.distance} km</span>
            </div>
            <div className="flex items-center gap-1">
              <img src="/car_assets/pump.png" alt="Fuel" className="w-3.5 h-3.5 opacity-80" />
              <span>{car.fuelCapacity}L</span>
            </div>
            <span className="font-extrabold text-amber-400 font-mono-numbers">₱{car.pricePerHour}/h</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <img
            src={car.image}
            alt={car.model}
            className="w-20 h-14 object-contain rounded-lg group-hover:scale-105 transition-transform"
          />
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleOpenDetails}
      className="cursor-pointer bg-[#F8F9FA] text-neutral-900 rounded-[22px] p-5 shadow-sm hover:shadow-xl border border-neutral-200/90 transition-all duration-300 active:scale-[0.99] group relative overflow-hidden"
    >
      {/* Top Meta Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-900 text-white tracking-wide">
            {car.brand}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
            {car.transmission === 'Automatic' ? 'AT' : 'MT'}
          </span>
          <span className="text-[11px] font-medium text-neutral-600 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {car.seats} Seats
          </span>
        </div>

        {car.isAvailable ? (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ready in Samar
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Active Trip
          </span>
        )}
      </div>

      {/* Main Car Visual */}
      <div className="relative py-2 flex items-center justify-center min-h-[140px] bg-white rounded-2xl border border-neutral-100 p-2">
        <img
          src={car.image}
          alt={car.model}
          className="max-h-[130px] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
        />
        {/* Quick GPS pin overlay button */}
        <button
          onClick={handleGpsPreview}
          title="Track Vehicle GPS in Region 8"
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-neutral-900 hover:text-white text-neutral-700 shadow-sm border border-neutral-200 transition-all"
        >
          <Navigation className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Car Model Title & Specs */}
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg sm:text-xl text-neutral-950 tracking-tight group-hover:text-amber-600 transition-colors">
            {car.model}
          </h3>
          <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
            {car.category}
          </span>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{car.engineType}</p>
      </div>

      {/* Bottom Info Row (Distance, Fuel, PHP Price) */}
      <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Distance with GPS icon */}
          <div className="flex items-center gap-1 text-neutral-700 text-xs font-medium bg-white px-2 py-1 rounded-lg border border-neutral-200">
            <img src="/car_assets/gps.png" alt="GPS" className="w-3.5 h-3.5 object-contain" />
            <span>{car.distance.toFixed(0)} km</span>
          </div>

          {/* Fuel with Pump icon */}
          <div className="flex items-center gap-1 text-neutral-700 text-xs font-medium bg-white px-2 py-1 rounded-lg border border-neutral-200">
            <img src="/car_assets/pump.png" alt="Fuel" className="w-3.5 h-3.5 object-contain" />
            <span>{car.fuelCapacity.toFixed(0)}L</span>
          </div>
        </div>

        {/* Price in PHP (₱) & Book Button */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-base font-black text-neutral-950 font-mono-numbers leading-tight">
              ₱{car.pricePerDay.toLocaleString()}
              <span className="text-[11px] font-normal text-neutral-500">/day</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-semibold">
              ₱{car.pricePerHour}/hr standard
            </div>
          </div>

          <button
            onClick={handleBookNow}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${
              car.isAvailable
                ? 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95'
                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {car.isAvailable ? 'Book Unit' : 'View'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const MoreCard: React.FC<{ car: Car; label?: string }> = ({ car, label }) => {
  const { setSelectedCar, setActiveScreen } = useRental();

  return (
    <div
      onClick={() => {
        setSelectedCar(car);
        setActiveScreen('car-details');
      }}
      className="cursor-pointer bg-[#212020] hover:bg-[#292828] text-white p-3 rounded-[18px] shadow-lg border border-white/5 transition-all duration-200 flex items-center justify-between gap-3 active:scale-[0.99] group"
    >
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
            {car.model}
          </span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-neutral-950">
            {car.transmission === 'Automatic' ? 'AT' : 'MT'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-neutral-400" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{car.fuelCapacity}L</span>
          </div>
          <span className="font-extrabold text-amber-400 font-mono-numbers">₱{car.pricePerDay.toLocaleString()}/day</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <img src={car.image} alt={car.model} className="w-14 h-10 object-contain rounded" />
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
