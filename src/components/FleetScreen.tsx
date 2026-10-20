import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { CarCard } from './CarCard';
import { Search, SlidersHorizontal, MapPin, Sparkles, Navigation, ShieldCheck, Compass, Info, Download, Smartphone } from 'lucide-react';

export const FleetScreen: React.FC = () => {
  const { cars, activeReservation, setActiveTab, setSelectedCar, setActiveScreen, setIsInstallModalOpen } = useRental();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'seats'>('featured');

  const categories = ['All', 'Subcompact Sedan', 'Crossover SUV', 'Utility MPV', 'Commercial Van'];

  const filteredCars = cars
    .filter(car => {
      const matchesSearch = 
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.engineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.transmission.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'seats') return b.seats - a.seats;
      return 0;
    });

  return (
    <div className="flex flex-col h-full bg-white text-neutral-900 overflow-y-auto pb-24">
      {/* Top Header matching Flutter AppBar (title: 'Choose Your Car') */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/car_assets/albeth_logo_transparent.png" alt="ALBETH Logo" className="h-9 sm:h-10 w-auto object-contain" />
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>San Sebastian, Samar • Region 8</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-neutral-950">
              ALBETH TRANSPORT (Cars for any occasions)
            </h1>
          </div>
        </div>

        {/* Live GPS quick jump badge */}
        <button
          onClick={() => {
            setActiveTab('gps');
            setActiveScreen('main');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 text-white text-xs font-bold shadow hover:bg-neutral-800 transition-all active:scale-95 shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Region 8 GPS</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Office Location & Region 8 Operating Scope Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 shadow-sm">
          <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-extrabold text-amber-900 flex items-center gap-1">
              <span>ALBETH TRANSPORT (Cars for any occasions)</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-bold">HQ</span>
            </div>
            <p className="text-neutral-700 mt-0.5 leading-relaxed">
              Main Business Office @ <strong>San Sebastian, Samar</strong>. We operate exclusively within <strong>Region 8 (Eastern Visayas)</strong> — Samar, Northern Samar, Eastern Samar, Leyte, Southern Leyte & Biliran (Any point return).
            </p>
          </div>
        </div>

        {/* Mobile .APK & Offline-Sync Banner */}
        <div 
          onClick={() => setIsInstallModalOpen(true)}
          className="cursor-pointer p-3.5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-950 text-white border border-amber-400/30 shadow-md flex items-center justify-between gap-3 group active:scale-[0.99] transition-all hover:border-amber-400"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wide">Mobile Installer (.APK)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">Auto-Sync</span>
              </div>
              <p className="text-[11px] text-neutral-300 truncate">
                Download direct Android app installer (v1.0) with offline queue & real-time telemetry
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="px-3 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-black text-xs shrink-0 group-hover:bg-amber-300 transition-colors shadow"
          >
            Download
          </button>
        </div>

        {/* Active Rental Alert Bar if user currently has an active car */}
        {activeReservation && (
          <div
            onClick={() => {
              setActiveTab('reservations');
              setActiveScreen('main');
            }}
            className="cursor-pointer p-3.5 rounded-2xl bg-neutral-950 text-white shadow-lg border border-amber-400/40 flex items-center justify-between gap-3 group active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-amber-400 truncate">
                  Active Booking: {activeReservation.car.model}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">
                  Live GPS tracking active in Samar/Leyte • Tap to return
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-400 text-neutral-950 shrink-0">
              Manage &gt;
            </span>
          </div>
        )}

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Mirage G4, EcoSport, Tamaraw GL, L300..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-100 border border-neutral-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
          />
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Count Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span className="font-semibold text-neutral-700">
            {filteredCars.length} Region 8 {filteredCars.length === 1 ? 'unit' : 'units'} listed
          </span>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3 text-neutral-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-neutral-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="featured">Recommended Units</option>
              <option value="price-low">Rate: Low to High (₱)</option>
              <option value="price-high">Rate: High to Low (₱)</option>
              <option value="seats">Most Seats (Capacity)</option>
            </select>
          </div>
        </div>

        {/* Fleet Units List (Mirage G4, EcoSport, Tamaraw GL, L300 FB) */}
        <div className="space-y-4">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} variant="light" />
          ))}

          {filteredCars.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="font-bold text-neutral-600">No units match your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs font-bold text-amber-600 underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* ALBETH TRANSPORT Transparent Brand Footer */}
        <div className="pt-8 pb-4 flex flex-col items-center justify-center text-center">
          <img
            src="/car_assets/albeth_logo_transparent.png"
            alt="ALBETH TRANSPORT (Cars for any occasions)"
            className="h-14 sm:h-16 w-auto object-contain hover:scale-105 transition-transform"
          />
          <p className="text-xs font-black text-neutral-900 mt-2">
            ALBETH TRANSPORT (Cars for any occasions)
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Head Office: San Sebastian, Samar • Operating in Region 8 (Any Point)
          </p>
        </div>
      </div>
    </div>
  );
};
