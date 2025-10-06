// TypeScript interfaces and types for marketplace
// Following clinic-web pattern with comprehensive type definitions

// Base entity types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User and authentication types (Following marketplace patient user structure)
export interface User extends BaseEntity {
  phone: string;
  full_name: string;
  email?: string;
  address?: string;
  pincode?: string;
  date_of_birth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  account_type: 'PRIMARY' | 'FAMILY_MEMBER';
  primary_user_id?: string;
  role?: 'MARKETPLACE_PATIENT';
  isActive?: boolean;
  last_login?: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
  timezone: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Authentication DTOs (Following Firebase pattern)
export interface LoginDto {
  phone: string;
  firebaseIdToken: string;
}

export interface RegisterDto {
  phone: string;
  firebaseIdToken: string;
  full_name: string;
}

export interface OTPDto {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Therapist types
export interface Therapist extends BaseEntity {
  user: User;
  licenseNumber: string;
  specializations: Specialization[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  bio: string;
  qualifications: Qualification[];
  availability: Availability[];
  services: TherapistService[];
  languages: string[];
  homeVisitAreas: string[];
  onlineConsultation: boolean;
  profileImage?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
}

export interface Specialization extends BaseEntity {
  name: string;
  description: string;
  category: string;
}

export interface Qualification extends BaseEntity {
  degree: string;
  institution: string;
  year: number;
  certificateUrl?: string;
}

export interface TherapistService extends BaseEntity {
  service: Service;
  price: number;
  duration: number; // minutes
  homeVisitPrice?: number;
  onlinePrice?: number;
  isActive: boolean;
}

// Service types
export interface Service extends BaseEntity {
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  baseDuration: number; // minutes
  isActive: boolean;
  requirements?: string[];
  benefits?: string[];
  imageUrl?: string;
}

export interface ServiceCategory extends BaseEntity {
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

// Booking types
export interface Booking extends BaseEntity {
  patient: User;
  therapist: Therapist;
  service: Service;
  appointmentDate: string;
  startTime: string;
  duration: number; // minutes
  type: 'home_visit' | 'clinic' | 'online';
  status: BookingStatus;
  price: number;
  address?: Address;
  notes?: string;
  therapistNotes?: string;
  cancellationReason?: string;
  payment: Payment;
  review?: Review;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface CreateBookingDto {
  therapistId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  type: 'home_visit' | 'clinic' | 'online';
  notes?: string;
  address?: Address;
}

export interface UpdateBookingDto {
  appointmentDate?: string;
  startTime?: string;
  notes?: string;
  address?: Address;
}

// Payment types
export interface Payment extends BaseEntity {
  booking: Booking;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  stripePaymentIntentId?: string;
  refundAmount?: number;
  refundReason?: string;
}

export type PaymentMethod = 'card' | 'upi' | 'wallet' | 'cash';
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

// Review types
export interface Review extends BaseEntity {
  booking: Booking;
  patient: User;
  therapist: Therapist;
  rating: number; // 1-5
  comment?: string;
  isAnonymous: boolean;
  response?: TherapistResponse;
}

export interface TherapistResponse extends BaseEntity {
  comment: string;
  respondedAt: string;
}

export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  comment?: string;
  isAnonymous: boolean;
}

// Availability types
export interface Availability extends BaseEntity {
  therapist: Therapist;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  type: 'home_visit' | 'clinic' | 'online';
  isActive: boolean;
}

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  type: 'home_visit' | 'clinic' | 'online';
  therapist: Therapist;
  service: Service;
  price: number;
}

// Location types
export interface Location extends BaseEntity {
  name: string;
  type: 'city' | 'area' | 'pincode';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  parentLocation?: Location;
  isActive: boolean;
}

// Notification types
export interface Notification extends BaseEntity {
  user: User;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'payment_success'
  | 'payment_failed'
  | 'review_request'
  | 'promotion'
  | 'system';

// Analytics types
export interface BookingAnalytics {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  revenue: number;
  averageRating: number;
  bookingsByDate: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  serviceBreakdown: Array<{
    service: Service;
    count: number;
    revenue: number;
  }>;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    refunds: number;
    net: number;
  }>;
  revenueByService: Array<{
    service: Service;
    revenue: number;
    count: number;
    averagePrice: number;
  }>;
}

// API response wrappers
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResponse<T> {
  data: T[];
  query: string;
  total: number;
  suggestions?: string[];
}

// Filter and search types
export interface TherapistFilters {
  specializations?: string[];
  minRating?: number;
  maxPrice?: number;
  availability?: {
    date: string;
    time: string;
  };
  location?: string;
  languages?: string[];
  gender?: 'male' | 'female';
  experience?: number;
  serviceTypes?: ('home_visit' | 'clinic' | 'online')[];
}

export interface ServiceFilters {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  location?: string;
}

export interface BookingFilters {
  status?: BookingStatus[];
  dateFrom?: string;
  dateTo?: string;
  therapistId?: string;
  serviceId?: string;
}

// Treatment Protocol types
export enum ProtocolStatus {
  DRAFT = 'DRAFT',
  FINALIZED = 'FINALIZED',
  SENT_TO_PATIENT = 'SENT_TO_PATIENT',
  ARCHIVED = 'ARCHIVED'
}

export interface TreatmentProtocolExercise {
  id: string;
  exercise_id?: string;
  exercise_name: string;
  exercise_description?: string;
  custom_reps: number;
  custom_sets: number;
  custom_duration_seconds: number;
  custom_notes?: string;
  frequency?: string;
  order_index: number;
}

export interface TreatmentProtocolArea {
  id: string;
  area_type: 'CONDITION' | 'ANATOMY';
  area_name: string;
  structure_type?: string;
  structure_id?: string;
  description?: string;
  severity_level?: number;
  notes?: string;
  order_index: number;
}

export interface TreatmentProtocolRecommendation {
  id: string;
  recommendation_type: 'LIFESTYLE' | 'PRECAUTION' | 'MEDICATION' | 'FOLLOW_UP' | 'OTHER';
  title: string;
  description: string;
  priority_level: number;
  order_index: number;
}

export interface TreatmentProtocol extends BaseEntity {
  visit_id: string;
  patient_id?: string;
  patient_user_id?: string;
  clinic_id?: string;
  physiotherapist_id: string;
  protocol_title: string;
  current_complaint?: string;
  general_notes?: string;
  additional_manual_notes?: string;
  show_explanations: boolean;
  status: ProtocolStatus;
  finalized_at?: string;
  sent_to_patient_at?: string;
  created_by: string;
  updated_by?: string;
  exercises?: TreatmentProtocolExercise[];
  affectedAreas?: TreatmentProtocolArea[];
  recommendations?: TreatmentProtocolRecommendation[];
}

export interface CreateTreatmentProtocolDto {
  visit_id: string;
  protocol_title: string;
  current_complaint?: string;
  general_notes?: string;
  additional_manual_notes?: string;
  show_explanations?: boolean;
  exercises?: Omit<TreatmentProtocolExercise, 'id'>[];
  affected_areas?: Omit<TreatmentProtocolArea, 'id'>[];
  recommendations?: Omit<TreatmentProtocolRecommendation, 'id'>[];
}

export interface UpdateTreatmentProtocolDto {
  protocol_title?: string;
  current_complaint?: string;
  general_notes?: string;
  additional_manual_notes?: string;
  show_explanations?: boolean;
  status?: ProtocolStatus;
  exercises?: Omit<TreatmentProtocolExercise, 'id'>[];
  affected_areas?: Omit<TreatmentProtocolArea, 'id'>[];
  recommendations?: Omit<TreatmentProtocolRecommendation, 'id'>[];
}

export interface GetTreatmentProtocolsQueryDto {
  visit_id?: string;
  patient_id?: string;
  patient_user_id?: string;
  clinic_id?: string;
  physiotherapist_id?: string;
  status?: ProtocolStatus;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

// ========== BATCH AVAILABILITY TYPES ==========
/**
 * Comprehensive batch availability API for marketplace.
 * This API allows fetching availability for multiple physiotherapists across multiple days,
 * with advanced filtering by service types, location-based pricing, and real-time slot conflicts.
 * 
 * Features:
 * - Multi-day availability (up to 7 days)
 * - Service type filtering (ONLINE, CLINIC, HOME_VISIT)
 * - Location-based pricing with zone calculations
 * - Real-time booking conflict detection
 * - Batch processing for optimal performance
 */

export interface BatchAvailabilityQuery {
  ids: string[]; // Physiotherapist IDs
  date: string; // Start date (YYYY-MM-DD)
  days?: number; // Number of days (1-7, default: 1)
  service_types?: AvailabilityServiceType[]; // Filter by service types
  patient_pincode?: string; // For home visit pricing
  patient_lat?: number; // Patient latitude for distance calculation
  patient_lng?: number; // Patient longitude for distance calculation
  duration?: number; // Session duration (30-180 min, default: 60)
}

export type AvailabilityServiceType = 'ONLINE' | 'CLINIC' | 'HOME_VISIT';

export interface AvailabilitySlot {
  availability_id: string;
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  duration_minutes: number;
  is_available: boolean;
}

export interface OnlineAvailabilitySlot extends AvailabilitySlot {}

export interface ClinicAvailabilitySlot extends AvailabilitySlot {
  clinic_id?: string;
  clinic_name?: string;
  clinic_address?: string;
}

export interface ZoneInfo {
  zone: 'green' | 'yellow' | 'red';
  pincode_match: boolean;
  distance_km: number;
  extra_charge: number;
}

export interface HomeVisitAvailabilitySlot extends AvailabilitySlot {
  service_location_id?: string;
  service_location_name?: string;
  zone_info?: ZoneInfo;
}

export interface DayAvailability {
  online?: OnlineAvailabilitySlot[];
  clinic?: ClinicAvailabilitySlot[];
  home_visit?: HomeVisitAvailabilitySlot[];
}

export interface PricingBreakdown {
  consultation_fee: number;
  online?: {
    consultation_fee: number;
    platform_fee: number;
    total: number;
  };
  clinic?: {
    consultation_fee: number;
    total: number;
  };
  home_visit?: {
    consultation_fee: number;
    travel_fee: number;
    zone_extra_charge: number;
    total: number;
    zone_breakdown: {
      green: { extra_charge: number; available: boolean };
      yellow: { extra_charge: number; available: boolean };
      red: { extra_charge: number; available: boolean };
    };
  };
}

export interface PhysiotherapistBatchAvailability {
  physiotherapist_id: string;
  name: string;
  specialization: string[];
  rating: number;
  total_reviews: number;
  years_experience: number;
  availability: Record<string, DayAvailability>; // Date string -> availability
  pricing: PricingBreakdown;
}

export interface BatchAvailabilityResponse {
  success: boolean;
  message: string;
  data: Record<string, PhysiotherapistBatchAvailability>; // Physio ID -> availability data
  meta: {
    requested_date: string;
    days_included: number;
    service_types_filter?: AvailabilityServiceType[];
    patient_location?: {
      pincode?: string;
      coordinates?: [number, number];
    };
    booking_conflicts_checked: boolean;
    physiotherapist_count: number;
    generated_at: string;
  };
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, unknown>;
}