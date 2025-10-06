// Marketplace API endpoints matching physio-backend-core implementation

export const ENDPOINTS = {
  // ========== AUTHENTICATION (Following EMR Pattern Exactly) ==========
  LOGIN: () => 'marketplace/auth/login',
  GET_ME: () => 'marketplace/auth/me',
  REFRESH_TOKEN: () => 'marketplace/auth/refresh-token',

  // ========== PATIENT USER MANAGEMENT ==========
  GET_MY_PROFILE: () => 'patient-users/me',
  UPDATE_MY_PROFILE: () => 'patient-users/me',
  
  // Family Members
  GET_FAMILY_MEMBERS: () => 'patient-users/family',
  ADD_FAMILY_MEMBER: () => 'patient-users/family',
  REMOVE_FAMILY_MEMBER: (familyMemberId: string) => `patient-users/family/${familyMemberId}`,
  
  // Dashboard
  GET_DASHBOARD: () => 'patient-users/dashboard',

  // ========== MARKETPLACE BOOKINGS ==========
  CREATE_BOOKING: () => 'patient-users/bookings',
  GET_MY_BOOKINGS: () => 'patient-users/bookings',
  GET_BOOKING: (bookingId: string) => `patient-users/bookings/${bookingId}`,
  CANCEL_BOOKING: (bookingId: string) => `patient-users/bookings/${bookingId}/cancel`,

  // ========== REVIEWS ==========
  CREATE_REVIEW: () => 'patient-users/reviews',
  GET_MY_REVIEWS: () => 'patient-users/reviews',

  // ========== TREATMENT PROTOCOLS ==========
  GET_TREATMENT_PROTOCOLS: (params?: Record<string, any>) => {
    let url = 'treatment-protocols';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key].toString());
        }
      });
      if (searchParams.toString()) {
        url += '?' + searchParams.toString();
      }
    }
    return url;
  },
  GET_TREATMENT_PROTOCOL: (id: string) => `treatment-protocols/${id}`,
  GET_TREATMENT_PROTOCOL_BY_VISIT: (visitId: string) => `treatment-protocols/visit/${visitId}`,
  CHECK_TREATMENT_PROTOCOL_EXISTS: (visitId: string) => `treatment-protocols/visit/${visitId}/exists`,
  CREATE_TREATMENT_PROTOCOL: () => 'treatment-protocols',
  UPDATE_TREATMENT_PROTOCOL: (id: string) => `treatment-protocols/${id}`,
  FINALIZE_TREATMENT_PROTOCOL: (id: string) => `treatment-protocols/${id}/finalize`,
  SEND_TREATMENT_PROTOCOL: (id: string) => `treatment-protocols/${id}/send-to-patient`,
  GENERATE_TREATMENT_PROTOCOL_PDF: (id: string) => `treatment-protocols/${id}/pdf`,

  // ========== MARKETPLACE DISCOVERY ==========
  
  // Home page
  GET_FEATURED_PHYSIOTHERAPISTS: (params?: { location?: string; limit?: number }) => {
    let url = 'marketplace/physiotherapists/featured';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.location) searchParams.append('location', params.location);
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (searchParams.toString()) {
        url += '?' + searchParams.toString();
      }
    }
    return url;
  },

  // Search
  SEARCH_PHYSIOTHERAPISTS: (params?: Record<string, string | number | boolean>) => {
    let url = 'marketplace/physiotherapists/search';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key].toString());
        }
      });
      if (searchParams.toString()) {
        url += '?' + searchParams.toString();
      }
    }
    return url;
  },

  // Profile and details
  GET_PHYSIOTHERAPIST_PROFILE: (physioId: string, params?: { include_reviews?: boolean; reviews_limit?: number }) => {
    let url = `marketplace/physiotherapists/${physioId}/profile`;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.include_reviews !== undefined) searchParams.append('include_reviews', params.include_reviews.toString());
      if (params.reviews_limit) searchParams.append('reviews_limit', params.reviews_limit.toString());
      if (searchParams.toString()) {
        url += '?' + searchParams.toString();
      }
    }
    return url;
  },

  GET_PHYSIOTHERAPIST_REVIEWS: (physioId: string, params?: { page?: number; limit?: number; rating_filter?: number }) => {
    let url = `marketplace/physiotherapists/${physioId}/reviews`;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.rating_filter) searchParams.append('rating_filter', params.rating_filter.toString());
      if (searchParams.toString()) {
        url += '?' + searchParams.toString();
      }
    }
    return url;
  },

  GET_PHYSIOTHERAPIST_AVAILABILITY: (physioId: string, params: { date: string; service_type?: string; duration?: number }) => {
    const url = `marketplace/physiotherapists/${physioId}/availability`;
    const searchParams = new URLSearchParams();
    searchParams.append('date', params.date);
    if (params.service_type) searchParams.append('service_type', params.service_type);
    if (params.duration) searchParams.append('duration', params.duration.toString());
    return url + '?' + searchParams.toString();
  },

  // Batch availability endpoint - fetches availability for multiple physiotherapists
  GET_BATCH_AVAILABILITY: (params: {
    ids: string[];
    date: string;
    days?: number;
    service_types?: string[];
    patient_pincode?: string;
    patient_lat?: number;
    patient_lng?: number;
    duration?: number;
  }) => {
    const url = 'marketplace/physiotherapists/batch-availability';
    
    // Backend transform expects strings that it can split, not arrays
    // Based on error analysis, backend has wrong decorator order but expects comma-separated strings
    const searchParams = new URLSearchParams();
    
    // Use a different approach - send as JSON-encoded arrays or find the working format
    // Since backend transform calls .split(), it expects strings
    searchParams.append('ids', params.ids.join(','));
    searchParams.append('date', params.date);
    
    // Optional parameters
    if (params.days) searchParams.append('days', params.days.toString());
    if (params.service_types && params.service_types.length > 0) {
      searchParams.append('service_types', params.service_types.join(','));
    }
    if (params.patient_pincode) searchParams.append('patient_pincode', params.patient_pincode);
    if (params.patient_lat) searchParams.append('patient_lat', params.patient_lat.toString());
    if (params.patient_lng) searchParams.append('patient_lng', params.patient_lng.toString());
    if (params.duration) searchParams.append('duration', params.duration.toString());
    
    return url + '?' + searchParams.toString();
  },

  // Helper endpoints
  GET_SPECIALIZATIONS: () => 'marketplace/physiotherapists/meta/specializations',
  SEARCH_LOCATIONS: (params: { query: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', params.query);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    return `marketplace/physiotherapists/meta/locations?${searchParams.toString()}`;
  },

  // NOT IMPLEMENTED YET
  // CREATE_PAYMENT_INTENT: ...
  // CONFIRM_PAYMENT: ...
  // GET_PAYMENT_STATUS: ...
  // GET_CONDITIONS: ...
  // SEARCH_CONDITIONS: ...
};