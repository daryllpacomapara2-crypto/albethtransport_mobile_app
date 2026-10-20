import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, ReturnStation, Reservation, AppTab, ClientUser } from '../types/rental';
import { INITIAL_CARS, INITIAL_RESERVATIONS, RETURN_STATIONS, CURRENT_USER } from '../data/mockData';

interface BookingPayload {
  carId: string;
  pickupStationId: string;
  returnStationId: string;
  pickupDateTime: string;
  returnDateTime: string;
  totalHours: number;
  rateType: 'hourly' | 'daily';
  subtotal: number;
  insuranceTier: 'standard' | 'premium' | 'zero_deductible';
  insuranceFee: number;
  addOns: { id: string; name: string; price: number }[];
  totalPrice: number;
}

interface InspectionPayload {
  returnStationId: string;
  finalOdometerKm: number;
  finalFuelPercent: number;
  exteriorCondition: 'excellent' | 'good' | 'minor_scratches' | 'needs_attention';
  cleanliness: 'clean' | 'moderate' | 'dirty';
  notes: string;
}

interface RentalContextType {
  cars: Car[];
  reservations: Reservation[];
  returnStations: ReturnStation[];
  currentUser: ClientUser;
  isLoggedIn: boolean;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedCar: Car | null;
  setSelectedCar: (car: Car | null) => void;
  activeScreen: 'onboarding' | 'main' | 'car-details';
  setActiveScreen: (screen: 'onboarding' | 'main' | 'car-details') => void;
  bookingCar: Car | null;
  setBookingCar: (car: Car | null) => void;
  returnModalReservation: Reservation | null;
  setReturnModalReservation: (res: Reservation | null) => void;
  activeReservation: Reservation | null;
  viewDeviceFrame: boolean;
  setViewDeviceFrame: (val: boolean) => void;
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (val: boolean) => void;
  
  // Actions
  bookCar: (payload: BookingPayload) => Promise<Reservation>;
  extendReservation: (reservationId: string, hours: number) => void;
  cancelReservation: (reservationId: string) => void;
  returnCar: (reservationId: string, inspection: InspectionPayload) => Promise<Reservation>;
  toggleCarLock: (carId: string) => void;
  toggleCarEngine: (carId: string) => void;
  teleportCarToStation: (carId: string, stationId: string) => void;
  teleportCarNearbyStation: (carId: string, stationId: string, distanceMeters: number) => void;
  calculateDistanceKm: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  systemAlert: string | null;
  setSystemAlert: (msg: string | null) => void;
  loginClient: (emailOrPhone: string, pass: string) => Promise<boolean>;
  registerClient: (data: { name: string; email: string; phone: string; driverLicense: string; address: string }) => Promise<boolean>;
  logoutClient: () => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CARS: 'albeth_r8_cars_v2',
  RESERVATIONS: 'albeth_r8_reservations_v2',
  USER: 'albeth_r8_user_v2',
  LOGGED_IN: 'albeth_r8_logged_in_v1',
  ONBOARDED: 'albeth_r8_onboarded_v1',
  DEVICE_FRAME: 'albeth_r8_frame_v1'
};

export function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4 && parsed.some(c => c.id === 'car-mirage-g4')) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_CARS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RESERVATIONS;
  });

  const [currentUser, setCurrentUser] = useState<ClientUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return CURRENT_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
    return saved === 'true';
  });

  const [activeScreen, setActiveScreen] = useState<'onboarding' | 'main' | 'car-details'>('onboarding');
  const [activeTab, setActiveTab] = useState<AppTab>('fleet');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [returnModalReservation, setReturnModalReservation] = useState<Reservation | null>(null);
  const [viewDeviceFrame, setViewDeviceFrame] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEVICE_FRAME);
    return saved !== null ? saved === 'true' : true;
  });
  const [systemAlert, setSystemAlert] = useState<string | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEVICE_FRAME, String(viewDeviceFrame));
  }, [viewDeviceFrame]);

  // Live GPS simulation for active cars with engine on in Region 8 (Eastern Visayas)
  useEffect(() => {
    const interval = setInterval(() => {
      setCars(prevCars =>
        prevCars.map(car => {
          if (!car.isAvailable && car.currentGps.engineOn) {
            // Realistic GPS movement along Maharlika Highway
            const deltaLat = (Math.random() - 0.48) * 0.0003;
            const deltaLng = (Math.random() - 0.48) * 0.0003;
            const currentSpeed = Math.floor(35 + Math.random() * 25);
            return {
              ...car,
              currentGps: {
                ...car.currentGps,
                lat: Number((car.currentGps.lat + deltaLat).toFixed(6)),
                lng: Number((car.currentGps.lng + deltaLng).toFixed(6)),
                speedKmH: currentSpeed,
                odometerKm: Number((car.currentGps.odometerKm + 0.03).toFixed(2)),
                fuelPercent: Math.max(15, car.currentGps.fuelPercent - 0.01)
              }
            };
          }
          return car;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activeReservation = reservations.find(r => r.status === 'active') || null;

  const loginClient = async (emailOrPhone: string, pass: string): Promise<boolean> => {
    setIsLoggedIn(true);
    setSystemAlert(`Welcome back, ${currentUser.name}! Signed in to ALBETH TRANSPORT.`);
    return true;
  };

  const registerClient = async (data: {
    name: string;
    email: string;
    phone: string;
    driverLicense: string;
    address: string;
  }): Promise<boolean> => {
    const newClient: ClientUser = {
      id: `client-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      driverLicense: `${data.driverLicense} (Verified LTO PH)`,
      address: data.address || 'Region 8, Philippines',
      avatar: '/car_assets/user.png',
      walletBalance: 15000.00,
      membershipTier: 'ALBETH Member (Region 8)',
      memberSince: '2024',
      totalTrips: 0,
      points: 1000
    };
    setCurrentUser(newClient);
    setIsLoggedIn(true);
    setSystemAlert(`Account created successfully! Welcome to ALBETH TRANSPORT, ${data.name}.`);
    return true;
  };

  const logoutClient = () => {
    setIsLoggedIn(false);
    setActiveScreen('onboarding');
    setSystemAlert('You have been logged out.');
  };

  const bookCar = async (payload: BookingPayload): Promise<Reservation> => {
    const car = cars.find(c => c.id === payload.carId);
    if (!car) throw new Error('Vehicle not found');

    const pickupStation = RETURN_STATIONS.find(s => s.id === payload.pickupStationId) || RETURN_STATIONS[0];
    const returnStation = RETURN_STATIONS.find(s => s.id === payload.returnStationId) || RETURN_STATIONS[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      bookingCode: `ALB-R8-${new Date().getFullYear()}-${randomSuffix}`,
      carId: car.id,
      car: { ...car, isAvailable: false },
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      pickupStationId: pickupStation.id,
      pickupStationName: pickupStation.name,
      returnStationId: returnStation.id,
      returnStationName: returnStation.name,
      pickupDateTime: payload.pickupDateTime,
      returnDateTime: payload.returnDateTime,
      totalHours: payload.totalHours,
      rateType: payload.rateType,
      subtotal: payload.subtotal,
      insuranceTier: payload.insuranceTier,
      insuranceFee: payload.insuranceFee,
      addOns: payload.addOns,
      totalPrice: payload.totalPrice,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Update car status
    setCars(prev =>
      prev.map(c =>
        c.id === car.id
          ? {
              ...c,
              isAvailable: false,
              currentGps: {
                ...c.currentGps,
                lat: pickupStation.lat,
                lng: pickupStation.lng,
                address: `${pickupStation.name} - Bay #${Math.floor(1 + Math.random() * 6)}`,
                speedKmH: 0,
                engineOn: true,
                isLocked: false
              }
            }
          : c
      )
    );

    setReservations(prev => [newReservation, ...prev]);
    setBookingCar(null);
    setSystemAlert(`Booking ${newReservation.bookingCode} confirmed! Vehicle dispatched in Region 8.`);
    return newReservation;
  };

  const extendReservation = (reservationId: string, hours: number) => {
    setReservations(prev =>
      prev.map(res => {
        if (res.id === reservationId) {
          const currentReturn = new Date(res.returnDateTime).getTime();
          const newReturn = new Date(currentReturn + hours * 3600 * 1000).toISOString();
          const extraCost = hours * res.car.pricePerHour;
          return {
            ...res,
            returnDateTime: newReturn,
            totalHours: res.totalHours + hours,
            totalPrice: res.totalPrice + extraCost
          };
        }
        return res;
      })
    );
    setSystemAlert(`Rental extended by +${hours} hours (₱${hours * (activeReservation?.car.pricePerHour || 160)} added).`);
  };

  const cancelReservation = (reservationId: string) => {
    const target = reservations.find(r => r.id === reservationId);
    if (!target) return;

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );

    // Free the vehicle
    setCars(prev =>
      prev.map(c => (c.id === target.carId ? { ...c, isAvailable: true } : c))
    );

    setSystemAlert(`Booking ${target.bookingCode} was cancelled.`);
  };

  const returnCar = async (reservationId: string, inspection: InspectionPayload): Promise<Reservation> => {
    const target = reservations.find(r => r.id === reservationId);
    if (!target) throw new Error('Reservation not found');

    const returnStation = RETURN_STATIONS.find(s => s.id === inspection.returnStationId) || RETURN_STATIONS[0];
    const car = cars.find(c => c.id === target.carId) || target.car;

    // Calculate real distance from current car GPS to designated return station
    const distanceKm = calculateHaversineKm(
      car.currentGps.lat,
      car.currentGps.lng,
      returnStation.lat,
      returnStation.lng
    );
    const distanceMeters = Math.round(distanceKm * 1000);

    const updatedReservation: Reservation = {
      ...target,
      status: 'completed',
      returnedAt: new Date().toISOString(),
      returnStationId: returnStation.id,
      returnStationName: returnStation.name,
      returnInspection: {
        returnStationId: returnStation.id,
        finalOdometerKm: inspection.finalOdometerKm,
        finalFuelPercent: inspection.finalFuelPercent,
        exteriorCondition: inspection.exteriorCondition,
        cleanliness: inspection.cleanliness,
        notes: inspection.notes,
        inspectedBy: 'ALBETH San Sebastian GPS Auto-Return Sensor',
        verifiedGpsDistanceMeters: distanceMeters
      }
    };

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? updatedReservation : r))
    );

    // Update car to be available at return station
    setCars(prev =>
      prev.map(c =>
        c.id === target.carId
          ? {
              ...c,
              isAvailable: true,
              distance: Math.max(100, c.distance - 25),
              currentGps: {
                ...c.currentGps,
                lat: returnStation.lat,
                lng: returnStation.lng,
                address: `${returnStation.name} - Checked In`,
                speedKmH: 0,
                engineOn: false,
                isLocked: true,
                odometerKm: inspection.finalOdometerKm,
                fuelPercent: inspection.finalFuelPercent
              }
            }
          : c
      )
    );

    setReturnModalReservation(null);
    setSystemAlert(`Return successful! Vehicle checked into ${returnStation.name}.`);
    return updatedReservation;
  };

  const toggleCarLock = (carId: string) => {
    setCars(prev =>
      prev.map(c => {
        if (c.id === carId) {
          const nextState = !c.currentGps.isLocked;
          setSystemAlert(nextState ? `Vehicle ${c.model} locked.` : `Vehicle ${c.model} unlocked.`);
          return {
            ...c,
            currentGps: { ...c.currentGps, isLocked: nextState }
          };
        }
        return c;
      })
    );
  };

  const toggleCarEngine = (carId: string) => {
    setCars(prev =>
      prev.map(c => {
        if (c.id === carId) {
          const nextEngine = !c.currentGps.engineOn;
          setSystemAlert(nextEngine ? `Engine started remotely.` : `Engine turned off.`);
          return {
            ...c,
            currentGps: {
              ...c.currentGps,
              engineOn: nextEngine,
              speedKmH: nextEngine ? c.currentGps.speedKmH : 0
            }
          };
        }
        return c;
      })
    );
  };

  const teleportCarToStation = (carId: string, stationId: string) => {
    const station = RETURN_STATIONS.find(s => s.id === stationId);
    if (!station) return;
    setCars(prev =>
      prev.map(c =>
        c.id === carId
          ? {
              ...c,
              currentGps: {
                ...c.currentGps,
                lat: station.lat,
                lng: station.lng,
                address: `${station.name} - Return Bay #1`,
                speedKmH: 0
              }
            }
          : c
      )
    );
    setSystemAlert(`Car GPS location placed inside ${station.name} return zone.`);
  };

  const teleportCarNearbyStation = (carId: string, stationId: string, distanceMeters: number) => {
    const station = RETURN_STATIONS.find(s => s.id === stationId);
    if (!station) return;
    const offset = (distanceMeters / 111320);
    setCars(prev =>
      prev.map(c =>
        c.id === carId
          ? {
              ...c,
              currentGps: {
                ...c.currentGps,
                lat: station.lat + offset * 0.7,
                lng: station.lng + offset * 0.7,
                address: `Approaching ${station.name} (~${distanceMeters}m away)`,
                speedKmH: 25
              }
            }
          : c
      )
    );
    setSystemAlert(`Car GPS updated: ~${distanceMeters}m from ${station.name}.`);
  };

  return (
    <RentalContext.Provider
      value={{
        cars,
        reservations,
        returnStations: RETURN_STATIONS,
        currentUser,
        isLoggedIn,
        activeTab,
        setActiveTab,
        selectedCar,
        setSelectedCar,
        activeScreen,
        setActiveScreen,
        bookingCar,
        setBookingCar,
        returnModalReservation,
        setReturnModalReservation,
        activeReservation,
        viewDeviceFrame,
        setViewDeviceFrame,
        isInstallModalOpen,
        setIsInstallModalOpen,
        bookCar,
        extendReservation,
        cancelReservation,
        returnCar,
        toggleCarLock,
        toggleCarEngine,
        teleportCarToStation,
        teleportCarNearbyStation,
        calculateDistanceKm: calculateHaversineKm,
        systemAlert,
        setSystemAlert,
        loginClient,
        registerClient,
        logoutClient
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};
