'use client';

import { useState, useEffect } from 'react';
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

interface AddressFormProps {
  address?: Address; // For editing existing address
  onSuccess?: (address: Address) => void;
  onCancel?: () => void;
  className?: string;
}

export default function AddressForm({
  address,
  onSuccess,
  onCancel,
  className = '',
}: AddressFormProps) {
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

  useEffect(() => {
    // Clear error when component mounts
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
          onSuccess?.(result.payload);
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
          onSuccess?.(result.payload);
        }
      }
    } catch (err) {
      // Error is handled by Redux slice
      console.error('Address submission error:', err);
    }
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={`address-form ${className}`}>
      <div className="address-form-header">
        <h3>{isEditing ? 'Edit Address' : 'Add New Address'}</h3>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())}>×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="address_line_1">Address Line 1 *</label>
            <input
              type="text"
              id="address_line_1"
              value={formData.address_line_1}
              onChange={(e) => handleInputChange('address_line_1', e.target.value)}
              placeholder="House/Flat number, Street name"
              className={errors.address_line_1 ? 'error' : ''}
            />
            {errors.address_line_1 && <span className="error-text">{errors.address_line_1}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="address_line_2">Address Line 2</label>
            <input
              type="text"
              id="address_line_2"
              value={formData.address_line_2}
              onChange={(e) => handleInputChange('address_line_2', e.target.value)}
              placeholder="Area, Colony, Sector (Optional)"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="State"
              className={errors.state ? 'error' : ''}
            />
            {errors.state && <span className="error-text">{errors.state}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode *</label>
            <input
              type="text"
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="000000"
              maxLength={6}
              className={errors.pincode ? 'error' : ''}
            />
            {errors.pincode && <span className="error-text">{errors.pincode}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address_type">Address Type *</label>
            <select
              id="address_type"
              value={formData.address_type}
              onChange={(e) => handleInputChange('address_type', e.target.value as AddressType)}
            >
              <option value={AddressType.HOME}>Home</option>
              <option value={AddressType.WORK}>Work</option>
              <option value={AddressType.OTHER}>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="label">Label</label>
            <input
              type="text"
              id="label"
              value={formData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              placeholder="e.g., My Home, Mom's House"
            />
          </div>
        </div>

        {formData.address_type === AddressType.WORK && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company_name">Company Name *</label>
              <input
                type="text"
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Company name"
                className={errors.company_name ? 'error' : ''}
              />
              {errors.company_name && <span className="error-text">{errors.company_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="floor_details">Floor Details</label>
              <input
                type="text"
                id="floor_details"
                value={formData.floor_details}
                onChange={(e) => handleInputChange('floor_details', e.target.value)}
                placeholder="Floor 3, Bay 2"
              />
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="landmark">Landmark</label>
            <input
              type="text"
              id="landmark"
              value={formData.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              placeholder="Near metro station, mall, etc."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_primary}
                onChange={(e) => handleInputChange('is_primary', e.target.checked)}
              />
              Set as primary address
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Address' : 'Add Address')}
          </button>
        </div>
      </form>
    </div>
  );
}

// CSS styles (move to separate file in production)
const styles = `
.address-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.address-form-header h3 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
}

.error-banner {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-banner button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #721c24;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  flex: 1 1 100%;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.cancel-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.submit-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button:hover {
  background: #5a6268;
}

.submit-button:hover {
  background: #0056b3;
}

.cancel-button:disabled,
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
`;

// Inject styles
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}