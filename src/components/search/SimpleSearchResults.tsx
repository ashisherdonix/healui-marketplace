'use client';

import React from 'react';
import { 
  Star, 
  MapPin, 
  Monitor, 
  Home, 
  Search,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { theme } from '@/utils/theme';

interface Physiotherapist {
  id: string;
  full_name: string;
  specializations?: string[];
  years_of_experience?: number;
  average_rating: number;
  total_reviews: number;
  practice_address?: string;
  consultation_fee?: string;
  home_visit_fee?: string;
  profile_photo_url?: string;
  bio?: string;
  is_verified?: boolean;
  home_visit_available?: boolean;
  online_consultation_available?: boolean;
}

interface SimpleSearchResultsProps {
  results: Physiotherapist[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onResultClick?: (result: Physiotherapist) => void;
}

const PhysiotherapistCard: React.FC<{
  result: Physiotherapist;
  onClick?: (result: Physiotherapist) => void;
}> = ({ result, onClick }) => {
  const handleClick = () => {
    onClick?.(result);
  };

  const formatPrice = (price?: string) => {
    if (!price) return 'Contact for pricing';
    return `₹${parseFloat(price).toLocaleString()}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        background: theme.colors.white,
        borderRadius: '16px',
        border: `1px solid ${theme.colors.gray[200]}`,
        padding: 'clamp(1.25rem, 3vw, 1.5rem)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.colors.primary;
        e.currentTarget.style.boxShadow = `0 8px 25px ${theme.colors.primary}15`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.gray[200];
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'start', gap: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
        {/* Profile Image */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {result.profile_photo_url ? (
            <img
              src={result.profile_photo_url}
              alt={result.full_name}
              style={{
                width: 'clamp(3.5rem, 8vw, 4rem)',
                height: 'clamp(3.5rem, 8vw, 4rem)',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `2px solid ${theme.colors.gray[200]}`
              }}
            />
          ) : (
            <div style={{
              width: 'clamp(3.5rem, 8vw, 4rem)',
              height: 'clamp(3.5rem, 8vw, 4rem)',
              borderRadius: '50%',
              background: theme.colors.secondary,
              border: `2px solid ${theme.colors.gray[200]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: theme.colors.primary,
                fontWeight: '600',
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
              }}>
                {getInitials(result.full_name)}
              </span>
            </div>
          )}
          
          {result.is_verified && (
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: 'clamp(1.25rem, 3vw, 1.5rem)',
              height: 'clamp(1.25rem, 3vw, 1.5rem)',
              background: theme.colors.success,
              borderRadius: '50%',
              border: `2px solid ${theme.colors.white}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: theme.colors.white,
                fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                fontWeight: 'bold'
              }}>✓</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'start', 
            justifyContent: 'space-between', 
            marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
                fontWeight: '600',
                color: theme.colors.text,
                marginBottom: '0.25rem'
              }}>
                Dr. {result.full_name}
              </h3>
              {result.years_of_experience && (
                <p style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  color: theme.colors.primary,
                  fontWeight: '500'
                }}>
                  {result.years_of_experience} years experience
                </p>
              )}
            </div>
            
            {/* Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: `${theme.colors.success}15`,
              padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 1.5vw, 0.75rem)',
              borderRadius: '20px'
            }}>
              <Star style={{ 
                width: 'clamp(0.875rem, 2vw, 1rem)', 
                height: 'clamp(0.875rem, 2vw, 1rem)', 
                color: theme.colors.warning,
                fill: theme.colors.warning
              }} />
              <span style={{
                fontWeight: '600',
                color: theme.colors.success,
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
              }}>
                {result.average_rating.toFixed(1)}
              </span>
              <span style={{
                fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                color: theme.colors.gray[600]
              }}>
                ({result.total_reviews})
              </span>
            </div>
          </div>

          {/* Location */}
          {result.practice_address && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)' 
            }}>
              <MapPin style={{ 
                width: 'clamp(0.875rem, 2vw, 1rem)', 
                height: 'clamp(0.875rem, 2vw, 1rem)', 
                color: theme.colors.gray[400] 
              }} />
              <span style={{
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                color: theme.colors.gray[600]
              }}>{result.practice_address}</span>
            </div>
          )}

          {/* Specializations */}
          {result.specializations && result.specializations.length > 0 && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 'clamp(0.375rem, 1vw, 0.5rem)', 
              marginBottom: 'clamp(0.75rem, 2vw, 1rem)' 
            }}>
              {result.specializations.slice(0, 3).map((spec, index) => (
                <span 
                  key={index}
                  style={{
                    padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 1.5vw, 0.75rem)',
                    background: `${theme.colors.primary}15`,
                    color: theme.colors.primary,
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    borderRadius: '20px',
                    fontWeight: '500'
                  }}
                >
                  {spec.charAt(0).toUpperCase() + spec.slice(1).replace('_', ' ')}
                </span>
              ))}
              {result.specializations.length > 3 && (
                <span style={{
                  padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 1.5vw, 0.75rem)',
                  background: theme.colors.gray[100],
                  color: theme.colors.gray[600],
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  borderRadius: '20px'
                }}>
                  +{result.specializations.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Services & Pricing */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(1rem, 3vw, 1.5rem)',
            flexWrap: 'wrap'
          }}>
            {result.online_consultation_available && result.consultation_fee && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
              }}>
                <Monitor style={{ 
                  width: 'clamp(0.875rem, 2vw, 1rem)', 
                  height: 'clamp(0.875rem, 2vw, 1rem)', 
                  color: theme.colors.info
                }} />
                <span style={{ color: theme.colors.gray[500] }}>Online:</span>
                <span style={{ 
                  fontWeight: '600', 
                  color: theme.colors.text 
                }}>
                  {formatPrice(result.consultation_fee)}
                </span>
              </div>
            )}
            
            {result.home_visit_available && result.home_visit_fee && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
              }}>
                <Home style={{ 
                  width: 'clamp(0.875rem, 2vw, 1rem)', 
                  height: 'clamp(0.875rem, 2vw, 1rem)', 
                  color: theme.colors.success
                }} />
                <span style={{ color: theme.colors.gray[500] }}>Home visit:</span>
                <span style={{ 
                  fontWeight: '600', 
                  color: theme.colors.text 
                }}>
                  {formatPrice(result.home_visit_fee)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleSearchResults: React.FC<SimpleSearchResultsProps> = ({
  results,
  loading = false,
  error = null,
  onRetry,
  onResultClick
}) => {
  // Loading State
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index} 
            style={{
              background: theme.colors.white,
              borderRadius: '16px',
              border: `1px solid ${theme.colors.gray[200]}`,
              padding: 'clamp(1.25rem, 3vw, 1.5rem)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'start', gap: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
              <div style={{
                width: 'clamp(3.5rem, 8vw, 4rem)',
                height: 'clamp(3.5rem, 8vw, 4rem)',
                background: theme.colors.gray[200],
                borderRadius: '50%',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                <div style={{
                  height: 'clamp(1.125rem, 3vw, 1.25rem)',
                  background: theme.colors.gray[200],
                  borderRadius: '8px',
                  width: '60%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
                <div style={{
                  height: 'clamp(0.875rem, 2vw, 1rem)',
                  background: theme.colors.gray[200],
                  borderRadius: '6px',
                  width: '40%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
                <div style={{
                  height: 'clamp(0.875rem, 2vw, 1rem)',
                  background: theme.colors.gray[200],
                  borderRadius: '6px',
                  width: '80%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
              </div>
            </div>
          </div>
        ))}
        
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 2.5vw, 1.5rem)',
        textAlign: 'center'
      }}>
        <AlertCircle style={{ 
          width: 'clamp(2.5rem, 6vw, 3rem)', 
          height: 'clamp(2.5rem, 6vw, 3rem)', 
          color: theme.colors.error,
          marginBottom: 'clamp(1rem, 2.5vw, 1.25rem)'
        }} />
        <h3 style={{
          fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
          fontWeight: '600',
          color: theme.colors.text,
          marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)'
        }}>Search Failed</h3>
        <p style={{
          color: theme.colors.gray[600],
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          lineHeight: '1.5',
          maxWidth: '400px',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)'
        }}>
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem)',
              background: theme.gradients.primary,
              color: theme.colors.white,
              borderRadius: '12px',
              border: 'none',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${theme.colors.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <RefreshCw style={{ width: 'clamp(1rem, 2.5vw, 1.125rem)', height: 'clamp(1rem, 2.5vw, 1.125rem)' }} />
            Try Again
          </button>
        )}
      </div>
    );
  }

  // No Results State
  if (results.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 2.5vw, 1.5rem)',
        textAlign: 'center'
      }}>
        <Search style={{ 
          width: 'clamp(2.5rem, 6vw, 3rem)', 
          height: 'clamp(2.5rem, 6vw, 3rem)', 
          color: theme.colors.gray[400],
          marginBottom: 'clamp(1rem, 2.5vw, 1.25rem)'
        }} />
        <h3 style={{
          fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
          fontWeight: '600',
          color: theme.colors.text,
          marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)'
        }}>No Results Found</h3>
        <p style={{
          color: theme.colors.gray[600],
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          lineHeight: '1.5',
          maxWidth: '400px'
        }}>
          No physiotherapists found matching your search criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  // Results
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 3vw, 2rem)' }}>
      {/* Results Count */}
      <div style={{
        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
        color: theme.colors.gray[600],
        fontWeight: '500'
      }}>
        Found {results.length} physiotherapist{results.length !== 1 ? 's' : ''}
      </div>

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
        {results.map((result) => (
          <PhysiotherapistCard
            key={result.id}
            result={result}
            onClick={onResultClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleSearchResults;