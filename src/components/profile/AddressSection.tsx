'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAddresses,
  selectAddresses,
  selectPrimaryAddress,
  selectAddressLoading,
  selectAddressError,
  deleteAddress,
  setPrimaryAddress,
  clearError,
} from '@/store/slices/addressSlice';
import { Address, AddressType } from '@/lib/types/address';
import Card from '@/components/card';
import Button from '@/components/button';
import { 
  Plus, 
  MapPin, 
  Home, 
  Building2, 
  MoreVertical,
  Edit3,
  Trash2,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import AddressFormModal from './AddressFormModal';

const AddressSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);
  const primaryAddress = useAppSelector(selectPrimaryAddress);
  const loading = useAppSelector(selectAddressLoading);
  const error = useAppSelector(selectAddressError);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const getAddressTypeIcon = (type: AddressType) => {
    switch (type) {
      case AddressType.HOME:
        return <Home style={{ width: '1.25rem', height: '1.25rem' }} />;
      case AddressType.WORK:
        return <Building2 style={{ width: '1.25rem', height: '1.25rem' }} />;
      case AddressType.OTHER:
        return <MapPin style={{ width: '1.25rem', height: '1.25rem' }} />;
      default:
        return <MapPin style={{ width: '1.25rem', height: '1.25rem' }} />;
    }
  };

  const getAddressTypeColor = (type: AddressType) => {
    switch (type) {
      case AddressType.HOME:
        return 'var(--lk-primary)';
      case AddressType.WORK:
        return 'var(--lk-secondary)';
      case AddressType.OTHER:
        return 'var(--lk-tertiary)';
      default:
        return 'var(--lk-onsurfacevariant)';
    }
  };

  const formatAddress = (address: Address) => {
    const parts = [address.address_line_1];
    if (address.address_line_2) parts.push(address.address_line_2);
    parts.push(`${address.city}, ${address.state} ${address.pincode}`);
    return parts.join(', ');
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setDropdownOpen(null);
  };

  const handleDeleteConfirm = (addressId: string) => {
    setDeleteConfirm(addressId);
    setDropdownOpen(null);
  };

  const handleDelete = async (addressId: string) => {
    setDeletingId(addressId);
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
    } catch (error) {
      console.error('Failed to delete address:', error);
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  };

  const handleSetPrimary = async (addressId: string) => {
    try {
      await dispatch(setPrimaryAddress(addressId)).unwrap();
    } catch (error) {
      console.error('Failed to set primary address:', error);
    } finally {
      setDropdownOpen(null);
    }
  };

  const handleAddressFormSuccess = () => {
    setShowAddModal(false);
    setEditingAddress(null);
    dispatch(fetchAddresses());
  };

  if (loading && addresses.length === 0) {
    return (
      <Card variant="fill" scaleFactor="heading">
        <div className="p-lg" style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--lk-outline)',
            borderTop: '3px solid var(--lk-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
            Loading addresses...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card variant="fill" scaleFactor="heading">
        <div className="p-lg">
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div className="lk-typography-title-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.25rem'
              }}>
                Addresses
              </div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                Manage your addresses for home visits and bookings
              </div>
            </div>
            
            <Button
              variant="fill"
              size="md"
              label="Add Address"
              color="primary"
              onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus style={{ width: '1rem', height: '1rem' }} />
              Add Address
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem',
              backgroundColor: 'var(--lk-errorcontainer)',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
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

          {/* Addresses List */}
          {addresses.filter(addr => addr.is_active).length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              backgroundColor: 'var(--lk-surfacevariant)',
              borderRadius: '0.75rem',
              border: '2px dashed var(--lk-outline)'
            }}>
              <MapPin style={{ 
                width: '3rem', 
                height: '3rem', 
                color: 'var(--lk-onsurfacevariant)',
                margin: '0 auto 1rem'
              }} />
              <div className="lk-typography-title-small" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem'
              }}>
                No addresses added yet
              </div>
              <div className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurfacevariant)',
                marginBottom: '1.5rem'
              }}>
                Add your first address to start booking physiotherapy services at your location
              </div>
              <Button
                variant="fill"
                size="md"
                label="Add Your First Address"
                color="primary"
                onClick={() => setShowAddModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
              >
                <Plus style={{ width: '1rem', height: '1rem' }} />
                Add Your First Address
              </Button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {addresses.filter(addr => addr.is_active).map((address) => (
                <div
                  key={address.id}
                  style={{
                    border: `2px solid ${address.is_primary ? 'var(--lk-primary)' : 'var(--lk-outline)'}`,
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    backgroundColor: address.is_primary ? 'var(--lk-primarycontainer)' : 'var(--lk-surface)',
                    position: 'relative'
                  }}
                >
                  {/* Address Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        color: getAddressTypeColor(address.address_type),
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {getAddressTypeIcon(address.address_type)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="lk-typography-title-small" style={{ 
                            color: address.is_primary ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurface)',
                            fontWeight: '600'
                          }}>
                            {address.label || address.address_type}
                          </span>
                          {address.is_primary && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.125rem 0.5rem',
                              backgroundColor: 'var(--lk-primary)',
                              borderRadius: '0.75rem'
                            }}>
                              <Star style={{ width: '0.75rem', height: '0.75rem', color: 'var(--lk-onprimary)' }} />
                              <span className="lk-typography-label-small" style={{ 
                                color: 'var(--lk-onprimary)',
                                fontWeight: '500'
                              }}>
                                Primary
                              </span>
                            </div>
                          )}
                        </div>
                        {address.company_name && (
                          <div className="lk-typography-body-small" style={{ 
                            color: address.is_primary ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurfacevariant)',
                            marginTop: '0.125rem'
                          }}>
                            {address.company_name}
                            {address.floor_details && ` • ${address.floor_details}`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === address.id ? null : address.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          color: address.is_primary ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurfacevariant)'
                        }}
                        className="hover:bg-surfacevariant"
                      >
                        <MoreVertical style={{ width: '1.25rem', height: '1.25rem' }} />
                      </button>

                      {dropdownOpen === address.id && (
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          zIndex: 10,
                          backgroundColor: 'var(--lk-surface)',
                          border: '1px solid var(--lk-outline)',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          minWidth: '160px',
                          marginTop: '0.25rem'
                        }}>
                          <button
                            onClick={() => handleEdit(address)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              color: 'var(--lk-onsurface)'
                            }}
                            className="hover:bg-surfacevariant"
                          >
                            <Edit3 style={{ width: '1rem', height: '1rem' }} />
                            Edit
                          </button>
                          
                          {!address.is_primary && (
                            <button
                              onClick={() => handleSetPrimary(address.id)}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--lk-onsurface)'
                              }}
                              className="hover:bg-surfacevariant"
                            >
                              <Star style={{ width: '1rem', height: '1rem' }} />
                              Set as Primary
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteConfirm(address.id)}
                            disabled={deletingId === address.id || addresses.length <= 1}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              color: 'var(--lk-error)',
                              opacity: deletingId === address.id ? 0.5 : 1
                            }}
                            className="hover:bg-errorcontainer"
                          >
                            <Trash2 style={{ width: '1rem', height: '1rem' }} />
                            {deletingId === address.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Details */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div className="lk-typography-body-medium" style={{ 
                      color: address.is_primary ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurface)',
                      lineHeight: '1.5'
                    }}>
                      {formatAddress(address)}
                    </div>
                    {address.landmark && (
                      <div className="lk-typography-body-small" style={{ 
                        color: address.is_primary ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurfacevariant)',
                        marginTop: '0.25rem'
                      }}>
                        Near: {address.landmark}
                      </div>
                    )}
                  </div>

                  {/* Address Footer */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '0.5rem',
                    borderTop: `1px solid ${address.is_primary ? 'var(--lk-primary)' : 'var(--lk-outline)'}`,
                    opacity: 0.7
                  }}>
                    <span className="lk-typography-label-small" style={{ 
                      color: address.is_primary ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurfacevariant)'
                    }}>
                      Added {new Date(address.created_at).toLocaleDateString()}
                    </span>
                    <span className="lk-typography-label-small" style={{ 
                      color: address.is_primary ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurfacevariant)'
                    }}>
                      Pincode: {address.pincode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Address Form Modal */}
      {(showAddModal || editingAddress) && (
        <AddressFormModal
          address={editingAddress}
          onClose={() => {
            setShowAddModal(false);
            setEditingAddress(null);
          }}
          onSuccess={handleAddressFormSuccess}
        />
      )}

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 5
          }}
          onClick={() => setDropdownOpen(null)}
        />
      )}

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
                  <Trash2 style={{ width: '18px', height: '18px', color: '#dc2626' }} />
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
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deletingId === deleteConfirm}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: deletingId === deleteConfirm ? '#9ca3af' : '#dc2626',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#ffffff',
                    cursor: deletingId === deleteConfirm ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    if (deletingId !== deleteConfirm) {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (deletingId !== deleteConfirm) {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }
                  }}
                >
                  {deletingId === deleteConfirm ? (
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
    </>
  );
};

export default AddressSection;