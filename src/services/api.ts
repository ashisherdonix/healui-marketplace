import { ApiMethods, BASE_URL } from '@/lib/data-access/api-client';
import { ENDPOINTS } from '@/lib/data-access/endpoints';
import { store } from '@/store/store';
import therapistSlice from '@/store/slices/therapistSlice';
import bookingSlice from '@/store/slices/bookingSlice';

// Type definitions
interface _MarketplaceAuthDto {
  phone: string;
  otp: string;
  full_name?: string;
}

interface CreateBookingDto {
  patient_user_id: string;
  physiotherapist_id: string;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  scheduled_date: string;
  scheduled_time: string;
  end_time: string;
  duration_minutes: number;
  chief_complaint?: string;
  patient_address?: string;
  consultation_fee: number;
  travel_fee?: number;
  total_amount: number;
  conditions?: string[];
}

interface CreateReviewDto {
  visit_id: string;
  rating: number;
  review_text?: string;
  conditions_treated?: string[];
  tags?: string[];
  ratings_breakdown?: {
    professionalism: number;
    effectiveness: number;
    communication: number;
    punctuality: number;
    value_for_money: number;
  };
}

interface UpdateProfileDto {
  full_name: string; // Required field
  email?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'O'; // M (Male), F (Female), O (Other)
  address?: string;
  pincode?: string;
}

interface AddFamilyMemberDto {
  full_name: string;
  relationship: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'O'; // M (Male), F (Female), O (Other)
  address?: string;
  pincode?: string;
}

// API Manager class for marketplace - following EMR pattern exactly
class ApiManager {
  // ========== FIREBASE AUTHENTICATION (Following EMR Pattern) ==========
  static login = (data: { phone: string; firebaseIdToken: string }) => {
    const url = BASE_URL + ENDPOINTS.LOGIN();
    // Clear any existing auth tokens before login to prevent interference
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    return ApiMethods.post(url, data);
  };

  static refreshToken = (refreshToken: string) => {
    const url = BASE_URL + ENDPOINTS.REFRESH_TOKEN();
    return ApiMethods.post(url, { refresh_token: refreshToken });
  };

  // ========== USER MANAGEMENT (Following EMR Pattern) ==========
  static getMe = () => {
    const url = BASE_URL + ENDPOINTS.GET_ME();
    return ApiMethods.get(url).then((res) => {
      console.log('🔄 ApiManager.getMe - Raw response:', res);
      return res;
    }).catch((error) => {
      console.error('❌ ApiManager.getMe - Error:', error);
      throw error;
    });
  };

  // ========== PATIENT USER MANAGEMENT ==========
  static getMyProfile = () => {
    const url = BASE_URL + ENDPOINTS.GET_MY_PROFILE();
    return ApiMethods.get(url);
  };

  static updateMyProfile = (data: UpdateProfileDto) => {
    const url = BASE_URL + ENDPOINTS.UPDATE_MY_PROFILE();
    return ApiMethods.put(url, data);
  };

  static getDashboard = () => {
    const url = BASE_URL + ENDPOINTS.GET_DASHBOARD();
    return ApiMethods.get(url);
  };

  // ========== FAMILY MEMBERS ==========
  static getFamilyMembers = () => {
    const url = BASE_URL + ENDPOINTS.GET_FAMILY_MEMBERS();
    return ApiMethods.get(url);
  };

  static addFamilyMember = (data: AddFamilyMemberDto) => {
    const url = BASE_URL + ENDPOINTS.ADD_FAMILY_MEMBER();
    return ApiMethods.post(url, data);
  };

  static removeFamilyMember = (familyMemberId: string) => {
    const url = BASE_URL + ENDPOINTS.REMOVE_FAMILY_MEMBER(familyMemberId);
    return ApiMethods.delete(url);
  };

  // ========== MARKETPLACE BOOKINGS ==========
  static getMyBookings = () => {
    const url = BASE_URL + ENDPOINTS.GET_MY_BOOKINGS();
    return ApiMethods.get(url).then((res) => {
      if (res.success && res.data) {
        store.dispatch(bookingSlice.actions.setBookings(res.data));
      }
      return res;
    });
  };

  static getBooking = (bookingId: string) => {
    const url = BASE_URL + ENDPOINTS.GET_BOOKING(bookingId);
    return ApiMethods.get(url).then((res) => {
      if (res.success && res.data) {
        store.dispatch(bookingSlice.actions.setCurrentBooking(res.data));
      }
      return res;
    });
  };

  static createBooking = (data: CreateBookingDto) => {
    const url = BASE_URL + ENDPOINTS.CREATE_BOOKING();
    return ApiMethods.post(url, data).then((res) => {
      if (res.success && res.data) {
        store.dispatch(bookingSlice.actions.addBooking(res.data));
      }
      return res;
    });
  };

  static cancelBooking = (bookingId: string, reason: string) => {
    const url = BASE_URL + ENDPOINTS.CANCEL_BOOKING(bookingId);
    return ApiMethods.put(url, { reason }).then((res) => {
      if (res.success && res.data) {
        store.dispatch(bookingSlice.actions.updateBookingData(res.data));
      }
      return res;
    });
  };

  // ========== REVIEWS ==========
  static createReview = (data: CreateReviewDto) => {
    const url = BASE_URL + ENDPOINTS.CREATE_REVIEW();
    return ApiMethods.post(url, data);
  };

  static getMyReviews = () => {
    const url = BASE_URL + ENDPOINTS.GET_MY_REVIEWS();
    return ApiMethods.get(url);
  };

  // ========== MARKETPLACE DISCOVERY ==========

  // Home page featured physiotherapists
  static getFeaturedPhysiotherapists = (params?: { location?: string; limit?: number }) => {
    const url = BASE_URL + ENDPOINTS.GET_FEATURED_PHYSIOTHERAPISTS(params);
    return ApiMethods.get(url).then((res) => {
      if (res.success && res.data) {
        store.dispatch(therapistSlice.actions.setTherapists(res.data));
      }
      return res;
    });
  };

  // Search physiotherapists
  static searchPhysiotherapists = (params?: {
    query?: string;
    location?: string;
    specialization?: string;
    service_type?: 'HOME_VISIT' | 'ONLINE';
    available_date?: string;
    min_rating?: number;
    max_price?: number;
    gender?: 'M' | 'F';
    experience_years?: number;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  }) => {
    const url = BASE_URL + ENDPOINTS.SEARCH_PHYSIOTHERAPISTS(params);
    return ApiMethods.get(url).then((res) => {
      if (res.success && res.data) {
        store.dispatch(therapistSlice.actions.setTherapists(res.data));
      }
      return res;
    });
  };

  static getPhysiotherapistProfile = (physioId: string, options?: { include_reviews?: boolean; reviews_limit?: number }) => {
    const url = BASE_URL + ENDPOINTS.GET_PHYSIOTHERAPIST_PROFILE(physioId, options);
    return ApiMethods.get(url).then((res) => {
      if (res.success && res.data) {
        store.dispatch(therapistSlice.actions.setCurrentTherapist(res.data));
      }
      return res;
    });
  };

  static getPhysiotherapistAvailability = (physioId: string, params: {
    date: string;
    service_type?: 'HOME_VISIT' | 'ONLINE';
    duration?: number;
  }) => {
    const url = BASE_URL + ENDPOINTS.GET_PHYSIOTHERAPIST_AVAILABILITY(physioId, params);
    return ApiMethods.get(url);
  };

  static getPhysiotherapistReviews = (physioId: string, params?: {
    page?: number;
    limit?: number;
    rating_filter?: number;
  }) => {
    const url = BASE_URL + ENDPOINTS.GET_PHYSIOTHERAPIST_REVIEWS(physioId, params);
    return ApiMethods.get(url);
  };

  // Helper methods
  static getSpecializations = () => {
    const url = BASE_URL + ENDPOINTS.GET_SPECIALIZATIONS();
    return ApiMethods.get(url);
  };

  static searchLocations = (query: string, limit?: number) => {
    const url = BASE_URL + ENDPOINTS.SEARCH_LOCATIONS({ query, limit });
    return ApiMethods.get(url);
  };

  // ========== NOT IMPLEMENTED YET ==========
  // TODO: Payment APIs, Conditions APIs, etc.

  // ========== LOGOUT ==========
  static logout = () => {
    // Clear cookies
    if (typeof window !== 'undefined') {
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    return Promise.resolve({ success: true });
  };
}

export default ApiManager;