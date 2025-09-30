import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Address } from '@/lib/types';

// User state interface
interface UserState {
  userData: User | null;
  currentLocation: string | null;
  selectedAddress: Address | null;
  userMode: 'patient' | 'therapist'; // for users who can be both
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  userData: null,
  currentLocation: null,
  selectedAddress: null,
  userMode: 'patient',
  preferences: {
    language: 'en',
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
  },
  loading: false,
  error: null,
};

// Async thunks
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to update profile');
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserState['preferences']>, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to update preferences');
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (file: File, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to upload image');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Synchronous actions
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
      state.error = null;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.currentLocation = null;
      state.selectedAddress = null;
      state.userMode = 'patient';
      state.error = null;
    },
    setCurrentLocation: (state, action: PayloadAction<string>) => {
      state.currentLocation = action.payload;
    },
    setSelectedAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
    },
    setUserMode: (state, action: PayloadAction<'patient' | 'therapist'>) => {
      state.userMode = action.payload;
    },
    updatePreferencesLocal: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserField: (state, action: PayloadAction<{ field: keyof User; value: unknown }>) => {
      if (state.userData) {
        (state.userData as Record<string, unknown>)[action.payload.field] = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update preferences
    builder
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = {
          ...state.preferences,
          ...action.payload,
        };
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload profile image
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userData) {
          state.userData.profileImage = action.payload.imageUrl;
        }
        state.error = null;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUserData,
  clearUserData,
  setCurrentLocation,
  setSelectedAddress,
  setUserMode,
  updatePreferencesLocal,
  clearError,
  updateUserField,
} = userSlice.actions;

export default userSlice;