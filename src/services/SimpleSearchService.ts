import ApiManager from './api';

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

class SimpleSearchService {
  async search(filters: SimpleSearchFilters): Promise<SearchResult[]> {
    try {
      // Convert filters to API parameters
      const apiParams = this.convertFilters(filters);
      
      // Make API call
      const response = await ApiManager.searchPhysiotherapists(apiParams);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Search failed');
      }
      
      return response.data as SearchResult[];
      
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search physiotherapists. Please try again.');
    }
  }

  async getFeatured(): Promise<SearchResult[]> {
    try {
      const response = await ApiManager.getFeaturedPhysiotherapists({ limit: 12 });
      
      if (!response.success || !response.data) {
        return [];
      }
      
      return response.data as SearchResult[];
      
    } catch (error) {
      console.error('Featured error:', error);
      return [];
    }
  }

  private convertFilters(filters: SimpleSearchFilters): Record<string, any> {
    const params: Record<string, any> = {
      limit: 20
    };

    if (filters.query.trim()) {
      // Detect if query is likely a pincode (numbers only) or name/location
      const hasNumbers = /\d/.test(filters.query);
      const hasLetters = /[a-zA-Z]/.test(filters.query);
      
      if (hasNumbers && !hasLetters) {
        // Pure numbers - treat as pincode/location
        params.location = filters.query.trim();
      } else if (hasLetters && !hasNumbers) {
        // Pure letters - treat as name
        params.query = filters.query.trim();
      } else {
        // Mixed - search both name and location
        params.query = filters.query.trim();
        params.location = filters.query.trim();
      }
    }

    if (filters.specialty) {
      params.specialization = filters.specialty;
    }

    if (filters.serviceType !== 'ALL') {
      params.service_type = filters.serviceType;
    }

    return params;
  }
}

export const simpleSearchService = new SimpleSearchService();
export default simpleSearchService;