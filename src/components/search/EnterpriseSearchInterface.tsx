'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  X, 
  Loader2,
  TrendingUp,
  Clock,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';

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
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'RECENT' | 'POPULAR' | 'CONDITION' | 'LOCATION';
  icon?: React.ReactNode;
}

interface EnterpriseSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  loading?: boolean;
  placeholder?: string;
  initialFilters?: Partial<SearchFilters>;
  className?: string;
}

// Constants
const POPULAR_CONDITIONS = [
  'Back Pain', 'Knee Pain', 'Sports Injury', 'Post Surgery',
  'Neck Pain', 'Stroke Recovery', 'Arthritis', 'Sciatica'
];

const SPECIALIZATIONS = [
  'Sports Rehabilitation', 'Orthopedic', 'Neurological', 'Pediatric',
  'Geriatric', 'Cardiopulmonary', 'Women\'s Health', 'Manual Therapy'
];

// Custom hooks for enterprise features
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const useSearchAnalytics = () => {
  const trackSearch = useCallback((query: string, filters: SearchFilters) => {
    // Enterprise analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        filters_used: Object.keys(filters).filter(key => 
          filters[key as keyof SearchFilters] && 
          key !== 'query' && 
          filters[key as keyof SearchFilters] !== 'ALL'
        ).length
      });
    }
    
    // Custom analytics
    console.log('🔍 Search Analytics:', { query, filters, timestamp: Date.now() });
  }, []);

  return { trackSearch };
};

const EnterpriseSearchInterface: React.FC<EnterpriseSearchProps> = ({
  onSearch,
  onFiltersChange,
  loading = false,
  placeholder = "Search for physiotherapists, conditions, or treatments...",
  initialFilters,
  className = ""
}) => {
  // State management
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    specialization: '',
    serviceType: 'ALL',
    availability: 'ALL',
    minRating: 0,
    sortBy: 'RELEVANCE',
    ...initialFilters
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks
  const debouncedQuery = useDebounce(filters.query, 300);
  const { trackSearch } = useSearchAnalytics();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healui_recent_searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 5));
        } catch (error) {
          console.error('Failed to load recent searches:', error);
        }
      }
    }
  }, []);

  // Handle search execution
  const executeSearch = useCallback(() => {
    if (!filters.query.trim() && !hasActiveFilters()) return;
    
    // Save to recent searches
    if (filters.query.trim()) {
      const updated = [
        filters.query.trim(),
        ...recentSearches.filter(s => s !== filters.query.trim())
      ].slice(0, 5);
      
      setRecentSearches(updated);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('healui_recent_searches', JSON.stringify(updated));
      }
    }
    
    // Track analytics
    trackSearch(filters.query, filters);
    
    // Execute search
    onSearch(filters);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  }, [filters, recentSearches, onSearch, trackSearch]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      onFiltersChange?.(filters);
    }
  }, [debouncedQuery, filters, onFiltersChange]);

  // Check if filters are active
  const hasActiveFilters = useCallback(() => {
    return filters.location || 
           filters.specialization || 
           filters.serviceType !== 'ALL' || 
           filters.availability !== 'ALL' ||
           filters.minRating > 0 ||
           filters.maxPrice ||
           filters.sortBy !== 'RELEVANCE';
  }, [filters]);

  // Generate search suggestions
  const suggestions = useMemo((): SearchSuggestion[] => {
    const suggestions: SearchSuggestion[] = [];
    const query = filters.query.toLowerCase();

    // Recent searches
    if (!query) {
      recentSearches.forEach(search => {
        suggestions.push({
          id: `recent-${search}`,
          text: search,
          type: 'RECENT',
          icon: <Clock className="w-4 h-4 text-gray-400" />
        });
      });
    }

    // Popular conditions matching query
    POPULAR_CONDITIONS.forEach(condition => {
      if (!query || condition.toLowerCase().includes(query)) {
        suggestions.push({
          id: `condition-${condition}`,
          text: condition,
          type: 'CONDITION',
          icon: <TrendingUp className="w-4 h-4 text-blue-500" />
        });
      }
    });

    return suggestions.slice(0, 6);
  }, [filters.query, recentSearches]);

  // Handle filter updates
  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [filters, onFiltersChange]);

  // Handle suggestion selection
  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    updateFilter('query', suggestion.text);
    setShowSuggestions(false);
    // Small delay to allow state update, then search
    setTimeout(() => {
      executeSearch();
    }, 100);
  }, [updateFilter, executeSearch]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !isFocused) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      
      if (event.key === 'Escape') {
        setShowSuggestions(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: '',
      location: '',
      specialization: '',
      serviceType: 'ALL',
      availability: 'ALL',
      minRating: 0,
      sortBy: 'RELEVANCE'
    };
    setFilters(clearedFilters);
    setShowFilters(false);
    onFiltersChange?.(clearedFilters);
  }, [onFiltersChange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.location) count++;
    if (filters.specialization) count++;
    if (filters.serviceType !== 'ALL') count++;
    if (filters.availability !== 'ALL') count++;
    if (filters.minRating > 0) count++;
    if (filters.maxPrice) count++;
    if (filters.sortBy !== 'RELEVANCE') count++;
    return count;
  }, [filters]);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Main Search Container */}
      <div ref={searchContainerRef} className="relative">
        {/* Primary Search Input */}
        <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 ${
          isFocused ? 'border-blue-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'
        }`}>
          <div className="flex items-center">
            {/* Search Icon */}
            <div className="pl-6 pr-2">
              {loading ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Search Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  executeSearch();
                }
              }}
              placeholder={placeholder}
              className="flex-1 py-4 px-2 text-lg bg-transparent border-none outline-none placeholder-gray-500"
              autoComplete="off"
              spellCheck={false}
            />

            {/* Clear Search */}
            {filters.query && (
              <button
                onClick={() => updateFilter('query', '')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 mx-2 px-4 py-2 rounded-lg transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Search Button */}
            <button
              onClick={executeSearch}
              disabled={loading || (!filters.query.trim() && !hasActiveFilters())}
              className="mx-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            <div className="p-2">
              {!filters.query && recentSearches.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Recent Searches
                  </div>
                </div>
              )}
              
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  {suggestion.icon}
                  <span className="text-gray-900">{suggestion.text}</span>
                  {suggestion.type === 'POPULAR' && (
                    <span className="ml-auto text-xs text-gray-500">Popular</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-40 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    placeholder="City or pincode"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Specialization Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) => updateFilter('specialization', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any specialization</option>
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Service Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={filters.serviceType}
                  onChange={(e) => updateFilter('serviceType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All services</option>
                  <option value="HOME_VISIT">Home visit</option>
                  <option value="ONLINE">Online consultation</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => updateFilter('availability', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Any time</option>
                  <option value="TODAY">Available today</option>
                  <option value="THIS_WEEK">This week</option>
                  <option value="SPECIFIC_DATE">Specific date</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => updateFilter('minRating', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>Any rating</option>
                  <option value={3}>3+ stars</option>
                  <option value={4}>4+ stars</option>
                  <option value={4.5}>4.5+ stars</option>
                  <option value={5}>5 stars</option>
                </select>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="RELEVANCE">Relevance</option>
                  <option value="RATING">Highest rated</option>
                  <option value="PRICE">Price: Low to high</option>
                  <option value="DISTANCE">Distance</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear all filters
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    executeSearch();
                    setShowFilters(false);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Shortcut Hint */}
      {!isFocused && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">/</kbd> to search
          </span>
        </div>
      )}
    </div>
  );
};

export default EnterpriseSearchInterface;