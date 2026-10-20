import React, { useEffect, useRef, useState } from 'react';
import { useRental } from '../context/RentalContext';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Power, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Compass, 
  Layers, 
  Crosshair, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Car, ReturnStation } from '../types/rental';

export const GpsTrackingScreen: React.FC = () => {
  const { 
    cars, 
    activeReservation, 
    selectedCar, 
    setSelectedCar, 
    returnStations, 
    toggleCarLock, 
    toggleCarEngine,
    teleportCarToStation,
    teleportCarNearbyStation,
    setReturnModalReservation,
    setBookingCar,
    calculateDistanceKm
  } = useRental();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const carMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const stationLayersRef = useRef<L.LayerGroup | null>(null);

  // Active tracked vehicle: prioritize active reservation's car, or selected car, or first available car
  const activeCarId = activeReservation?.carId || selectedCar?.id || cars[0]?.id;
  const currentTrackedCar = cars.find(c => c.id === activeCarId) || cars[0];

  const [selectedReturnStationId, setSelectedReturnStationId] = useState<string>(
    activeReservation?.returnStationId || returnStations[0].id
  );
  const [mapFollowCar, setMapFollowCar] = useState(true);
  const [showTelemetryDetails, setShowTelemetryDetails] = useState(true);

  const selectedTargetStation = returnStations.find(s => s.id === selectedReturnStationId) || returnStations[0];

  // Calculate distance from car to selected return hub
  const distanceKm = currentTrackedCar
    ? calculateDistanceKm(
        currentTrackedCar.currentGps.lat,
        currentTrackedCar.currentGps.lng,
        selectedTargetStation.lat,
        selectedTargetStation.lng
      )
    : 0;

  const distanceMeters = Math.round(distanceKm * 1000);
  const isInsideReturnGeofence = distanceMeters <= 250;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if ((mapContainerRef.current as unknown as { _leaflet_id?: number | null })._leaflet_id) {
        (mapContainerRef.current as unknown as { _leaflet_id?: number | null })._leaflet_id = null;
      }
      const map = L.map(mapContainerRef.current, {
        center: [currentTrackedCar.currentGps.lat, currentTrackedCar.currentGps.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Dark style OpenStreetMap tiles for sleek automotive interface
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Station layers
      const stationGroup = L.layerGroup().addTo(map);
      stationLayersRef.current = stationGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Return Stations Markers & Geofences
  useEffect(() => {
    const map = mapInstanceRef.current;
    const stationGroup = stationLayersRef.current;
    if (!map || !stationGroup) return;

    stationGroup.clearLayers();

    returnStations.forEach(st => {
      const isSelected = st.id === selectedReturnStationId;

      // Geofence circle (180m radius for return zone)
      const circle = L.circle([st.lat, st.lng], {
        radius: 180,
        color: isSelected ? '#10b981' : '#6366f1',
        weight: isSelected ? 2 : 1,
        fillColor: isSelected ? '#10b981' : '#6366f1',
        fillOpacity: isSelected ? 0.22 : 0.08,
        dashArray: isSelected ? '4, 4' : undefined
      });
      circle.addTo(stationGroup);

      // Station Icon
      const stationIcon = L.divIcon({
        className: 'station-pin-marker',
        html: `
          <div style="transform: translate(-50%, -100%);">
            <div style="background: ${isSelected ? '#059669' : '#1e1b4b'}; border: 2px solid ${isSelected ? '#34d399' : '#818cf8'}; color: white; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: ${isSelected ? '#10b981' : '#c7d2fe'};"></span>
              ${st.name.split(' ')[1] || st.name}
            </div>
          </div>
        `,
        iconSize: [0, 0]
      });

      const marker = L.marker([st.lat, st.lng], { icon: stationIcon });
      marker.on('click', () => setSelectedReturnStationId(st.id));
      marker.addTo(stationGroup);
    });
  }, [returnStations, selectedReturnStationId]);

  // Update Car Marker & Route Line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !currentTrackedCar) return;

    const carLat = currentTrackedCar.currentGps.lat;
    const carLng = currentTrackedCar.currentGps.lng;

    // Custom Car Pin
    const carIcon = L.divIcon({
      className: 'car-radar-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
          <!-- Pulse wave -->
          <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(245, 158, 11, 0.35); animation: radar-pulse 2s infinite ease-out;"></div>
          <!-- Vehicle container -->
          <div style="position: relative; width: 34px; height: 34px; background: #0f172a; border: 2.5px solid #fbbf24; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0,0,0,0.5); z-index: 10;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44]
    });

    if (!carMarkerRef.current) {
      carMarkerRef.current = L.marker([carLat, carLng], { icon: carIcon }).addTo(map);
    } else {
      carMarkerRef.current.setLatLng([carLat, carLng]);
      carMarkerRef.current.setIcon(carIcon);
    }

    // Connect Route line to target station
    if (selectedTargetStation) {
      const latlngs: [number, number][] = [
        [carLat, carLng],
        [
          (carLat + selectedTargetStation.lat) / 2 + 0.001,
          (carLng + selectedTargetStation.lng) / 2 - 0.001
        ],
        [selectedTargetStation.lat, selectedTargetStation.lng]
      ];

      if (!routePolylineRef.current) {
        routePolylineRef.current = L.polyline(latlngs, {
          color: '#fbbf24',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8'
        }).addTo(map);
      } else {
        routePolylineRef.current.setLatLngs(latlngs);
      }
    }

    if (mapFollowCar) {
      map.panTo([carLat, carLng], { animate: true, duration: 0.6 });
    }
  }, [currentTrackedCar?.currentGps.lat, currentTrackedCar?.currentGps.lng, selectedTargetStation, mapFollowCar]);

  const handleCenterOnCar = () => {
    setMapFollowCar(true);
    if (mapInstanceRef.current && currentTrackedCar) {
      mapInstanceRef.current.setView(
        [currentTrackedCar.currentGps.lat, currentTrackedCar.currentGps.lng],
        15,
        { animate: true }
      );
    }
  };

  const handleInitiateReturn = () => {
    if (activeReservation) {
      setReturnModalReservation(activeReservation);
    } else {
      // Prompt user to book first or view test reservation
      alert('You currently have no active rental to return. Pick a vehicle below to book now!');
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#18181B] text-white overflow-hidden select-none">
      {/* Top Floating Header with Car Switcher & GPS Live Status */}
      <div className="absolute top-3 left-3 right-3 z-[1000] space-y-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2">
          {/* Vehicle selector */}
          <div className="pointer-events-auto bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <select
              value={currentTrackedCar.id}
              onChange={e => {
                const found = cars.find(c => c.id === e.target.value);
                if (found) setSelectedCar(found);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {cars.map(c => (
                <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                  {c.model} ({!c.isAvailable ? 'Active Rental' : 'Standby'})
                </option>
              ))}
            </select>
          </div>

          {/* Recenter button */}
          <button
            onClick={handleCenterOnCar}
            className="pointer-events-auto p-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 text-neutral-200 hover:text-amber-400 active:scale-95 shadow-xl transition-all"
            title="Recenter on Vehicle"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Return Geofence Banner */}
        <div className="pointer-events-auto bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-2 h-2 rounded-full shrink-0 ${isInsideReturnGeofence ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div className="truncate">
              <span className="text-neutral-400">Target Return: </span>
              <span className="font-semibold text-white">{selectedTargetStation.name}</span>
            </div>
          </div>
          <span className={`font-mono font-bold px-2 py-0.5 rounded-md text-[11px] shrink-0 ${
            isInsideReturnGeofence ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-neutral-300'
          }`}>
            {distanceMeters <= 50 ? 'IN BAY' : `${distanceMeters}m away`}
          </span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="flex-1 w-full h-full relative" ref={mapContainerRef} />

      {/* Quick GPS Teleport / Test Sandbox Pill */}
      <div className="absolute right-3 top-28 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => teleportCarToStation(currentTrackedCar.id, selectedReturnStationId)}
          title="Simulate vehicle parking inside return bay (0m)"
          className="p-2.5 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xl backdrop-blur-md border border-emerald-400/40 flex items-center gap-1.5 transition-all active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="hidden sm:inline">Park in Bay (0m)</span>
        </button>

        <button
          onClick={() => teleportCarNearbyStation(currentTrackedCar.id, selectedReturnStationId, 450)}
          title="Simulate driving near station (~450m)"
          className="p-2.5 rounded-2xl bg-black/80 hover:bg-black text-amber-400 text-[11px] font-medium shadow-xl backdrop-blur-md border border-white/10 flex items-center gap-1.5 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Drive Out (~450m)</span>
        </button>
      </div>

      {/* Bottom Floating Telemetry & Return Card (Matches Flutter MapsDetailsPage bottom sheet) */}
      <div className="z-[1000] bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 p-4 sm:p-5 rounded-t-[28px] shadow-2xl space-y-4 max-h-[58%] overflow-y-auto">
        {/* Top Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto -mt-1 cursor-pointer" onClick={() => setShowTelemetryDetails(!showTelemetryDetails)} />

        {/* Vehicle Header with Image */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 uppercase tracking-wider">
                GPS RETURN TRACKING
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {currentTrackedCar.plateNumber}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {currentTrackedCar.model}
            </h3>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{currentTrackedCar.currentGps.address}</span>
            </p>
          </div>

          <div className="relative shrink-0">
            <img
              src="/car_assets/white_car.png"
              alt="White Car"
              className="w-24 sm:w-28 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Telemetry Metrics Row (Speed, Fuel, Odometer, Battery) */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-base font-black text-amber-400 font-mono-numbers">
              {currentTrackedCar.currentGps.speedKmH}
            </div>
            <div className="text-[10px] text-neutral-400">km/h Speed</div>
          </div>

          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-base font-black text-emerald-400 font-mono-numbers">
              {Math.round(currentTrackedCar.currentGps.fuelPercent)}%
            </div>
            <div className="text-[10px] text-neutral-400">Fuel Level</div>
          </div>

          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-base font-black text-blue-400 font-mono-numbers">
              {currentTrackedCar.currentGps.batteryPercent}%
            </div>
            <div className="text-[10px] text-neutral-400">Battery</div>
          </div>

          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-xs font-black text-white font-mono-numbers pt-1">
              {(currentTrackedCar.currentGps.odometerKm / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-neutral-400">Odometer</div>
          </div>
        </div>

        {/* Remote Hardware Controls (Lock/Unlock & Engine toggle) */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCarLock(currentTrackedCar.id)}
              className={`p-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                currentTrackedCar.currentGps.isLocked
                  ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {currentTrackedCar.currentGps.isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Doors Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Doors Unlocked</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleCarEngine(currentTrackedCar.id)}
              className={`p-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                currentTrackedCar.currentGps.engineOn
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{currentTrackedCar.currentGps.engineOn ? 'Engine Running' : 'Engine Off'}</span>
            </button>
          </div>

          <div className="text-right">
            <div className="text-xs text-neutral-400">Rate</div>
            <div className="text-sm font-bold text-white font-mono-numbers">₱{currentTrackedCar.pricePerHour}/h</div>
            <div className="text-[10px] text-amber-400 font-semibold">₱{currentTrackedCar.pricePerDay.toLocaleString()}/day</div>
          </div>
        </div>

        {/* Destination Station Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Select Return Terminal</span>
            <span className="text-amber-400 normal-case">{selectedTargetStation.operatingHours}</span>
          </label>
          <select
            value={selectedReturnStationId}
            onChange={e => setSelectedReturnStationId(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {returnStations.map(station => (
              <option key={station.id} value={station.id} className="bg-neutral-900 text-white">
                {station.name} ({station.availableBays} bays free)
              </option>
            ))}
          </select>
        </div>

        {/* Action Button: Return Car or Book */}
        <div>
          {activeReservation && activeReservation.carId === currentTrackedCar.id ? (
            <button
              onClick={handleInitiateReturn}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isInsideReturnGeofence
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/25 animate-pulse'
                  : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-400/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isInsideReturnGeofence
                  ? 'Within Return Bay — Complete Inspection & Return'
                  : `Initiate Return to ${selectedTargetStation.name.split(' ')[1] || 'Hub'}`}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setBookingCar(currentTrackedCar)}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-white hover:bg-neutral-100 text-neutral-950 shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4" />
              <span>Book {currentTrackedCar.model} for Return Telemetry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
