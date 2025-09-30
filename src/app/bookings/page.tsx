'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import ApiManager from '@/services/api';
import Header from '@/components/layout/Header';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Home as HomeIcon,
  Video,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface Booking {
  id: string;
  patient_id?: string | null;
  clinic_id?: string | null;
  physiotherapist_id: string;
  visit_type: 'INITIAL_CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY';
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  chief_complaint?: string;
  check_in_time?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  cancellation_reason?: string | null;
  cancelled_by?: string | null;
  cancelled_at?: string | null;
  parent_visit_id?: string | null;
  vital_signs?: any | null;
  video_link?: string;
  video_session_id?: string;
  visit_source: 'MARKETPLACE' | 'CLINIC';
  patient_user_id: string;
  consultation_fee: string;
  travel_fee: string;
  total_amount: string;
  patient_address?: string;
  payment_info: {
    method: string;
    status: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
  physiotherapist?: {
    id: string;
    phone: string;
    full_name: string;
    specializations?: string[];
    experience?: number;
    rating?: number;
  };
  patientUser?: {
    id: string;
    phone: string;
    full_name: string;
  };
  review?: any | null;
}

const BookingsPage: React.FC = () => {
  const { user, isAuthenticated, initializing } = useAppSelector((state) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated (but only after initialization is complete)
  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, initializing]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadBookings();
    }
  }, [isAuthenticated, user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getMyBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
      case 'COMPLETED':
        return <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />;
      case 'CANCELLED':
        return <XCircle style={{ width: '1.25rem', height: '1.25rem', color: '#000000' }} />;
      case 'PENDING':
        return <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />;
      case 'IN_PROGRESS':
        return <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />;
      default:
        return <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#000000' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
      case 'COMPLETED':
      case 'IN_PROGRESS':
        return '#1e5f79';
      case 'CANCELLED':
        return '#000000';
      case 'PENDING':
        return '#1e5f79';
      default:
        return '#000000';
    }
  };

  const statusCounts = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    scheduled: bookings.filter(b => b.status === 'SCHEDULED').length,
    in_progress: bookings.filter(b => b.status === 'IN_PROGRESS').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  // Show loading state during initialization
  if (initializing) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '100vh', backgroundColor: '#eff8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #c8eaeb',
              borderTop: '3px solid #1e5f79',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{ color: '#000000', fontSize: '1rem' }}>
              Loading your bookings...
            </div>
          </div>
        </div>
      </>
    );
  }

  // Redirect will happen in useEffect if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '100vh', backgroundColor: '#eff8ff', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{
              textAlign: 'center',
              padding: '3rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #c8eaeb',
                borderTop: '3px solid #1e5f79',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <div style={{ color: '#000000', fontSize: '1rem' }}>
                Loading your bookings...
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: '#eff8ff', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
          
          {/* Breadcrumbs */}
          <nav style={{ marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '1rem 1.5rem',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <Link href="/" style={{ 
                  color: '#1e5f79', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <HomeIcon style={{ width: '1rem', height: '1rem' }} />
                  Home
                </Link>
                <ChevronRight style={{ width: '1rem', height: '1rem', color: '#c8eaeb' }} />
                <Link href="/profile" style={{ color: '#1e5f79', textDecoration: 'none' }}>
                  Profile
                </Link>
                <ChevronRight style={{ width: '1rem', height: '1rem', color: '#c8eaeb' }} />
                <span style={{ color: '#000000', fontWeight: '500' }}>My Bookings</span>
              </div>
            </div>
          </nav>
          
          {/* Page Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              color: '#000000',
              fontSize: '2rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              My Bookings
            </div>
            <div style={{ color: '#1e5f79', fontSize: '1rem' }}>
              Track your appointments and session history
            </div>
          </div>

          {/* Compact Stats */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.75rem',
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#c8eaeb',
            borderRadius: '0.75rem'
          }}>
            {[
              { label: 'Total', value: statusCounts.total, color: '#000000' },
              { label: 'Pending', value: statusCounts.pending, color: '#1e5f79' },
              { label: 'Scheduled', value: statusCounts.scheduled, color: '#1e5f79' },
              { label: 'In Progress', value: statusCounts.in_progress, color: '#1e5f79' },
              { label: 'Completed', value: statusCounts.completed, color: '#1e5f79' },
              { label: 'Cancelled', value: statusCounts.cancelled, color: '#000000' }
            ].map((stat) => (
              <div key={stat.label} style={{ 
                textAlign: 'center',
                padding: '0.75rem 0.5rem'
              }}>
                <div style={{ 
                  color: stat.color,
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.25rem'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  color: stat.color,
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bookings List */}
          {bookings.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {bookings.map((booking) => (
                <div 
                  key={booking.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #c8eaeb',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start'
                  }}>
                    {/* Main Content */}
                    <div>
                      {/* Header with Status */}
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        {getStatusIcon(booking.status)}
                        <span 
                          style={{ 
                            padding: '0.125rem 0.5rem',
                            backgroundColor: getStatusColor(booking.status),
                            color: '#ffffff',
                            borderRadius: '0.75rem',
                            fontSize: '0.6875rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}
                        >
                          {booking.status.toLowerCase()}
                        </span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {booking.visit_mode === 'HOME_VISIT' ? (
                            <HomeIcon style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                          ) : (
                            <Video style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                          )}
                          <span style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '500' }}>
                            {booking.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online'}
                          </span>
                        </div>
                      </div>

                      {/* Patient and Doctor Info */}
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        {/* Patient Info */}
                        {booking.patientUser && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: '#c8eaeb',
                            borderRadius: '0.5rem'
                          }}>
                            <div style={{
                              width: '1.5rem',
                              height: '1.5rem',
                              borderRadius: '50%',
                              backgroundColor: '#1e5f79',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <User style={{ width: '0.75rem', height: '0.75rem', color: '#ffffff' }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ 
                                color: '#1e5f79',
                                fontSize: '0.625rem',
                                marginBottom: '0.125rem',
                                fontWeight: '500'
                              }}>
                                Patient
                              </div>
                              <div style={{ 
                                color: '#000000',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {booking.patientUser.full_name}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Doctor Info */}
                        {booking.physiotherapist && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: '#eff8ff',
                            borderRadius: '0.5rem'
                          }}>
                            <div style={{
                              width: '1.5rem',
                              height: '1.5rem',
                              borderRadius: '50%',
                              backgroundColor: '#1e5f79',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <User style={{ width: '0.75rem', height: '0.75rem', color: '#ffffff' }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ 
                                color: '#1e5f79',
                                fontSize: '0.625rem',
                                marginBottom: '0.125rem',
                                fontWeight: '500'
                              }}>
                                Doctor
                              </div>
                              <div style={{ 
                                color: '#000000',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                Dr. {booking.physiotherapist.full_name}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Session Details */}
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <Calendar style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                          <span style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '500' }}>
                            {new Date(booking.scheduled_date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <Clock style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                          <span style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '500' }}>
                            {booking.scheduled_time} ({booking.duration_minutes}m)
                          </span>
                        </div>

                        {booking.patient_address && booking.visit_mode === 'HOME_VISIT' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', gridColumn: '1 / -1' }}>
                            <MapPin style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                            <span style={{ 
                              color: '#000000',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {booking.patient_address}
                            </span>
                          </div>
                        )}
                      </div>

                      {booking.chief_complaint && (
                        <div style={{ 
                          marginTop: '0.75rem',
                          padding: '0.5rem',
                          backgroundColor: '#c8eaeb',
                          borderRadius: '0.375rem'
                        }}>
                          <div style={{ 
                            color: '#1e5f79',
                            fontSize: '0.625rem',
                            fontWeight: '500',
                            marginBottom: '0.25rem'
                          }}>
                            Complaint:
                          </div>
                          <div style={{ 
                            color: '#000000',
                            fontSize: '0.75rem',
                            lineHeight: '1.3'
                          }}>
                            {booking.chief_complaint}
                          </div>
                        </div>
                      )}

                      {/* Join Link for Online Appointments */}
                      {booking.visit_mode === 'ONLINE' && booking.video_link && (booking.status === 'SCHEDULED' || booking.status === 'IN_PROGRESS') && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <button
                            onClick={() => {
                              if (booking.video_link) {
                                window.open(booking.video_link, '_blank');
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#1e5f79',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#0f3a47';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#1e5f79';
                            }}
                          >
                            <Video style={{ width: '0.875rem', height: '0.875rem' }} />
                            Join Session
                            <ExternalLink style={{ width: '0.75rem', height: '0.75rem' }} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        color: '#1e5f79',
                        fontSize: '1.125rem',
                        fontWeight: '700'
                      }}>
                        ₹{parseFloat(booking.total_amount).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <Calendar style={{ 
                width: '4rem', 
                height: '4rem', 
                color: '#c8eaeb',
                margin: '0 auto 1rem'
              }} />
              <div style={{ 
                color: '#000000',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                No bookings yet
              </div>
              <div style={{ 
                color: '#1e5f79',
                fontSize: '1rem',
                marginBottom: '2rem'
              }}>
                Book your first physiotherapy session to get started
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;