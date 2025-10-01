import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Booking, 
  CreateBookingDto, 
  UpdateBookingDto, 
  BookingStatus,
  BookingFilters,
  AvailableSlot 
} from '@/lib/types';

// Booking context for non-authenticated users
export interface BookingContext {
  physiotherapist_id: string;
  physiotherapist_name: string;
  scheduled_date: string;
  scheduled_time: string;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  selectedSlot: AvailableSlot;
  consultation_fee: number;
  travel_fee?: number;
  total_amount: number;
}

// Booking state interface
interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  availableSlots: AvailableSlot[];
  bookingContext: BookingContext | null; // Add booking context for login flow
  loading: {
    bookings: boolean;
    creating: boolean;
    updating: boolean;
    cancelling: boolean;
    slots: boolean;
  };
  error: {
    bookings: string | null;
    creating: string | null;
    updating: string | null;
    cancelling: string | null;
    slots: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: BookingFilters;
}

// Initial state
const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  availableSlots: [],
  bookingContext: null, // Add booking context initialization
  loading: {
    bookings: false,
    creating: false,
    updating: false,
    cancelling: false,
    slots: false,
  },
  error: {
    bookings: null,
    creating: null,
    updating: null,
    cancelling: null,
    slots: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {},
};

// Async thunks
export const getBookings = createAsyncThunk(
  'booking/getBookings',
  async (params: { page?: number; limit?: number; filters?: BookingFilters }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch bookings');
    }
  }
);

export const getBooking = createAsyncThunk(
  'booking/getBooking',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch booking');
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: CreateBookingDto, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to create booking');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'booking/updateBooking',
  async (params: { id: string; data: UpdateBookingDto }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to update booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (params: { id: string; reason?: string }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to cancel booking');
    }
  }
);

export const rescheduleBooking = createAsyncThunk(
  'booking/rescheduleBooking',
  async (params: { id: string; appointmentDate: string; startTime: string }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to reschedule booking');
    }
  }
);

export const getAvailableSlots = createAsyncThunk(
  'booking/getAvailableSlots',
  async (params: { date: string; serviceType?: string; location?: string; duration?: number }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch available slots');
    }
  }
);

// Booking slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Synchronous actions
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    // Booking context management for non-authenticated users
    setBookingContext: (state, action: PayloadAction<BookingContext>) => {
      state.bookingContext = action.payload;
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingBookingContext', JSON.stringify(action.payload));
      }
    },
    clearBookingContext: (state) => {
      state.bookingContext = null;
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingBookingContext');
      }
    },
    restoreBookingContext: (state) => {
      // Restore from localStorage
      if (typeof window !== 'undefined') {
        const savedContext = localStorage.getItem('pendingBookingContext');
        if (savedContext) {
          state.bookingContext = JSON.parse(savedContext);
        }
      }
    },
    setFilters: (state, action: PayloadAction<BookingFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: BookingStatus }>) => {
      const booking = state.bookings.find(b => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
      if (state.currentBooking && state.currentBooking.id === action.payload.id) {
        state.currentBooking.status = action.payload.status;
      }
    },
    clearAvailableSlots: (state) => {
      state.availableSlots = [];
    },
    clearErrors: (state) => {
      state.error = {
        bookings: null,
        creating: null,
        updating: null,
        cancelling: null,
        slots: null,
      };
    },
    clearBookings: (state) => {
      state.bookings = [];
      state.currentBooking = null;
      state.availableSlots = [];
      state.bookingContext = null;
      state.pagination = initialState.pagination;
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingBookingContext');
      }
    },
    // Add missing actions for API integration
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.unshift(action.payload);
      state.currentBooking = action.payload;
    },
    updateBookingData: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
      if (state.currentBooking && state.currentBooking.id === action.payload.id) {
        state.currentBooking = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Get bookings
    builder
      .addCase(getBookings.pending, (state) => {
        state.loading.bookings = true;
        state.error.bookings = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading.bookings = false;
        state.bookings = (action.payload as unknown as {data: Booking[], pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        }}).data;
        state.pagination = (action.payload as unknown as {data: Booking[], pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        }}).pagination;
        state.error.bookings = null;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading.bookings = false;
        state.error.bookings = action.payload as string;
      });

    // Get booking
    builder
      .addCase(getBooking.pending, (state) => {
        state.loading.bookings = true;
        state.error.bookings = null;
      })
      .addCase(getBooking.fulfilled, (state, action) => {
        state.loading.bookings = false;
        state.currentBooking = action.payload as unknown as Booking;
        state.error.bookings = null;
      })
      .addCase(getBooking.rejected, (state, action) => {
        state.loading.bookings = false;
        state.error.bookings = action.payload as string;
      });

    // Create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.bookings.unshift(action.payload as unknown as Booking);
        state.currentBooking = action.payload as unknown as Booking;
        state.error.creating = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload as string;
      });

    // Update booking
    builder
      .addCase(updateBooking.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.bookings.findIndex(b => b.id === (action.payload as unknown as Booking).id);
        if (index !== -1) {
          state.bookings[index] = action.payload as unknown as Booking;
        }
        if (state.currentBooking && state.currentBooking.id === (action.payload as unknown as Booking).id) {
          state.currentBooking = action.payload as unknown as Booking;
        }
        state.error.updating = null;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload as string;
      });

    // Cancel booking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading.cancelling = true;
        state.error.cancelling = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading.cancelling = false;
        const index = state.bookings.findIndex(b => b.id === (action.payload as unknown as Booking).id);
        if (index !== -1) {
          state.bookings[index] = action.payload as unknown as Booking;
        }
        if (state.currentBooking && state.currentBooking.id === (action.payload as unknown as Booking).id) {
          state.currentBooking = action.payload as unknown as Booking;
        }
        state.error.cancelling = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading.cancelling = false;
        state.error.cancelling = action.payload as string;
      });

    // Reschedule booking
    builder
      .addCase(rescheduleBooking.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(rescheduleBooking.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.bookings.findIndex(b => b.id === (action.payload as unknown as Booking).id);
        if (index !== -1) {
          state.bookings[index] = action.payload as unknown as Booking;
        }
        if (state.currentBooking && state.currentBooking.id === (action.payload as unknown as Booking).id) {
          state.currentBooking = action.payload as unknown as Booking;
        }
        state.error.updating = null;
      })
      .addCase(rescheduleBooking.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload as string;
      });

    // Get available slots
    builder
      .addCase(getAvailableSlots.pending, (state) => {
        state.loading.slots = true;
        state.error.slots = null;
      })
      .addCase(getAvailableSlots.fulfilled, (state, action) => {
        state.loading.slots = false;
        state.availableSlots = action.payload as unknown as AvailableSlot[];
        state.error.slots = null;
      })
      .addCase(getAvailableSlots.rejected, (state, action) => {
        state.loading.slots = false;
        state.error.slots = action.payload as string;
      });
  },
});

export const {
  setCurrentBooking,
  clearCurrentBooking,
  setBookingContext,
  clearBookingContext,
  restoreBookingContext,
  setFilters,
  clearFilters,
  updateBookingStatus,
  clearAvailableSlots,
  clearErrors,
  clearBookings,
  setBookings,
  addBooking,
  updateBookingData,
} = bookingSlice.actions;

export default bookingSlice;