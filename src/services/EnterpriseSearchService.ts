import ApiManager from './api';

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
  page?: number;
  limit?: number;
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
  appliedFilters: SearchFilters;
}

interface CacheEntry {
  data: SearchResponse;
  timestamp: number;
  expiresAt: number;
}

// Enterprise Search Service Class
class EnterpriseSearchService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100;
  private searchRequestQueue = new Map<string, Promise<SearchResponse>>();

  // Analytics tracking
  private analytics = {
    searchCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageResponseTime: 0,
    errorCount: 0,
    lastSearchTime: 0
  };

  /**
   * Main search method with enterprise features
   */
  async search(filters: SearchFilters): Promise<SearchResponse> {
    const startTime = Date.now();
    const searchId = this.generateSearchId(filters);
    
    try {
      // Increment search count
      this.analytics.searchCount++;
      this.analytics.lastSearchTime = startTime;

      // Check cache first
      const cached = this.getCachedResult(searchId);
      if (cached) {
        this.analytics.cacheHits++;
        this.logSearchAnalytics('CACHE_HIT', filters, Date.now() - startTime);
        return cached;
      }

      this.analytics.cacheMisses++;

      // Check if same request is already in progress
      if (this.searchRequestQueue.has(searchId)) {
        this.logSearchAnalytics('DEDUPED', filters, Date.now() - startTime);
        return await this.searchRequestQueue.get(searchId)!;
      }

      // Execute search with request deduplication
      const searchPromise = this.executeSearch(filters, searchId, startTime);
      this.searchRequestQueue.set(searchId, searchPromise);

      try {
        const result = await searchPromise;
        return result;
      } finally {
        this.searchRequestQueue.delete(searchId);
      }

    } catch (error) {
      this.analytics.errorCount++;
      this.logSearchError(error, filters, searchId);
      throw this.handleSearchError(error, filters);
    }
  }

  /**
   * Execute actual search with proper error handling
   */
  private async executeSearch(filters: SearchFilters, searchId: string, startTime: number): Promise<SearchResponse> {
    try {
      // Convert our filters to API parameters
      const apiParams = this.convertFiltersToApiParams(filters);
      
      // Make API call with timeout
      const response = await Promise.race([
        ApiManager.searchPhysiotherapists(apiParams),
        this.createTimeoutPromise(10000) // 10 second timeout
      ]);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Search request failed');
      }

      const executionTime = Date.now() - startTime;
      
      // Build enterprise response
      const searchResponse: SearchResponse = {
        results: response.data as SearchResult[],
        pagination: response.pagination || {
          total: (response.data as SearchResult[]).length,
          page: filters.page || 1,
          limit: filters.limit || 12,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        },
        searchId,
        executionTime,
        appliedFilters: filters
      };

      // Cache the result
      this.cacheResult(searchId, searchResponse);
      
      // Update analytics
      this.updateAnalytics(executionTime);
      this.logSearchAnalytics('SUCCESS', filters, executionTime);

      return searchResponse;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logSearchAnalytics('ERROR', filters, executionTime, error);
      throw error;
    }
  }

  /**
   * Convert our filter format to API parameters
   */
  private convertFiltersToApiParams(filters: SearchFilters): Record<string, any> {
    const params: Record<string, any> = {
      page: filters.page || 1,
      limit: filters.limit || 12
    };

    if (filters.query) {
      params.query = filters.query;
    }

    if (filters.location) {
      params.location = filters.location;
    }

    if (filters.specialization) {
      params.specialization = filters.specialization;
    }

    if (filters.serviceType !== 'ALL') {
      params.service_type = filters.serviceType;
    }

    if (filters.availability === 'TODAY') {
      params.available_date = new Date().toISOString().split('T')[0];
    } else if (filters.availability === 'SPECIFIC_DATE' && filters.specificDate) {
      params.available_date = filters.specificDate;
    }

    if (filters.minRating > 0) {
      params.min_rating = filters.minRating;
    }

    if (filters.maxPrice) {
      params.max_price = filters.maxPrice;
    }

    // Handle sorting
    switch (filters.sortBy) {
      case 'RATING':
        params.sort_by = 'rating';
        params.sort_order = 'desc';
        break;
      case 'PRICE':
        params.sort_by = 'price';
        params.sort_order = 'asc';
        break;
      case 'DISTANCE':
        params.sort_by = 'distance';
        params.sort_order = 'asc';
        break;
      default:
        // RELEVANCE - let API handle default sorting
        break;
    }

    return params;
  }

  /**
   * Get featured physiotherapists
   */
  async getFeatured(location?: string, limit: number = 6): Promise<SearchResult[]> {
    const cacheKey = `featured_${location || 'all'}_${limit}`;
    
    try {
      // Check cache
      const cached = this.getCachedResult(cacheKey);
      if (cached) {
        return cached.results;
      }

      // Make API call
      const response = await ApiManager.getFeaturedPhysiotherapists({ location, limit });
      
      if (!response.success || !response.data) {
        throw new Error('Failed to load featured physiotherapists');
      }

      const results = response.data as SearchResult[];
      
      // Cache results (as a search response format)
      const searchResponse: SearchResponse = {
        results,
        pagination: {
          total: results.length,
          page: 1,
          limit,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        },
        searchId: cacheKey,
        executionTime: 0,
        appliedFilters: {
          query: '',
          location: location || '',
          specialization: '',
          serviceType: 'ALL',
          availability: 'ALL',
          minRating: 0,
          sortBy: 'RELEVANCE'
        }
      };

      this.cacheResult(cacheKey, searchResponse);
      return results;

    } catch (error) {
      console.error('Featured physiotherapists error:', error);
      // Return empty array instead of throwing to prevent page crashes
      return [];
    }
  }

  /**
   * Search suggestions for autocomplete
   */
  async getLocationSuggestions(query: string, limit: number = 5): Promise<Array<{
    id: string;
    name: string;
    type: string;
    display_name: string;
  }>> {
    if (query.length < 2) return [];

    try {
      const response = await ApiManager.searchLocations(query, limit);
      
      if (response.success && response.data) {
        return response.data as Array<{
          id: string;
          name: string;
          type: string;
          display_name: string;
        }>;
      }
      
      return [];
    } catch (error) {
      console.error('Location suggestions error:', error);
      return [];
    }
  }

  /**
   * Get available specializations
   */
  async getSpecializations(): Promise<string[]> {
    const cacheKey = 'specializations';
    
    try {
      // Check cache
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.data.results as unknown as string[];
      }

      const response = await ApiManager.getSpecializations();
      
      if (response.success && response.data) {
        const specializations = response.data as string[];
        
        // Cache for longer (1 hour) since specializations don't change often
        this.cache.set(cacheKey, {
          data: { results: specializations } as any,
          timestamp: Date.now(),
          expiresAt: Date.now() + (60 * 60 * 1000)
        });
        
        return specializations;
      }

      // Return fallback specializations
      return [
        'Sports Rehabilitation', 'Orthopedic', 'Neurological', 'Pediatric',
        'Geriatric', 'Cardiopulmonary', 'Women\'s Health', 'Manual Therapy'
      ];

    } catch (error) {
      console.error('Specializations error:', error);
      // Return fallback instead of throwing
      return [
        'Sports Rehabilitation', 'Orthopedic', 'Neurological', 'Pediatric',
        'Geriatric', 'Cardiopulmonary', 'Women\'s Health', 'Manual Therapy'
      ];
    }
  }

  /**
   * Cache management
   */
  private generateSearchId(filters: SearchFilters): string {
    const normalized = { ...filters };
    delete normalized.page; // Don't include page in cache key for base search
    return btoa(JSON.stringify(normalized)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  }

  private getCachedResult(key: string): SearchResponse | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (cached.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private cacheResult(key: string, data: SearchResponse): void {
    // Implement LRU cache eviction
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_TTL
    });
  }

  /**
   * Error handling
   */
  private createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Search request timeout')), ms);
    });
  }

  private handleSearchError(error: any, filters: SearchFilters): Error {
    // Create user-friendly error messages
    if (error.message?.includes('timeout')) {
      return new Error('Search is taking longer than expected. Please try again.');
    }
    
    if (error.message?.includes('network')) {
      return new Error('Network connection issue. Please check your internet and try again.');
    }
    
    if (error.status === 429) {
      return new Error('Too many search requests. Please wait a moment and try again.');
    }
    
    if (error.status >= 500) {
      return new Error('Server error. Our team has been notified. Please try again later.');
    }
    
    // Generic fallback
    return new Error('Search failed. Please try again.');
  }

  /**
   * Analytics and logging
   */
  private updateAnalytics(executionTime: number): void {
    // Update average response time with exponential moving average
    if (this.analytics.averageResponseTime === 0) {
      this.analytics.averageResponseTime = executionTime;
    } else {
      this.analytics.averageResponseTime = 
        (this.analytics.averageResponseTime * 0.9) + (executionTime * 0.1);
    }
  }

  private logSearchAnalytics(type: string, filters: SearchFilters, executionTime: number, error?: any): void {
    const logData = {
      type,
      filters: {
        hasQuery: !!filters.query,
        hasLocation: !!filters.location,
        hasSpecialization: !!filters.specialization,
        serviceType: filters.serviceType,
        availability: filters.availability,
        minRating: filters.minRating,
        sortBy: filters.sortBy
      },
      executionTime,
      timestamp: Date.now(),
      error: error?.message
    };

    // In production, send to analytics service
    console.log('🔍 Search Analytics:', logData);
    
    // Track in browser analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search_performance', {
        search_type: type,
        execution_time: executionTime,
        has_filters: Object.values(logData.filters).some(v => v && v !== 'ALL' && v !== 'RELEVANCE' && v !== 0)
      });
    }
  }

  private logSearchError(error: any, filters: SearchFilters, searchId: string): void {
    const errorData = {
      searchId,
      error: {
        message: error.message,
        stack: error.stack,
        status: error.status
      },
      filters,
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    };

    // In production, send to error tracking service (Sentry, Bugsnag, etc.)
    console.error('🚨 Search Error:', errorData);
  }

  /**
   * Performance monitoring
   */
  getPerformanceMetrics() {
    return {
      ...this.analytics,
      cacheSize: this.cache.size,
      cacheHitRate: this.analytics.cacheHits / (this.analytics.cacheHits + this.analytics.cacheMisses) || 0,
      errorRate: this.analytics.errorCount / this.analytics.searchCount || 0
    };
  }

  /**
   * Cache management utilities
   */
  clearCache(): void {
    this.cache.clear();
  }

  warmCache(popularSearches: SearchFilters[]): Promise<void[]> {
    return Promise.all(
      popularSearches.map(filters => 
        this.search(filters).catch(error => {
          console.warn('Cache warming failed for:', filters, error);
        })
      )
    );
  }
}

// Export singleton instance
export const enterpriseSearchService = new EnterpriseSearchService();
export default enterpriseSearchService;