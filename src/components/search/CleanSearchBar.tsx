'use client';

import React, { useState, useEffect, useRef } from 'react';
import ApiManager from '@/services/api';
import { Search, MapPin, Filter, Calendar, X } from 'lucide-react';
import { theme } from '@/utils/theme';

interface SearchParams {
  query: string;
  location: string;
  specialization: string;
  available_date: string;
}

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'city' | 'area' | 'pincode';
  display_name: string;
}

interface CleanSearchBarProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

const CleanSearchBar: React.FC<CleanSearchBarProps> = ({ onSearch, loading = false }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    location: '',
    specialization: '',
    available_date: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>([
    'Sports Injury',
    'Back Pain',
    'Post Surgery',
    'Neurological',
    'Pediatric',
    'Orthopedic'
  ]);

  const locationRef = useRef<HTMLDivElement>(null);

  // Load location suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchParams.location.length >= 2) {
        searchLocations(searchParams.location);
      } else {
        setLocationSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchParams.location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (query: string) => {
    try {
      const response = await ApiManager.searchLocations(query, 5);
      if (response.success && response.data) {
        setLocationSuggestions(response.data);
        setShowLocationDropdown(true);
      }
    } catch (error) {
      console.error('Failed to search locations:', error);
    }
  };

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSearchParams(prev => ({ ...prev, location: location.display_name }));
    setShowLocationDropdown(false);
  };

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const clearSearch = () => {
    setSearchParams({
      query: '',
      location: '',
      specialization: '',
      available_date: ''
    });
  };

  const hasFilters = searchParams.query || searchParams.location || searchParams.specialization || searchParams.available_date;

  return (
    <div>
      {/* Main Search Bar */}
      <div style={{
        backgroundColor: theme.colors.white,
        borderRadius: '50px',
        boxShadow: '0 8px 32px rgba(30, 95, 121, 0.12)',
        overflow: 'hidden',
        border: `3px solid ${theme.colors.secondary}`,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(30, 95, 121, 0.18)';
        e.currentTarget.style.borderColor = theme.colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(30, 95, 121, 0.12)';
        e.currentTarget.style.borderColor = theme.colors.secondary;
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px'
        }}>
          {/* Search Input */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search style={{
              width: '22px',
              height: '22px',
              color: theme.colors.primary,
              marginLeft: '20px',
              marginRight: '14px'
            }} />
            <input
              type="text"
              value={searchParams.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              placeholder="Search physiotherapists, conditions, or treatments"
              style={{
                flex: 1,
                height: '50px',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: theme.colors.text,
                backgroundColor: 'transparent',
                fontWeight: '500'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Divider */}
          <div style={{
            width: '2px',
            height: '32px',
            background: `linear-gradient(to bottom, transparent, ${theme.colors.secondary}, transparent)`,
            margin: '0 12px'
          }} />

          {/* Location Input */}
          <div ref={locationRef} style={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            minWidth: '200px'
          }}>
            <MapPin style={{
              width: '20px',
              height: '20px',
              color: theme.colors.primary,
              marginRight: '10px'
            }} />
            <input
              type="text"
              value={searchParams.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Location"
              style={{
                width: '100%',
                height: '50px',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: theme.colors.text,
                backgroundColor: 'transparent',
                fontWeight: '500'
              }}
              onFocus={() => searchParams.location.length >= 2 && setShowLocationDropdown(true)}
            />
            
            {/* Location Dropdown */}
            {showLocationDropdown && locationSuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 16px)',
                left: 0,
                right: 0,
                backgroundColor: theme.colors.white,
                border: `2px solid ${theme.colors.secondary}`,
                borderRadius: '16px',
                maxHeight: '280px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 12px 32px rgba(30, 95, 121, 0.15)'
              }}>
                {locationSuggestions.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: theme.colors.text,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'background-color 0.15s ease',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.background}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MapPin style={{ width: '16px', height: '16px', color: theme.colors.primary }} />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600' }}>{location.name}</div>
                      {location.type && (
                        <div style={{ fontSize: '13px', color: theme.colors.gray[500], marginTop: '2px' }}>
                          {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              marginLeft: '12px',
              marginRight: '6px',
              padding: '0 28px',
              height: '44px',
              background: theme.gradients.primary,
              color: theme.colors.white,
              border: 'none',
              borderRadius: '22px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.8 : 1,
              boxShadow: '0 4px 16px rgba(30, 95, 121, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 95, 121, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 95, 121, 0.3)';
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Searching
              </>
            ) : (
              <>
                <Search style={{ width: '18px', height: '18px' }} />
                Search
              </>
            )}
          </button>
        </div>
      </div>



      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CleanSearchBar;