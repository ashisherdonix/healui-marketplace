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
  metadata?: Record<string, any>;
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

// Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, any>;
}