import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthResponse, LoginDto, RegisterDto } from '@/lib/types';
import { setAuthTokens, removeAuthTokens } from '@/lib/utils/helpers';
import { firebaseAuthService, ConfirmationResult } from '@/services/firebase-auth';
import { formatPhoneNumber, validatePhoneNumber, getFirebaseErrorMessage } from '@/utils/firebase-helper';
import ApiManager from '@/services/api';

// Auth state interface
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerifying: boolean;
  confirmationResult: ConfirmationResult | null;
  phoneNumber: string | null;
  initializing: boolean; // New field to track auth initialization
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  otpSent: false,
  otpVerifying: false,
  confirmationResult: null,
  phoneNumber: null,
  initializing: true, // Start as true, AuthInitializer will set to false
};

// Async thunks - will be implemented in services layer
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginDto, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterDto, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      throw new Error('Not implemented yet');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Registration failed');
    }
  }
);

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phone: string, { rejectWithValue }) => {
    try {
      // Validate phone number
      if (!validatePhoneNumber(phone)) {
        return rejectWithValue('Please enter a valid phone number');
      }

      // Format phone number
      const formattedPhone = formatPhoneNumber(phone);
      
      // Send OTP using Firebase
      const result = await firebaseAuthService.sendOTP(formattedPhone);
      
      if (!result.success) {
        return rejectWithValue(result.error || 'Failed to send OTP');
      }
      
      return {
        confirmationResult: result.confirmationResult,
        phoneNumber: formattedPhone
      };
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string };
      const errorMessage = getFirebaseErrorMessage(firebaseError.code) || firebaseError.message || 'Failed to send OTP';
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData: { otp: string; confirmationResult: ConfirmationResult }, { rejectWithValue }) => {
    try {
      // Verify OTP using Firebase
      const result = await firebaseAuthService.verifyOTP(otpData.confirmationResult, otpData.otp);
      
      if (!result.success) {
        return rejectWithValue(result.error || 'OTP verification failed');
      }
      
      // Get Firebase user token
      const firebaseToken = await firebaseAuthService.getUserToken();
      
      if (!firebaseToken) {
        return rejectWithValue('Failed to get authentication token');
      }
      
      // Send Firebase token to backend to get JWT tokens (Following EMR Pattern)
      const response = await ApiManager.login({
        phone: result.user.phoneNumber || '',
        firebaseIdToken: firebaseToken
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string };
      const errorMessage = getFirebaseErrorMessage(firebaseError.code) || firebaseError.message || 'OTP verification failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 getCurrentUser - Starting API call...');
      const response = await ApiManager.getMe();
      console.log('🔄 getCurrentUser - API response received:', response);
      
      if (response.success && response.data) {
        console.log('✅ getCurrentUser - Success, returning user data:', response.data);
        return response.data; // Return user data directly
      } else {
        console.log('❌ getCurrentUser - API call failed:', response);
        // Don't throw error, just return rejection to handle gracefully
        return rejectWithValue(response.message || 'Failed to get user data');
      }
    } catch (error) {
      console.error('❌ getCurrentUser - Error occurred:', error);
      return rejectWithValue((error as Error).message || 'Failed to get user data');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Will be implemented in services/api.ts
      removeAuthTokens();
      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    resetOTPState: (state) => {
      state.otpSent = false;
      state.otpVerifying = false;
      state.confirmationResult = null;
      state.phoneNumber = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.loading = false;
      state.initializing = false;
      state.error = null;
      state.otpSent = false;
      state.otpVerifying = false;
      state.confirmationResult = null;
      state.phoneNumber = null;
      // Set tokens in cookies following EMR pattern
      setAuthTokens(action.payload.accessToken, action.payload.refreshToken);
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.initializing = true; // Reset to true so AuthInitializer can run again
      state.error = null;
      state.otpSent = false;
      state.otpVerifying = false;
      state.confirmationResult = null;
      state.phoneNumber = null;
      // Remove tokens from cookies
      removeAuthTokens();
      // Sign out from Firebase
      firebaseAuthService.signOut().catch(console.error);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initializing = false;
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.initializing = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        setAuthTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        setAuthTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.error = null;
        state.confirmationResult = action.payload.confirmationResult;
        state.phoneNumber = action.payload.phoneNumber;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.otpSent = false;
        state.confirmationResult = null;
        state.phoneNumber = null;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.otpVerifying = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.otpVerifying = false;
        state.otpSent = false;
        state.initializing = false;
        state.isAuthenticated = true;
        // Extract the user data from the login response
        state.user = action.payload.user;
        state.error = null;
        state.confirmationResult = null;
        state.phoneNumber = null;
        setAuthTokens(action.payload.accessToken || action.payload.access_token, action.payload.refreshToken || action.payload.refresh_token);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.otpVerifying = false;
        state.error = action.payload as string;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.error = action.payload as string;
        
        // Don't immediately log out on network errors - only on 401
        // Network errors could be temporary (e.g., page refresh, CORS, etc.)
        const errorMessage = action.payload as string;
        if (errorMessage?.includes('Unauthorized') || errorMessage?.includes('401')) {
          state.isAuthenticated = false;
          state.user = null;
          removeAuthTokens();
        }
        // For other errors, keep the current auth state
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.initializing = true; // Reset to true so AuthInitializer can run again
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        state.otpSent = false;
        state.otpVerifying = false;
        state.confirmationResult = null;
        state.phoneNumber = null;
        removeAuthTokens();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  resetOTPState, 
  loginSuccess, 
  logoutSuccess, 
  setUser,
  setInitializing
} = authSlice.actions;

export default authSlice;