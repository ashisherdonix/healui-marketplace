import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PhysiotherapistBatchAvailability } from '@/lib/types';

interface AvailabilityState {
  batchData: Record<string, PhysiotherapistBatchAvailability>;
  lastUpdated: Record<string, number>; // Physio ID -> timestamp
  loading: boolean;
  error: string | null;
}

const initialState: AvailabilityState = {
  batchData: {},
  lastUpdated: {},
  loading: false,
  error: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    setBatchAvailability: (
      state,
      action: PayloadAction<{
        data: Record<string, PhysiotherapistBatchAvailability>;
        timestamp?: number;
      }>
    ) => {
      const { data, timestamp = Date.now() } = action.payload;
      state.batchData = { ...state.batchData, ...data };
      Object.keys(data).forEach(id => {
        state.lastUpdated[id] = timestamp;
      });
      state.loading = false;
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearStaleData: (state) => {
      const now = Date.now();
      Object.keys(state.lastUpdated).forEach(id => {
        if (now - state.lastUpdated[id] > CACHE_DURATION) {
          delete state.batchData[id];
          delete state.lastUpdated[id];
        }
      });
    },
    
    clearAvailability: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        delete state.batchData[id];
        delete state.lastUpdated[id];
      });
    },
    
    resetAvailability: () => initialState
  }
});

export const {
  setBatchAvailability,
  setLoading,
  setError,
  clearStaleData,
  clearAvailability,
  resetAvailability
} = availabilitySlice.actions;

export default availabilitySlice;

// Selectors
export const selectAvailabilityForPhysio = (state: { availability: AvailabilityState }, physioId: string) =>
  state.availability.batchData[physioId];

export const selectIsAvailabilityStale = (state: { availability: AvailabilityState }, physioId: string) => {
  const lastUpdated = state.availability.lastUpdated[physioId];
  if (!lastUpdated) return true;
  return Date.now() - lastUpdated > CACHE_DURATION;
};

export const selectAvailabilityLoading = (state: { availability: AvailabilityState }) =>
  state.availability.loading;

export const selectAvailabilityError = (state: { availability: AvailabilityState }) =>
  state.availability.error;