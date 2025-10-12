'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import EnterpriseSearchInterface from '@/components/search/EnterpriseSearchInterface';
import EnterpriseSearchResults from '@/components/search/EnterpriseSearchResults';
import enterpriseSearchService from '@/services/EnterpriseSearchService';
import { AlertTriangle, WifiOff } from 'lucide-react';

// Types
interface SearchFilters {
  query: string;
  location: string;
  specialization: string;
  serviceType: 'ALL' | 'HOME_VISIT' | 'ONLINE';
  availability: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'SPECIFIC_DATE';
  specificDate?: string;
  minRating: number;
  maxPrice?: number;
  sortBy: 'RELEVANCE' | 'RATING' | 'PRICE' | 'DISTANCE';
  // New location-based parameters
  lat?: number;
  lng?: number;
  radius?: number;
  pincode?: string;
  useCurrentLocation?: boolean;
}

interface SearchResponse {
  results: Array<{
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
    availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    is_verified?: boolean;
    home_visit_available?: boolean;
    online_consultation_available?: boolean;
    gender?: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  searchId: string;
  executionTime: number;
  appliedFilters: SearchFilters;
}

// Error Boundary Component
class SearchErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Search Error Boundary:', error, errorInfo);
    this.props.onError?.(error);
    
    // In production, send to error tracking service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Network Status Hook
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Performance monitoring hook
const usePerformanceMonitoring = () => {
  const startTimeRef = useRef<number>(0);

  const startTiming = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endTiming = useCallback((eventName: string) => {
    const duration = performance.now() - startTimeRef.current;
    
    // Track performance in analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: eventName,
        value: Math.round(duration)
      });
    }
    
    console.log(`⏱️ ${eventName}: ${duration.toFixed(2)}ms`);
    return duration;
  }, []);

  return { startTiming, endTiming };
};

// Search Content Component (wrapped in Suspense)
const SearchContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnline = useNetworkStatus();
  const { startTiming, endTiming } = usePerformanceMonitoring();

  // State management
  const [searchData, setSearchData] = useState<SearchResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialFilters, setInitialFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    specialization: '',
    serviceType: 'ALL',
    availability: 'ALL',
    minRating: 0,
    sortBy: 'RELEVANCE',
    lat: undefined,
    lng: undefined,
    radius: 15,
    pincode: '',
    useCurrentLocation: false
  });

  // Load initial filters from URL on mount
  useEffect(() => {
    const urlFilters: SearchFilters = {
      query: searchParams.get('q') || searchParams.get('query') || '',
      location: searchParams.get('location') || '',
      specialization: searchParams.get('specialization') || '',
      serviceType: (searchParams.get('serviceType') as 'ALL' | 'HOME_VISIT' | 'ONLINE') || 'ALL',
      availability: (searchParams.get('availability') as 'ALL' | 'TODAY' | 'THIS_WEEK' | 'SPECIFIC_DATE') || 'ALL',
      specificDate: searchParams.get('specificDate') || undefined,
      minRating: parseFloat(searchParams.get('minRating') || '0'),
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      sortBy: (searchParams.get('sortBy') as 'RELEVANCE' | 'RATING' | 'PRICE' | 'DISTANCE') || 'RELEVANCE',
      // Location-based parameters from URL
      lat: searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined,
      lng: searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined,
      radius: searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 15,
      pincode: searchParams.get('pincode') || '',
      useCurrentLocation: searchParams.get('useCurrentLocation') === 'true'
    };

    setInitialFilters(urlFilters);

    // If there are search parameters, perform initial search
    if (hasActiveFilters(urlFilters)) {
      performSearch(urlFilters, parseInt(searchParams.get('page') || '1'));
    } else {
      // Load featured physiotherapists for empty state
      loadFeaturedPhysiotherapists();
    }
  }, []);

  // Check if filters have any active values
  const hasActiveFilters = useCallback((filters: SearchFilters): boolean => {
    return !!(
      filters.query ||
      filters.location ||
      filters.specialization ||
      filters.serviceType !== 'ALL' ||
      filters.availability !== 'ALL' ||
      filters.minRating > 0 ||
      filters.maxPrice ||
      filters.sortBy !== 'RELEVANCE' ||
      filters.lat ||
      filters.lng ||
      filters.pincode
    );
  }, []);

  // Update URL with current filters
  const updateURL = useCallback((filters: SearchFilters, page?: number) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'ALL' && value !== 'RELEVANCE' && value !== 0) {
        params.set(key, value.toString());
      }
    });

    if (page && page > 1) {
      params.set('page', page.toString());
    }

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.replace(newURL, { scroll: false });
  }, [router]);

  // Load featured physiotherapists for empty state
  const loadFeaturedPhysiotherapists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      startTiming();

      const featured = await enterpriseSearchService.getFeatured(undefined, 12);
      
      const featuredResponse: SearchResponse = {
        results: featured,
        pagination: {
          total: featured.length,
          page: 1,
          limit: 12,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        },
        searchId: 'featured',
        executionTime: endTiming('featured_load'),
        appliedFilters: initialFilters
      };

      setSearchData(featuredResponse);
    } catch (err) {
      console.error('Failed to load featured physiotherapists:', err);
      setError('Failed to load physiotherapists. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [initialFilters, startTiming, endTiming]);

  // Perform search with enterprise service
  const performSearch = useCallback(async (filters: SearchFilters, page: number = 1) => {
    if (!isOnline) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      startTiming();

      const searchFilters = { ...filters, page, limit: 12 };
      const response = await enterpriseSearchService.search(searchFilters);
      
      setSearchData(response);
      updateURL(filters, page);
      endTiming('search_execution');

    } catch (err) {
      console.error('Search failed:', err);
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isOnline, startTiming, endTiming, updateURL]);

  // Handle search form submission
  const handleSearch = useCallback((filters: SearchFilters) => {
    performSearch(filters, 1);
  }, [performSearch]);

  // Handle filter changes (for real-time search)
  const handleFiltersChange = useCallback((filters: SearchFilters) => {
    // Only trigger search if there's a query
    if (filters.query && filters.query.length >= 3) {
      // Debounced search will be handled by the service
      const timeoutId = setTimeout(() => {
        performSearch(filters, 1);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [performSearch]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    if (searchData?.appliedFilters) {
      performSearch(searchData.appliedFilters, page);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchData?.appliedFilters, performSearch]);

  // Handle result click
  const handleResultClick = useCallback((result: any) => {
    // Track click analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'select_content', {
        content_type: 'physiotherapist',
        content_id: result.id
      });
    }

    router.push(`/physiotherapist/${result.id}`);
  }, [router]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (searchData?.appliedFilters) {
      performSearch(searchData.appliedFilters);
    } else {
      loadFeaturedPhysiotherapists();
    }
  }, [searchData?.appliedFilters, performSearch, loadFeaturedPhysiotherapists]);

  // Handle error reporting
  const handleErrorReport = useCallback((error: Error) => {
    // In production, send to error tracking service
    console.error('Enterprise Search Error:', error);
  }, []);

  return (
    <SearchErrorBoundary onError={handleErrorReport}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-red-600 text-white px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">
                You're offline. Some features may not work properly.
              </span>
            </div>
          </div>
        )}

        {/* Search Interface */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <EnterpriseSearchInterface
              onSearch={handleSearch}
              onFiltersChange={handleFiltersChange}
              loading={loading}
              initialFilters={initialFilters}
              placeholder="Search physiotherapists, specializations, or conditions..."
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Title for Featured/Empty State */}
          {!searchData?.appliedFilters.query && !loading && (
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Find Expert Physiotherapists
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with verified physiotherapy professionals for home visits and online consultations
              </p>
            </div>
          )}

          {/* Search Results */}
          <EnterpriseSearchResults
            data={searchData}
            loading={loading}
            error={error}
            onPageChange={handlePageChange}
            onRetry={handleRetry}
            onResultClick={handleResultClick}
          />

          {/* Performance Info (Development Only) */}
          {process.env.NODE_ENV === 'development' && searchData && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>Search ID: {searchData.searchId}</span>
                <span>Execution Time: {searchData.executionTime}ms</span>
                <span>Results: {searchData.results.length}</span>
                <span>Cache Hit Rate: {(enterpriseSearchService.getPerformanceMetrics().cacheHitRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </main>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    </SearchErrorBoundary>
  );
};

// Main Search Page Component with Suspense
const SearchPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;