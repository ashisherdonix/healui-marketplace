import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Therapist, 
  Service, 
  TherapistFilters, 
  Review 
} from '@/lib/types';

// Therapist state interface
interface TherapistState {
  therapists: Therapist[];
  currentTherapist: Therapist | null;
  featuredTherapists: Therapist[];
  therapistServices: Service[];
  therapistReviews: Review[];
  loading: {
    therapists: boolean;
    current: boolean;
    featured: boolean;
    services: boolean;
    reviews: boolean;
  };
  error: {
    therapists: string | null;
    current: string | null;
    featured: string | null;
    services: string | null;
    reviews: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: TherapistFilters;
}

// Initial state
const initialState: TherapistState = {
  therapists: [],
  currentTherapist: null,
  featuredTherapists: [],
  therapistServices: [],
  therapistReviews: [],
  loading: {
    therapists: false,
    current: false,
    featured: false,
    services: false,
    reviews: false,
  },
  error: {
    therapists: null,
    current: null,
    featured: null,
    services: null,
    reviews: null,
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
export const getTherapists = createAsyncThunk(
  'therapist/getTherapists',
  async (params: { page?: number; limit?: number; filters?: TherapistFilters }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch therapists');
    }
  }
);

export const getTherapist = createAsyncThunk(
  'therapist/getTherapist',
  async (therapistId: string, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch therapist');
    }
  }
);

export const getFeaturedTherapists = createAsyncThunk(
  'therapist/getFeaturedTherapists',
  async (_limit: number = 6, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch featured therapists');
    }
  }
);

export const getTherapistAvailability = createAsyncThunk(
  'therapist/getAvailability',
  async (params: { id: string; date?: string; duration?: number }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch availability');
    }
  }
);

export const getTherapistReviews = createAsyncThunk(
  'therapist/getReviews',
  async (params: { id: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch reviews');
    }
  }
);

export const searchTherapists = createAsyncThunk(
  'therapist/searchTherapists',
  async (params: { query: string; filters?: TherapistFilters }, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to search therapists');
    }
  }
);

// Therapist slice
const therapistSlice = createSlice({
  name: 'therapist',
  initialState,
  reducers: {
    // Synchronous actions
    setCurrentTherapist: (state, action: PayloadAction<Therapist>) => {
      state.currentTherapist = action.payload;
    },
    clearCurrentTherapist: (state) => {
      state.currentTherapist = null;
      state.therapistServices = [];
      state.therapistReviews = [];
    },
    setFilters: (state, action: PayloadAction<TherapistFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateTherapistRating: (state, action: PayloadAction<{ id: string; rating: number; reviewCount: number }>) => {
      const therapist = state.therapists.find(t => t.id === action.payload.id);
      if (therapist) {
        therapist.rating = action.payload.rating;
        therapist.reviewCount = action.payload.reviewCount;
      }
      if (state.currentTherapist && state.currentTherapist.id === action.payload.id) {
        state.currentTherapist.rating = action.payload.rating;
        state.currentTherapist.reviewCount = action.payload.reviewCount;
      }
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.therapistReviews.unshift(action.payload);
    },
    clearErrors: (state) => {
      state.error = {
        therapists: null,
        current: null,
        featured: null,
        services: null,
        reviews: null,
      };
    },
    clearTherapists: (state) => {
      state.therapists = [];
      state.currentTherapist = null;
      state.featuredTherapists = [];
      state.therapistServices = [];
      state.therapistReviews = [];
      state.pagination = initialState.pagination;
    },
    // Direct setters for API responses
    setTherapists: (state, action: PayloadAction<Record<string, unknown>[]>) => {
      state.therapists = action.payload;
    },
    setFeaturedTherapists: (state, action: PayloadAction<Record<string, unknown>[]>) => {
      state.featuredTherapists = action.payload;
    },
    setTherapistReviews: (state, action: PayloadAction<Record<string, unknown>[]>) => {
      state.therapistReviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get therapists
    builder
      .addCase(getTherapists.pending, (state) => {
        state.loading.therapists = true;
        state.error.therapists = null;
      })
      .addCase(getTherapists.fulfilled, (state, action) => {
        state.loading.therapists = false;
        state.therapists = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error.therapists = null;
      })
      .addCase(getTherapists.rejected, (state, action) => {
        state.loading.therapists = false;
        state.error.therapists = action.payload as string;
      });

    // Get therapist
    builder
      .addCase(getTherapist.pending, (state) => {
        state.loading.current = true;
        state.error.current = null;
      })
      .addCase(getTherapist.fulfilled, (state, action) => {
        state.loading.current = false;
        state.currentTherapist = action.payload;
        state.error.current = null;
      })
      .addCase(getTherapist.rejected, (state, action) => {
        state.loading.current = false;
        state.error.current = action.payload as string;
      });

    // Get featured therapists
    builder
      .addCase(getFeaturedTherapists.pending, (state) => {
        state.loading.featured = true;
        state.error.featured = null;
      })
      .addCase(getFeaturedTherapists.fulfilled, (state, action) => {
        state.loading.featured = false;
        state.featuredTherapists = action.payload;
        state.error.featured = null;
      })
      .addCase(getFeaturedTherapists.rejected, (state, action) => {
        state.loading.featured = false;
        state.error.featured = action.payload as string;
      });

    // Get therapist availability
    builder
      .addCase(getTherapistAvailability.pending, (state) => {
        state.loading.services = true;
        state.error.services = null;
      })
      .addCase(getTherapistAvailability.fulfilled, (state) => {
        state.loading.services = false;
        // Availability data would be handled in booking slice or separate availability slice
        state.error.services = null;
      })
      .addCase(getTherapistAvailability.rejected, (state, action) => {
        state.loading.services = false;
        state.error.services = action.payload as string;
      });

    // Get therapist reviews
    builder
      .addCase(getTherapistReviews.pending, (state) => {
        state.loading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(getTherapistReviews.fulfilled, (state, action) => {
        state.loading.reviews = false;
        state.therapistReviews = action.payload.data;
        state.error.reviews = null;
      })
      .addCase(getTherapistReviews.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error.reviews = action.payload as string;
      });

    // Search therapists
    builder
      .addCase(searchTherapists.pending, (state) => {
        state.loading.therapists = true;
        state.error.therapists = null;
      })
      .addCase(searchTherapists.fulfilled, (state, action) => {
        state.loading.therapists = false;
        state.therapists = action.payload.data;
        state.error.therapists = null;
      })
      .addCase(searchTherapists.rejected, (state, action) => {
        state.loading.therapists = false;
        state.error.therapists = action.payload as string;
      });
  },
});

export const {
  setCurrentTherapist,
  clearCurrentTherapist,
  setFilters,
  clearFilters,
  updateTherapistRating,
  addReview,
  clearErrors,
  clearTherapists,
  setTherapists,
  setFeaturedTherapists,
  setTherapistReviews,
} = therapistSlice.actions;

export default therapistSlice;