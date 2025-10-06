import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import bookingSlice from './slices/bookingSlice';
import therapistSlice from './slices/therapistSlice';
import searchSlice from './slices/searchSlice';
import availabilitySlice from './slices/availabilitySlice';

// Configure Redux store following clinic-web pattern
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    booking: bookingSlice.reducer,
    therapist: therapistSlice.reducer,
    search: searchSlice.reducer,
    availability: availabilitySlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for date serialization
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store instance for API client access
export default store;