'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  AlertCircle,
  RefreshCw,
  Search,
  MapPin,
  Star,
  Clock,
  TrendingUp,
  Users,
  Filter
} from 'lucide-react';

// Types
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
  availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  is_verified?: boolean;
  home_visit_available?: boolean;
  online_consultation_available?: boolean;
  gender?: string;
}

interface SearchResponse {
  results: SearchResult[];
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
  appliedFilters: any;
}

interface EnterpriseSearchResultsProps {
  data?: SearchResponse;
  loading?: boolean;
  error?: string | null;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

// Professional Physiotherapist Card Component
const PhysiotherapistCard: React.FC<{
  result: SearchResult;
  viewMode: 'grid' | 'list';
  onClick?: (result: SearchResult) => void;
}> = ({ result, viewMode, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.(result);
  }, [result, onClick]);

  const formatPrice = (price?: string) => {
    if (!price) return 'Contact for pricing';
    return `₹${parseFloat(price).toLocaleString()}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleClick}
        className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            {result.profile_photo_url ? (
              <img
                src={result.profile_photo_url}
                alt={result.full_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-gray-200 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {getInitials(result.full_name)}
                </span>
              </div>
            )}
            
            {result.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Dr. {result.full_name}
                </h3>
                {result.years_of_experience && (
                  <p className="text-sm text-blue-600 font-medium">
                    {result.years_of_experience} years experience
                  </p>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-green-700">
                  {result.average_rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">
                  ({result.total_reviews})
                </span>
              </div>
            </div>

            {/* Location */}
            {result.practice_address && (
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{result.practice_address}</span>
              </div>
            )}

            {/* Specializations */}
            {result.specializations && result.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {result.specializations.slice(0, 4).map((spec, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                  >
                    {spec}
                  </span>
                ))}
                {result.specializations.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    +{result.specializations.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Bio */}
            {result.bio && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {result.bio}
              </p>
            )}

            {/* Services & Pricing */}
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                {result.online_consultation_available && result.consultation_fee && (
                  <div className="text-sm">
                    <span className="text-gray-500">Online:</span>
                    <span className="font-semibold text-gray-900 ml-1">
                      {formatPrice(result.consultation_fee)}
                    </span>
                  </div>
                )}
                
                {result.home_visit_available && result.home_visit_fee && (
                  <div className="text-sm">
                    <span className="text-gray-500">Home visit:</span>
                    <span className="font-semibold text-gray-900 ml-1">
                      {formatPrice(result.home_visit_fee)}
                    </span>
                  </div>
                )}
              </div>

              {/* Availability Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  result.availability_status === 'AVAILABLE' ? 'bg-green-500' : 
                  result.availability_status === 'BUSY' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-600">
                  {result.availability_status === 'AVAILABLE' ? 'Available today' :
                   result.availability_status === 'BUSY' ? 'Busy today' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col"
    >
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-4">
        {result.profile_photo_url ? (
          <img
            src={result.profile_photo_url}
            alt={result.full_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-gray-200 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {getInitials(result.full_name)}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            Dr. {result.full_name}
          </h3>
          {result.years_of_experience && (
            <p className="text-sm text-blue-600 font-medium">
              {result.years_of_experience} years exp.
            </p>
          )}
        </div>

        {result.is_verified && (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="font-semibold">{result.average_rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({result.total_reviews})</span>
        </div>
        
        <div className={`w-2 h-2 rounded-full ${
          result.availability_status === 'AVAILABLE' ? 'bg-green-500' : 
          result.availability_status === 'BUSY' ? 'bg-yellow-500' : 'bg-gray-400'
        }`} />
      </div>

      {/* Location */}
      {result.practice_address && (
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">{result.practice_address}</span>
        </div>
      )}

      {/* Specializations */}
      {result.specializations && result.specializations.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4 flex-1">
          {result.specializations.slice(0, 2).map((spec, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
            >
              {spec}
            </span>
          ))}
          {result.specializations.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{result.specializations.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Pricing */}
      <div className="space-y-2 mt-auto">
        {result.online_consultation_available && result.consultation_fee && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Online</span>
            <span className="font-semibold">{formatPrice(result.consultation_fee)}</span>
          </div>
        )}
        
        {result.home_visit_available && result.home_visit_fee && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Home visit</span>
            <span className="font-semibold">{formatPrice(result.home_visit_fee)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
  const skeletons = Array.from({ length: viewMode === 'grid' ? 6 : 4 });

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {skeletons.map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-64" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Component
const EnterpriseSearchResults: React.FC<EnterpriseSearchResultsProps> = ({
  data,
  loading = false,
  error = null,
  onPageChange,
  onRetry,
  onResultClick,
  className = ""
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to top when page changes
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data?.pagination.page]);

  // Pagination logic
  const paginationPages = useMemo(() => {
    if (!data?.pagination) return [];
    
    const { page, totalPages } = data.pagination;
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (page > 4) {
        pages.push('ellipsis');
      }
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 3) {
        pages.push('ellipsis');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [data?.pagination]);

  // Error State
  if (error) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Failed</h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // No Results State
  if (!loading && data && data.results.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Search className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            We couldn't find any physiotherapists matching your search criteria. 
            Try adjusting your filters or search terms.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-500">Popular searches:</span>
            {['Back Pain', 'Sports Injury', 'Post Surgery'].map(term => (
              <button
                key={term}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={resultsRef} className={`${className}`}>
      {/* Results Header */}
      {data && !loading && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Results Info */}
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {data.pagination.total.toLocaleString()} Results
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {data.executionTime}ms
                </span>
                {data.pagination.page > 1 && (
                  <span>
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSkeleton viewMode={viewMode} />}

      {/* Results Grid */}
      {data && !loading && (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {data.results.map((result) => (
            <PhysiotherapistCard
              key={result.id}
              result={result}
              viewMode={viewMode}
              onClick={onResultClick}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && !loading && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => onPageChange?.(data.pagination.page - 1)}
            disabled={!data.pagination.hasPrev}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {paginationPages.map((page, index) => (
            page === 'ellipsis' ? (
              <span key={index} className="px-2 text-gray-500">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange?.(page as number)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  page === data.pagination.page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )
          ))}

          <button
            onClick={() => onPageChange?.(data.pagination.page + 1)}
            disabled={!data.pagination.hasNext}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Results Summary */}
      {data && !loading && (
        <div className="text-center text-sm text-gray-500 mt-8">
          Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
          {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
          {data.pagination.total.toLocaleString()} results
        </div>
      )}
    </div>
  );
};

export default EnterpriseSearchResults;