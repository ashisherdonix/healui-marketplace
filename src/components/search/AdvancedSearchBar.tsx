'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ApiManager from '@/services/api';
import { 
  Search, 
  MapPin, 
  Filter, 
  Calendar, 
  X, 
  Star, 
  DollarSign, 
  User, 
  Clock,
  ChevronDown,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { theme } from '@/utils/theme';

interface SearchParams {
  query: string;
  location: string;
  specialization: string;
  service_type: 'HOME_VISIT' | 'ONLINE' | '';
  available_date: string;
  min_rating: string;
  max_price: string;
  gender: 'M' | 'F' | '';
  experience_years: string;
  sort_by: 'rating' | 'price' | 'experience' | 'distance' | '';
  sort_order: 'asc' | 'desc';
}

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'city' | 'area' | 'pincode';
  display_name: string;
}

interface AdvancedSearchBarProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  showSuggestions?: boolean;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({ 
  onSearch, 
  loading = false,
  showSuggestions = true 
}) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    location: '',
    specialization: '',
    service_type: '',
    available_date: '',
    min_rating: '',
    max_price: '',
    gender: '',
    experience_years: '',
    sort_by: '',
    sort_order: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>([
    'Back Pain', 'Knee Pain', 'Sports Injury', 'Post Surgery', 'Neck Pain', 'Stroke Recovery'
  ]);
  
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load specializations from API
  useEffect(() => {
    loadSpecializations();
    loadRecentSearches();
  }, []);

  const loadSpecializations = async () => {
    setLoadingSpecializations(true);
    try {
      const response = await ApiManager.getSpecializations();
      if (response.success && response.data) {
        setSpecializations(response.data as string[]);
      } else {
        // Fallback specializations
        setSpecializations([
          'Sports Injury', 'Back Pain', 'Post Surgery', 'Neurological',
          'Pediatric', 'Orthopedic', 'Cardiopulmonary', 'Geriatric',
          'Women\'s Health', 'Manual Therapy', 'Exercise Therapy'
        ]);
      }
    } catch (error) {
      console.error('Failed to load specializations:', error);
      setSpecializations([
        'Sports Injury', 'Back Pain', 'Post Surgery', 'Neurological',
        'Pediatric', 'Orthopedic', 'Cardiopulmonary', 'Geriatric'
      ]);
    } finally {
      setLoadingSpecializations(false);
    }
  };

  const loadRecentSearches = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  };

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    }
  };

  // Debounced location search
  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await ApiManager.searchLocations(query, 5);
      if (response.success && response.data) {
        setLocationSuggestions(response.data as LocationSuggestion[]);
        setShowLocationDropdown(true);
      }
    } catch (error) {
      console.error('Failed to search locations:', error);
    }
  }, []);

  // Location search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(searchParams.location);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchParams.location, searchLocations]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSearchParams(prev => ({ ...prev, location: location.display_name }));
    setShowLocationDropdown(false);
  };

  const handleSearch = () => {
    // Save recent search
    if (searchParams.query) {
      saveRecentSearch(searchParams.query);
    }
    
    onSearch(searchParams);
  };

  const handleQuickSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, query }));
    saveRecentSearch(query);
    onSearch({ ...searchParams, query });
  };

  const clearSearch = () => {
    setSearchParams({
      query: '',
      location: '',
      specialization: '',
      service_type: '',
      available_date: '',
      min_rating: '',
      max_price: '',
      gender: '',
      experience_years: '',
      sort_by: '',
      sort_order: 'desc'
    });
    setShowFilters(false);
    setShowAdvanced(false);
  };

  const hasFilters = Object.entries(searchParams).some(([key, value]) => 
    key !== 'sort_order' && value !== ''
  );

  const getActiveFilterCount = () => {
    return Object.entries(searchParams).filter(([key, value]) => 
      key !== 'query' && key !== 'sort_order' && value !== ''
    ).length;
  };

  return (
    <div ref={searchRef} className="w-full max-w-4xl mx-auto">
      {/* Main Search Container */}
      <div className="relative">
        {/* Primary Search Bar */}
        <div 
          className="bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl"
          style={{
            borderColor: theme.colors.secondary,
            boxShadow: '0 4px 20px rgba(30, 95, 121, 0.1)'
          }}
        >
          {/* Top Row - Main Search */}
          <div className="flex items-center p-2 gap-2">
            {/* Search Input */}
            <div className="flex-1 flex items-center min-w-0">
              <Search className="w-5 h-5 text-gray-400 ml-4 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchParams.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                placeholder="Search conditions, specializations, or physiotherapist names..."
                className="flex-1 h-12 border-none outline-none text-base font-medium placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => showSuggestions && setShowFilters(true)}
              />
            </div>

            {/* Location Input */}
            <div ref={locationRef} className="relative flex items-center">
              <div className="h-6 w-px bg-gray-200 mr-3" />
              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={searchParams.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Pincode or city"
                className="w-32 h-12 border-none outline-none text-sm font-medium placeholder-gray-400"
                onFocus={() => searchParams.location.length >= 2 && setShowLocationDropdown(true)}
              />
              
              {/* Location Dropdown */}
              {showLocationDropdown && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {locationSuggestions.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">{location.name}</div>
                        <div className="text-xs text-gray-500">{location.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {/* Suggestions Row */}
          {showSuggestions && showFilters && (
            <div className="border-t border-gray-100 p-4 space-y-3">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-2">Recent Searches</div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Popular Conditions
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-100 p-4 space-y-4">
              {/* Quick Filters Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Service Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Service Type</label>
                  <select
                    value={searchParams.service_type}
                    onChange={(e) => handleInputChange('service_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Service</option>
                    <option value="HOME_VISIT">Home Visit</option>
                    <option value="ONLINE">Online Consultation</option>
                  </select>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Specialization</label>
                  <select
                    value={searchParams.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loadingSpecializations}
                  >
                    <option value="">Any Specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Available Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Available Date</label>
                  <input
                    type="date"
                    value={searchParams.available_date}
                    onChange={(e) => handleInputChange('available_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Min Rating</label>
                  <select
                    value={searchParams.min_rating}
                    onChange={(e) => handleInputChange('min_rating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
              </button>

              {/* Advanced Filters */}
              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  {/* Max Price */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Max Consultation Fee</label>
                    <input
                      type="number"
                      value={searchParams.max_price}
                      onChange={(e) => handleInputChange('max_price', e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Gender Preference */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Gender Preference</label>
                    <select
                      value={searchParams.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>

                  {/* Experience Years */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Min Experience</label>
                    <select
                      value={searchParams.experience_years}
                      onChange={(e) => handleInputChange('experience_years', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Experience</option>
                      <option value="1">1+ Years</option>
                      <option value="3">3+ Years</option>
                      <option value="5">5+ Years</option>
                      <option value="10">10+ Years</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Sort Options */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-500">Sort by:</label>
                    <select
                      value={searchParams.sort_by}
                      onChange={(e) => handleInputChange('sort_by', e.target.value)}
                      className="px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Relevance</option>
                      <option value="rating">Rating</option>
                      <option value="price">Price</option>
                      <option value="experience">Experience</option>
                      <option value="distance">Distance</option>
                    </select>
                  </div>
                  
                  {searchParams.sort_by && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInputChange('sort_order', searchParams.sort_order === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50"
                      >
                        <span>{searchParams.sort_order === 'asc' ? 'Low to High' : 'High to Low'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                {hasFilters && (
                  <button
                    onClick={clearSearch}
                    className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          .md\\:grid-cols-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .md\\:grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 640px) {
          .flex {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          
          .flex-1 {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedSearchBar;