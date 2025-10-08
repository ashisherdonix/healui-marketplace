import ApiManager from './api';
import { parseLocationQuery } from '@/utils/pincodeUtils';

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
      const query = filters.query.trim();
      
      // Use utility function to parse location query
      const { pincode, remainingQuery } = parseLocationQuery(query);
      
      // Detect query type
      const hasNumbers = /\d/.test(query);
      const hasLetters = /[a-zA-Z]/.test(query);
      
      if (pincode) {
        // Found a valid 6-digit pincode - use it for location
        console.log('🔍 Extracted pincode from search:', pincode);
        params.location = pincode;
        
        // If query has more than just pincode, also search by remaining text
        if (remainingQuery) {
          params.query = remainingQuery;
          console.log('🔍 Also searching for:', remainingQuery);
        }
      } else if (hasNumbers && !hasLetters) {
        // Pure numbers but not valid pincode - still treat as location
        params.location = query;
      } else if (hasLetters && !hasNumbers) {
        // Pure letters - treat as name
        params.query = query;
      } else {
        // Mixed content without valid pincode - search as name
        params.query = query;
      }
      
      console.log('🔎 Search params:', params);
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