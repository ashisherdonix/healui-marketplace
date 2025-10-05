'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Stethoscope, Home, Monitor } from 'lucide-react';
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
}

const SPECIALTIES = [
  'orthopedic',
  'neurological', 
  'pediatric',
  'geriatric',
  'sports',
  'cardiac',
  'pulmonary',
  'women_health',
  'pain_management',
  'rehabilitation'
];

const SimpleSearchInterface: React.FC<SimpleSearchInterfaceProps> = ({
  onSearch,
  loading = false,
  placeholder = "Search by name or pincode..."
}) => {
  const [filters, setFilters] = useState<SimpleSearchFilters>({
    query: '',
    specialty: '',
    serviceType: 'ALL'
  });

  // Animated placeholder state
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  
  // Animated counter state
  const [patientCount, setPatientCount] = useState(145000);
  const targetCount = 150000;
  
  const placeholderTexts = [
    'Search by name...',
    'Dr. Sharma',
    'Search by specialty...',
    'Sports injury',
    'Search by pincode...',
    '400001',
    'Knee pain specialist',
    'Back pain treatment'
  ];

  // Typing animation effect
  useEffect(() => {
    if (filters.query) {
      // Don't animate if user is typing
      return;
    }

    const currentPlaceholder = placeholderTexts[placeholderIndex];
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    if (!isDeleting && charIndex < currentPlaceholder.length) {
      // Typing
      const timeout = setTimeout(() => {
        setCurrentText(currentPlaceholder.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && charIndex === currentPlaceholder.length) {
      // Pause before deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setCurrentText(currentPlaceholder.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, deletingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex === 0) {
      // Move to next placeholder
      setIsDeleting(false);
      setPlaceholderIndex((placeholderIndex + 1) % placeholderTexts.length);
    }
  }, [charIndex, isDeleting, placeholderIndex, filters.query]);

  // Counter animation effect
  useEffect(() => {
    if (patientCount < targetCount) {
      const increment = Math.ceil((targetCount - patientCount) / 50);
      const timer = setTimeout(() => {
        setPatientCount(prev => {
          const next = prev + increment;
          return next > targetCount ? targetCount : next;
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [patientCount, targetCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleInputChange = (field: keyof SimpleSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
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

  const getPlaceholderText = () => {
    // Show animated placeholder only when input is empty
    if (!filters.query) {
      return currentText || placeholder;
    }
    
    // Show context-aware placeholder when user is typing
    const searchType = detectSearchType(filters.query);
    switch (searchType) {
      case 'pincode':
        return 'Pincode detected...';
      case 'name':
        return 'Physiotherapist name...';
      case 'mixed':
        return 'Name or location...';
      default:
        return placeholder;
    }
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

  return (
    <div style={{
      background: theme.colors.white,
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${theme.colors.gray[200]}`,
      padding: 'clamp(1.5rem, 4vw, 2.5rem)',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header with patient counter */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
        padding: '0 clamp(1rem, 2vw, 2rem)'
      }}>
        <h3 style={{
          fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
          fontWeight: '600',
          color: theme.colors.text,
          margin: 0,
          fontFamily: '"IBM Plex Sans", Inter, system-ui, sans-serif',
          lineHeight: '1.5'
        }}>
          Best physiotherapists in Delhi
        </h3>
        <p style={{
          fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
          color: theme.colors.gray[600],
          marginTop: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          Experience of treating more than
          <span style={{
            color: theme.colors.primary,
            fontWeight: '700',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '0.25rem'
          }}>
            {patientCount.toLocaleString()}+
            {patientCount < targetCount && (
              <span style={{
                display: 'inline-block',
                width: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                height: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary,
                animation: 'pulse 1s infinite'
              }} />
            )}
          </span>
          patients!
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
        {/* Combined Search */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: 'clamp(0.75rem, 2vw, 1rem)',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}>
            {getSearchIcon()}
          </div>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleInputChange('query', e.target.value)}
            placeholder={getPlaceholderText()}
            style={{
              ...inputStyle,
              paddingRight: filters.query ? 'clamp(4.5rem, 8vw, 5rem)' : 'clamp(0.75rem, 2vw, 1rem)'
            }}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.gray[300];
              e.target.style.boxShadow = 'none';
            }}
            className="search-input"
          />
          {/* Search type indicator */}
          {filters.query && (
            <div style={{
              position: 'absolute',
              right: 'clamp(0.75rem, 2vw, 1rem)',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
              color: theme.colors.gray[500],
              background: theme.colors.gray[100],
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              fontWeight: '500',
              zIndex: 20
            }}>
              {detectSearchType(filters.query) === 'pincode' ? 'PIN' : 
               detectSearchType(filters.query) === 'name' ? 'NAME' : 'MIXED'}
            </div>
          )}
        </div>

        {/* Filters Row - Responsive */}
        <div className="filters-row" style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.75rem, 2vw, 1rem)'
        }}>
          {/* Specialty */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{
              position: 'absolute',
              left: 'clamp(0.75rem, 2vw, 1rem)',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <Stethoscope style={{ 
                width: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
                height: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
                color: theme.colors.gray[400] 
              }} />
            </div>
            <select
              value={filters.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
              style={selectStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.gray[300];
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty.charAt(0).toUpperCase() + specialty.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Service Type Toggle */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div className="service-type-toggle" style={{
              display: 'flex',
              background: theme.colors.gray[100],
              borderRadius: '12px',
              padding: '4px',
              width: '100%',
              height: 'clamp(3rem, 7vw, 3.5rem)',
              maxWidth: '100%'
            }}>
              {['ALL', 'HOME_VISIT', 'ONLINE'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange('serviceType', type as 'ALL' | 'HOME_VISIT' | 'ONLINE')}
                  className={`service-button ${filters.serviceType === type ? 'active' : ''}`}
                  style={{
                    flex: 1,
                    padding: '0 clamp(0.75rem, 2vw, 1.25rem)',
                    background: filters.serviceType === type ? theme.colors.white : 'transparent',
                    color: filters.serviceType === type ? theme.colors.primary : theme.colors.gray[600],
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                    fontWeight: filters.serviceType === type ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(0.375rem, 1vw, 0.5rem)',
                    boxShadow: filters.serviceType === type ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    textAlign: 'center',
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (filters.serviceType !== type) {
                      e.currentTarget.style.background = `${theme.colors.gray[200]}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filters.serviceType !== type) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div className="service-button-content" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 'clamp(0.375rem, 1.5vw, 0.625rem)',
                    flexDirection: 'row',
                    width: '100%'
                  }}>
                    {type === 'HOME_VISIT' && (
                      <Home style={{ 
                        width: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
                        height: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                        flexShrink: 0
                      }} />
                    )}
                    {type === 'ONLINE' && (
                      <Monitor style={{ 
                        width: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
                        height: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                        flexShrink: 0
                      }} />
                    )}
                    <span className="service-button-text" style={{ 
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: 'inherit',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {type === 'ALL' ? 'Any' : type === 'HOME_VISIT' ? 'Home' : 'Online'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? theme.colors.gray[400] : theme.gradients.primary,
            color: theme.colors.white,
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            padding: 'clamp(0.875rem, 2.5vw, 1rem)',
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${theme.colors.primary}40`;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: 'clamp(1rem, 2.5vw, 1.25rem)',
                height: 'clamp(1rem, 2.5vw, 1.25rem)',
                border: '2px solid transparent',
                borderTop: `2px solid ${theme.colors.white}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Searching...
            </>
          ) : (
            <>
              <Search style={{ 
                width: 'clamp(1rem, 2.5vw, 1.25rem)', 
                height: 'clamp(1rem, 2.5vw, 1.25rem)' 
              }} />
              Search Physiotherapists
            </>
          )}
        </button>
      </form>

      {/* Combined CSS for responsive layout and animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Animated placeholder styling */
        :global(.search-input::placeholder) {
          color: #6B7280;
          transition: opacity 0.3s ease;
        }
        
        /* Desktop layout - filters in one row */
        @media (min-width: 769px) {
          :global(.filters-row) {
            flex-direction: row !important;
            gap: clamp(1rem, 2vw, 1.5rem) !important;
          }
          
          :global(.filters-row > div) {
            flex: 1 !important;
          }
          
          :global(.service-type-toggle) {
            min-width: 335px !important;
          }
        }
        
        /* Tablet and mobile - filters stacked */
        @media (max-width: 768px) {
          :global(.service-button-content) {
            flex-direction: row !important;
            gap: 0.375rem !important;
          }
          :global(.service-button-text) {
            font-size: 0.875rem !important;
            line-height: 1.2 !important;
          }
          :global(.service-button) {
            padding: 0 0.75rem !important;
          }
        }
        
        @media (max-width: 600px) {
          :global(.service-button-content) {
            flex-direction: column !important;
            gap: 0.125rem !important;
          }
          :global(.service-button-text) {
            font-size: 0.75rem !important;
            line-height: 1 !important;
          }
          :global(.service-button) {
            padding: 0 0.5rem !important;
          }
          :global(.service-button svg) {
            width: 1rem !important;
            height: 1rem !important;
          }
        }
        
        @media (max-width: 400px) {
          :global(.service-button-text) {
            font-size: 0.7rem !important;
          }
          :global(.service-button) {
            padding: 0 0.375rem !important;
          }
          :global(.service-button svg) {
            width: 0.875rem !important;
            height: 0.875rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleSearchInterface;