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
      <div className="search-bar" style={{
        backgroundColor: theme.colors.white,
        borderRadius: 'clamp(1rem, 4vw, 3.125rem)',
        boxShadow: '0 0.5rem 2rem rgba(30, 95, 121, 0.12)',
        overflow: 'hidden',
        border: `clamp(1px, 0.5vw, 3px) solid ${theme.colors.secondary}`,
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0.75rem 2.5rem rgba(30, 95, 121, 0.18)';
        e.currentTarget.style.borderColor = theme.colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0.5rem 2rem rgba(30, 95, 121, 0.12)';
        e.currentTarget.style.borderColor = theme.colors.secondary;
      }}>
        <div className="search-container" style={{
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(0.25rem, 1vw, 0.375rem)',
          flexDirection: 'row',
          gap: '0'
        }}>
          {/* Search Input */}
          <div className="search-input-section" style={{ 
            flex: 3, 
            display: 'flex', 
            alignItems: 'center',
            minWidth: 0
          }}>
            <Search style={{
              width: 'clamp(1rem, 3vw, 1.375rem)',
              height: 'clamp(1rem, 3vw, 1.375rem)',
              color: theme.colors.primary,
              marginLeft: 'clamp(0.75rem, 3vw, 1.25rem)',
              marginRight: 'clamp(0.5rem, 2vw, 0.875rem)',
              flexShrink: 0
            }} />
            <input
              type="text"
              value={searchParams.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              placeholder="Search condition, specialization or physiotherapist"
              style={{
                flex: 1,
                height: 'clamp(2.5rem, 6vw, 3.125rem)',
                border: 'none',
                outline: 'none',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                color: theme.colors.text,
                backgroundColor: 'transparent',
                fontWeight: '500',
                minWidth: 0
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Divider */}
          <div className="search-divider" style={{
            width: '2px',
            height: 'clamp(1.5rem, 4vw, 2rem)',
            background: `linear-gradient(to bottom, transparent, ${theme.colors.secondary}, transparent)`,
            margin: '0 clamp(0.5rem, 2vw, 0.75rem)',
            flexShrink: 0
          }} />

          {/* Pincode Input */}
          <div ref={locationRef} className="location-input-section" style={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            width: 'clamp(5.5rem, 12vw, 7.5rem)',
            flex: '0 0 auto'
          }}>
            <MapPin style={{
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              color: theme.colors.primary,
              marginRight: 'clamp(0.25rem, 1vw, 0.375rem)',
              flexShrink: 0
            }} />
            <input
              type="tel"
              value={searchParams.location}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                handleInputChange('location', value);
              }}
              placeholder="6-digit pincode"
              maxLength={6}
              style={{
                width: '100%',
                height: 'clamp(2.5rem, 6vw, 3.125rem)',
                border: 'none',
                outline: 'none',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                color: theme.colors.text,
                backgroundColor: 'transparent',
                fontWeight: '500',
                minWidth: 0,
                textAlign: 'center',
                letterSpacing: '1px'
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
            className="search-button"
            onClick={handleSearch}
            disabled={loading}
            style={{
              marginLeft: 'clamp(0.5rem, 2vw, 0.75rem)',
              marginRight: 'clamp(0.25rem, 1vw, 0.375rem)',
              padding: '0 clamp(1rem, 4vw, 1.75rem)',
              height: 'clamp(2.25rem, 5vw, 2.75rem)',
              background: theme.gradients.primary,
              color: theme.colors.white,
              border: 'none',
              borderRadius: 'clamp(1.125rem, 3vw, 1.375rem)',
              fontSize: 'clamp(0.875rem, 3vw, 1rem)',
              fontWeight: '700',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.375rem, 1.5vw, 0.5rem)',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.8 : 1,
              boxShadow: '0 0.25rem 1rem rgba(30, 95, 121, 0.3)',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 0.375rem 1.25rem rgba(30, 95, 121, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(30, 95, 121, 0.3)';
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 'clamp(0.875rem, 2.5vw, 1rem)',
                  height: 'clamp(0.875rem, 2.5vw, 1rem)',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span className="search-button-text">Searching</span>
              </>
            ) : (
              <>
                <Search style={{ 
                  width: 'clamp(0.875rem, 2.5vw, 1.125rem)', 
                  height: 'clamp(0.875rem, 2.5vw, 1.125rem)' 
                }} />
                <span className="search-button-text">Search</span>
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
        
        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .search-container {
            flex-direction: column !important;
            gap: 0.75rem !important;
            padding: 1rem !important;
          }
          
          .search-divider {
            display: none !important;
          }
          
          .search-input-section,
          .location-input-section {
            width: 100% !important;
            min-width: 100% !important;
            flex: none !important;
          }
          
          .search-button {
            width: 100% !important;
            margin: 0 !important;
            justify-content: center !important;
          }
          
          .search-bar {
            border-radius: 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .search-container {
            padding: 0.75rem !important;
            gap: 0.5rem !important;
          }
          
          .search-input-section input::placeholder,
          .location-input-section input::placeholder {
            font-size: 0.8rem !important;
          }
          
          .search-input-section input::placeholder {
            content: "Search condition" !important;
          }
          
          .location-input-section input::placeholder {
            content: "Pincode" !important;
          }
          
          .search-button-text {
            display: none !important;
          }
          
          .search-button {
            padding: 0 1rem !important;
          }
        }
        
        @media (max-width: 360px) {
          .search-container {
            padding: 0.625rem !important;
            gap: 0.375rem !important;
          }
          
          .search-input-section input::placeholder {
            content: "Search" !important;
          }
          
          .location-input-section input::placeholder {
            content: "Pincode" !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CleanSearchBar;