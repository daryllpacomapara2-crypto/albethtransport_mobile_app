import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { Car } from '../types/rental';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  Compass, 
  Sparkles,
  CreditCard
} from 'lucide-react';

interface BookingModalDialogProps {
  car: Car;
}

const BookingModalDialog: React.FC<BookingModalDialogProps> = ({ car: bookingCar }) => {
  const { 
    setBookingCar, 
    returnStations, 
    bookCar, 
    currentUser, 
    setActiveTab, 
    setActiveScreen 
  } = useRental();

  // Initial default dates (tomorrow noon to next day noon)
  const now = new Date();
  const defaultPickup = new Date(now.getTime() + 2 * 3600 * 1000).toISOString().slice(0, 16);
  const defaultReturn = new Date(now.getTime() + 26 * 3600 * 1000).toISOString().slice(0, 16);

  const [pickupDateTime, setPickupDateTime] = useState<string>(defaultPickup);
  const [returnDateTime, setReturnDateTime] = useState<string>(defaultReturn);
  const [pickupStationId, setPickupStationId] = useState<string>(returnStations[0].id);
  const [returnStationId, setReturnStationId] = useState<string>(returnStations[0].id);
  const [insuranceTier, setInsuranceTier] = useState<'standard' | 'premium' | 'zero_deductible'>('premium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['addon-gps', 'addon-roadside']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate rental duration in hours
  const pDate = new Date(pickupDateTime).getTime();
  const rDate = new Date(returnDateTime).getTime();
  const diffHours = Math.max(1, Math.round((rDate - pDate) / (1000 * 3600)));
  const isDaily = diffHours >= 24;
  const days = Math.ceil(diffHours / 24);

  // Pricing calculations
  const carBasePrice = isDaily 
    ? days * bookingCar.pricePerDay 
    : diffHours * bookingCar.pricePerHour;

  const insuranceFees = {
    standard: 0,
    premium: isDaily ? days * 250 : Math.ceil(diffHours * 25),
    zero_deductible: isDaily ? days * 450 : Math.ceil(diffHours * 45)
  };

  const insuranceCost = insuranceFees[insuranceTier];

  const availableAddons = [
    { id: 'addon-gps', name: 'Integrated GPS Return Telemetry (Region 8)', price: 150, icon: '🛰️' },
    { id: 'addon-roadside', name: '24/7 Samar-Leyte Roadside Assistance', price: 120, icon: '🛡️' },
    { id: 'addon-driver', name: 'Authorized Co-Driver', price: 200, icon: '👤' },
    { id: 'addon-seat', name: 'ISOFIX Child Safety Seat', price: 150, icon: '👶' }
  ];

  const addonsCost = selectedAddons.reduce((sum, id) => {
    const item = availableAddons.find(a => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const totalCost = carBasePrice + insuranceCost + addonsCost;

  const handleToggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleConfirmReservation = async () => {
    try {
      setIsSubmitting(true);
      const chosenAddons = availableAddons
        .filter(a => selectedAddons.includes(a.id))
        .map(a => ({ id: a.id, name: a.name, price: a.price }));

      await bookCar({
        carId: bookingCar.id,
        pickupStationId,
        returnStationId,
        pickupDateTime: new Date(pickupDateTime).toISOString(),
        returnDateTime: new Date(returnDateTime).toISOString(),
        totalHours: diffHours,
        rateType: isDaily ? 'daily' : 'hourly',
        subtotal: carBasePrice,
        insuranceTier,
        insuranceFee: insuranceCost,
        addOns: chosenAddons,
        totalPrice: totalCost
      });

      // Switch to reservations tab so user immediately sees their active reservation!
      setActiveTab('reservations');
      setActiveScreen('main');
    } catch (err: any) {
      alert(err.message || 'Failed to complete reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#1F1F24] border border-white/10 rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col overflow-hidden text-white shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#19191D]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Book {bookingCar.model}</h3>
              <p className="text-[11px] text-neutral-400">Region 8 Operations • Office: San Sebastian, Samar</p>
            </div>
          </div>
          <button
            onClick={() => setBookingCar(null)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Car Summary Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <img
                src={bookingCar.image}
                alt={bookingCar.model}
                className="w-16 h-12 object-contain rounded drop-shadow"
              />
              <div>
                <h4 className="font-bold text-sm text-white">{bookingCar.model}</h4>
                <p className="text-xs text-neutral-400">
                  {bookingCar.transmission === 'Automatic' ? 'AT' : 'MT'} • {bookingCar.seats} Seats • {bookingCar.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400">Standard Rate:</span>
              <div className="font-extrabold text-amber-400 text-sm font-mono-numbers">
                ₱{bookingCar.pricePerDay.toLocaleString()}/day
              </div>
              <span className="text-[10px] text-neutral-400">₱{bookingCar.pricePerHour}/hr</span>
            </div>
          </div>

          {/* Schedule Pickers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Rental Schedule
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pickup Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  value={pickupDateTime}
                  onChange={e => setPickupDateTime(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Return Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  value={returnDateTime}
                  onChange={e => setReturnDateTime(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="text-xs text-amber-300/90 font-medium px-1 flex items-center justify-between">
              <span>Estimated Duration: {diffHours} hours ({days} {days === 1 ? 'day' : 'days'})</span>
              <span className="text-neutral-400 font-mono">Billed at {isDaily ? 'daily' : 'hourly'} rate</span>
            </div>
          </div>

          {/* Stations / Return Hub Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Terminal Locations
            </h4>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-400">Pickup Station</label>
                <select
                  value={pickupStationId}
                  onChange={e => setPickupStationId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-1 focus:ring-amber-400"
                >
                  {returnStations.map(station => (
                    <option key={station.id} value={station.id} className="bg-neutral-900 text-white">
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-400">
                  Designated GPS Return Station
                </label>
                <select
                  value={returnStationId}
                  onChange={e => setReturnStationId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-1 focus:ring-amber-400"
                >
                  {returnStations.map(station => (
                    <option key={station.id} value={station.id} className="bg-neutral-900 text-white">
                      {station.name} (GPS Geofence Return Active)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Insurance Protection Tiers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Protection Package
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', name: 'Standard', sub: '₱5,000 Deductible', price: 0 },
                { id: 'premium', name: 'Premium', sub: '₱2,000 Deductible', price: insuranceFees.premium },
                { id: 'zero_deductible', name: 'Zero Risk', sub: '₱0 Deductible', price: insuranceFees.zero_deductible }
              ].map(tier => {
                const isSelected = insuranceTier === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setInsuranceTier(tier.id as any)}
                    className={`cursor-pointer p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-white shadow-sm'
                        : 'bg-white/5 border-white/5 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{tier.name}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{tier.sub}</div>
                    <div className="text-xs font-extrabold text-amber-400 mt-1">
                      {tier.price === 0 ? 'Included' : `+₱${tier.price.toLocaleString()}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Mobility Add-ons
            </h4>
            <div className="space-y-1.5">
              {availableAddons.map(addon => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon.id)}
                    className={`cursor-pointer p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-white/10 border-amber-400/50 text-white'
                        : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{addon.icon}</span>
                      <span className="text-xs font-medium text-neutral-200">{addon.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400">+₱{addon.price}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-amber-400 border-amber-400 text-neutral-950' : 'border-neutral-500'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparent Itemized Total in PHP */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Vehicle Rental ({diffHours} hrs)</span>
              <span className="text-white font-mono">₱{carBasePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {insuranceCost > 0 && (
              <div className="flex justify-between text-neutral-400">
                <span>Protection Package</span>
                <span className="text-white font-mono">₱{insuranceCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {addonsCost > 0 && (
              <div className="flex justify-between text-neutral-400">
                <span>Selected Add-ons</span>
                <span className="text-white font-mono">₱{addonsCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
              <span className="font-bold text-white">Estimated Total (PHP)</span>
              <span className="text-xl font-black text-amber-400 font-mono-numbers">
                ₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Confirm Button */}
        <div className="p-4 border-t border-white/10 bg-[#19191D] flex items-center gap-3">
          <div className="hidden sm:block text-xs text-neutral-400">
            <div>Client: <span className="text-neutral-200 font-semibold">{currentUser.name}</span></div>
            <div className="text-[10px] text-amber-400">Region 8 Digital Key & GPS Dispatch</div>
          </div>

          <button
            onClick={handleConfirmReservation}
            disabled={isSubmitting}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-neutral-950 font-bold text-sm shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Key className="w-4 h-4" />
            <span>{isSubmitting ? 'Confirming with ALBETH...' : `Confirm & Book (₱${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const BookingModal: React.FC = () => {
  const { bookingCar } = useRental();
  if (!bookingCar) return null;
  return <BookingModalDialog car={bookingCar} />;
};

