'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAddresses,
  selectAddresses,
  selectPrimaryAddress,
  selectCurrentAddress,
  selectAddressLoading,
  selectAddressError,
  selectAddressForBooking,
  setPrimaryAddress,
} from '@/store/slices/addressSlice';
import { Address, AddressType } from '@/lib/types/address';

interface AddressSelectorProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
  showAddButton?: boolean;
  className?: string;
}

export default function AddressSelector({
  onAddressSelect,
  selectedAddressId,
  showAddButton = true,
  className = '',
}: AddressSelectorProps) {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);
  const primaryAddress = useAppSelector(selectPrimaryAddress);
  const currentAddress = useAppSelector(selectCurrentAddress);
  const loading = useAppSelector(selectAddressLoading);
  const error = useAppSelector(selectAddressError);

  const [selectedId, setSelectedId] = useState<string>(selectedAddressId || '');

  useEffect(() => {
    // Fetch addresses on component mount
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    // Auto-select primary address if no address is selected
    if (!selectedId && primaryAddress) {
      setSelectedId(primaryAddress.id);
      onAddressSelect(primaryAddress);
    }
  }, [primaryAddress, selectedId, onAddressSelect]);

  const handleAddressSelect = (address: Address) => {
    setSelectedId(address.id);
    onAddressSelect(address);
  };

  const getAddressDisplayText = (address: Address) => {
    const parts = [address.address_line_1];
    if (address.address_line_2) parts.push(address.address_line_2);
    parts.push(`${address.city}, ${address.state} ${address.pincode}`);
    return parts.join(', ');
  };

  const getAddressTypeIcon = (type: AddressType) => {
    switch (type) {
      case AddressType.HOME:
        return '🏠';
      case AddressType.WORK:
        return '🏢';
      case AddressType.OTHER:
        return '📍';
      default:
        return '📍';
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className={`address-selector ${className}`}>
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Loading addresses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`address-selector ${className}`}>
        <div className="error-state">
          <span className="error-text">Error loading addresses: {error}</span>
          <button 
            onClick={() => dispatch(fetchAddresses())}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`address-selector ${className}`}>
      <div className="address-selector-header">
        <h3>Select Address</h3>
        {showAddButton && (
          <button className="add-address-button">
            + Add New Address
          </button>
        )}
      </div>

      <div className="address-list">
        {addresses.filter(addr => addr.is_active).map((address) => (
          <div
            key={address.id}
            className={`address-card ${selectedId === address.id ? 'selected' : ''} ${
              address.is_primary ? 'primary' : ''
            }`}
            onClick={() => handleAddressSelect(address)}
          >
            <div className="address-card-header">
              <div className="address-type">
                <span className="type-icon">{getAddressTypeIcon(address.address_type)}</span>
                <span className="type-label">
                  {address.label || address.address_type}
                  {address.is_primary && <span className="primary-badge">Primary</span>}
                </span>
              </div>
              <input
                type="radio"
                name="address"
                value={address.id}
                checked={selectedId === address.id}
                onChange={() => handleAddressSelect(address)}
                className="address-radio"
              />
            </div>

            <div className="address-details">
              <p className="address-text">{getAddressDisplayText(address)}</p>
              {address.landmark && (
                <p className="landmark">Near: {address.landmark}</p>
              )}
              {address.company_name && (
                <p className="company">{address.company_name}</p>
              )}
              {address.floor_details && (
                <p className="floor">{address.floor_details}</p>
              )}
            </div>

            <div className="address-actions">
              <button className="edit-button">Edit</button>
              {!address.is_primary && (
                <button 
                  className="set-primary-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setPrimaryAddress(address.id));
                  }}
                >
                  Set as Primary
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {addresses.filter(addr => addr.is_active).length === 0 && (
        <div className="no-addresses">
          <p>No addresses found. Add your first address to continue.</p>
          <button className="add-first-address-button">
            Add Address
          </button>
        </div>
      )}
    </div>
  );
}

// CSS styles (you can move this to a separate CSS file)
const styles = `
.address-selector {
  max-width: 600px;
  margin: 0 auto;
}

.address-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.address-selector-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.add-address-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.address-card:hover {
  border-color: #007bff;
}

.address-card.selected {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.address-card.primary {
  border-color: #28a745;
}

.address-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.address-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-icon {
  font-size: 16px;
}

.type-label {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-badge {
  background: #28a745;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  text-transform: uppercase;
}

.address-details {
  margin-bottom: 12px;
}

.address-text {
  margin: 0 0 4px 0;
  color: #333;
}

.landmark, .company, .floor {
  margin: 2px 0;
  font-size: 14px;
  color: #666;
}

.address-actions {
  display: flex;
  gap: 8px;
}

.edit-button, .set-primary-button {
  background: none;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-button:hover, .set-primary-button:hover {
  background: #f8f9fa;
}

.loading-state, .error-state {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-text {
  color: #dc3545;
  display: block;
  margin-bottom: 8px;
}

.retry-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.no-addresses {
  text-align: center;
  padding: 40px 20px;
}

.add-first-address-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 16px;
}

.address-radio {
  width: 20px;
  height: 20px;
}
`;

// Inject styles (in a real app, use CSS modules or styled-components)
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}