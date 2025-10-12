'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon, PlusIcon, TrashIcon, Edit3Icon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import QuickAddressModal from './QuickAddressModal';
import { 
  selectCurrentAddress, 
  selectCurrentLocation, 
  selectActiveAddresses,
  selectLocationLoading,
  selectAddressLoading,
  selectAddressDeleting,
  setCurrentAddress,
  getCurrentLocation,
  fetchAddresses,
  deleteAddress
} from '@/store/slices/addressSlice';
import { AppDispatch } from '@/store';

interface AddressBannerProps {
  onAddAddress?: () => void;
}

const AddressBanner: React.FC<AddressBannerProps> = ({ onAddAddress }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const currentAddress = useSelector(selectCurrentAddress);
  const currentLocation = useSelector(selectCurrentLocation);
  const addresses = useSelector(selectActiveAddresses);
  const locationLoading = useSelector(selectLocationLoading);
  const addressLoading = useSelector(selectAddressLoading);
  const addressDeleting = useSelector(selectAddressDeleting);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Auto-select primary address on first render, or use current location if no addresses
  useEffect(() => {
    if (addresses.length > 0 && !currentAddress) {
      const primaryAddress = addresses.find(addr => addr.is_primary && addr.is_active);
      if (primaryAddress) {
        dispatch(setCurrentAddress(primaryAddress));
      }
    } else if (addresses.length === 0 && !currentAddress && !currentLocation && !locationLoading) {
      // No saved addresses and no current location - automatically get current location
      console.log('No saved addresses found, automatically getting current location...');
      dispatch(getCurrentLocation());
    }
  }, [addresses, currentAddress, currentLocation, locationLoading, dispatch]);

  const handleUseCurrentLocation = useCallback(() => {
    dispatch(getCurrentLocation());
    setIsOpen(false);
  }, [dispatch]);

  // Extract and log pincode when current location changes
  useEffect(() => {
    if (currentLocation && currentLocation.address) {
      // Extract 6-digit pincode from address string
      const pincodeMatch = currentLocation.address.match(/\b\d{6}\b/);
      if (pincodeMatch) {
        console.log('PINCODE CHOOSES:', pincodeMatch[0]);
      } else {
        console.log('PINCODE CHOOSES: No pincode found in current location');
      }
    }
  }, [currentLocation]);

  const handleSelectAddress = useCallback((address: any) => {
    console.log('PINCODE CHOOSES:', address.pincode);
    dispatch(setCurrentAddress(address));
    setIsOpen(false);
  }, [dispatch]);

  const handleAddClick = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleModalSuccess = useCallback(() => {
    dispatch(fetchAddresses());
    setShowAddModal(false);
  }, [dispatch]);


  const handleDeleteAddress = useCallback(async (addressId: string) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      // If deleted address was current, clear it
      if (currentAddress?.id === addressId) {
        dispatch(setCurrentAddress(null));
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  }, [dispatch, currentAddress]);

  const displayText = useMemo(() => {
    if (currentAddress) {
      return `${currentAddress.address_line_1}, ${currentAddress.city}`;
    }
    
    if (currentLocation) {
      return currentLocation.address || 'Current Location';
    }
    
    return 'Select your delivery location';
  }, [currentAddress, currentLocation]);

  const shortDisplayText = useMemo(() => {
    return displayText.length > 50 ? `${displayText.substring(0, 47)}...` : displayText;
  }, [displayText]);

  return (
    <>
      {/* Address Banner */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '8px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem',
          position: 'relative'
        }}>
          {/* Desktop: Compact left-aligned container */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '1rem'
          }}>
            {/* Address Container - Responsive */}
            <div className="address-container" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '600px',
              width: '100%',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Address Display */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                flex: 1,
                minWidth: 0
              }}>
                <MapPinIcon style={{ 
                  width: '16px', 
                  height: '16px', 
                  color: '#dc2626',
                  flexShrink: 0
                }} />
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="service-label" style={{ 
                    fontSize: '10px', 
                    color: '#64748b',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '1px'
                  }}>
                    Service Location
                  </div>
                  <div className="address-text" style={{ 
                    fontSize: '13px', 
                    color: '#1e293b',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {addressLoading ? 'Loading...' : shortDisplayText}
                  </div>
                </div>
              </div>

              {/* Change Button Only */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexShrink: 0
              }}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '4px 8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  Change
                  <ChevronDownIcon style={{ 
                    width: '10px', 
                    height: '10px',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} />
                </button>
              </div>
            </div>
          </div>

          {/* Dropdown Menu - Positioned relative to address container */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 10
                }}
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown Content - Responsive */}
              <div className="address-dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                width: '500px',
                marginTop: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                zIndex: 20,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {/* Current Location Option */}
                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <button
                    onClick={handleUseCurrentLocation}
                    disabled={locationLoading}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: locationLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!locationLoading) {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      {locationLoading ? (
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #3b82f6',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                      ) : (
                        <div style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#ffffff',
                            borderRadius: '50%'
                          }} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#3b82f6',
                        marginBottom: '2px'
                      }}>
                        Use current location
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#64748b' 
                      }}>
                        {currentLocation ? 
                          (currentLocation.address || 'Current location detected') : 
                          'We\'ll detect your location automatically'
                        }
                      </div>
                    </div>
                  </button>
                </div>

                {/* Saved Addresses */}
                {addresses.length > 0 && (
                  <div style={{ padding: '8px' }}>
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        style={{
                          display: 'flex',
                          alignItems: 'stretch',
                          gap: '2px',
                          marginBottom: '4px'
                        }}
                      >
                        <button
                          onClick={() => handleSelectAddress(address)}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'start',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: currentAddress?.id === address.id ? '#f0f9ff' : 'transparent',
                            border: 'none',
                            borderRadius: '6px 0 0 6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (currentAddress?.id !== address.id) {
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentAddress?.id !== address.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <div style={{ 
                            flexShrink: 0, 
                            marginTop: '2px'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: 
                                address.address_type === 'HOME' ? '#10b981' :
                                address.address_type === 'WORK' ? '#f59e0b' : '#6b7280'
                            }} />
                          </div>
                          <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              marginBottom: '4px'
                            }}>
                              <span style={{ 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#1e293b' 
                              }}>
                                {address.label || address.address_type}
                              </span>
                              {address.is_primary && (
                                <span style={{
                                  fontSize: '9px',
                                  backgroundColor: '#10b981',
                                  color: '#ffffff',
                                  padding: '3px 6px',
                                  borderRadius: '10px',
                                  fontWeight: '600',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}>
                                  ★ Primary
                                </span>
                              )}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#64748b',
                              lineHeight: '1.4'
                            }}>
                              {address.address_line_1}, {address.city}, {address.state} {address.pincode}
                            </div>
                          </div>
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(address.id);
                          }}
                          disabled={addresses.length <= 1}
                          style={{
                            width: '40px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0 6px 6px 0',
                            cursor: addresses.length <= 1 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: addresses.length <= 1 ? 0.4 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (addresses.length > 1) {
                              e.currentTarget.style.backgroundColor = '#fef2f2';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <TrashIcon style={{ width: '18px', height: '18px', color: '#dc2626' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {addresses.length === 0 && (
                  <div style={{ 
                    padding: '24px', 
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    No saved addresses yet. Add your first address to get started.
                  </div>
                )}

                {/* Add New Address Option */}
                <div style={{ padding: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowAddModal(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <PlusIcon style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: '#64748b',
                      flexShrink: 0
                    }} />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Add new address
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Add Address Modal */}
      <QuickAddressModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />


      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
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
            maxWidth: '400px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrashIcon style={{ width: '18px', height: '18px', color: '#dc2626' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0,
                    marginBottom: '2px'
                  }}>
                    Delete Address
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#374151',
                margin: '0 0 20px 0',
                lineHeight: '1.5'
              }}>
                Are you sure you want to delete this address? You won't be able to recover it.
              </p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#64748b',
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
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAddress(deleteConfirm)}
                  disabled={addressDeleting}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: addressDeleting ? '#9ca3af' : '#dc2626',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#ffffff',
                    cursor: addressDeleting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    if (!addressDeleting) {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!addressDeleting) {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }
                  }}
                >
                  {addressDeleting ? (
                    <>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations and responsive styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          .address-container {
            gap: 0.5rem !important;
            padding: 6px 12px !important;
            max-width: 100% !important;
          }
          
          .address-container > div:first-child {
            gap: 6px !important;
          }
          
          .address-container svg {
            width: 14px !important;
            height: 14px !important;
          }
          
          .address-container button {
            padding: 3px 6px !important;
            font-size: 10px !important;
            gap: 2px !important;
          }
          
          .address-container button svg {
            width: 8px !important;
            height: 8px !important;
          }
          
          .address-dropdown {
            width: calc(100vw - 2rem) !important;
            max-width: 500px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
          
          .address-dropdown button {
            font-size: 12px !important;
          }
          
          .address-dropdown > div {
            padding: 12px !important;
          }
          
          .service-label {
            font-size: 9px !important;
            letter-spacing: 0.3px !important;
          }
          
          .address-text {
            font-size: 11px !important;
          }
        }
      `}</style>
    </>
  );
};

export default AddressBanner;