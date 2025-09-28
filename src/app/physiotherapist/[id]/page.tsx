'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ApiManager from '@/services/api';
import { Calendar, Star, CheckCircle, ArrowLeft, MapPin, Clock, Phone, Video, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import Header from '@/components/layout/Header';
import { PhysiotherapistProfileSkeleton } from '@/components/shared/SkeletonLoader';
import { theme } from '@/utils/theme';

interface AvailabilitySlot {
  slot_id?: string;
  id?: string;
  start_time: string;
  end_time: string;
  is_available?: boolean;
  available?: boolean;
  visit_mode?: 'HOME_VISIT' | 'ONLINE';
  service_type?: 'HOME_VISIT' | 'ONLINE';
  fee?: number;
  price?: number;
  consultation_fee?: number;
}

interface Review {
  id: string;
  patient_name: string;
  rating: number;
  review_text?: string;
  created_at: string;
  conditions_treated?: string[];
  tags?: string[];
}

interface PhysiotherapistProfile {
  id: string;
  full_name: string;
  profile_photo_url?: string;
  cover_photo_url?: string;
  practice_address?: string;
  service_areas?: string;
  years_of_experience?: number;
  average_rating?: number;
  total_reviews?: number;
  specializations?: string[];
  languages?: string[];
  education?: Array<{ degree: string; institution: string; year: string }>;
  techniques?: Array<{ name: string; description?: string }>;
  bio?: string;
  consultation_fee?: string;
  home_visit_fee?: string;
  online_consultation_available?: boolean;
  home_visit_available?: boolean;
  is_verified?: boolean;
  license_number?: string;
  services?: Array<any>;
  workshops?: Array<any>;
  machines?: Array<any>;
  recent_reviews?: Array<any>;
  reviews_stats?: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: any;
  };
}

const PhysiotherapistEnhancedPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const physioId = params.id as string;
  
  const [profile, setProfile] = useState<PhysiotherapistProfile | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [consultationType, setConsultationType] = useState<'HOME_VISIT' | 'ONLINE'>('HOME_VISIT');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [dateViewMode, setDateViewMode] = useState<'quick' | 'calendar'>('quick');
  const [dateSlotCounts, setDateSlotCounts] = useState<{[key: string]: {HOME_VISIT: number, ONLINE: number}}>({});
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    if (physioId) {
      loadProfile();
      loadDateSlotCounts();
    }
  }, [physioId]);

  useEffect(() => {
    if (profile && selectedDate) {
      loadAvailability();
    }
  }, [profile, selectedDate, consultationType]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getPhysiotherapistProfile(physioId, {
        include_reviews: true,
        reviews_limit: 10
      });
      
      if (response.success && response.data) {
        setProfile(response.data);
        if (response.data.recent_reviews) {
          setReviews(response.data.recent_reviews);
        }
      } else {
        setError('Failed to load physiotherapist profile');
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async () => {
    if (!profile || !selectedDate) return;
    
    try {
      setAvailabilityLoading(true);
      const response = await ApiManager.getPhysiotherapistAvailability(profile.id, {
        date: selectedDate,
        service_type: consultationType,
        duration: 60
      });
      
      if (response.success && response.data) {
        // Check different possible data structures
        const slots = response.data.slots || response.data.available_slots || response.data || [];
        setAvailability(slots);
        setSelectedSlot(null);
      } else {
        setAvailability([]);
      }
    } catch (err: any) {
      console.error('Error loading availability:', err);
      setAvailability([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const loadDateSlotCounts = async () => {
    if (!physioId) return;
    
    try {
      const promises = [];
      const dates = [];
      
      // Load slots for next 42 days (6 weeks)
      for (let i = 0; i < 42; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        dates.push(dateString);
        
        promises.push(
          ApiManager.getPhysiotherapistAvailability(physioId, {
            date: dateString,
            service_type: 'HOME_VISIT',
            duration: 60
          }),
          ApiManager.getPhysiotherapistAvailability(physioId, {
            date: dateString,
            service_type: 'ONLINE',
            duration: 60
          })
        );
      }
      
      const responses = await Promise.all(promises);
      const newDateSlotCounts: {[key: string]: {HOME_VISIT: number, ONLINE: number}} = {};
      
      dates.forEach((dateString, index) => {
        const homeVisitResponse = responses[index * 2];
        const onlineResponse = responses[index * 2 + 1];
        
        // Handle different possible data structures for slot counts
        const homeVisitSlots = homeVisitResponse.success ? 
          (homeVisitResponse.data?.slots || homeVisitResponse.data?.available_slots || homeVisitResponse.data || []) : [];
        const onlineSlots = onlineResponse.success ? 
          (onlineResponse.data?.slots || onlineResponse.data?.available_slots || onlineResponse.data || []) : [];
        
        newDateSlotCounts[dateString] = {
          HOME_VISIT: Array.isArray(homeVisitSlots) ? homeVisitSlots.filter((slot: any) => 
            (slot.is_available !== false && slot.available !== false) && 
            (slot.visit_mode === 'HOME_VISIT' || slot.service_type === 'HOME_VISIT' || !slot.visit_mode)
          ).length : 0,
          ONLINE: Array.isArray(onlineSlots) ? onlineSlots.filter((slot: any) => 
            (slot.is_available !== false && slot.available !== false) && 
            (slot.visit_mode === 'ONLINE' || slot.service_type === 'ONLINE' || !slot.visit_mode)
          ).length : 0
        };
      });
      
      setDateSlotCounts(newDateSlotCounts);
    } catch (err: any) {
      console.error('Error loading date slot counts:', err);
    }
  };

  const handleBookAppointment = () => {
    if (selectedSlot && profile) {
      setShowBookingForm(true);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return 'N/A';
    try {
      // Handle different time formats
      if (time.includes('T')) {
        // ISO datetime format
        const date = new Date(time);
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      } else {
        // HH:MM format
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes || '00'} ${ampm}`;
      }
    } catch (error) {
      console.error('Error formatting time:', time, error);
      return time; // Return original if formatting fails
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return Math.floor(numPrice || 0);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getSlotCountForDate = (dateString: string) => {
    const slotData = dateSlotCounts[dateString];
    if (!slotData) return 0;
    return slotData[consultationType];
  };

  const renderCalendar = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button
            onClick={() => setSelectedMonth(new Date(year, month - 1))}
            style={{
              padding: '8px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronLeft style={{ width: '20px', height: '20px' }} />
          </button>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
            {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => setSelectedMonth(new Date(year, month + 1))}
            style={{
              padding: '8px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronRight style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6B7280', padding: '8px' }}>
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} />;
            }
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const isPast = date < today;
            const isSelected = selectedDate === dateString;
            const slotCount = getSlotCountForDate(dateString);
            const hasSlots = slotCount > 0;

            return (
              <button
                key={day}
                onClick={() => !isPast && setSelectedDate(dateString)}
                disabled={isPast}
                style={{
                  padding: '8px',
                  border: `2px solid ${isSelected ? '#2563EB' : isPast ? '#E5E7EB' : hasSlots ? '#D1D5DB' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#EFF6FF' : isPast ? '#F9FAFB' : hasSlots ? 'white' : '#F9FAFB',
                  cursor: isPast ? 'not-allowed' : 'pointer',
                  opacity: isPast ? 0.5 : 1,
                  position: 'relative'
                }}
              >
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? '#1E40AF' : '#1F2937'
                }}>{day}</div>
                {hasSlots && !isPast && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '2px', 
                    right: '2px', 
                    width: '6px', 
                    height: '6px', 
                    backgroundColor: '#10B981', 
                    borderRadius: '50%' 
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <PhysiotherapistProfileSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="bg-background" style={{ minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: '#1F2937', marginBottom: '1rem', fontSize: '24px', fontWeight: 'bold' }}>
              Error Loading Profile
            </div>
            <div style={{ color: '#6B7280', marginBottom: '2rem' }}>
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const coverImage = profile.cover_photo_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background }}>
      {/* Header */}
      <Header />
      
      {/* Cover Image with Doctor Info Overlay */}
      <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
        {/* Cover Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} />
        
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(30, 95, 121, 0.8), rgba(200, 234, 235, 0.6))'
        }} />

        {/* Breadcrumb */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '0',
          right: '0',
          zIndex: 2
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => router.push('/')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Home style={{ width: '14px', height: '14px' }} />
                Home
              </button>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>→</span>
              <button
                onClick={() => router.back()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Search Results
              </button>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>→</span>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                Dr. {profile.full_name}
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Information Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '0',
          right: '0',
          zIndex: 2
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Profile Image */}
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                {profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: '600'
                  }}>
                    {profile.full_name?.charAt(0) || 'D'}
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '16px' }}>
                  <h1 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: 'white',
                    margin: 0,
                    marginBottom: '12px',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                  }}>
                    Dr. {profile.full_name}
                  </h1>
                  
                  {/* Verification Badge */}
                  {profile.is_verified && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.9)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '16px'
                    }}>
                      <CheckCircle style={{ width: '16px', height: '16px' }} />
                      Verified Doctor
                    </div>
                  )}
                  
                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Star style={{ width: '20px', height: '20px', fill: '#f59e0b', color: '#f59e0b' }} />
                      <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>
                        {profile.average_rating || 0}
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                        ({profile.total_reviews || 0} reviews)
                      </span>
                    </div>
                    
                    {profile.years_of_experience && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <Clock style={{ width: '16px', height: '16px' }} />
                        {profile.years_of_experience} years experience
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  {profile.specializations && profile.specializations.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {profile.specializations.slice(0, 4).map((spec, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: 'rgba(200, 234, 235, 0.9)',
                            color: theme.colors.primary,
                            fontSize: '14px',
                            fontWeight: '600',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          {spec.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Location and Services */}
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {profile.practice_address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin style={{ width: '18px', height: '18px', color: 'rgba(255, 255, 255, 0.9)' }} />
                        <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                          {profile.practice_address}
                        </span>
                      </div>
                    )}
                    
                    {/* Service Types */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {profile.home_visit_available !== false && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '13px',
                          fontWeight: '500',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <Home style={{ width: '14px', height: '14px' }} />
                          Home Visit
                        </div>
                      )}
                      {profile.online_consultation_available !== false && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '13px',
                          fontWeight: '500',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <Video style={{ width: '14px', height: '14px' }} />
                          Online
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '24px',
                minWidth: '200px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', color: theme.colors.gray[600], marginBottom: '4px' }}>
                    Consultation Fee
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: theme.colors.primary
                  }}>
                    ₹{formatPrice(profile.consultation_fee || '800')}
                  </div>
                </div>
                
                {profile.home_visit_fee && profile.home_visit_fee !== profile.consultation_fee && (
                  <div style={{
                    paddingTop: '12px',
                    borderTop: `1px solid ${theme.colors.secondary}`
                  }}>
                    <div style={{ fontSize: '14px', color: theme.colors.gray[600], marginBottom: '4px' }}>
                      Home Visit
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: theme.colors.text
                    }}>
                      ₹{formatPrice(profile.home_visit_fee)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
        <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: '2fr 1fr' }}>
          {/* Left Column - About & Reviews */}
          <div>
            {/* About Section */}
            {profile.bio && (
              <div style={{ 
                backgroundColor: theme.colors.white,
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: theme.colors.text,
                  marginBottom: '16px'
                }}>
                  About
                </h2>
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: theme.colors.gray[600],
                  margin: 0
                }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div style={{ 
                backgroundColor: theme.colors.white,
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: theme.colors.text, 
                  marginBottom: '16px' 
                }}>
                  Education
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profile.education.map((edu, index) => (
                    <div key={index} style={{ borderBottom: index < profile.education.length - 1 ? `1px solid ${theme.colors.secondary}` : 'none', paddingBottom: '12px' }}>
                      <div style={{ fontWeight: '600', color: theme.colors.text }}>{edu.degree}</div>
                      <div style={{ fontSize: '14px', color: theme.colors.gray[600] }}>{edu.institution}, {edu.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Techniques */}
            {profile.techniques && profile.techniques.length > 0 && (
              <div style={{ 
                backgroundColor: theme.colors.white,
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: theme.colors.text, 
                  marginBottom: '16px' 
                }}>
                  Techniques & Treatments
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {profile.techniques.map((technique, index) => (
                    <div key={index} style={{ padding: '12px 0', borderBottom: index < profile.techniques.length - 1 ? `1px solid ${theme.colors.secondary}` : 'none' }}>
                      <div style={{ fontWeight: '500', color: theme.colors.text }}>{technique.name}</div>
                      {technique.description && (
                        <div style={{ fontSize: '14px', color: theme.colors.gray[600], marginTop: '4px' }}>
                          {technique.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div>
            <div style={{
              backgroundColor: theme.colors.white,
              padding: '24px',
              position: 'sticky',
              top: '20px'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '20px', 
                color: theme.colors.text 
              }}>
                Book Appointment
              </h2>
              
{/* Consultation Type Selection */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setConsultationType('HOME_VISIT')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: consultationType === 'HOME_VISIT' ? theme.colors.primary : theme.colors.white,
                      color: consultationType === 'HOME_VISIT' ? theme.colors.white : theme.colors.text,
                      border: `2px solid ${consultationType === 'HOME_VISIT' ? theme.colors.primary : theme.colors.secondary}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Home style={{ width: '16px', height: '16px' }} />
                    Home Visit
                  </button>
                  <button
                    onClick={() => setConsultationType('ONLINE')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: consultationType === 'ONLINE' ? theme.colors.primary : theme.colors.white,
                      color: consultationType === 'ONLINE' ? theme.colors.white : theme.colors.text,
                      border: `2px solid ${consultationType === 'ONLINE' ? theme.colors.primary : theme.colors.secondary}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Video style={{ width: '16px', height: '16px' }} />
                    Online
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: theme.colors.text, 
                  marginBottom: '12px' 
                }}>
                  Select Date
                </h3>
                
                {/* Quick Date Selection */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dateString = date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateString;
                    const slotCount = getSlotCountForDate(dateString);
                    
                    return (
                      <button
                        key={dateString}
                        onClick={() => setSelectedDate(dateString)}
                        style={{
                          minWidth: '80px',
                          padding: '12px 8px',
                          backgroundColor: isSelected ? theme.colors.primary : theme.colors.white,
                          color: isSelected ? theme.colors.white : theme.colors.text,
                          border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.secondary}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontSize: '13px',
                          fontWeight: isSelected ? '600' : '500'
                        }}
                      >
                        <div style={{ fontWeight: '600' }}>
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          {date.getDate()}
                        </div>
                        <div style={{ fontSize: '11px', marginTop: '2px' }}>
                          {slotCount > 0 ? `${slotCount} slots` : 'No slots'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: theme.colors.text, 
                  marginBottom: '12px' 
                }}>
                  Available Times
                </h3>
                
                {availabilityLoading ? (
                  <div style={{ 
                    padding: '20px', 
                    textAlign: 'center',
                    color: theme.colors.gray[500]
                  }}>
                    Loading slots...
                  </div>
                ) : availability.length > 0 ? (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '8px' 
                  }}>
                    {availability.map((slot, index) => {
                      const isSelected = selectedSlot === slot;
                      const slotKey = slot.slot_id || slot.id || `${slot.start_time}-${index}`;
                      
                      return (
                        <button
                          key={slotKey}
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '12px 8px',
                            backgroundColor: isSelected ? theme.colors.primary : theme.colors.white,
                            color: isSelected ? theme.colors.white : theme.colors.text,
                            border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.secondary}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '13px',
                            fontWeight: isSelected ? '600' : '500',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = theme.colors.primary;
                              e.currentTarget.style.backgroundColor = theme.colors.background;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = theme.colors.secondary;
                              e.currentTarget.style.backgroundColor = theme.colors.white;
                            }
                          }}
                        >
                          <div>{formatTime(slot.start_time)}</div>
                          <div style={{ fontSize: '11px', opacity: 0.8 }}>
                            ₹{formatPrice(slot.fee || slot.price || slot.consultation_fee || profile.consultation_fee || '800')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ 
                    padding: '20px', 
                    textAlign: 'center',
                    color: theme.colors.gray[500],
                    backgroundColor: theme.colors.background,
                    borderRadius: '8px'
                  }}>
                    No slots available for this date
                  </div>
                )}
              </div>

              {/* Book Button */}
              {selectedSlot ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                  }}
                >
                  Book {formatTime(selectedSlot.start_time)} - ₹{formatPrice(selectedSlot.fee || selectedSlot.price || selectedSlot.consultation_fee || profile.consultation_fee || '800')}
                </button>
              ) : (
                <div style={{ 
                  padding: '16px',
                  textAlign: 'center',
                  color: theme.colors.gray[500],
                  backgroundColor: theme.colors.background,
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  Select a date and time slot to book
                </div>
              )}

              {/* Enhanced Booking Form Modal */}
              {showBookingForm && selectedSlot && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}>
                  <div style={{
                    backgroundColor: theme.colors.white,
                    borderRadius: '12px',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}>
                    <EnhancedBookingForm
                      physiotherapist={{
                        id: profile.id,
                        full_name: profile.full_name,
                        consultation_fee: parseFloat(profile.consultation_fee || '800'),
                        location: profile.practice_address || 'Location not specified'
                      }}
                      selectedSlot={{
                        slot_id: selectedSlot.slot_id || selectedSlot.id || '',
                        start_time: selectedSlot.start_time,
                        end_time: selectedSlot.end_time,
                        is_available: selectedSlot.is_available !== false && selectedSlot.available !== false,
                        visit_mode: selectedSlot.visit_mode || selectedSlot.service_type || consultationType,
                        fee: selectedSlot.fee || selectedSlot.price || selectedSlot.consultation_fee || parseFloat(profile.consultation_fee || '800')
                      }}
                      selectedDate={selectedDate}
                      onClose={() => {
                        setSelectedSlot(null);
                        setShowBookingForm(false);
                      }}
                      onSuccess={() => {
                        setSelectedSlot(null);
                        setShowBookingForm(false);
                        loadAvailability();
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysiotherapistEnhancedPage;
