'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon, MapPinIcon, MapIcon } from '@heroicons/react/24/outline';
import { 
  Edit3, 
  Map, 
  Home, 
  Building2, 
  MapPin, 
  AlertCircle, 
  Check,
  Loader2,
  Plus
} from 'lucide-react';
import DynamicLeafletMap from '@/components/map/DynamicLeafletMap';
import { 
  createAddress,
  selectAddressCreating,
  selectAddressError,
  clearError 
} from '@/store/slices/addressSlice';
import { CreateAddressDto } from '@/lib/types/address';
import { AppDispatch } from '@/store';

interface QuickAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QuickAddressModal: React.FC<QuickAddressModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const creating = useSelector(selectAddressCreating);
  const error = useSelector(selectAddressError);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    address_line_1: '',
    city: '',
    state: '',
    pincode: '',
    address_type: 'HOME' as 'HOME' | 'WORK' | 'OTHER',
    label: '',
    landmark: '',
    is_primary: false
  });

  const [useMapInput, setUseMapInput] = useState(false);
  const [mapLocation, setMapLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const addressData: CreateAddressDto = {
      ...formData,
      country: 'India'
    };

    try {
      await dispatch(createAddress(addressData)).unwrap();
      onSuccess?.();
      handleClose();
    } catch (error) {
      // Error is handled by Redux
      console.error('Failed to create address:', error);
    }
  };

  const handleMapLocationSelect = useCallback((lat: number, lng: number, address?: string) => {
    setMapLocation({ lat, lng, address });
    
    if (address) {
      // Smart parsing of the address
      const parts = address.split(',').map(part => part.trim());
      let addressLine1 = '';
      let city = '';
      let state = '';
      let pincode = '';
      
      // Try to extract meaningful parts
      if (parts.length >= 2) {
        addressLine1 = parts[0] || '';
        city = parts[parts.length - 3] || '';
        state = parts[parts.length - 2] || '';
        
        // Look for pincode pattern
        const pincodeMatch = address.match(/\b\d{6}\b/);
        if (pincodeMatch) {
          pincode = pincodeMatch[0];
        }
      }
      
      setFormData(prev => ({
        ...prev,
        address_line_1: addressLine1,
        city: city,
        state: state,
        pincode: pincode
      }));
    }
  }, []);

  const handleClose = useCallback(() => {
    setFormData({
      address_line_1: '',
      city: '',
      state: '',
      pincode: '',
      address_type: 'HOME',
      label: '',
      landmark: '',
      is_primary: false
    });
    setUseMapInput(false);
    setMapLocation(null);
    dispatch(clearError());
    onClose();
  }, [dispatch, onClose]);

  // Early return if not open or not mounted - prevents any rendering
  if (!mounted || !isOpen) {
    return null;
  }

  const modalContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: useMapInput ? '680px' : '460px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 18px 24px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#1e5f79',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin size={20} color="#ffffff" />
            </div>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
                marginBottom: '2px'
              }}>
                Add Address
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                margin: 0
              }}>
                Enter details manually or select on map
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          >
            <XMarkIcon style={{ width: '18px', height: '18px', color: '#64748b' }} />
          </button>
        </div>

        {/* Input Method Toggle */}
        <div style={{ padding: '16px 24px 0 24px' }}>
          <div style={{
            display: 'flex',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            padding: '3px',
            gap: '2px'
          }}>
            <button
              type="button"
              onClick={() => setUseMapInput(false)}
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: '7px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: !useMapInput ? '#ffffff' : 'transparent',
                color: !useMapInput ? '#1e5f79' : '#64748b',
                boxShadow: !useMapInput ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Edit3 size={14} />
              Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setUseMapInput(true)}
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: '7px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: useMapInput ? '#ffffff' : 'transparent',
                color: useMapInput ? '#1e5f79' : '#64748b',
                boxShadow: useMapInput ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Map size={14} />
              Select on Map
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            margin: '16px 24px',
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} color="#dc2626" />
            <p style={{
              fontSize: '13px',
              color: '#dc2626',
              margin: 0,
              fontWeight: '500'
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Map Section */}
        {useMapInput && (
          <div style={{ padding: '0 24px' }}>
            <div style={{
              height: '300px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>
              <DynamicLeafletMap
                onLocationSelect={handleMapLocationSelect}
                height="300px"
                showSearch={true}
                initialCenter={mapLocation ? [mapLocation.lat, mapLocation.lng] : undefined}
              />
            </div>
            {mapLocation && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #e0f2fe'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#0369a1" />
                  <p style={{
                    fontSize: '12px',
                    color: '#0369a1',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {mapLocation.address || `${mapLocation.lat.toFixed(6)}, ${mapLocation.lng.toFixed(6)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '18px 24px 22px 24px' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            {/* Address Type */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Address Type
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { value: 'HOME', label: 'Home', icon: Home },
                  { value: 'WORK', label: 'Work', icon: Building2 },
                  { value: 'OTHER', label: 'Other', icon: MapPin }
                ].map((type) => {
                  const IconComponent = type.icon;
                  return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      address_type: type.value as any 
                    }))}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: `2px solid ${formData.address_type === type.value ? '#1e5f79' : '#e2e8f0'}`,
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: formData.address_type === type.value ? '#f0f9ff' : '#ffffff',
                      color: formData.address_type === type.value ? '#1e5f79' : '#64748b'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.address_type !== type.value) {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.address_type !== type.value) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                        <IconComponent size={18} />
                      </div>
                      <div style={{ fontSize: '13px' }}>{type.label}</div>
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Label */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Label <span style={{ color: '#9ca3af', fontWeight: '400' }}>(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., Mom's House, Office"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1e5f79';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Address Line 1 <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.address_line_1}
                onChange={(e) => setFormData(prev => ({ ...prev, address_line_1: e.target.value }))}
                placeholder="House/Flat/Office No., Street"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1e5f79';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Landmark */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Landmark <span style={{ color: '#9ca3af', fontWeight: '400' }}>(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                placeholder="Near Metro Station, Mall etc."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1e5f79';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* City and State */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  City <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1e5f79';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  State <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="State"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1e5f79';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Pincode <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormData(prev => ({ ...prev, pincode: value }));
                }}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1e5f79';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                maxLength={6}
                required
              />
            </div>

            {/* Primary Address Checkbox */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <input
                type="checkbox"
                id="is_primary"
                checked={formData.is_primary}
                onChange={(e) => setFormData(prev => ({ ...prev, is_primary: e.target.checked }))}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#1e5f79'
                }}
              />
              <label htmlFor="is_primary" style={{
                fontSize: '14px',
                color: '#1e293b',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Set as primary address
              </label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || !formData.address_line_1 || !formData.city || !formData.state || !formData.pincode}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  backgroundColor: creating || !formData.address_line_1 || !formData.city || !formData.state || !formData.pincode 
                    ? '#9ca3af' : '#1e5f79',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#ffffff',
                  cursor: creating || !formData.address_line_1 || !formData.city || !formData.state || !formData.pincode 
                    ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  if (!creating && formData.address_line_1 && formData.city && formData.state && formData.pincode) {
                    e.currentTarget.style.backgroundColor = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!creating && formData.address_line_1 && formData.city && formData.state && formData.pincode) {
                    e.currentTarget.style.backgroundColor = '#1e5f79';
                  }
                }}
              >
                {creating ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add Address
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default QuickAddressModal;