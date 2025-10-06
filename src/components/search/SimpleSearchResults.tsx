'use client';

import React from 'react';
import { 
  Search,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { theme } from '@/utils/theme';
import CleanPhysiotherapistCard from '@/components/shared/CleanPhysiotherapistCard';
import { PhysiotherapistBatchAvailability } from '@/lib/types';

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
  batchAvailability?: Record<string, PhysiotherapistBatchAvailability>;
  userLocation?: any;
  availabilityLoading?: boolean;
}


const SimpleSearchResults: React.FC<SimpleSearchResultsProps> = ({
  results,
  loading = false,
  error = null,
  onRetry,
  onResultClick,
  batchAvailability = {},
  userLocation,
  availabilityLoading = false
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
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', 
        gap: 'clamp(20px, 4vw, 28px)' 
      }}>
        {results.map((result) => (
          <CleanPhysiotherapistCard
            key={result.id}
            physiotherapist={result}
            availability={batchAvailability[result.id]}
            serviceTypeFilter="ALL"
            userLocation={userLocation}
            availabilityLoading={availabilityLoading}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleSearchResults;