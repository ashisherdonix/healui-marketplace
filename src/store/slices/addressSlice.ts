import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Address, CreateAddressDto, UpdateAddressDto } from '@/lib/types/address';
import ApiManager from '@/services/api';

interface CurrentLocation {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: number;
}

interface AddressState {
  addresses: Address[];
  currentAddress: Address | null;
  primaryAddress: Address | null;
  currentLocation: CurrentLocation | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  locationLoading: boolean;
}

const initialState: AddressState = {
  addresses: [],
  currentAddress: null,
  primaryAddress: null,
  currentLocation: null,
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  locationLoading: false,
};

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiManager.getAddresses();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch addresses');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch addresses');
    }
  }
);

export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData: CreateAddressDto, { rejectWithValue }) => {
    try {
      const response = await ApiManager.createAddress(addressData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create address');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ id, data }: { id: string; data: UpdateAddressDto }, { rejectWithValue }) => {
    try {
      const response = await ApiManager.updateAddress(id, data);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update address');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      const response = await ApiManager.deleteAddress(addressId);
      if (response.success) {
        return addressId;
      }
      throw new Error(response.message || 'Failed to delete address');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete address');
    }
  }
);

export const setPrimaryAddress = createAsyncThunk(
  'address/setPrimaryAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      const response = await ApiManager.setPrimaryAddress(addressId);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to set primary address');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to set primary address');
    }
  }
);

// Get current location
export const getCurrentLocation = createAsyncThunk(
  'address/getCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      return new Promise<CurrentLocation>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Reverse geocoding to get address
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
              );
              const data = await response.json();
              
              resolve({
                latitude,
                longitude,
                address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                timestamp: Date.now()
              });
            } catch (geocodeError) {
              // If geocoding fails, still return coordinates
              resolve({
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                timestamp: Date.now()
              });
            }
          },
          (error) => {
            let message = 'Failed to get current location';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                message = 'Location access denied by user';
                break;
              case error.POSITION_UNAVAILABLE:
                message = 'Location information unavailable';
                break;
              case error.TIMEOUT:
                message = 'Location request timed out';
                break;
            }
            reject(new Error(message));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // Cache for 1 minute
          }
        );
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get current location');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAddress: (state, action: PayloadAction<Address | null>) => {
      state.currentAddress = action.payload;
    },
    selectAddressForBooking: (state, action: PayloadAction<string>) => {
      const address = state.addresses.find(addr => addr.id === action.payload);
      if (address) {
        state.currentAddress = address;
      }
    },
    setCurrentLocation: (state, action: PayloadAction<CurrentLocation | null>) => {
      state.currentLocation = action.payload;
    },
    clearCurrentLocation: (state) => {
      state.currentLocation = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch addresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.primaryAddress = action.payload.find(addr => addr.is_primary) || null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create address
      .addCase(createAddress.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.creating = false;
        state.addresses.push(action.payload);
        // If this is the first address or marked as primary, update primary
        if (action.payload.is_primary) {
          state.primaryAddress = action.payload;
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })

      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        // Update primary address if needed
        if (action.payload.is_primary) {
          state.primaryAddress = action.payload;
        }
        // Update current address if it's the same
        if (state.currentAddress?.id === action.payload.id) {
          state.currentAddress = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })

      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deleting = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        // Clear primary if deleted address was primary
        if (state.primaryAddress?.id === action.payload) {
          state.primaryAddress = state.addresses.find(addr => addr.is_primary) || null;
        }
        // Clear current if deleted address was current
        if (state.currentAddress?.id === action.payload) {
          state.currentAddress = null;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      })

      // Set primary address
      .addCase(setPrimaryAddress.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(setPrimaryAddress.fulfilled, (state, action) => {
        state.updating = false;
        // Update all addresses - unset previous primary and set new primary
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          is_primary: addr.id === action.payload.id
        }));
        state.primaryAddress = action.payload;
        // Update current address if it's the same
        if (state.currentAddress?.id === action.payload.id) {
          state.currentAddress = action.payload;
        }
      })
      .addCase(setPrimaryAddress.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })

      // Get current location
      .addCase(getCurrentLocation.pending, (state) => {
        state.locationLoading = true;
        state.error = null;
      })
      .addCase(getCurrentLocation.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.currentLocation = action.payload;
      })
      .addCase(getCurrentLocation.rejected, (state, action) => {
        state.locationLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentAddress, selectAddressForBooking, setCurrentLocation, clearCurrentLocation } = addressSlice.actions;

// Selectors
export const selectAddresses = (state: { address: AddressState }) => state.address.addresses;
export const selectPrimaryAddress = (state: { address: AddressState }) => state.address.primaryAddress;
export const selectCurrentAddress = (state: { address: AddressState }) => state.address.currentAddress;
export const selectCurrentLocation = (state: { address: AddressState }) => state.address.currentLocation;
export const selectAddressLoading = (state: { address: AddressState }) => state.address.loading;
export const selectLocationLoading = (state: { address: AddressState }) => state.address.locationLoading;
export const selectAddressError = (state: { address: AddressState }) => state.address.error;
export const selectAddressCreating = (state: { address: AddressState }) => state.address.creating;
export const selectAddressUpdating = (state: { address: AddressState }) => state.address.updating;
export const selectAddressDeleting = (state: { address: AddressState }) => state.address.deleting;

// Computed selectors
export const selectActiveAddresses = (state: { address: AddressState }) => 
  state.address.addresses.filter(addr => addr.is_active);

export const selectAddressesByType = (type: string) => (state: { address: AddressState }) =>
  state.address.addresses.filter(addr => addr.address_type === type && addr.is_active);

export const selectAddressForBookingDisplay = (state: { address: AddressState }) => {
  const current = state.address.currentAddress;
  const primary = state.address.primaryAddress;
  return current || primary || state.address.addresses.find(addr => addr.is_active);
};

export default addressSlice;