import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiManager from '@/services/api';

// Search interfaces
interface SearchFilters {
  query?: string;
  location?: string;
  specialization?: string;
  service_type?: 'HOME_VISIT' | 'ONLINE';
  available_date?: string;
  min_rating?: number;
  max_price?: number;
  gender?: 'M' | 'F';
  experience_years?: number;
  sort_by?: 'rating' | 'price' | 'experience' | 'distance';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface SearchResult {
  id: string;
  full_name: string;
  specializations?: string[];
  years_of_experience?: number;
  average_rating: number;
  total_reviews: number;
  practice_address?: string;
  service_areas?: string;
  consultation_fee?: string;
  home_visit_fee?: string;
  profile_picture?: string;
  profile_photo_url?: string;
  cover_photo_url?: string;
  bio?: string;
  availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  is_verified?: boolean;
  home_visit_available?: boolean;
  online_consultation_available?: boolean;
  gender?: string;
}

interface SearchState {
  // Search results
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  
  // Search metadata
  totalResults: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  
  // Current search filters
  activeFilters: SearchFilters;
  
  // Search history and suggestions
  recentSearches: string[];
  popularSearches: string[];
  locationSuggestions: Array<{
    id: string;
    name: string;
    type: 'city' | 'area' | 'pincode';
    display_name: string;
  }>;
  
  // Specializations for filters
  specializations: string[];
  specializationsLoading: boolean;
  
  // Search analytics
  searchCount: number;
  lastSearchTime: number | null;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
  
  totalResults: 0,
  currentPage: 1,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  
  activeFilters: {},
  
  recentSearches: [],
  popularSearches: [
    'Back Pain', 'Knee Pain', 'Sports Injury', 'Post Surgery', 
    'Neck Pain', 'Stroke Recovery', 'Pediatric', 'Neurological'
  ],
  locationSuggestions: [],
  
  specializations: [],
  specializationsLoading: false,
  
  searchCount: 0,
  lastSearchTime: null,
};

// Async thunks
export const searchPhysiotherapists = createAsyncThunk(
  'search/searchPhysiotherapists',
  async (filters: SearchFilters, { rejectWithValue }) => {
    try {
      const response = await ApiManager.searchPhysiotherapists(filters);
      
      if (response.success && response.data) {
        return {
          results: response.data as SearchResult[],
          pagination: response.pagination || {
            total: (response.data as SearchResult[]).length,
            page: filters.page || 1,
            limit: filters.limit || 12,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        };
      } else {
        return rejectWithValue(response.message || 'Search failed');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Search failed');
    }
  }
);

export const getFeaturedPhysiotherapists = createAsyncThunk(
  'search/getFeaturedPhysiotherapists',
  async (params: { location?: string; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await ApiManager.getFeaturedPhysiotherapists(params);
      
      if (response.success && response.data) {
        return response.data as SearchResult[];
      } else {
        return rejectWithValue(response.message || 'Failed to load featured physiotherapists');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to load featured physiotherapists');
    }
  }
);

export const loadSpecializations = createAsyncThunk(
  'search/loadSpecializations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiManager.getSpecializations();
      
      if (response.success && response.data) {
        return response.data as string[];
      } else {
        // Return fallback specializations if API fails
        return [
          'Sports Injury', 'Back Pain', 'Post Surgery', 'Neurological',
          'Pediatric', 'Orthopedic', 'Cardiopulmonary', 'Geriatric',
          'Women\'s Health', 'Manual Therapy', 'Exercise Therapy'
        ];
      }
    } catch (error) {
      // Return fallback specializations if API fails
      return [
        'Sports Injury', 'Back Pain', 'Post Surgery', 'Neurological',
        'Pediatric', 'Orthopedic', 'Cardiopulmonary', 'Geriatric'
      ];
    }
  }
);

export const searchLocations = createAsyncThunk(
  'search/searchLocations',
  async (params: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await ApiManager.searchLocations(params.query, params.limit || 5);
      
      if (response.success && response.data) {
        return response.data as Array<{
          id: string;
          name: string;
          type: 'city' | 'area' | 'pincode';
          display_name: string;
        }>;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
);

// Search slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Filter management
    setActiveFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.activeFilters = action.payload;
    },
    
    clearFilters: (state) => {
      state.activeFilters = {};
      state.results = [];
      state.totalResults = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      state.error = null;
    },
    
    updateFilter: (state, action: PayloadAction<{ key: keyof SearchFilters; value: any }>) => {
      state.activeFilters[action.payload.key] = action.payload.value;
    },
    
    // Search history management
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches = [query, ...state.recentSearches.slice(0, 4)];
      }
    },
    
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    
    // Location suggestions
    setLocationSuggestions: (state, action: PayloadAction<Array<{
      id: string;
      name: string;
      type: 'city' | 'area' | 'pincode';
      display_name: string;
    }>>) => {
      state.locationSuggestions = action.payload;
    },
    
    clearLocationSuggestions: (state) => {
      state.locationSuggestions = [];
    },
    
    // Results management
    clearResults: (state) => {
      state.results = [];
      state.totalResults = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasNext = false;
      state.hasPrev = false;
      state.error = null;
    },
    
    // Error management
    clearError: (state) => {
      state.error = null;
    },
    
    // Analytics
    incrementSearchCount: (state) => {
      state.searchCount += 1;
      state.lastSearchTime = Date.now();
    },
    
    // Direct setters for external API calls
    setResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.results = action.payload;
    },
    
    setFeaturedResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.results = action.payload;
      state.totalResults = action.payload.length;
    },
  },
  
  extraReducers: (builder) => {
    // Search physiotherapists
    builder
      .addCase(searchPhysiotherapists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPhysiotherapists.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.totalResults = action.payload.pagination.total;
        state.currentPage = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.totalPages;
        state.hasNext = action.payload.pagination.hasNext;
        state.hasPrev = action.payload.pagination.hasPrev;
        state.error = null;
        state.searchCount += 1;
        state.lastSearchTime = Date.now();
      })
      .addCase(searchPhysiotherapists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.results = [];
        state.totalResults = 0;
      });

    // Featured physiotherapists
    builder
      .addCase(getFeaturedPhysiotherapists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedPhysiotherapists.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.totalResults = action.payload.length;
        state.currentPage = 1;
        state.totalPages = 1;
        state.hasNext = false;
        state.hasPrev = false;
        state.error = null;
      })
      .addCase(getFeaturedPhysiotherapists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.results = [];
      });

    // Load specializations
    builder
      .addCase(loadSpecializations.pending, (state) => {
        state.specializationsLoading = true;
      })
      .addCase(loadSpecializations.fulfilled, (state, action) => {
        state.specializationsLoading = false;
        state.specializations = action.payload;
      })
      .addCase(loadSpecializations.rejected, (state, action) => {
        state.specializationsLoading = false;
        // Keep fallback specializations
        state.specializations = [
          'Sports Injury', 'Back Pain', 'Post Surgery', 'Neurological',
          'Pediatric', 'Orthopedic', 'Cardiopulmonary', 'Geriatric'
        ];
      });

    // Search locations
    builder
      .addCase(searchLocations.fulfilled, (state, action) => {
        state.locationSuggestions = action.payload;
      });
  },
});

export const {
  setActiveFilters,
  clearFilters,
  updateFilter,
  addRecentSearch,
  clearRecentSearches,
  setLocationSuggestions,
  clearLocationSuggestions,
  clearResults,
  clearError,
  incrementSearchCount,
  setResults,
  setFeaturedResults,
} = searchSlice.actions;

export default searchSlice;