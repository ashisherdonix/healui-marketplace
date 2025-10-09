import { ApiMethods, BASE_URL } from '@/lib/data-access/api-client';
import { ENDPOINTS } from '@/lib/data-access/endpoints';
import { store } from '@/store/store';
import therapistSlice from '@/store/slices/therapistSlice';
import bookingSlice from '@/store/slices/bookingSlice';
import { BatchAvailabilityQuery, BatchAvailabilityResponse } from '@/lib/types';

// Type definitions (kept for future use)
// interface MarketplaceAuthDto {
//   phone: string;
//   otp: string;
//   full_name?: string;
// }

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

interface CreatePaymentIntentDto {
  visit_id: string;
  total_amount: number;
  coupon_code?: string;
  payment_method?: string;
}

interface ConfirmPaymentDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface ValidateCouponDto {
  coupon_code: string;
  physiotherapist_id: string;
  total_amount: number;
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
        store.dispatch(bookingSlice.actions.setBookings(res.data as unknown as never[]));
      }
      return res;
    });
  };

  static getBooking = (bookingId: string) => {
    const url = BASE_URL + ENDPOINTS.GET_BOOKING(bookingId);
    return ApiMethods.get(url).then((res) => {
      if (res.success && res.data) {
        store.dispatch(bookingSlice.actions.setCurrentBooking(res.data as unknown as never));
      }
      return res;
    });
  };

  static createBooking = (data: CreateBookingDto) => {
    const url = BASE_URL + ENDPOINTS.CREATE_BOOKING();
    return ApiMethods.post(url, data).then((res) => {
      if (res.success && res.data) {
        store.dispatch(bookingSlice.actions.addBooking(res.data as unknown as never));
      }
      return res;
    });
  };

  static cancelBooking = (bookingId: string, reason: string) => {
    const url = BASE_URL + ENDPOINTS.CANCEL_BOOKING(bookingId);
    return ApiMethods.put(url, { reason }).then((res) => {
      if (res.success && res.data) {
        store.dispatch(bookingSlice.actions.updateBookingData(res.data as unknown as never));
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
        store.dispatch(therapistSlice.actions.setTherapists(res.data as Record<string, unknown>[]));
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
        store.dispatch(therapistSlice.actions.setTherapists(res.data as Record<string, unknown>[]));
      }
      return res;
    });
  };

  static getPhysiotherapistProfile = (physioId: string, options?: { include_reviews?: boolean; reviews_limit?: number }) => {
    const url = BASE_URL + ENDPOINTS.GET_PHYSIOTHERAPIST_PROFILE(physioId, options);
    return ApiMethods.get(url).then((res) => {
      if (res.success && res.data) {
        store.dispatch(therapistSlice.actions.setCurrentTherapist(res.data as unknown as never));
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

  /**
   * Batch Availability API - Advanced marketplace slot fetching
   * 
   * This API provides comprehensive availability data for multiple physiotherapists
   * across multiple days with advanced filtering and location-based pricing.
   * 
   * Features:
   * - Multi-day availability (up to 7 days)
   * - Service type filtering (ONLINE, CLINIC, HOME_VISIT)
   * - Location-based pricing with zone calculations
   * - Real-time booking conflict detection
   * - Batch processing for optimal performance
   * 
   * Use cases:
   * - Marketplace search results with availability preview
   * - Calendar view showing multiple physios
   * - Location-based pricing comparison
   * - Bulk availability checking for booking flows
   * 
   * @param params - Query parameters for batch availability
   * @returns Promise<BatchAvailabilityResponse> - Comprehensive availability data
   */
  static getBatchAvailability = (params: BatchAvailabilityQuery): Promise<BatchAvailabilityResponse> => {
    console.log('🔄 ApiManager.getBatchAvailability - Request params:', {
      physioCount: params.ids.length,
      date: params.date,
      days: params.days,
      serviceTypes: params.service_types,
      hasLocation: !!(params.patient_pincode || (params.patient_lat && params.patient_lng))
    });

    // Backend DTO is now fixed! Use real API endpoint
    const url = BASE_URL + ENDPOINTS.GET_BATCH_AVAILABILITY({
      ids: params.ids,
      date: params.date,
      days: params.days,
      service_types: params.service_types,
      patient_pincode: params.patient_pincode,
      patient_lat: params.patient_lat,
      patient_lng: params.patient_lng,
      duration: params.duration
    });

    console.log('🔍 Final URL being called:', url);

    return ApiMethods.get(url).then((res: BatchAvailabilityResponse) => {
      console.log('✅ ApiManager.getBatchAvailability - Response received:', {
        success: res.success,
        physiosWithAvailability: Object.keys(res.data || {}).length,
        totalDays: res.meta?.days_included,
        bookingConflictsChecked: res.meta?.booking_conflicts_checked
      });

      // Optionally update Redux store with batch availability data
      // This could be useful for caching and state management
      if (res.success && res.data) {
        // Convert batch availability to individual therapist format for Redux compatibility
        const therapists = Object.values(res.data).map(physio => ({
          id: physio.physiotherapist_id,
          name: physio.name,
          specialization: physio.specialization,
          rating: physio.rating,
          total_reviews: physio.total_reviews,
          years_experience: physio.years_experience,
          // Add availability and pricing data for components to access
          batchAvailability: physio.availability,
          pricing: physio.pricing
        }));

        // Update therapist store with enriched data
        store.dispatch(therapistSlice.actions.setTherapists(therapists as unknown as Record<string, unknown>[]));
      }

      return res;
    }).catch((error) => {
      console.error('❌ ApiManager.getBatchAvailability - Error:', error);
      throw error;
    });
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

  // ========== TREATMENT PROTOCOLS ==========
  static getTreatmentProtocols = (params?: Record<string, any>) => {
    const url = BASE_URL + ENDPOINTS.GET_TREATMENT_PROTOCOLS(params);
    return ApiMethods.get(url);
  };

  static getTreatmentProtocol = (id: string) => {
    const url = BASE_URL + ENDPOINTS.GET_TREATMENT_PROTOCOL(id);
    return ApiMethods.get(url);
  };

  static getTreatmentProtocolByVisit = (visitId: string) => {
    const url = BASE_URL + ENDPOINTS.GET_TREATMENT_PROTOCOL_BY_VISIT(visitId);
    return ApiMethods.get(url);
  };

  static checkTreatmentProtocolExists = (visitId: string) => {
    const url = BASE_URL + ENDPOINTS.CHECK_TREATMENT_PROTOCOL_EXISTS(visitId);
    return ApiMethods.get(url);
  };

  static createTreatmentProtocol = (data: any) => {
    const url = BASE_URL + ENDPOINTS.CREATE_TREATMENT_PROTOCOL();
    return ApiMethods.post(url, data);
  };

  static updateTreatmentProtocol = (id: string, data: any) => {
    const url = BASE_URL + ENDPOINTS.UPDATE_TREATMENT_PROTOCOL(id);
    return ApiMethods.put(url, data);
  };

  static finalizeTreatmentProtocol = (id: string) => {
    const url = BASE_URL + ENDPOINTS.FINALIZE_TREATMENT_PROTOCOL(id);
    return ApiMethods.post(url, {});
  };

  static sendTreatmentProtocol = (id: string) => {
    const url = BASE_URL + ENDPOINTS.SEND_TREATMENT_PROTOCOL(id);
    return ApiMethods.post(url, {});
  };

  static generateTreatmentProtocolPDF = (id: string) => {
    const url = BASE_URL + ENDPOINTS.GENERATE_TREATMENT_PROTOCOL_PDF(id);
    return ApiMethods.get(url);
  };

  // ========== PAYMENT APIS ==========
  static createPaymentIntent = (data: CreatePaymentIntentDto) => {
    const url = BASE_URL + ENDPOINTS.CREATE_PAYMENT_INTENT();
    return ApiMethods.post(url, data);
  };

  static confirmPayment = (transactionId: string, data: ConfirmPaymentDto) => {
    const url = BASE_URL + ENDPOINTS.CONFIRM_PAYMENT(transactionId);
    return ApiMethods.post(url, data);
  };

  static getPaymentStatus = (transactionId: string) => {
    const url = BASE_URL + ENDPOINTS.GET_PAYMENT_STATUS(transactionId);
    return ApiMethods.get(url);
  };

  // ========== COUPON APIS ==========
  static getAvailableCoupons = (params?: { physiotherapist_id?: string; total_amount?: number }) => {
    const url = BASE_URL + ENDPOINTS.GET_AVAILABLE_COUPONS(params);
    return ApiMethods.get(url);
  };

  static validateCoupon = (data: ValidateCouponDto) => {
    const url = BASE_URL + ENDPOINTS.VALIDATE_COUPON();
    return ApiMethods.post(url, data);
  };

  static getCouponDetails = (couponCode: string) => {
    const url = BASE_URL + ENDPOINTS.GET_COUPON_DETAILS(couponCode);
    return ApiMethods.get(url);
  };

  // ========== CONDITIONS ==========
  static getConditions = (params?: { search?: string; limit?: number }) => {
    const url = BASE_URL + ENDPOINTS.GET_CONDITIONS(params);
    return ApiMethods.get(url);
  };

  static searchConditions = (query: string) => {
    const url = BASE_URL + ENDPOINTS.SEARCH_CONDITIONS(query);
    return ApiMethods.get(url);
  };

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