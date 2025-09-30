'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ApiManager from '@/services/api';
import { Calendar, Star, CheckCircle } from 'lucide-react';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';

// Import the new components
import ServiceSelection from '@/components/physiotherapist/ServiceSelection';
import DateSelection from '@/components/physiotherapist/DateSelection';
import TimeSlots from '@/components/physiotherapist/TimeSlots';
import ReviewsSection from '@/components/physiotherapist/ReviewsSection';

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
  rating?: number;
  total_reviews?: number;
  specializations?: string[];
  languages?: string[];
  education?: Array<{ degree: string; institution: string; year: string }>;
  certifications?: string[];
  bio?: string;
  consultation_fee?: number;
  home_visit_fee?: number;
  online_fee?: number;
  availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  next_available_slot?: string;
}

const PhysiotherapistDetailPage: React.FC = () => {
  const params = useParams();
  const physioId = params.id as string;
  
  const [profile, setProfile] = useState<PhysiotherapistProfile | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [todayAvailability, setTodayAvailability] = useState<AvailabilitySlot[]>([]);
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

  useEffect(() => {
    if (profile) {
      loadTodayAvailability();
    }
  }, [profile, consultationType]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getPhysiotherapistProfile(physioId, {
        include_reviews: true,
        reviews_limit: 10
      });
      
      if (response.success && response.data) {
        setProfile((response.data as {profile: PhysiotherapistProfile}).profile);
        setReviews((response.data as {reviews?: Review[]}).reviews || []);
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
        setAvailability((response.data as {slots?: AvailabilitySlot[]}).slots || []);
        setSelectedSlot(null);
      }
    } catch (err: Error | unknown) {
      console.error('Error loading availability:', err);
      setAvailability([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const loadTodayAvailability = async () => {
    if (!profile) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await ApiManager.getPhysiotherapistAvailability(profile.id, {
        date: today,
        service_type: consultationType,
        duration: 60
      });
      
      if (response.success && response.data) {
        setTodayAvailability((response.data as {slots?: AvailabilitySlot[]}).slots || []);
      }
    } catch (err: Error | unknown) {
      console.error('Error loading today availability:', err);
      setTodayAvailability([]);
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
          HOME_VISIT: homeVisitResponse.success ? ((homeVisitResponse.data as {slots?: AvailabilitySlot[]})?.slots?.filter((slot: AvailabilitySlot) => slot.is_available)?.length || 0) : 0,
          ONLINE: onlineResponse.success ? ((onlineResponse.data as {slots?: AvailabilitySlot[]})?.slots?.filter((slot: AvailabilitySlot) => slot.is_available)?.length || 0) : 0
        };
      });
      
      setDateSlotCounts(newDateSlotCounts);
    } catch (err: Error | unknown) {
      console.error('Error loading date slot counts:', err);
    }
  };

  const findNextAvailableSlot = () => {
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const slotData = dateSlotCounts[dateString];
      
      if (slotData && slotData[consultationType] > 0) {
        setSelectedDate(dateString);
        break;
      }
    }
  };

  const handleBookAppointment = () => {
    if (selectedSlot && profile) {
      setShowBookingForm(true);
    }
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
          <div className="lk-typography-body-medium" style={{ color: '#6B7280' }}>
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
          <div className="lk-typography-headline-medium" style={{ color: '#1F2937', marginBottom: '1rem' }}>
            Error Loading Profile
          </div>
          <div className="lk-typography-body-medium" style={{ color: '#6B7280', marginBottom: '2rem' }}>
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

  if (!profile) {
    console.log('Profile is null, returning null');
    return null;
  }

  console.log('Rendering page with profile:', profile);

  return (
    <>
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Profile Header */}
      <div style={{ backgroundColor: 'red', padding: '10px', color: 'white' }}>DEBUG: Page is rendering</div>
      <div style={{ backgroundColor: 'blue', padding: '10px', color: 'white' }}>Profile: {profile.full_name}</div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0', position: 'relative' }}>
        
        {/* Profile Details Section */}
        <div style={{ 
          backgroundColor: 'white',
          margin: '8px',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1F2937',
              margin: 0
            }}>
              About Dr. {profile.full_name}
            </h2>
          </div>

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

        {/* Quick Booking Section */}
        <div style={{ 
          display: 'block',
          margin: '8px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '8px'
            }}>
              Available Today
            </h2>
            
            {todayAvailability.length > 0 ? (
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '12px'
              }}>
                {todayAvailability.slice(0, 3).map((slot) => (
                  <button
                    key={slot.slot_id}
                    onClick={() => {
                      setSelectedDate(new Date().toISOString().split('T')[0]);
                      setSelectedSlot(slot);
                      setActiveTab('availability');
                    }}
                    style={{
                      padding: '8px 16px',
                      border: '2px solid #10B981',
                      backgroundColor: 'white',
                      color: '#10B981',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#10B981';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#10B981';
                    }}
                  >
                    {slot.start_time} - ₹{Math.floor(slot.fee || profile.consultation_fee || 600)}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#FEF2F2',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#B91C1C'
              }}>
                No slots available today. Check tomorrow or book in advance.
              </div>
            )}
          </div>

          {/* "Next Available Today" button */}
          {profile.availability_status === 'AVAILABLE' && profile.next_available_slot && (
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setSelectedDate(today);
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '8px 16px',
                border: '2px solid #2563EB',
                backgroundColor: 'white',
                color: '#2563EB',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <CheckCircle style={{ width: '16px', height: '16px' }} />
              Next Available Today
            </button>
          )}

          {/* Service Selection */}
          <ServiceSelection
            profile={profile}
            consultationType={consultationType}
            setConsultationType={setConsultationType}
            setSelectedSlot={setSelectedSlot}
            availabilityLoading={availabilityLoading}
            dateSlotCounts={dateSlotCounts}
          />
        </div>

        {/* Tab Navigation and Content */}
        <div style={{ 
          display: 'block',
          margin: '8px',
          backgroundColor: 'white',
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
                  onClick={() => setActiveTab(tab.id as 'availability' | 'reviews')}
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
              {/* Date Selection */}
              <DateSelection
                dateViewMode={dateViewMode}
                setDateViewMode={setDateViewMode}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                dateSlotCounts={dateSlotCounts}
                consultationType={consultationType}
                findNextAvailableSlot={findNextAvailableSlot}
              />
              
              {/* Divider */}
              <div style={{
                borderTop: '1px solid #E5E7EB',
                margin: '20px 0'
              }} />
              
              {/* Time Slots */}
              <TimeSlots
                availability={availability}
                availabilityLoading={availabilityLoading}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                consultationType={consultationType}
                setConsultationType={setConsultationType}
                profile={profile}
                selectedDate={selectedDate}
                handleBookAppointment={handleBookAppointment}
              />
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <ReviewsSection reviews={reviews} profile={profile} />
          )}
        </div>
      </div>

      {/* Enhanced Booking Form Modal with Login Integration */}
      {showBookingForm && selectedSlot && profile && (
        <EnhancedBookingForm
          physiotherapist={{
            id: profile.id,
            full_name: profile.full_name,
            consultation_fee: profile.consultation_fee || 500,
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
            console.log('Booking successful!');
          }}
        />
      )}
    </div>
    </>
  );
}

export default PhysiotherapistDetailPage;