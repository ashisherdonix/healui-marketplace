'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  setBookingContext, 
  clearBookingContext, 
  restoreBookingContext,
  BookingContext 
} from '@/store/slices/bookingSlice';

/**
 * Custom hook to manage booking context for non-authenticated users
 * Handles saving, restoring, and clearing booking details during login flow
 */
export const useBookingContext = () => {
  const dispatch = useAppDispatch();
  const { bookingContext } = useAppSelector((state) => state.booking);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  /**
   * Save booking context to Redux and localStorage
   */
  const saveBookingContext = (context: BookingContext) => {
    dispatch(setBookingContext(context));
  };

  /**
   * Clear booking context from Redux and localStorage
   */
  const clearContext = () => {
    dispatch(clearBookingContext());
  };

  /**
   * Restore booking context from localStorage
   */
  const restoreContext = () => {
    dispatch(restoreBookingContext());
  };

  /**
   * Check if there's a pending booking context
   */
  const hasPendingBooking = Boolean(bookingContext);

  /**
   * Get the current booking context
   */
  const getCurrentContext = () => bookingContext;

  /**
   * Auto-clear context when user logs out
   */
  const autoManageContext = () => {
    if (!isAuthenticated && bookingContext) {
      // User is not authenticated but has context - keep it for login flow
      return;
    }
    
    if (isAuthenticated && bookingContext) {
      // User is authenticated and has context - they can proceed to booking
      return;
    }
  };

  return {
    bookingContext,
    hasPendingBooking,
    saveBookingContext,
    clearContext,
    restoreContext,
    getCurrentContext,
    autoManageContext,
    isAuthenticated
  };
};

export default useBookingContext;