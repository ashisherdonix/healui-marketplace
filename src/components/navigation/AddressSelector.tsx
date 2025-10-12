'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon, PlusIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { MapPinIcon as LocationIcon } from '@heroicons/react/24/solid';
import QuickAddressModal from './QuickAddressModal';
import { 
  selectCurrentAddress, 
  selectCurrentLocation, 
  selectActiveAddresses,
  selectLocationLoading,
  selectAddressLoading,
  setCurrentAddress,
  getCurrentLocation,
  fetchAddresses
} from '@/store/slices/addressSlice';
import { AppDispatch } from '@/store';

interface AddressSelectorProps {
  onAddAddress?: () => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onAddAddress }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const currentAddress = useSelector(selectCurrentAddress);
  const currentLocation = useSelector(selectCurrentLocation);
  const addresses = useSelector(selectActiveAddresses);
  const locationLoading = useSelector(selectLocationLoading);
  const addressLoading = useSelector(selectAddressLoading);

  useEffect(() => {
    // Fetch addresses on component mount
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleUseCurrentLocation = () => {
    dispatch(getCurrentLocation());
    setIsOpen(false);
  };

  const handleSelectAddress = (address: any) => {
    dispatch(setCurrentAddress(address));
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (currentAddress) {
      const shortAddress = `${currentAddress.address_line_1}, ${currentAddress.city}`;
      return shortAddress.length > 30 ? `${shortAddress.substring(0, 30)}...` : shortAddress;
    }
    
    if (currentLocation) {
      const shortLocation = currentLocation.address || 'Current Location';
      return shortLocation.length > 30 ? `${shortLocation.substring(0, 30)}...` : shortLocation;
    }
    
    return 'Select delivery location';
  };

  return (
    <div className="relative">
      {/* Address Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px] max-w-[280px]"
      >
        <MapPinIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
        <div className="flex-1 text-left">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Deliver to
          </div>
          <div className="text-sm font-medium text-gray-900 truncate">
            {addressLoading ? 'Loading...' : getDisplayText()}
          </div>
        </div>
        <ChevronDownIcon 
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {/* Current Location Option */}
            <div className="p-3 border-b border-gray-100">
              <button
                onClick={handleUseCurrentLocation}
                disabled={locationLoading}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="flex-shrink-0">
                  {locationLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                  ) : (
                    <LocationIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-blue-600">
                    Use current location
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentLocation ? 
                      (currentLocation.address || 'Current location detected') : 
                      'We\'ll detect your location'
                    }
                  </div>
                </div>
              </button>
            </div>

            {/* Saved Addresses */}
            {addresses.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => handleSelectAddress(address)}
                    className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors ${
                      currentAddress?.id === address.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${
                        address.address_type === 'HOME' ? 'bg-green-500' :
                        address.address_type === 'WORK' ? 'bg-orange-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {address.label || address.address_type}
                        </span>
                        {address.is_primary && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {address.address_line_1}, {address.city}, {address.state} {address.pincode}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Add New Address */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowAddModal(true);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <PlusIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Add new address
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Quick Add Address Modal */}
      <QuickAddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          // Refresh addresses after successful creation
          dispatch(fetchAddresses());
        }}
      />
    </div>
  );
};

export default AddressSelector;