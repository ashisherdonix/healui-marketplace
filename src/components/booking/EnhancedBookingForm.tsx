'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setBookingContext, clearBookingContext, restoreBookingContext } from '@/store/slices/bookingSlice';
import LoginModal from '@/components/auth/LoginModal';
import BookingForm from '@/components/booking/BookingForm';
import BookingSuccess from '@/components/booking/BookingSuccess';

interface AvailabilitySlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  fee: number;
}

interface PhysiotherapistProfile {
  id: string;
  full_name: string;
  consultation_fee: number;
  location: string;
}

interface BookingData {
  id: string;
  physiotherapist?: {
    phone?: string;
  };
  patient_address?: string;
  total_amount: number;
  consultation_fee: number;
  travel_fee?: number;
  status: string;
}

interface EnhancedBookingFormProps {
  physiotherapist: PhysiotherapistProfile;
  selectedSlot: AvailabilitySlot;
  selectedDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({
  physiotherapist,
  selectedSlot,
  selectedDate,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { bookingContext } = useAppSelector((state) => state.booking);
  
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated);
  const [bookingSuccessData, setBookingSuccessData] = useState<BookingData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // If user is not authenticated, save booking context
    if (!isAuthenticated) {
      const context = {
        physiotherapist_id: physiotherapist.id,
        physiotherapist_name: physiotherapist.full_name,
        scheduled_date: selectedDate,
        scheduled_time: selectedSlot.start_time,
        visit_mode: selectedSlot.visit_mode,
        selectedSlot: {
          date: selectedDate,
          startTime: selectedSlot.start_time,
          endTime: selectedSlot.end_time,
          type: selectedSlot.visit_mode === 'HOME_VISIT' ? 'home_visit' : 'online',
          therapist: {
            id: physiotherapist.id,
            full_name: physiotherapist.full_name,
          } as any,
          service: {} as any,
          price: selectedSlot.fee
        },
        consultation_fee: selectedSlot.fee,
        travel_fee: selectedSlot.visit_mode === 'HOME_VISIT' ? 100 : 0,
        total_amount: selectedSlot.fee + (selectedSlot.visit_mode === 'HOME_VISIT' ? 100 : 0)
      };
      dispatch(setBookingContext(context));
    }
  }, [isAuthenticated, physiotherapist, selectedSlot, selectedDate, dispatch]);

  useEffect(() => {
    // Restore booking context on mount
    dispatch(restoreBookingContext());
  }, [dispatch]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Keep the booking context so the form can use it
  };

  const handleClose = () => {
    // Clear booking context when closing
    dispatch(clearBookingContext());
    onClose();
  };

  const handleBookingSuccess = (bookingData: BookingData) => {
    // Clear booking context on successful booking
    dispatch(clearBookingContext());
    
    // Show success modal with booking data
    setBookingSuccessData(bookingData);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setBookingSuccessData(null);
    onSuccess();
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleClose}
        onSuccess={handleLoginSuccess}
        context="booking"
        bookingContext={bookingContext || {
          physiotherapist_id: physiotherapist.id,
          physiotherapist_name: physiotherapist.full_name,
          scheduled_date: selectedDate,
          scheduled_time: selectedSlot.start_time,
          visit_mode: selectedSlot.visit_mode,
          selectedSlot: {
            start_time: selectedSlot.start_time,
            end_time: selectedSlot.end_time,
            visit_mode: selectedSlot.visit_mode
          }
        }}
        urgencyMessage="Quick login to secure this appointment"
      />
    );
  }

  // Show success modal
  if (showSuccess && bookingSuccessData) {
    return (
      <BookingSuccess
        bookingData={{
          id: bookingSuccessData.id,
          physiotherapist_name: physiotherapist.full_name,
          physiotherapist_phone: bookingSuccessData.physiotherapist?.phone,
          scheduled_date: selectedDate,
          scheduled_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          visit_mode: selectedSlot.visit_mode,
          patient_address: bookingSuccessData.patient_address,
          total_amount: bookingSuccessData.total_amount,
          consultation_fee: bookingSuccessData.consultation_fee,
          travel_fee: bookingSuccessData.travel_fee,
          status: bookingSuccessData.status
        }}
        onClose={handleSuccessClose}
        onViewBookings={() => {
          handleSuccessClose();
          // You can add navigation to bookings page here
        }}
      />
    );
  }

  // Show booking form once authenticated
  return (
    <BookingForm
      physiotherapist={physiotherapist}
      selectedSlot={selectedSlot}
      selectedDate={selectedDate}
      onClose={handleClose}
      onSuccess={handleBookingSuccess}
    />
  );
};

export default EnhancedBookingForm;