'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import SimpleSearchInterface from '@/components/search/SimpleSearchInterface';
import SimpleSearchResults from '@/components/search/SimpleSearchResults';
import simpleSearchService from '@/services/SimpleSearchService';
import { theme } from '@/utils/theme';
import { useAvailabilityBatch } from '@/hooks/useAvailabilityBatch';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setBatchAvailability } from '@/store/slices/availabilitySlice';

interface SimpleSearchFilters {
  query: string; // Combined search for name or pincode  
  specialty: string;
  serviceType: 'ALL' | 'HOME_VISIT' | 'ONLINE';
}

interface SearchResult {
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
  gender?: string;
}

const SimpleSearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [initialFilters, setInitialFilters] = useState<SimpleSearchFilters>({
    query: '',
    specialty: '',
    serviceType: 'ALL'
  });

  // Get physiotherapist IDs for batch availability
  const physiotherapistIds = results.map(p => p.id);
  
  // Use the batch availability hook
  const { 
    availability: batchAvailability, 
    loading: availabilityLoading, 
    error: availabilityError 
  } = useAvailabilityBatch({
    physiotherapistIds,
    userLocation: userLocation ? {
      pincode: userLocation.pincode,
      lat: userLocation.latitude,
      lng: userLocation.longitude
    } : undefined,
    serviceTypes: ['HOME_VISIT', 'ONLINE'],
    days: 3,
    enabled: physiotherapistIds.length > 0
  });

  // Update Redux store with availability data
  useEffect(() => {
    if (batchAvailability && Object.keys(batchAvailability).length > 0) {
      dispatch(setBatchAvailability({ 
        data: batchAvailability,
        timestamp: Date.now()
      }));
    }
  }, [batchAvailability, dispatch]);

  // Load featured physiotherapists and get location on page load
  useEffect(() => {
    loadFeatured();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false
            });
          });
          
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        } catch (geoError) {
          console.warn('Geolocation failed:', geoError);
        }
      }
    } catch (error) {
      console.warn('Location detection failed:', error);
    }
  };

  // Check URL parameters and perform search if present
  useEffect(() => {
    const query = searchParams.get('query') || searchParams.get('name') || searchParams.get('pincode') || '';
    const specialty = searchParams.get('specialty') || '';
    const serviceType = (searchParams.get('serviceType') || 'ALL') as 'ALL' | 'HOME_VISIT' | 'ONLINE';

    // Set initial filters for the search interface
    const filters = { query, specialty, serviceType };
    setInitialFilters(filters);

    if (query || specialty || serviceType !== 'ALL') {
      performSearch(filters);
      setHasSearched(true);
    }
  }, [searchParams]);

  const loadFeatured = async () => {
    try {
      setLoading(true);
      setError(null);
      const featured = await simpleSearchService.getFeatured();
      setResults(featured);
    } catch (err) {
      setError('Failed to load physiotherapists');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (filters: SimpleSearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const searchResults = await simpleSearchService.search(filters);
      setResults(searchResults);
      
      // Update URL
      updateURL(filters);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (filters: SimpleSearchFilters) => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('query', filters.query);
    if (filters.specialty) params.set('specialty', filters.specialty);
    if (filters.serviceType !== 'ALL') params.set('serviceType', filters.serviceType);

    const newURL = params.toString() ? `/search/simple?${params.toString()}` : '/search/simple';
    router.replace(newURL, { scroll: false });
  };

  const handleSearch = (filters: SimpleSearchFilters) => {
    performSearch(filters);
  };

  const handleRetry = () => {
    if (hasSearched) {
      // Retry last search - get filters from URL
      const query = searchParams.get('query') || searchParams.get('name') || searchParams.get('pincode') || '';
      const specialty = searchParams.get('specialty') || '';
      const serviceType = (searchParams.get('serviceType') || 'ALL') as 'ALL' | 'HOME_VISIT' | 'ONLINE';
      performSearch({ query, specialty, serviceType });
    } else {
      loadFeatured();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(`/physiotherapist/${result.id}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.colors.background 
    }}>
      <Header />
      
      {/* Search Interface */}
      <div style={{
        background: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray[200]}`,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 2.5vw, 1.5rem)'
        }}>
          <SimpleSearchInterface
            onSearch={handleSearch}
            loading={loading}
            showFilters={true}
            placeholder="Search physiotherapists by name..."
            initialFilters={initialFilters}
          />
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1rem, 2.5vw, 1.5rem)'
      }}>
        {/* Page Title */}
        {!hasSearched && !loading && (
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(2rem, 5vw, 3rem)'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)'
            }}>
              Find Expert Physiotherapists
            </h1>
            <p style={{
              color: theme.colors.gray[600],
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              lineHeight: '1.5'
            }}>
              Search by name, pincode, specialty, or service type
            </p>
          </div>
        )}

        {/* Search Results */}
        <SimpleSearchResults
          results={results}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          onResultClick={handleResultClick}
          batchAvailability={batchAvailability}
          userLocation={userLocation}
          availabilityLoading={availabilityLoading}
        />
      </main>
    </div>
  );
};

export default SimpleSearchPage;