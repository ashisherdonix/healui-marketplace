'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ApiManager from '@/services/api';
import { Calendar, Star, CheckCircle, ArrowLeft, MapPin, Clock, Phone, Video, ChevronLeft, ChevronRight, Home, User, CreditCard } from 'lucide-react';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import Header from '@/components/layout/Header';
import { PhysiotherapistProfileSkeleton } from '@/components/shared/SkeletonLoader';
import DateSelection from '@/components/physiotherapist/DateSelection';
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
  services?: Array<Record<string, unknown>>;
  workshops?: Array<Record<string, unknown>>;
  machines?: Array<Record<string, unknown>>;
  recent_reviews?: Array<Record<string, unknown>>;
  reviews_stats?: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<string, number>;
  };
}

const PhysiotherapistResponsivePage: React.FC = () => {
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
  const [dateSlotCounts, setDateSlotCounts] = useState<{[key: string]: {HOME_VISIT: number, ONLINE: number}}>({});
  const [dateViewMode, setDateViewMode] = useState<'quick' | 'calendar'>('quick');

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
        setProfile(response.data as PhysiotherapistProfile);
        if ((response.data as {recent_reviews?: Review[]}).recent_reviews) {
          setReviews((response.data as {recent_reviews: Review[]}).recent_reviews);
        }
      } else {
        setError('Failed to load physiotherapist profile');
      }
    } catch (err: Error | unknown) {
      console.error('Error loading profile:', err);
      setError((err as Error)?.message || 'Failed to load profile');
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
        const slots = (response.data as {slots?: AvailabilitySlot[]}).slots || 
                     (response.data as {available_slots?: AvailabilitySlot[]}).available_slots || 
                     (response.data as AvailabilitySlot[]) || [];
        setAvailability(slots);
        setSelectedSlot(null);
      } else {
        setAvailability([]);
      }
    } catch (err: Error | unknown) {
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
      
      for (let i = 0; i < 14; i++) {
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
        
        const homeVisitSlots = homeVisitResponse.success ? 
          ((homeVisitResponse.data as {slots?: AvailabilitySlot[]})?.slots || 
           (homeVisitResponse.data as {available_slots?: AvailabilitySlot[]})?.available_slots || 
           (homeVisitResponse.data as AvailabilitySlot[]) || []) : [];
        const onlineSlots = onlineResponse.success ? 
          ((onlineResponse.data as {slots?: AvailabilitySlot[]})?.slots || 
           (onlineResponse.data as {available_slots?: AvailabilitySlot[]})?.available_slots || 
           (onlineResponse.data as AvailabilitySlot[]) || []) : [];
        
        newDateSlotCounts[dateString] = {
          HOME_VISIT: Array.isArray(homeVisitSlots) ? homeVisitSlots.filter((slot: AvailabilitySlot) => 
            (slot.is_available !== false && slot.available !== false) && 
            (slot.visit_mode === 'HOME_VISIT' || slot.service_type === 'HOME_VISIT' || !slot.visit_mode)
          ).length : 0,
          ONLINE: Array.isArray(onlineSlots) ? onlineSlots.filter((slot: AvailabilitySlot) => 
            (slot.is_available !== false && slot.available !== false) && 
            (slot.visit_mode === 'ONLINE' || slot.service_type === 'ONLINE' || !slot.visit_mode)
          ).length : 0
        };
      });
      
      setDateSlotCounts(newDateSlotCounts);
    } catch (err: Error | unknown) {
      console.error('Error loading date slot counts:', err);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return 'N/A';
    try {
      if (time.includes('T')) {
        const date = new Date(time);
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      } else {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes || '00'} ${ampm}`;
      }
    } catch (error) {
      console.error('Error formatting time:', time, error);
      return time;
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return Math.floor(numPrice || 0);
  };

  const getSlotCountForDate = (dateString: string) => {
    const slotData = dateSlotCounts[dateString];
    if (!slotData) return 0;
    return slotData[consultationType];
  };

  const findNextAvailableSlot = () => {
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const slotCount = getSlotCountForDate(dateString);
      
      if (slotCount > 0) {
        setSelectedDate(dateString);
        break;
      }
    }
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
      <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background }}>
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background }}>
      <Header />
      


      {/* Desktop Cover Section - Hidden on Mobile */}
      <div className="desktop-only" style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${profile.cover_photo_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(30, 95, 121, 0.8))'
        }} />


        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '0',
          right: '0',
          zIndex: 2
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                {profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '36px',
                    fontWeight: '600'
                  }}>
                    {profile.full_name?.charAt(0) || 'D'}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, color: 'white' }}>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: 0,
                  marginBottom: '8px'
                }}>
                  Dr. {profile.full_name}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star style={{ width: '18px', height: '18px', fill: '#f59e0b', color: '#f59e0b' }} />
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>
                      {profile.average_rating || 0}
                    </span>
                    <span style={{ fontSize: '14px', opacity: 0.9 }}>
                      ({profile.total_reviews || 0} reviews)
                    </span>
                  </div>
                  
                  {profile.years_of_experience && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock style={{ width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '14px' }}>
                        {profile.years_of_experience} years exp
                      </span>
                    </div>
                  )}
                </div>

                {/* About Section */}
                {profile.bio && (
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '12px',
                    opacity: 0.95,
                    maxWidth: '600px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {profile.bio}
                  </p>
                )}

                {profile.specializations && profile.specializations.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {profile.specializations.slice(0, 3).map((spec, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(200, 234, 235, 0.9)',
                          color: theme.colors.primary,
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '16px'
                        }}
                      >
                        {spec.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end'
              }}>
                {/* Online Consultation */}
                {profile.online_consultation_available && (
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center',
                    minWidth: '140px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Video style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.9)' }} />
                      <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px' }}>
                        Online
                      </div>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>
                      ₹{formatPrice(profile.consultation_fee || '800')}
                    </div>
                  </div>
                )}

                {/* Home Visit */}
                {profile.home_visit_available && (
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center',
                    minWidth: '140px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Home style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.9)' }} />
                      <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px' }}>
                        Home Visit
                      </div>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>
                      ₹{formatPrice(profile.home_visit_fee || '1200')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Profile Header */}
      <div className="mobile-only" style={{ backgroundColor: theme.colors.white, padding: '16px' }}>
        {/* Photo, Name and About Section */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: theme.colors.secondary,
            border: `2px solid ${theme.colors.primary}`
          }}>
            {profile.profile_photo_url ? (
              <img
                src={profile.profile_photo_url}
                alt={profile.full_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.primary,
                fontSize: '24px',
                fontWeight: '600'
              }}>
                {profile.full_name?.charAt(0) || 'D'}
              </div>
            )}
          </div>

          {/* Name and About Text */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: theme.colors.text,
              margin: 0,
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Dr. {profile.full_name}
              {profile.is_verified && (
                <CheckCircle style={{ 
                  width: '14px', 
                  height: '14px', 
                  color: '#10B981'
                }} />
              )}
            </h1>
            {profile.bio && (
              <p style={{
                fontSize: '12px',
                lineHeight: '1.4',
                color: theme.colors.gray[700],
                margin: 0,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Rating, Experience and Specializations */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star style={{ width: '14px', height: '14px', fill: '#f59e0b', color: '#f59e0b' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                {profile.average_rating || 0}
              </span>
              <span style={{ fontSize: '12px', color: theme.colors.gray[600] }}>
                ({profile.total_reviews || 0} reviews)
              </span>
            </div>
            {profile.years_of_experience && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock style={{ width: '14px', height: '14px', color: theme.colors.primary }} />
                <span style={{ fontSize: '12px', color: theme.colors.gray[600] }}>
                  {profile.years_of_experience} years exp
                </span>
              </div>
            )}
          </div>

          {profile.specializations && profile.specializations.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '6px', 
              flexWrap: 'wrap'
            }}>
              {profile.specializations.slice(0, 3).map((spec, index) => (
                <span
                  key={index}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.primary,
                    fontSize: '11px',
                    fontWeight: '600',
                    borderRadius: '12px'
                  }}
                >
                  {spec.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>


      {/* Booking Section */}
      <div style={{ backgroundColor: theme.colors.background, padding: '24px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Mobile Consultation Type */}
          <div className="mobile-only" style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: '12px'
            }}>
              Choose Consultation Type
            </h3>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              {profile.home_visit_available && (
                <button
                  onClick={() => setConsultationType('HOME_VISIT')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    backgroundColor: consultationType === 'HOME_VISIT' ? theme.colors.primary : theme.colors.white,
                    color: consultationType === 'HOME_VISIT' ? 'white' : theme.colors.text,
                    border: consultationType === 'HOME_VISIT' ? 'none' : `1px solid ${theme.colors.gray[300]}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '40px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Home style={{ 
                      width: '14px', 
                      height: '14px',
                      color: consultationType === 'HOME_VISIT' ? 'white' : theme.colors.primary
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Home Visit</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>
                    ₹{formatPrice(profile.home_visit_fee || '1200')}
                  </span>
                </button>
              )}
              
              {profile.online_consultation_available && (
                <button
                  onClick={() => setConsultationType('ONLINE')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    backgroundColor: consultationType === 'ONLINE' ? theme.colors.primary : theme.colors.white,
                    color: consultationType === 'ONLINE' ? 'white' : theme.colors.text,
                    border: consultationType === 'ONLINE' ? 'none' : `1px solid ${theme.colors.gray[300]}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '40px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Video style={{ 
                      width: '14px', 
                      height: '14px',
                      color: consultationType === 'ONLINE' ? 'white' : theme.colors.primary
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Online</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>
                    ₹{formatPrice(profile.consultation_fee || '800')}
                  </span>
                </button>
              )}
            </div>
          </div>
          
          {/* Consultation Types - Desktop Only */}
          <div className="desktop-only" style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Choose Consultation Type
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '12px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <button
                onClick={() => setConsultationType('HOME_VISIT')}
                style={{
                  padding: '16px',
                  backgroundColor: consultationType === 'HOME_VISIT' ? theme.colors.primary : theme.colors.white,
                  color: consultationType === 'HOME_VISIT' ? theme.colors.white : theme.colors.text,
                  border: `2px solid ${consultationType === 'HOME_VISIT' ? theme.colors.primary : theme.colors.secondary}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Home style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>Home Visit</span>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>
                  Physiotherapist visits your home
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                  ₹{formatPrice(profile.home_visit_fee || profile.consultation_fee || '800')}
                </div>
              </button>
              
              <button
                onClick={() => setConsultationType('ONLINE')}
                style={{
                  padding: '16px',
                  backgroundColor: consultationType === 'ONLINE' ? theme.colors.primary : theme.colors.white,
                  color: consultationType === 'ONLINE' ? theme.colors.white : theme.colors.text,
                  border: `2px solid ${consultationType === 'ONLINE' ? theme.colors.primary : theme.colors.secondary}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Video style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>Online Consultation</span>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>
                  Video call consultation
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                  ₹{formatPrice(profile.consultation_fee || '800')}
                </div>
              </button>
            </div>
          </div>

          {/* Date Selection Component */}
          <DateSelection
            dateViewMode={dateViewMode}
            setDateViewMode={setDateViewMode}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            dateSlotCounts={dateSlotCounts}
            consultationType={consultationType}
            findNextAvailableSlot={findNextAvailableSlot}
          />

          {/* Time Slots */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Available Times
            </h3>
            
            {availabilityLoading ? (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                color: theme.colors.gray[500]
              }}>
                Loading slots...
              </div>
            ) : availability.length > 0 ? (
              <>
                <style>{`
                  @media (max-width: 768px) {
                    .time-slots-mobile {
                      display: grid !important;
                      grid-template-columns: repeat(3, 1fr) !important;
                    }
                    .time-slots-desktop {
                      display: none !important;
                    }
                  }
                  @media (min-width: 769px) {
                    .time-slots-mobile {
                      display: none !important;
                    }
                    .time-slots-desktop {
                      display: grid !important;
                    }
                  }
                `}</style>
                
                {/* Mobile: 3 column grid */}
                <div className="time-slots-mobile" style={{ 
                  gap: '8px',
                  width: '100%'
                }}>
                  {availability.map((slot, index) => {
                    const isSelected = selectedSlot === slot;
                    const slotKey = slot.slot_id || slot.id || `${slot.start_time}-${index}`;
                    
                    return (
                      <button
                        key={slotKey}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '10px 6px',
                          backgroundColor: isSelected ? theme.colors.primary : theme.colors.white,
                          color: isSelected ? theme.colors.white : theme.colors.text,
                          border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.secondary}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontSize: '13px',
                          fontWeight: isSelected ? '600' : '500',
                          transition: 'all 0.2s ease',
                          minHeight: '45px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%'
                        }}
                      >
                        {formatTime(slot.start_time)}
                      </button>
                    );
                  })}
                </div>
                
                {/* Desktop: Auto-fit grid */}
                <div className="time-slots-desktop" style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '8px',
                  maxWidth: '800px',
                  margin: '0 auto'
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
                          border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.secondary}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: isSelected ? '600' : '500',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {formatTime(slot.start_time)}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                color: theme.colors.gray[500],
                backgroundColor: theme.colors.white,
                borderRadius: '12px',
                border: `1px solid ${theme.colors.secondary}`
              }}>
                No slots available for this date
              </div>
            )}
          </div>

          {/* Book Button */}
          <div style={{ textAlign: 'center' }}>
            {selectedSlot ? (
              <button
                onClick={() => setShowBookingForm(true)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '16px 24px',
                  background: theme.gradients.primary,
                  color: theme.colors.white,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 16px rgba(30, 95, 121, 0.3)'
                }}
              >
                Book Appointment - ₹{formatPrice(selectedSlot.fee || selectedSlot.price || selectedSlot.consultation_fee || profile.consultation_fee || '800')}
              </button>
            ) : (
              <div style={{ 
                padding: '16px',
                color: theme.colors.gray[500],
                backgroundColor: theme.colors.white,
                borderRadius: '12px',
                border: `1px solid ${theme.colors.secondary}`,
                fontSize: '14px',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                Select a date and time slot to book
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
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

      {/* Responsive CSS */}
      <style jsx>{`
        .desktop-only {
          display: block;
        }
        
        .mobile-only {
          display: none;
        }
        
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          
          .mobile-only {
            display: block !important;
          }
        }
        
        @media (max-width: 480px) {
          .consultation-grid {
            grid-template-columns: 1fr !important;
          }
          
          .date-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 6px !important;
          }
          
          .time-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PhysiotherapistResponsivePage;