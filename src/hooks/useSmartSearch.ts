import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  searchPhysiotherapists,
  getFeaturedPhysiotherapists,
  loadSpecializations,
  searchLocations,
  setActiveFilters,
  clearFilters,
  addRecentSearch,
  clearError,
  incrementSearchCount,
} from '@/store/slices/searchSlice';

// Search filters interface
interface SearchFilters {
  query?: string;
  location?: string;
  specialization?: string;
  service_type?: 'HOME_VISIT' | 'ONLINE';
  available_date?: string;
  min_rating?: number;
  max_price?: number;
  gender?: 'M' | 'F';
  experience_years?: number;
  sort_by?: 'rating' | 'price' | 'experience' | 'distance';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Hook for smart search functionality
export const useSmartSearch = () => {
  const dispatch = useAppDispatch();
  const searchState = useAppSelector((state) => state.search);

  // Initialize specializations on mount
  useEffect(() => {
    if (searchState.specializations.length === 0 && !searchState.specializationsLoading) {
      dispatch(loadSpecializations());
    }
  }, [dispatch, searchState.specializations.length, searchState.specializationsLoading]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && searchState.recentSearches.length === 0) {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        try {
          const recentSearches = JSON.parse(saved);
          recentSearches.forEach((search: string) => {
            dispatch(addRecentSearch(search));
          });
        } catch (error) {
          console.error('Failed to load recent searches:', error);
        }
      }
    }
  }, [dispatch, searchState.recentSearches.length]);

  // Save recent searches to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && searchState.recentSearches.length > 0) {
      localStorage.setItem('recent_searches', JSON.stringify(searchState.recentSearches));
    }
  }, [searchState.recentSearches]);

  // Search function with analytics
  const performSearch = useCallback(async (filters: SearchFilters) => {
    // Clear any existing errors
    dispatch(clearError());
    
    // Set active filters
    dispatch(setActiveFilters(filters));
    
    // Add to recent searches if query exists
    if (filters.query) {
      dispatch(addRecentSearch(filters.query));
    }
    
    // Perform the search
    const result = await dispatch(searchPhysiotherapists(filters));
    
    return result;
  }, [dispatch]);

  // Load featured physiotherapists
  const loadFeatured = useCallback(async (params?: { location?: string; limit?: number }) => {
    const result = await dispatch(getFeaturedPhysiotherapists(params || {}));
    return result;
  }, [dispatch]);

  // Search locations with debounce
  const searchLocationSuggestions = useCallback(async (query: string, limit?: number) => {
    if (query.length >= 2) {
      const result = await dispatch(searchLocations({ query, limit }));
      return result;
    }
    return null;
  }, [dispatch]);

  // Clear all search data
  const clearSearch = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Quick search for common conditions
  const quickSearch = useCallback(async (query: string, additionalFilters?: Partial<SearchFilters>) => {
    const filters: SearchFilters = {
      query,
      page: 1,
      limit: 12,
      sort_order: 'desc',
      ...additionalFilters
    };
    
    return performSearch(filters);
  }, [performSearch]);

  // Search with pagination
  const searchWithPagination = useCallback(async (page: number, filters?: SearchFilters) => {
    const searchFilters = filters || searchState.activeFilters;
    return performSearch({
      ...searchFilters,
      page,
      limit: searchFilters.limit || 12
    });
  }, [performSearch, searchState.activeFilters]);

  // Search with sorting
  const searchWithSorting = useCallback(async (sortBy: string, sortOrder: 'asc' | 'desc', filters?: SearchFilters) => {
    const searchFilters = filters || searchState.activeFilters;
    return performSearch({
      ...searchFilters,
      sort_by: sortBy as 'rating' | 'price' | 'experience' | 'distance',
      sort_order: sortOrder,
      page: 1 // Reset to first page when sorting
    });
  }, [performSearch, searchState.activeFilters]);

  // Get search suggestions based on current query
  const getSearchSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    
    // Add recent searches that match current query
    if (searchState.activeFilters.query) {
      const query = searchState.activeFilters.query.toLowerCase();
      searchState.recentSearches.forEach(search => {
        if (search.toLowerCase().includes(query) && !suggestions.includes(search)) {
          suggestions.push(search);
        }
      });
    }
    
    // Add popular searches if no recent matches
    if (suggestions.length < 3) {
      searchState.popularSearches.forEach(search => {
        if (!suggestions.includes(search) && suggestions.length < 5) {
          suggestions.push(search);
        }
      });
    }
    
    return suggestions;
  }, [searchState.activeFilters.query, searchState.recentSearches, searchState.popularSearches]);

  // Get filter analytics
  const getFilterAnalytics = useMemo(() => {
    const activeFilterCount = Object.entries(searchState.activeFilters).filter(
      ([key, value]) => key !== 'sort_order' && key !== 'page' && key !== 'limit' && value
    ).length;

    const hasLocationFilter = Boolean(searchState.activeFilters.location);
    const hasSpecializationFilter = Boolean(searchState.activeFilters.specialization);
    const hasServiceTypeFilter = Boolean(searchState.activeFilters.service_type);
    const hasPriceFilter = Boolean(searchState.activeFilters.max_price);
    const hasRatingFilter = Boolean(searchState.activeFilters.min_rating);
    const hasDateFilter = Boolean(searchState.activeFilters.available_date);

    return {
      activeFilterCount,
      hasLocationFilter,
      hasSpecializationFilter,
      hasServiceTypeFilter,
      hasPriceFilter,
      hasRatingFilter,
      hasDateFilter,
      searchCount: searchState.searchCount,
      lastSearchTime: searchState.lastSearchTime
    };
  }, [searchState.activeFilters, searchState.searchCount, searchState.lastSearchTime]);

  // Smart search recommendations based on user behavior
  const getSmartRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    
    // If user searches for "back pain", suggest related conditions
    const query = searchState.activeFilters.query?.toLowerCase();
    if (query) {
      const conditionMap: Record<string, string[]> = {
        'back': ['Lower Back Pain', 'Upper Back Pain', 'Sciatica', 'Herniated Disc'],
        'knee': ['Knee Arthritis', 'ACL Injury', 'Meniscus Tear', 'Patellofemoral Pain'],
        'neck': ['Cervical Pain', 'Whiplash', 'Cervical Radiculopathy'],
        'shoulder': ['Frozen Shoulder', 'Rotator Cuff', 'Shoulder Impingement'],
        'sports': ['Sports Injury', 'ACL Rehabilitation', 'Ankle Sprain', 'Tennis Elbow']
      };
      
      Object.entries(conditionMap).forEach(([key, conditions]) => {
        if (query.includes(key)) {
          recommendations.push(...conditions.slice(0, 3));
        }
      });
    }
    
    return recommendations.slice(0, 5);
  }, [searchState.activeFilters.query]);

  return {
    // State
    ...searchState,
    
    // Actions
    performSearch,
    loadFeatured,
    searchLocationSuggestions,
    clearSearch,
    quickSearch,
    searchWithPagination,
    searchWithSorting,
    
    // Computed values
    getSearchSuggestions,
    getFilterAnalytics,
    getSmartRecommendations,
    
    // Utilities
    hasActiveFilters: getFilterAnalytics.activeFilterCount > 0,
    isSearching: searchState.loading,
    hasResults: searchState.results.length > 0,
    canLoadMore: searchState.hasNext,
    canGoBack: searchState.hasPrev,
  };
};

export default useSmartSearch;