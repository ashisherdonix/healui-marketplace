'use client';

import React, { useState, useEffect } from 'react';
import CleanPhysiotherapistCard from '@/components/shared/CleanPhysiotherapistCard';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  DollarSign,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  TrendingUp,
  Users,
  AlertCircle
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
  service_areas?: string;
  consultation_fee?: string;
  home_visit_fee?: string;
  profile_picture?: string;
  profile_photo_url?: string;
  cover_photo_url?: string;
  bio?: string;
  availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  is_verified?: boolean;
  home_visit_available?: boolean;
  online_consultation_available?: boolean;
  gender?: string;
}

interface SearchResultsProps {
  results: Physiotherapist[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onClearSearch?: () => void;
  showFilters?: boolean;
  activeFiltersCount?: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  searchQuery,
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSortChange,
  onClearSearch,
  showFilters = false,
  activeFiltersCount = 0
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSortChange = (newSortBy: string) => {
    let newSortOrder: 'asc' | 'desc' = 'desc';
    
    // Toggle order if same sort field
    if (newSortBy === sortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Default orders for different fields
      newSortOrder = newSortBy === 'price' ? 'asc' : 'desc';
    }
    
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    onSortChange?.(newSortBy, newSortOrder);
  };

  const getSortIcon = (field: string) => {
    if (field !== sortBy) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getSortLabel = (field: string) => {
    const labels = {
      relevance: 'Relevance',
      rating: 'Rating',
      price: 'Price',
      experience: 'Experience',
      distance: 'Distance'
    };
    return labels[field as keyof typeof labels] || field;
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Show 2 pages before and after current page
    
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        {/* Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Error</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {error}
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Search className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {searchQuery 
            ? `No physiotherapists found for "${searchQuery}". Try adjusting your search or filters.`
            : "No physiotherapists match your current filters. Try broadening your search criteria."
          }
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search & Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Physiotherapists'}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {totalResults.toLocaleString()} results
            </span>
            {activeFiltersCount > 0 && (
              <span className="flex items-center gap-1">
                <Filter className="w-4 h-4" />
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
              </span>
            )}
            {currentPage > 1 && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="experience">Experience</option>
              <option value="distance">Distance</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Clear Search */}
          {onClearSearch && (searchQuery || activeFiltersCount > 0) && (
            <button
              onClick={onClearSearch}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Sort Indicators */}
      {sortBy !== 'relevance' && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>
            Sorted by {getSortLabel(sortBy)} 
            <span className="font-medium text-blue-600 ml-1">
              ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
            </span>
          </span>
        </div>
      )}

      {/* Results Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {results.map((therapist, index) => (
          <CleanPhysiotherapistCard
            key={therapist.id || index}
            physiotherapist={therapist}
            variant={viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-8">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {/* First page if not in range */}
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}

            {/* Page numbers in range */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 border rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page if not in range */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalResults)} of {totalResults.toLocaleString()} results
      </div>
    </div>
  );
};

export default SearchResults;