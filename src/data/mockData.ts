import { Car, ReturnStation, Reservation, ClientUser } from '../types/rental';

export const RETURN_STATIONS: ReturnStation[] = [
  {
    id: 'st-san-sebastian',
    name: 'ALBETH TRANSPORT (Cars for any occasions)',
    address: 'Maharlika Highway, Poblacion, San Sebastian, Samar',
    municipality: 'San Sebastian',
    province: 'Samar',
    lat: 11.7142,
    lng: 124.9653,
    availableBays: 10,
    operatingHours: '24/7 Operations & Dispatch',
    is24Hours: true,
    phone: '+63 (055) 543-8821 / +63 917 882 4011',
    isHeadOffice: true
  },
  {
    id: 'st-catbalogan',
    name: 'ALBETH Catbalogan Samar Station',
    address: 'Provincial Capitol Complex, Maharlika Hwy, Catbalogan City, Samar',
    municipality: 'Catbalogan City',
    province: 'Samar',
    lat: 11.7753,
    lng: 124.8860,
    availableBays: 8,
    operatingHours: '06:00 AM - 10:00 PM',
    is24Hours: false,
    phone: '+63 (055) 543-9022'
  },
  {
    id: 'st-tacloban-airport',
    name: 'ALBETH Tacloban DZR Airport Hub',
    address: 'Arrivals Terminal, Daniel Z. Romualdez Airport, San Jose, Tacloban City, Leyte',
    municipality: 'Tacloban City',
    province: 'Leyte',
    lat: 11.2281,
    lng: 125.0285,
    availableBays: 16,
    operatingHours: '24/7 Flight Meet & Greet',
    is24Hours: true,
    phone: '+63 (053) 832-7711'
  },
  {
    id: 'st-calbayog',
    name: 'ALBETH Calbayog City Hub',
    address: 'Maharlika Highway, Barangay Dagum, Calbayog City, Samar',
    municipality: 'Calbayog City',
    province: 'Samar',
    lat: 12.0674,
    lng: 124.5954,
    availableBays: 6,
    operatingHours: '07:00 AM - 09:00 PM',
    is24Hours: false,
    phone: '+63 (055) 533-4190'
  },
  {
    id: 'st-ormoc-port',
    name: 'ALBETH Ormoc Port Terminal',
    address: 'Pier 2 Passenger Concourse, Port Area, Ormoc City, Leyte',
    municipality: 'Ormoc City',
    province: 'Leyte',
    lat: 11.0050,
    lng: 124.6075,
    availableBays: 8,
    operatingHours: '05:30 AM - 11:00 PM (Ferry Schedule)',
    is24Hours: false,
    phone: '+63 (053) 561-2290'
  },
  {
    id: 'st-borongan',
    name: 'ALBETH Borongan Eastern Samar Station',
    address: 'Real Street, Poblacion, Borongan City, Eastern Samar',
    municipality: 'Borongan City',
    province: 'Eastern Samar',
    lat: 11.6080,
    lng: 125.4318,
    availableBays: 5,
    operatingHours: '07:00 AM - 08:00 PM',
    is24Hours: false,
    phone: '+63 (055) 560-9110'
  }
];

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-mirage-g4',
    model: 'Mitsubishi Mirage G4 (AT)',
    brand: 'Mitsubishi',
    year: 2024,
    category: 'Subcompact Sedan',
    distance: 450,
    fuelCapacity: 42,
    pricePerHour: 160,
    pricePerDay: 1600,
    image: '/car_assets/fleet_mirage_g4.jpg',
    topViewImage: '/car_assets/fleet_mirage_g4.jpg',
    acceleration: '0-100 km/h in 11.5s',
    transmission: 'Automatic',
    seats: 5,
    engineType: '1.2L DOHC 12V 3-Cylinder MIVEC Gas (78 HP)',
    rating: 4.9,
    isAvailable: true,
    plateNumber: 'EAA-4812',
    features: [
      'Automatic CVT Transmission',
      '5 Passenger Seating',
      'Ultra Fuel Efficient (21 km/L)',
      'Touchscreen Infotainment w/ Apple CarPlay',
      'Cold Dual Aircon & USB Ports',
      'Equipped with Region 8 GPS Telemetry'
    ],
    currentGps: {
      lat: 11.7145,
      lng: 124.9658,
      address: 'ALBETH Main Office, Poblacion, San Sebastian, Samar',
      speedKmH: 0,
      fuelPercent: 95,
      batteryPercent: 100,
      isLocked: true,
      engineOn: false,
      odometerKm: 14210
    }
  },
  {
    id: 'car-ecosport',
    model: 'Ford EcoSport Titanium (AT)',
    brand: 'Ford',
    year: 2023,
    category: 'Crossover SUV',
    distance: 520,
    fuelCapacity: 52,
    pricePerHour: 230,
    pricePerDay: 2300,
    image: '/car_assets/fleet_ecosport.jpg',
    topViewImage: '/car_assets/fleet_ecosport.jpg',
    acceleration: '0-100 km/h in 10.2s',
    transmission: 'Automatic',
    seats: 5,
    engineType: '1.5L Ti-VCT Inline-4 (123 HP / 150 Nm)',
    rating: 4.95,
    isAvailable: false, // Active rental for immediate demo of real-time management!
    plateNumber: 'HAA-9120',
    features: [
      '6-Speed Automatic w/ SelectShift',
      '5 Passenger Seating',
      '209mm High Ground Clearance (Ideal for Samar-Leyte roads)',
      'SYNC 3 Touchscreen & Reverse Camera',
      'Sunroof & Leather Seats',
      'Electronic Stability Control'
    ],
    currentGps: {
      lat: 11.7350,
      lng: 124.9420,
      address: 'En route Maharlika Hwy near San Sebastian & Catbalogan border, Samar',
      speedKmH: 42,
      fuelPercent: 84,
      batteryPercent: 97,
      isLocked: true,
      engineOn: true,
      odometerKm: 26340
    }
  },
  {
    id: 'car-tamaraw-gl',
    model: 'Toyota Tamaraw GL (AT)',
    brand: 'Toyota',
    year: 2024,
    category: 'Utility MPV',
    distance: 680,
    fuelCapacity: 65,
    pricePerHour: 290,
    pricePerDay: 2900,
    image: '/car_assets/fleet_tamaraw_gl.jpg',
    topViewImage: '/car_assets/fleet_tamaraw_gl.jpg',
    acceleration: '0-100 km/h in 11.0s',
    transmission: 'Automatic',
    seats: 9,
    engineType: '2.4L 2GD-FTV 4-Cyl D-4D Turbo Diesel (150 HP / 400 Nm)',
    rating: 5.0,
    isAvailable: true,
    plateNumber: 'NAA-3388',
    features: [
      '6-Speed Automatic Transmission',
      'Spacious 9-Passenger Seating Capacity',
      'Powerful 2.4L D-4D Turbo Diesel (Climbs steep Samar mountain passes easily)',
      'Dual High-Cooling Aircon System',
      'Rugged High Payload Chassis',
      'Integrated Fleet GPS Return Sensor'
    ],
    currentGps: {
      lat: 11.2281,
      lng: 125.0285,
      address: 'ALBETH Tacloban DZR Airport Bay #4, Leyte',
      speedKmH: 0,
      fuelPercent: 90,
      batteryPercent: 99,
      isLocked: true,
      engineOn: false,
      odometerKm: 9450
    }
  },
  {
    id: 'car-l300-fb',
    model: 'Mitsubishi L300 FB (MT)',
    brand: 'Mitsubishi',
    year: 2024,
    category: 'Commercial Van',
    distance: 580,
    fuelCapacity: 55,
    pricePerHour: 260,
    pricePerDay: 2600,
    image: '/car_assets/fleet_l300_fb.jpg',
    topViewImage: '/car_assets/fleet_l300_fb.jpg',
    acceleration: '0-100 km/h in 14.5s',
    transmission: 'Manual',
    seats: 17,
    engineType: '2.2L 4N14 Common Rail Turbocharged Diesel Euro 4 (99 HP / 200 Nm)',
    rating: 4.85,
    isAvailable: true,
    plateNumber: 'HAA-7741',
    features: [
      '5-Speed Heavy-Duty Manual Transmission',
      '17-Passenger Seating (Dual Rear Bench Rows)',
      'Front & Rear Dual Air-Conditioning System',
      'Heavy-Duty Commercial Cargo & People Mover',
      'Maximum Reliability across Region 8 Inter-Towns',
      'Equipped with 24/7 Roadside Assistance'
    ],
    currentGps: {
      lat: 11.7142,
      lng: 124.9653,
      address: 'ALBETH Central Depot, San Sebastian, Samar',
      speedKmH: 0,
      fuelPercent: 92,
      batteryPercent: 100,
      isLocked: true,
      engineOn: false,
      odometerKm: 31200
    }
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-alb-801',
    bookingCode: 'ALB-R8-2024-8849',
    carId: 'car-ecosport',
    car: INITIAL_CARS[1],
    userId: 'user-client-01',
    userName: 'Maria Lourdes Santos',
    userPhone: '+63 917 552 8901',
    pickupStationId: 'st-san-sebastian',
    pickupStationName: 'ALBETH TRANSPORT (Cars for any occasions)',
    returnStationId: 'st-san-sebastian',
    returnStationName: 'ALBETH TRANSPORT (Cars for any occasions)',
    pickupDateTime: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    returnDateTime: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
    totalHours: 24,
    rateType: 'daily',
    subtotal: 2300,
    insuranceTier: 'premium',
    insuranceFee: 250,
    addOns: [
      { id: 'gps-unlimited', name: 'Integrated GPS Return Telemetry (Region 8)', price: 150 },
      { id: 'roadside', name: '24/7 Samar-Leyte Roadside Assistance', price: 120 }
    ],
    totalPrice: 2820,
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'res-alb-800',
    bookingCode: 'ALB-R8-2024-7120',
    carId: 'car-mirage-g4',
    car: INITIAL_CARS[0],
    userId: 'user-client-01',
    userName: 'Maria Lourdes Santos',
    userPhone: '+63 917 552 8901',
    pickupStationId: 'st-tacloban-airport',
    pickupStationName: 'ALBETH Tacloban DZR Airport Hub',
    returnStationId: 'st-san-sebastian',
    returnStationName: 'ALBETH TRANSPORT (Cars for any occasions)',
    pickupDateTime: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    returnDateTime: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    totalHours: 48,
    rateType: 'daily',
    subtotal: 3200,
    insuranceTier: 'zero_deductible',
    insuranceFee: 450,
    addOns: [
      { id: 'airport-drop', name: 'Airport Drop-off & Clean Return', price: 200 }
    ],
    totalPrice: 3850,
    status: 'completed',
    createdAt: new Date(Date.now() - 6 * 86400 * 1000).toISOString(),
    returnedAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    returnInspection: {
      returnStationId: 'st-san-sebastian',
      finalOdometerKm: 13950,
      finalFuelPercent: 95,
      exteriorCondition: 'excellent',
      cleanliness: 'clean',
      notes: 'Returned in pristine condition at San Sebastian, Samar Office.',
      inspectedBy: 'Albeth Samar Staff #03',
      verifiedGpsDistanceMeters: 12
    }
  }
];

export const CURRENT_USER: ClientUser = {
  id: 'user-client-01',
  name: 'Maria Lourdes Santos',
  email: 'maria.santos@email.ph',
  phone: '+63 917 552 8901',
  driverLicense: 'N01-19-094821 (Verified LTO PH)',
  address: 'San Sebastian, Samar, Region 8',
  avatar: '/car_assets/user.png',
  walletBalance: 25000.00,
  membershipTier: 'ALBETH Gold Samar Club',
  memberSince: '2023',
  totalTrips: 11,
  points: 4850
};
