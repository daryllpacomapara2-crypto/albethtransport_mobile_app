/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RentalProvider, useRental } from './context/RentalContext';
import { MobileFrame } from './components/MobileFrame';
import { OnboardingScreen } from './components/OnboardingScreen';
import { FleetScreen } from './components/FleetScreen';
import { CarDetailsScreen } from './components/CarDetailsScreen';
import { GpsTrackingScreen } from './components/GpsTrackingScreen';
import { ReservationsScreen } from './components/ReservationsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BookingModal } from './components/BookingModal';
import { ReturnCarModal } from './components/ReturnCarModal';

const AppContent: React.FC = () => {
  const { activeScreen, activeTab, bookingCar, returnModalReservation } = useRental();

  return (
    <MobileFrame>
      {/* Route between screens */}
      {activeScreen === 'onboarding' && <OnboardingScreen />}
      {activeScreen === 'car-details' && <CarDetailsScreen />}
      {activeScreen === 'main' && (
        <>
          {activeTab === 'fleet' && <FleetScreen />}
          {activeTab === 'gps' && <GpsTrackingScreen />}
          {activeTab === 'reservations' && <ReservationsScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </>
      )}

      {/* Global Interactive Overlays */}
      {bookingCar && <BookingModal />}
      {returnModalReservation && <ReturnCarModal />}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <RentalProvider>
      <AppContent />
    </RentalProvider>
  );
}
