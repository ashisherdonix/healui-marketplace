'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Stethoscope, Home, Monitor, ChevronDown, X, Navigation } from 'lucide-react';
import { theme } from '@/utils/theme';

interface SimpleSearchFilters {
  query: string; // Combined search for name or pincode
  specialty: string;
  serviceType: 'ALL' | 'HOME_VISIT' | 'ONLINE';
}

interface SimpleSearchInterfaceProps {
  onSearch: (filters: SimpleSearchFilters) => void;
  loading?: boolean;
  placeholder?: string;
  initialFilters?: Partial<SimpleSearchFilters>;
  showFilters?: boolean; // New prop to control filter visibility
}

const ALL_SPECIALTIES = [
  { id: '', label: 'All Specialties' },
  { id: 'orthopedic', label: 'Orthopedic' },
  { id: 'neurological', label: 'Neurological' },
  { id: 'pediatric', label: 'Pediatric' },
  { id: 'geriatric', label: 'Geriatric' },
  { id: 'sports', label: 'Sports Medicine' },
  { id: 'cardiac', label: 'Cardiac' },
  { id: 'pulmonary', label: 'Pulmonary' },
  { id: 'women_health', label: 'Women\'s Health' },
  { id: 'pain_management', label: 'Pain Management' },
  { id: 'rehabilitation', label: 'Rehabilitation' }
];

const SERVICE_TYPES = [
  { id: 'ALL', label: 'All Services' },
  { id: 'HOME_VISIT', label: 'Home Visit' },
  { id: 'ONLINE', label: 'Online' }
];

const SimpleSearchInterface: React.FC<SimpleSearchInterfaceProps> = ({
  onSearch,
  loading = false,
  placeholder = "Search by name or pincode...",
  initialFilters = {},
  showFilters = true // Default to true for backward compatibility
}) => {
  const [filters, setFilters] = useState<SimpleSearchFilters>({
    query: initialFilters.query || '',
    specialty: initialFilters.specialty || '',
    serviceType: initialFilters.serviceType || 'ALL'
  });
  const [inputFocused, setInputFocused] = useState(false);
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showPincodePrompt, setShowPincodePrompt] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [pincodePromptDismissed, setPincodePromptDismissed] = useState(false);

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters({
      query: initialFilters.query || '',
      specialty: initialFilters.specialty || '',
      serviceType: initialFilters.serviceType || 'ALL'
    });
  }, [initialFilters.query, initialFilters.specialty, initialFilters.serviceType]);

  // Removed animated placeholders for cleaner UX

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleInputChange = (field: keyof SimpleSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    
    // Check if pincode prompt needed when switching to home visit (only if filters are shown)
    if (showFilters && field === 'serviceType' && value === 'HOME_VISIT') {
      checkPincodeNeeded();
    }
  };

  // Smooth pincode detection and handling
  const checkPincodeNeeded = () => {
    const hasPincode = /\d{6}/.test(filters.query); // Check for 6-digit pincode
    const hasLocationKeywords = /\b(near|in|at|around)\b/i.test(filters.query); // Check for location indicators
    
    if (!hasPincode && !hasLocationKeywords && !userLocation && !pincodePromptDismissed) {
      // Delay showing prompt to avoid interrupting user flow
      setTimeout(() => setShowPincodePrompt(true), 800);
    }
  };

  // Detect pincode in search query and auto-close prompt
  useEffect(() => {
    const hasPincode = /\d{6}/.test(filters.query);
    if (hasPincode && showPincodePrompt) {
      setShowPincodePrompt(false);
    }
  }, [filters.query, showPincodePrompt]);

  // Get user's current location
  const getCurrentLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        });
      });
      
      // Get pincode from coordinates (you'd call a reverse geocoding service)
      setUserLocation('Current Location');
      setShowPincodePrompt(false);
      // You can add reverse geocoding API call here
      
    } catch (error) {
      console.warn('Location access denied');
    }
  };

  // Format specialty display name
  const getSpecialtyDisplayName = (specialtyId: string) => {
    const specialty = ALL_SPECIALTIES.find(s => s.id === specialtyId);
    return specialty ? specialty.label : 'All Specialties';
  };

  // Format service type display name
  const getServiceTypeDisplayName = (serviceTypeId: string) => {
    const serviceType = SERVICE_TYPES.find(s => s.id === serviceTypeId);
    return serviceType ? serviceType.label : 'All Services';
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const active = [];
    if (filters.specialty) {
      const specialty = ALL_SPECIALTIES.find(s => s.id === filters.specialty);
      active.push({ type: 'specialty', label: specialty?.label || filters.specialty, value: filters.specialty });
    }
    if (filters.serviceType !== 'ALL') {
      const service = SERVICE_TYPES.find(s => s.id === filters.serviceType);
      active.push({ type: 'serviceType', label: service?.label || filters.serviceType, value: filters.serviceType });
    }
    return active;
  };

  // Clear specific filter
  const clearFilter = (type: string) => {
    if (type === 'specialty') {
      setFilters(prev => ({ ...prev, specialty: '' }));
    } else if (type === 'serviceType') {
      setFilters(prev => ({ ...prev, serviceType: 'ALL' }));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(prev => ({ ...prev, specialty: '', serviceType: 'ALL' }));
  };

  // Detect if the query is a pincode (contains numbers) or name (contains letters)
  const detectSearchType = (query: string) => {
    const hasNumbers = /\d/.test(query);
    const hasLetters = /[a-zA-Z]/.test(query);
    
    if (hasNumbers && !hasLetters) {
      return 'pincode';
    } else if (hasLetters && !hasNumbers) {
      return 'name';
    } else if (hasNumbers && hasLetters) {
      return 'mixed'; // Could be name with numbers or address
    }
    return 'unknown';
  };

  // Clear search capabilities placeholder
  const getPlaceholderText = () => {
    return "Search by name or pincode";
  };

  const getSearchIcon = () => {
    const searchType = detectSearchType(filters.query);
    if (searchType === 'pincode') {
      return <MapPin style={{ 
        width: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
        height: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
        color: theme.colors.primary 
      }} />;
    }
    return <Search style={{ 
      width: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
      height: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
      color: theme.colors.gray[400] 
    }} />;
  };

  const inputStyle = {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1rem) clamp(3rem, 6vw, 3.5rem)',
    border: `1px solid ${theme.colors.gray[300]}`,
    borderRadius: '12px',
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%'
  };

  const selectStyle = {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    padding: 'clamp(0.875rem, 2.5vw, 1.125rem) clamp(2.5rem, 5vw, 3rem) clamp(0.875rem, 2.5vw, 1.125rem) clamp(3rem, 6vw, 3.5rem)',
    border: `1px solid ${theme.colors.gray[300]}`,
    borderRadius: '12px',
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
    height: 'clamp(3rem, 7vw, 3.5rem)',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em'
  };

  const focusStyle = {
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 3px ${theme.colors.primary}20`
  };

  // Simple homepage version without filters
  if (!showFilters) {
    return (
      <div style={{
        background: theme.colors.white,
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        border: `1px solid ${theme.colors.gray[200]}`,
        padding: '1.5rem',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'stretch' }}>
          {/* Single Search Input */}
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <Search style={{ 
                width: '1.25rem', 
                height: '1.25rem', 
                color: theme.colors.gray[400]
              }} />
            </div>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              placeholder={getPlaceholderText()}
              style={{
                fontSize: '1rem',
                padding: '1rem 1.5rem 1rem 3.5rem',
                border: `2px solid ${theme.colors.gray[300]}`,
                borderRadius: '12px',
                backgroundColor: theme.colors.white,
                color: theme.colors.text,
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
                fontWeight: '400',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                minHeight: '52px',
                textOverflow: 'ellipsis'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                e.target.style.transform = 'scale(1.01)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.gray[300];
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'scale(1)';
              }}
              className="search-input"
            />
          </div>

          {/* Minimized Search Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? theme.colors.gray[400] : theme.colors.primary,
              color: theme.colors.white,
              fontWeight: '600',
              fontSize: '1rem',
              padding: '1rem 2rem',
              borderRadius: '12px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              minHeight: '52px',
              boxShadow: '0 2px 8px rgba(30, 95, 121, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 95, 121, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 95, 121, 0.2)';
              }
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search capabilities hint */}
        <div style={{
          textAlign: 'center',
          marginTop: '0.75rem',
          fontSize: '0.875rem',
          color: theme.colors.gray[500]
        }}>
          Try: "Dr. Sharma", "400001", "back pain"
        </div>

        {/* Mobile Responsive CSS for simple version */}
        <style jsx>{`
          /* Container adjustments for mobile */
          @media (max-width: 768px) {
            div[style*="maxWidth: 600px"] {
              max-width: 100% !important;
              margin: 0 !important;
              padding: 1rem !important;
              border-radius: 12px !important;
              box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04) !important;
            }
            
            form {
              flex-direction: column !important;
              gap: 1rem !important;
            }
            
            button[type="submit"] {
              width: 100% !important;
              padding: 1rem 1.5rem !important;
              font-size: 1rem !important;
              min-height: 52px !important;
              border-radius: 12px !important;
              margin: 0 !important;
            }
            
            input[type="text"] {
              font-size: 1rem !important;
              padding: 1rem 1.5rem 1rem 3.5rem !important;
              min-height: 52px !important;
              border-radius: 12px !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
            
            /* Search icon positioning */
            div[style*="position: absolute"] {
              left: 1.25rem !important;
            }
            
            /* Hint text */
            div[style*="Try:"] {
              font-size: 0.875rem !important;
              margin-top: 1rem !important;
            }
          }
          
          @media (max-width: 480px) {
            div[style*="maxWidth: 600px"] {
              padding: 1rem !important;
              margin: 0 0.5rem !important;
            }
            
            input[type="text"] {
              font-size: 1rem !important;
              padding: 1rem 1.25rem 1rem 3.25rem !important;
            }
            
            /* Search icon positioning for small mobile */
            div[style*="position: absolute"] {
              left: 1.125rem !important;
            }
            
            button[type="submit"] {
              font-size: 1rem !important;
              padding: 1rem 1.5rem !important;
            }
            
            /* Search icon smaller */
            svg {
              width: 1.125rem !important;
              height: 1.125rem !important;
            }
          }
          
          /* Ensure full width on very small screens */
          @media (max-width: 320px) {
            div[style*="maxWidth: 600px"] {
              margin: 0 !important;
              border-radius: 8px !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Full search page version with filters
  return (
    <div style={{
      background: 'transparent',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <div style={{
            position: 'absolute',
            left: '1.25rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <Search style={{ 
              width: '1.25rem', 
              height: '1.25rem', 
              color: theme.colors.gray[400]
            }} />
          </div>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleInputChange('query', e.target.value)}
            placeholder={getPlaceholderText()}
            style={{
              fontSize: '1rem',
              padding: '1rem 5rem 1rem 3rem',
              border: 'none',
              borderRadius: '16px',
              backgroundColor: theme.colors.white,
              color: theme.colors.text,
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              fontWeight: '500',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              minHeight: '56px'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = `0 8px 32px rgba(30, 95, 121, 0.15)`;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              e.target.style.transform = 'translateY(0)';
            }}
          />
          
          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: loading ? theme.colors.gray[400] : 'linear-gradient(135deg, #1e5f79 0%, #0f4c75 100%)',
              color: theme.colors.white,
              fontWeight: '600',
              fontSize: '0.95rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(30, 95, 121, 0.25)',
              minHeight: '44px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0f4c75 0%, #1e5f79 100%)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 95, 121, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1e5f79 0%, #0f4c75 100%)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 95, 121, 0.25)';
              }
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Enhanced Filters Row */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          
          {/* Filters Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '0.75rem',
            alignItems: 'stretch'
          }}>
            {/* Specialty Filter */}
            <div style={{ position: 'relative', flex: 1 }}>
              <button
                type="button"
                onClick={() => setShowSpecialtyDropdown(!showSpecialtyDropdown)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: filters.specialty ? theme.colors.primary + '15' : theme.colors.gray[50],
                  color: filters.specialty ? theme.colors.primary : theme.colors.gray[700],
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  if (!filters.specialty) {
                    e.currentTarget.style.backgroundColor = theme.colors.gray[100];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filters.specialty) {
                    e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Stethoscope style={{ width: '1rem', height: '1rem' }} />
                  <span>{getSpecialtyDisplayName(filters.specialty)}</span>
                </div>
                <ChevronDown style={{ 
                  width: '1rem', 
                  height: '1rem',
                  transform: showSpecialtyDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
            </button>
            
              {/* Specialty Dropdown */}
              {showSpecialtyDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  backgroundColor: theme.colors.white,
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  marginTop: '0.5rem',
                  maxHeight: '280px',
                  overflowY: 'auto'
                }}>
                {ALL_SPECIALTIES.map((specialty) => (
                  <div
                    key={specialty.id}
                    onClick={() => {
                      handleInputChange('specialty', specialty.id);
                      setShowSpecialtyDropdown(false);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${theme.colors.gray[100]}`,
                      backgroundColor: filters.specialty === specialty.id ? theme.colors.primaryLight + '20' : 'transparent',
                      color: filters.specialty === specialty.id ? theme.colors.primary : theme.colors.text,
                      fontSize: '0.9rem',
                      fontWeight: filters.specialty === specialty.id ? '600' : '400',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (filters.specialty !== specialty.id) {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.specialty !== specialty.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>{specialty.label}</span>
                  </div>
                ))}
                </div>
              )}
            </div>

            {/* Service Type Tabs */}
            <div style={{
              display: 'flex',
              backgroundColor: theme.colors.gray[50],
              borderRadius: '12px',
              padding: '0.25rem',
              gap: '0.25rem',
              minWidth: 'fit-content',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              {SERVICE_TYPES.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleInputChange('serviceType', service.id as 'ALL' | 'HOME_VISIT' | 'ONLINE')}
                  style={{
                    padding: '0.625rem 0.875rem',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: filters.serviceType === service.id ? theme.colors.white : 'transparent',
                    color: filters.serviceType === service.id ? theme.colors.primary : theme.colors.gray[600],
                    fontSize: '0.8rem',
                    fontWeight: filters.serviceType === service.id ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: filters.serviceType === service.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    minWidth: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    if (filters.serviceType !== service.id) {
                      e.currentTarget.style.backgroundColor = theme.colors.white + '60';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filters.serviceType !== service.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {service.id === 'HOME_VISIT' && <Home style={{ width: '0.875rem', height: '0.875rem' }} />}
                  {service.id === 'ONLINE' && <Monitor style={{ width: '0.875rem', height: '0.875rem' }} />}
                  {service.id === 'ALL' && <Search style={{ width: '0.875rem', height: '0.875rem' }} />}
                  <span>{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* Subtle Pincode Prompt for Home Visits */}
      {showPincodePrompt && filters.serviceType === 'HOME_VISIT' && (
        <div style={{
          backgroundColor: theme.colors.primary + '08',
          border: `1px solid ${theme.colors.primary}20`,
          borderRadius: '8px',
          padding: '0.875rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem'
        }}>
          <MapPin style={{ width: '1rem', height: '1rem', color: theme.colors.primary }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: theme.colors.text }}>
              Add your location for accurate home visit results
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={getCurrentLocation}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}40`,
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary + '10';
                e.currentTarget.style.borderColor = theme.colors.primary + '60';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = theme.colors.primary + '40';
              }}
            >
              <Navigation style={{ width: '0.75rem', height: '0.75rem' }} />
              Use Location
            </button>
            <button
              onClick={() => {
                setShowPincodePrompt(false);
                setPincodePromptDismissed(true);
              }}
              style={{
                padding: '0.25rem',
                backgroundColor: 'transparent',
                color: theme.colors.gray[400],
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.gray[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.gray[400];
              }}
            >
              <X style={{ width: '0.875rem', height: '0.875rem' }} />
            </button>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {getActiveFilters().length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.875rem', color: theme.colors.gray[600], fontWeight: '500' }}>
            Active filters:
          </span>
          {getActiveFilters().map((filter, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: theme.colors.primary + '15',
                color: theme.colors.primary,
                padding: '0.375rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: `1px solid ${theme.colors.primary}30`
              }}
            >
              <span>{filter.label}</span>
              <button
                onClick={() => clearFilter(filter.type)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.primary,
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X style={{ width: '0.875rem', height: '0.875rem' }} />
              </button>
            </div>
          ))}
          {getActiveFilters().length > 1 && (
            <button
              onClick={clearAllFilters}
              style={{
                background: 'none',
                border: `1px solid ${theme.colors.gray[400]}`,
                color: theme.colors.gray[600],
                cursor: 'pointer',
                padding: '0.375rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Search capabilities hint */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.875rem',
        color: theme.colors.gray[500]
      }}>
        Try: "Dr. Sharma", "400001", "back pain", "sports injury"
      </div>

      {/* Mobile Responsive CSS */}
      <style jsx>{`
        /* Mobile-first responsive design */
        @media (max-width: 768px) {
          /* Stack filters vertically on mobile */
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          
          /* Full width for search input on mobile */
          input[type="text"] {
            padding: 1rem 4rem 1rem 3rem !important;
            font-size: 1rem !important;
            border-radius: 16px !important;
          }
          
          button[type="submit"] {
            padding: 0.875rem 1.5rem !important;
            font-size: 0.9rem !important;
            border-radius: 12px !important;
          }
          
          /* Service type tabs responsive */
          div[style*="minWidth: fit-content"] {
            width: 100% !important;
            justify-content: space-between !important;
          }
          
          div[style*="minWidth: fit-content"] button {
            flex: 1 !important;
            min-width: auto !important;
            padding: 0.75rem 0.5rem !important;
            font-size: 0.75rem !important;
            gap: 0.25rem !important;
          }
          
          /* Specialty filter responsive */
          div[style*="flex: 1"] button {
            padding: 1rem !important;
            font-size: 0.9rem !important;
            border-radius: 16px !important;
          }
          
          /* Dropdown positioning for mobile */
          div[style*="position: absolute"][style*="zIndex: 1000"] {
            position: fixed !important;
            left: 1rem !important;
            right: 1rem !important;
            top: auto !important;
            bottom: 2rem !important;
            z-index: 9999 !important;
            border-radius: 16px !important;
            max-height: 50vh !important;
          }
          
          /* Active filters responsive */
          div[style*="Active filters"] {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          
          /* Pincode prompt responsive */
          div[style*="Add your location"] {
            flex-direction: column !important;
            gap: 1rem !important;
            text-align: center !important;
            padding: 1rem !important;
            border-radius: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          /* Extra small screens */
          input[type="text"] {
            padding: 1rem 3.5rem 1rem 2.75rem !important;
            font-size: 1rem !important;
          }
          
          button[type="submit"] {
            padding: 0.75rem 1.25rem !important;
            font-size: 0.875rem !important;
            right: 0.5rem !important;
          }
          
          /* Compact service tabs */
          div[style*="minWidth: fit-content"] button {
            padding: 0.625rem 0.375rem !important;
            font-size: 0.7rem !important;
          }
          
          /* Compact specialty filter */
          div[style*="flex: 1"] button {
            padding: 0.875rem !important;
          }
          
          /* Smaller icons */
          svg {
            width: 0.875rem !important;
            height: 0.875rem !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          /* Larger touch targets */
          button {
            min-height: 44px !important;
          }
          
          /* Full screen dropdown on touch devices */
          div[style*="position: absolute"][style*="zIndex: 1000"] {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90vw !important;
            max-width: 400px !important;
            max-height: 70vh !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleSearchInterface;