'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createAddress,
  updateAddress,
  selectAddressCreating,
  selectAddressUpdating,
  selectAddressError,
  clearError,
} from '@/store/slices/addressSlice';
import { Address, CreateAddressDto, UpdateAddressDto, AddressType, AddressFormData } from '@/lib/types/address';
import Button from '@/components/button';
import DynamicLeafletMap from '@/components/map/DynamicLeafletMap';
import { X, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface AddressFormModalProps {
  address?: Address | null; // For editing existing address
  onClose: () => void;
  onSuccess: (address: Address) => void;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  address,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectAddressCreating);
  const updating = useAppSelector(selectAddressUpdating);
  const error = useAppSelector(selectAddressError);

  const isEditing = !!address;
  const isLoading = creating || updating;

  const [formData, setFormData] = useState<AddressFormData>({
    address_line_1: address?.address_line_1 || '',
    address_line_2: address?.address_line_2 || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || '',
    country: address?.country || 'India',
    landmark: address?.landmark || '',
    address_type: address?.address_type || AddressType.HOME,
    label: address?.label || '',
    company_name: address?.company_name || '',
    floor_details: address?.floor_details || '',
    is_primary: address?.is_primary || false,
  });

  const [errors, setErrors] = useState<Partial<AddressFormData>>({});
  const [showMap, setShowMap] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.address_line_1.trim()) {
      newErrors.address_line_1 = 'Address line 1 is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    if (formData.address_type === AddressType.WORK && !formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required for work addresses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && address) {
        const updateData: UpdateAddressDto = {
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2 || undefined,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          landmark: formData.landmark || undefined,
          address_type: formData.address_type,
          label: formData.label || undefined,
          company_name: formData.company_name || undefined,
          floor_details: formData.floor_details || undefined,
          is_primary: formData.is_primary,
        };

        const result = await dispatch(updateAddress({ id: address.id, data: updateData }));
        if (updateAddress.fulfilled.match(result)) {
          onSuccess(result.payload);
        }
      } else {
        const createData: CreateAddressDto = {
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2 || undefined,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          landmark: formData.landmark || undefined,
          address_type: formData.address_type,
          label: formData.label || undefined,
          company_name: formData.company_name || undefined,
          floor_details: formData.floor_details || undefined,
          is_primary: formData.is_primary,
        };

        const result = await dispatch(createAddress(createData));
        if (createAddress.fulfilled.match(result)) {
          onSuccess(result.payload);
        }
      }
    } catch (err) {
      console.error('Address submission error:', err);
    }
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number, fullAddress?: string) => {
    setMapCoordinates({ lat, lng });
    
    if (fullAddress) {
      try {
        // Parse the address from Nominatim result
        const addressParts = fullAddress.split(', ');
        
        // Extract city, state, and pincode from the result
        const cityMatch = addressParts.find(part => 
          !part.match(/^\d/) && 
          !part.includes('Block') && 
          !part.includes('District') &&
          !part.includes('Road') &&
          part.length > 2
        );
        
        const pincodeMatch = fullAddress.match(/\b\d{6}\b/);
        const stateMatch = addressParts.find(part => 
          ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'Odisha', 'Assam', 'Punjab', 'Haryana', 'Kerala', 'Jharkhand', 'Uttarakhand', 'Himachal Pradesh', 'Tripura', 'Meghalaya', 'Manipur', 'Nagaland', 'Goa', 'Arunachal Pradesh', 'Mizoram', 'Sikkim', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep', 'Puducherry'].some(state => 
            part.includes(state)
          )
        );

        // Update form fields with parsed data
        if (cityMatch && !formData.city) {
          handleInputChange('city', cityMatch);
        }
        
        if (pincodeMatch && !formData.pincode) {
          handleInputChange('pincode', pincodeMatch[0]);
        }
        
        if (stateMatch && !formData.state) {
          handleInputChange('state', stateMatch);
        }

        // Set the full address as address_line_1 if not already filled
        if (!formData.address_line_1) {
          const cleanAddress = addressParts[0] || fullAddress.split(',')[0];
          handleInputChange('address_line_1', cleanAddress);
        }
      } catch (error) {
        console.error('Error parsing address:', error);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--lk-surface)',
        borderRadius: '0.75rem',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid var(--lk-outline)'
        }}>
          <div>
            <div className="lk-typography-title-medium" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.25rem'
            }}>
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </div>
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
              {isEditing ? 'Update your address details' : 'Add a new address for home visits'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              color: 'var(--lk-onsurfacevariant)'
            }}
            className="hover:bg-surfacevariant"
          >
            <X style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Error Message */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem',
              backgroundColor: 'var(--lk-errorcontainer)',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-error)' }} />
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onerrorcontainer)' }}>
                {error}
              </div>
              <button
                onClick={() => dispatch(clearError())}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: 'var(--lk-error)',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Map Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Button
              variant={showMap ? 'fill' : 'text'}
              size="md"
              label={showMap ? 'Hide Map' : 'Use Map to Select Location'}
              color="primary"
              onClick={() => setShowMap(!showMap)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
            >
              <MapPin style={{ width: '1rem', height: '1rem' }} />
              {showMap ? 'Hide Map' : 'Use Map to Select Location'}
            </Button>
          </div>

          {/* Map Section */}
          {showMap && (
            <div style={{ marginBottom: '1.5rem' }}>
              <DynamicLeafletMap
                onLocationSelect={handleLocationSelect}
                initialLat={mapCoordinates?.lat}
                initialLng={mapCoordinates?.lng}
                height="300px"
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            {/* Address Line 1 */}
            <div>
              <label className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem',
                display: 'block',
                fontWeight: '500'
              }}>
                Address Line 1 *
              </label>
              <input
                type="text"
                value={formData.address_line_1}
                onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                placeholder="House/Flat number, Street name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${errors.address_line_1 ? 'var(--lk-error)' : 'var(--lk-outline)'}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)'
                }}
                className="focus:outline-none focus:border-primary"
              />
              {errors.address_line_1 && (
                <div className="lk-typography-body-small" style={{ 
                  color: 'var(--lk-error)', 
                  marginTop: '0.25rem' 
                }}>
                  {errors.address_line_1}
                </div>
              )}
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem',
                display: 'block',
                fontWeight: '500'
              }}>
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.address_line_2}
                onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                placeholder="Area, Colony, Sector (Optional)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--lk-outline)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)'
                }}
                className="focus:outline-none focus:border-primary"
              />
            </div>

            {/* City, State, Pincode Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  display: 'block',
                  fontWeight: '500'
                }}>
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${errors.city ? 'var(--lk-error)' : 'var(--lk-outline)'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  className="focus:outline-none focus:border-primary"
                />
                {errors.city && (
                  <div className="lk-typography-body-small" style={{ 
                    color: 'var(--lk-error)', 
                    marginTop: '0.25rem' 
                  }}>
                    {errors.city}
                  </div>
                )}
              </div>

              <div>
                <label className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  display: 'block',
                  fontWeight: '500'
                }}>
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${errors.state ? 'var(--lk-error)' : 'var(--lk-outline)'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  className="focus:outline-none focus:border-primary"
                />
                {errors.state && (
                  <div className="lk-typography-body-small" style={{ 
                    color: 'var(--lk-error)', 
                    marginTop: '0.25rem' 
                  }}>
                    {errors.state}
                  </div>
                )}
              </div>

              <div>
                <label className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  display: 'block',
                  fontWeight: '500'
                }}>
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${errors.pincode ? 'var(--lk-error)' : 'var(--lk-outline)'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  className="focus:outline-none focus:border-primary"
                />
                {errors.pincode && (
                  <div className="lk-typography-body-small" style={{ 
                    color: 'var(--lk-error)', 
                    marginTop: '0.25rem' 
                  }}>
                    {errors.pincode}
                  </div>
                )}
              </div>
            </div>

            {/* Address Type and Label Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  display: 'block',
                  fontWeight: '500'
                }}>
                  Address Type *
                </label>
                <select
                  value={formData.address_type}
                  onChange={(e) => handleInputChange('address_type', e.target.value as AddressType)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  className="focus:outline-none focus:border-primary"
                >
                  <option value={AddressType.HOME}>Home</option>
                  <option value={AddressType.WORK}>Work</option>
                  <option value={AddressType.OTHER}>Other</option>
                </select>
              </div>

              <div>
                <label className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  display: 'block',
                  fontWeight: '500'
                }}>
                  Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  placeholder="e.g., My Home, Mom's House"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  className="focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Work Address Fields */}
            {formData.address_type === AddressType.WORK && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="lk-typography-body-medium" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem',
                    display: 'block',
                    fontWeight: '500'
                  }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Company name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${errors.company_name ? 'var(--lk-error)' : 'var(--lk-outline)'}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'var(--lk-surface)',
                      color: 'var(--lk-onsurface)'
                    }}
                    className="focus:outline-none focus:border-primary"
                  />
                  {errors.company_name && (
                    <div className="lk-typography-body-small" style={{ 
                      color: 'var(--lk-error)', 
                      marginTop: '0.25rem' 
                    }}>
                      {errors.company_name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="lk-typography-body-medium" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem',
                    display: 'block',
                    fontWeight: '500'
                  }}>
                    Floor Details
                  </label>
                  <input
                    type="text"
                    value={formData.floor_details}
                    onChange={(e) => handleInputChange('floor_details', e.target.value)}
                    placeholder="Floor 3, Bay 2"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid var(--lk-outline)',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'var(--lk-surface)',
                      color: 'var(--lk-onsurface)'
                    }}
                    className="focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Landmark */}
            <div>
              <label className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem',
                display: 'block',
                fontWeight: '500'
              }}>
                Landmark
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => handleInputChange('landmark', e.target.value)}
                placeholder="Near metro station, mall, etc."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--lk-outline)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)'
                }}
                className="focus:outline-none focus:border-primary"
              />
            </div>

            {/* Primary Address Checkbox */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.is_primary}
                  onChange={(e) => handleInputChange('is_primary', e.target.checked)}
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    accentColor: 'var(--lk-primary)'
                  }}
                />
                <span className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurface)' }}>
                  Set as primary address
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
          padding: '1.5rem',
          borderTop: '1px solid var(--lk-outline)'
        }}>
          <Button
            variant="text"
            size="md"
            label="Cancel"
            color="primary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="fill"
            size="md"
            label={isLoading ? 'Saving...' : (isEditing ? 'Update Address' : 'Add Address')}
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Address' : 'Add Address')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;