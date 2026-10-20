export interface Car {
  id: string;
  model: string;
  brand: string;
  year: number;
  category: 'Subcompact Sedan' | 'Crossover SUV' | 'Utility MPV' | 'Commercial Van';
  distance: number; // in km
  fuelCapacity: number; // in liters
  pricePerHour: number; // hourly rate in PHP (₱)
  pricePerDay: number; // daily rate in PHP (₱)
  image: string;
  topViewImage?: string;
  acceleration: string;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  engineType: string;
  rating: number;
  isAvailable: boolean;
  plateNumber: string;
  features: string[];
  currentGps: {
    lat: number;
    lng: number;
    address: string;
    speedKmH: number;
    fuelPercent: number;
    batteryPercent: number;
    isLocked: boolean;
    engineOn: boolean;
    odometerKm: number;
  };
}

export interface ReturnStation {
  id: string;
  name: string;
  address: string;
  municipality: string;
  province: string;
  lat: number;
  lng: number;
  availableBays: number;
  operatingHours: string;
  is24Hours: boolean;
  phone: string;
  isHeadOffice?: boolean;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  driverLicense: string;
  address: string;
  avatar: string;
  walletBalance: number;
  membershipTier: string;
  memberSince: string;
  totalTrips: number;
  points: number;
}

export interface Reservation {
  id: string;
  bookingCode: string;
  carId: string;
  car: Car;
  userId: string;
  userName: string;
  userPhone: string;
  pickupStationId: string;
  pickupStationName: string;
  returnStationId: string;
  returnStationName: string;
  pickupDateTime: string; // ISO string
  returnDateTime: string; // ISO string
  totalHours: number;
  rateType: 'hourly' | 'daily';
  subtotal: number;
  insuranceTier: 'standard' | 'premium' | 'zero_deductible';
  insuranceFee: number;
  addOns: {
    id: string;
    name: string;
    price: number;
  }[];
  totalPrice: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
  returnedAt?: string;
  returnInspection?: {
    returnStationId: string;
    finalOdometerKm: number;
    finalFuelPercent: number;
    exteriorCondition: 'excellent' | 'good' | 'minor_scratches' | 'needs_attention';
    cleanliness: 'clean' | 'moderate' | 'dirty';
    notes: string;
    inspectedBy: string;
    verifiedGpsDistanceMeters: number;
  };
}

export type AppTab = 'fleet' | 'gps' | 'reservations' | 'profile';
