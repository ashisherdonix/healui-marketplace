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

  // Get physiotherapist IDs from Redux store (homepage featured doctors) and current search results
  const homepagePhysiotherapists = useSelector((state: RootState) => state.therapist.therapists);
  const homepagePhysioIds = homepagePhysiotherapists.map((p: any) => p.id);
  const searchResultIds = results.map(p => p.id);
  
  // Combine IDs from homepage featured doctors and current search results (prioritize search results)
  const physiotherapistIds = searchResultIds.length > 0 
    ? [...new Set([...searchResultIds, ...homepagePhysioIds])] // Remove duplicates, prioritize search results
    : homepagePhysioIds; // Use homepage IDs if no search results
  
  console.log('🔍 Batch availability IDs:', {
    searchResultIds: searchResultIds.length,
    homepageIds: homepagePhysioIds.length,
    totalIds: physiotherapistIds.length,
    finalIds: physiotherapistIds
  });
  
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
    // Check if we already have physiotherapists from homepage in Redux store
    if (homepagePhysiotherapists.length > 0 && results.length === 0) {
      console.log('🔄 Using physiotherapists from homepage Redux store:', homepagePhysiotherapists.length);
      // Convert the Redux therapists to the expected format for results
      const convertedResults = homepagePhysiotherapists.map((therapist: any) => ({
        id: therapist.id,
        full_name: therapist.name || therapist.full_name,
        specializations: therapist.specialization || therapist.specializations,
        years_of_experience: therapist.years_experience || therapist.years_of_experience,
        average_rating: therapist.rating || therapist.average_rating,
        total_reviews: therapist.total_reviews,
        practice_address: therapist.practice_address,
        consultation_fee: therapist.consultation_fee,
        home_visit_fee: therapist.home_visit_fee,
        profile_photo_url: therapist.profile_photo_url,
        bio: therapist.bio,
        is_verified: therapist.is_verified,
        home_visit_available: therapist.home_visit_available,
        online_consultation_available: therapist.online_consultation_available,
        gender: therapist.gender
      }));
      setResults(convertedResults);
    } else {
      // Load featured if not available in Redux store
      loadFeatured();
    }
    getUserLocation();
  }, [homepagePhysiotherapists.length]); // Re-run when homepage physiotherapists are loaded

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
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
    }}>
      <Header />
      
      {/* Search Interface */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1rem, 2.5vw, 1.5rem)'
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
        padding: 'clamp(2rem, 4vw, 2.5rem) clamp(1rem, 2.5vw, 1.5rem)'
      }}>
        {/* Page Title */}
        {!hasSearched && !loading && (
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              fontWeight: '800',
              color: theme.colors.text,
              marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)',
              background: 'linear-gradient(135deg, #1e5f79 0%, #0f4c75 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              Find Expert Physiotherapists
            </h1>
            <p style={{
              color: theme.colors.gray[600],
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              Search by name, pincode, specialty, or service type
            </p>
          </div>
        )}

        {/* Search Results */}
        <div style={{
          background: 'transparent'
        }}>
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
        </div>
      </main>
    </div>
  );
};

export default SimpleSearchPage;