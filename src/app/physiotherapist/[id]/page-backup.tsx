'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ApiManager from '@/services/api';
import { Calendar, Star, CheckCircle, ArrowLeft, MapPin, Clock, Phone, Grid3x3, CalendarDays } from 'lucide-react';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';

interface AvailabilitySlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  fee: number;
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
  profile_image?: string;
  location?: string;
  experience_years?: number;
  average_rating?: number;
  total_reviews?: number;
  specializations?: string[];
  languages?: string[];
  education?: Array<{ degree: string; institution: string; year: string }>;
  certifications?: string[];
  bio?: string;
  consultation_fee?: string;
  home_visit_fee?: string;
  online_fee?: string;
  availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  next_available_slot?: string;
}

const PhysiotherapistDetailPage: React.FC = () => {
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
  const [activeTab, setActiveTab] = useState<'availability' | 'reviews'>('availability');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [dateViewMode, setDateViewMode] = useState<'quick' | 'calendar'>('quick');
  const [dateSlotCounts, setDateSlotCounts] = useState<{[key: string]: {HOME_VISIT: number, ONLINE: number}}>({});

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
        // Reviews might be in a separate field or embedded
        if (response.data.reviews) {
          setReviews(response.data.reviews);
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
        setAvailability(response.data.slots || []);
        setSelectedSlot(null);
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
      
      for (let i = 0; i < 7; i++) {
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
        
        newDateSlotCounts[dateString] = {
          HOME_VISIT: homeVisitResponse.success ? (homeVisitResponse.data?.slots?.filter((slot: any) => slot.is_available)?.length || 0) : 0,
          ONLINE: onlineResponse.success ? (onlineResponse.data?.slots?.filter((slot: any) => slot.is_available)?.length || 0) : 0
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
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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

  if (loading) {
    return (
      <div className="bg-background" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E5E7EB',
            borderTopColor: '#2563EB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <div style={{ color: '#6B7280' }}>
            Loading physiotherapist profile...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background" style={{ minHeight: '100vh', padding: '2rem' }}>
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
    );
  }

  if (!profile) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Profile Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)', 
        color: 'white', 
        padding: '20px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(100px, -100px)'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <button
            onClick={() => router.back()}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Search
          </button>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'white',
              flexShrink: 0
            }}>
              {profile.profile_image ? (
                <img 
                  src={profile.profile_image} 
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
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#2563EB',
                  background: 'white'
                }}>
                  {profile.full_name?.charAt(0) || '?'}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                marginBottom: '8px',
                color: 'white'
              }}>
                {profile.full_name}
              </h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {profile.location && (
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    <MapPin style={{ width: '14px', height: '14px' }} />
                    {profile.location}
                  </div>
                )}
                
                {profile.experience_years && (
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    <Clock style={{ width: '14px', height: '14px' }} />
                    {profile.experience_years} years exp
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star style={{ width: '20px', height: '20px', fill: '#FCD34D', color: '#FCD34D' }} />
                  <span style={{ fontSize: '18px', fontWeight: '700' }}>{profile.average_rating || 0}</span>
                  <span style={{ opacity: 0.9, fontSize: '14px' }}>({profile.total_reviews || 0} reviews)</span>
                </div>
                
                {profile.specializations && profile.specializations.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Specializes in:</div>
                    <div style={{ 
                      padding: '4px 12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {profile.specializations[0]}
                    </div>
                    {profile.specializations.length > 1 && (
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        +{profile.specializations.length - 1} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0' }}>
        
        {/* Profile Details Section */}
        <div style={{ 
          backgroundColor: 'white',
          margin: '8px',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #E5E7EB'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '16px'
          }}>
            About Dr. {profile.full_name}
          </h2>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              {profile.bio && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '8px'
                  }}>
                    Biography
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    lineHeight: '1.6', 
                    color: '#6B7280',
                    margin: 0
                  }}>
                    {profile.bio}
                  </p>
                </div>
              )}

              {profile.specializations && profile.specializations.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '8px'
                  }}>
                    Specializations
                  </h3>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {profile.specializations.map((specialization, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#EFF6FF',
                          color: '#1E40AF',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {specialization}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.languages && profile.languages.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '8px'
                  }}>
                    Languages
                  </h3>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {profile.languages.map((language, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#F0FDF4',
                          color: '#166534',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.certifications && profile.certifications.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '8px'
                  }}>
                    Certifications
                  </h3>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {profile.certifications.map((certification, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {certification}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div style={{ 
          backgroundColor: 'white',
          margin: '8px',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #E5E7EB'
        }}>
          {/* Tab Navigation */}
          <div style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '12px',
            border: '1px solid #E5E7EB',
            display: 'flex'
          }}>
            {[
              { id: 'availability', label: 'Book Appointment', icon: Calendar },
              { id: 'reviews', label: 'Reviews & Feedback', icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: activeTab === tab.id ? '#2563EB' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6B7280',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'availability' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Book Your Appointment</h2>
              
              {/* Service Selection */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Choose Service Type</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setConsultationType('HOME_VISIT')}
                    style={{
                      flex: 1,
                      padding: '16px',
                      border: `2px solid ${consultationType === 'HOME_VISIT' ? '#2563EB' : '#E5E7EB'}`,
                      borderRadius: '12px',
                      backgroundColor: consultationType === 'HOME_VISIT' ? '#EFF6FF' : 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <MapPin style={{ width: '20px', height: '20px', color: '#2563EB' }} />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>Home Visit</div>
                        <div style={{ color: '#2563EB', fontSize: '18px', fontWeight: '700' }}>
                          ₹{formatPrice(profile.home_visit_fee || profile.consultation_fee || '800')}
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setConsultationType('ONLINE')}
                    style={{
                      flex: 1,
                      padding: '16px',
                      border: `2px solid ${consultationType === 'ONLINE' ? '#10B981' : '#E5E7EB'}`,
                      borderRadius: '12px',
                      backgroundColor: consultationType === 'ONLINE' ? '#F0FDF4' : 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Phone style={{ width: '20px', height: '20px', color: '#10B981' }} />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>Online</div>
                        <div style={{ color: '#10B981', fontSize: '18px', fontWeight: '700' }}>
                          ₹{formatPrice(profile.online_fee || profile.consultation_fee || '600')}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Select Date</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                  {[0, 1, 2, 3, 4, 5, 6].map((daysAhead) => {
                    const date = new Date();
                    date.setDate(date.getDate() + daysAhead);
                    const dateString = date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateString;
                    const slotCount = getSlotCountForDate(dateString);
                    
                    return (
                      <button
                        key={dateString}
                        onClick={() => setSelectedDate(dateString)}
                        disabled={slotCount === 0}
                        style={{
                          padding: '12px',
                          border: `2px solid ${isSelected ? '#2563EB' : '#E5E7EB'}`,
                          borderRadius: '8px',
                          backgroundColor: isSelected ? '#EFF6FF' : slotCount > 0 ? 'white' : '#F9FAFB',
                          cursor: slotCount > 0 ? 'pointer' : 'not-allowed',
                          textAlign: 'center',
                          opacity: slotCount === 0 ? 0.6 : 1
                        }}
                      >
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>
                          {daysAhead === 0 ? 'Today' : daysAhead === 1 ? 'Tomorrow' : formatDate(date)}
                        </div>
                        <div style={{ fontSize: '11px', opacity: 0.8 }}>
                          {slotCount > 0 ? `${slotCount} slots` : 'No slots'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Available Time Slots</h3>
                {availabilityLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>Loading slots...</div>
                ) : availability.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '20px' }}>
                    {availability.map((slot) => {
                      const isSelected = selectedSlot?.slot_id === slot.slot_id;
                      const isAvailable = slot.is_available;
                      
                      return (
                        <button
                          key={slot.slot_id}
                          onClick={() => isAvailable ? setSelectedSlot(slot) : null}
                          disabled={!isAvailable}
                          style={{
                            padding: '12px 8px',
                            border: `1.5px solid ${isSelected ? '#2563EB' : isAvailable ? '#E5E7EB' : '#F3F4F6'}`,
                            borderRadius: '8px',
                            backgroundColor: isSelected ? '#EFF6FF' : isAvailable ? 'white' : '#F9FAFB',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            textAlign: 'center',
                            opacity: isAvailable ? 1 : 0.6
                          }}
                        >
                          <div style={{ fontSize: '13px', fontWeight: '600' }}>
                            {formatTime(slot.start_time)}
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#2563EB' }}>
                            ₹{formatPrice(slot.fee || profile.consultation_fee || '600')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                    No slots available for selected date
                  </div>
                )}

                {selectedSlot && (
                  <button
                    onClick={handleBookAppointment}
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#2563EB',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Book This Appointment
                  </button>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                Patient Reviews ({profile.total_reviews || 0})
              </h3>
              
              {reviews.length > 0 ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {reviews.map((review) => (
                    <div key={review.id} style={{ padding: '20px', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{review.patient_name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  color: i < review.rating ? '#F59E0B' : '#E5E7EB',
                                  fill: i < review.rating ? '#F59E0B' : '#E5E7EB'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {review.review_text && (
                        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                          "{review.review_text}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                  No reviews yet - be the first to leave a review!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Booking Form Modal */}
      {showBookingForm && selectedSlot && profile && (
        <EnhancedBookingForm
          physiotherapist={{
            id: profile.id,
            full_name: profile.full_name,
            consultation_fee: formatPrice(profile.consultation_fee || '500'),
            location: profile.location || ''
          }}
          selectedSlot={selectedSlot}
          selectedDate={selectedDate}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedSlot(null);
          }}
          onSuccess={() => {
            setShowBookingForm(false);
            setSelectedSlot(null);
            loadAvailability();
          }}
        />
      )}
    </div>
  );
};

export default PhysiotherapistDetailPage;