import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { Reservation } from '../types/rental';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  Fuel, 
  FileCheck, 
  Camera, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ReturnCarModalDialogProps {
  reservation: Reservation;
}

const ReturnCarModalDialog: React.FC<ReturnCarModalDialogProps> = ({ reservation: returnModalReservation }) => {
  const { 
    setReturnModalReservation, 
    returnStations, 
    cars, 
    returnCar, 
    calculateDistanceKm, 
    teleportCarToStation 
  } = useRental();

  const currentCar = cars.find(c => c.id === returnModalReservation.carId) || returnModalReservation.car;
  const initialStation = returnStations.find(s => s.id === returnModalReservation.returnStationId) || returnStations[0];

  const [selectedStationId, setSelectedStationId] = useState(initialStation.id);
  const selectedStation = returnStations.find(s => s.id === selectedStationId) || initialStation;

  // Calculate real-time distance from current car GPS to selected return station
  const distanceKm = calculateDistanceKm(
    currentCar.currentGps.lat,
    currentCar.currentGps.lng,
    selectedStation.lat,
    selectedStation.lng
  );
  const distanceMeters = Math.round(distanceKm * 1000);
  const isInsideGeofence = distanceMeters <= 250;

  // Checklist state
  const [odometer, setOdometer] = useState<number>(currentCar.currentGps.odometerKm);
  const [fuelPercent, setFuelPercent] = useState<number>(Math.round(currentCar.currentGps.fuelPercent));
  const [exteriorCondition, setExteriorCondition] = useState<'excellent' | 'good' | 'minor_scratches' | 'needs_attention'>('excellent');
  const [cleanliness, setCleanliness] = useState<'clean' | 'moderate' | 'dirty'>('clean');
  const [notes, setNotes] = useState('Vehicle in great condition. Keys placed in digital drop-box.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'geofence' | 'checklist' | 'done'>('geofence');

  const handleSimulateInBay = () => {
    teleportCarToStation(currentCar.id, selectedStation.id);
  };

  const handleSubmitReturn = async () => {
    try {
      setIsSubmitting(true);
      await returnCar(returnModalReservation.id, {
        returnStationId: selectedStation.id,
        finalOdometerKm: odometer,
        finalFuelPercent: fuelPercent,
        exteriorCondition,
        cleanliness,
        notes
      });
      setStep('done');
    } catch (err: any) {
      alert(err.message || 'Failed to complete return.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#1D1D22] border border-white/10 rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col overflow-hidden text-white shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#17171B]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <h3 className="text-base font-extrabold text-white">Vehicle Return & Inspection</h3>
              <p className="text-xs text-neutral-400">
                {currentCar.model} • Booking {returnModalReservation.bookingCode}
              </p>
            </div>
          </div>
          <button
            onClick={() => setReturnModalReservation(null)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body based on step */}
        <div className="p-5 overflow-y-auto space-y-5">
          {step === 'geofence' && (
            <div className="space-y-4">
              {/* Geofence Status Box */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isInsideGeofence
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              }`}>
                <div className="flex items-start gap-3">
                  {isInsideGeofence ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm text-white">
                      {isInsideGeofence
                        ? 'GPS Return Zone Verified!'
                        : 'Vehicle Outside Return Bay'}
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      {isInsideGeofence
                        ? `Integrated telemetry verified car is ${distanceMeters}m from ${selectedStation.name}. You are authorized for contactless check-in.`
                        : `Vehicle is currently ${distanceMeters}m from ${selectedStation.name}. ALBETH requires return inside the 250m return perimeter.`}
                    </p>
                  </div>
                </div>

                {!isInsideGeofence && (
                  <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-300">Testing return process?</span>
                    <button
                      onClick={handleSimulateInBay}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow"
                    >
                      Simulate In-Bay (0m)
                    </button>
                  </div>
                )}
              </div>

              {/* Station Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Target Return Terminal
                </label>
                <select
                  value={selectedStationId}
                  onChange={e => setSelectedStationId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:ring-1 focus:ring-emerald-400"
                >
                  {returnStations.map(station => (
                    <option key={station.id} value={station.id} className="bg-neutral-900 text-white">
                      {station.name} — {station.operatingHours}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Telemetry Snapshot */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="text-xs font-bold text-neutral-300">Live Telemetry Snapshot</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="font-mono font-bold text-amber-400">{currentCar.currentGps.odometerKm} km</div>
                    <div className="text-[10px] text-neutral-400">Odometer</div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="font-mono font-bold text-emerald-400">{Math.round(currentCar.currentGps.fuelPercent)}%</div>
                    <div className="text-[10px] text-neutral-400">Fuel Tank</div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="font-mono font-bold text-blue-400">{currentCar.currentGps.isLocked ? 'Locked' : 'Unlocked'}</div>
                    <div className="text-[10px] text-neutral-400">Doors</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('checklist')}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Digital Inspection Checklist</span>
              </button>
            </div>
          )}

          {step === 'checklist' && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-300 bg-white/5 p-3 rounded-xl border border-white/5">
                Confirm vehicle condition metrics before final lock & drop-off.
              </div>

              {/* Odometer & Fuel inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Final Odometer (km)</span>
                  </label>
                  <input
                    type="number"
                    value={odometer}
                    onChange={e => setOdometer(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Final Fuel % ({fuelPercent}%)</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={fuelPercent}
                    onChange={e => setFuelPercent(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Exterior Condition */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Exterior Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'excellent', label: 'Pristine / No Scratches' },
                    { id: 'good', label: 'Good / Normal Wear' },
                    { id: 'minor_scratches', label: 'Minor Scratches' },
                    { id: 'needs_attention', label: 'Needs Staff Inspection' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExteriorCondition(item.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                        exteriorCondition === item.id
                          ? 'bg-amber-400/10 border-amber-400 text-white'
                          : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cleanliness */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Interior Cleanliness</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'clean', label: 'Clean' },
                    { id: 'moderate', label: 'Moderate' },
                    { id: 'dirty', label: 'Needs Wash' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCleanliness(c.id as any)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        cleanliness === c.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white'
                          : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-400">Notes / Bay Details</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('geofence')}
                  className="px-4 py-3 rounded-xl bg-white/10 text-neutral-300 text-xs font-bold hover:bg-white/20 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReturn}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Closing Rental & Locking Vehicle...' : 'Sign Off & Complete Return'}
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white">Return Completed!</h3>
                <p className="text-xs text-neutral-300 max-w-xs mx-auto">
                  {currentCar.model} has been safely checked into {selectedStation.name}. Vehicle doors are secured and your deposit is cleared.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Return Station:</span>
                  <span className="text-white">{selectedStation.name}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>GPS Verification:</span>
                  <span className="text-emerald-400 font-bold">Within Bay (&lt; 250m)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Final Odometer:</span>
                  <span className="text-white">{odometer} km</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Fuel Tank:</span>
                  <span className="text-white">{fuelPercent}%</span>
                </div>
              </div>

              <button
                onClick={() => setReturnModalReservation(null)}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm shadow-xl transition-all"
              >
                Close & View Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ReturnCarModal: React.FC = () => {
  const { returnModalReservation } = useRental();
  if (!returnModalReservation) return null;
  return <ReturnCarModalDialog reservation={returnModalReservation} />;
};

