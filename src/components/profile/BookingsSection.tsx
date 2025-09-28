'use client';

import React, { useState, useEffect } from 'react';
import ApiManager from '@/services/api';
import Card from '@/components/card';
import Button from '@/components/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Search
} from 'lucide-react';

interface Booking {
  id: string;
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
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  physiotherapist?: {
    id: string;
    full_name: string;
    phone: string;
    specializations?: string[];
    experience?: number;
    rating?: number;
  };
  patient?: {
    id: string;
    full_name: string;
    phone: string;
  };
}

const BookingsSection: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

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
      case 'CONFIRMED':
        return <CheckCircle style={{ width: '1rem', height: '1rem', color: 'var(--lk-primary)' }} />;
      case 'COMPLETED':
        return <CheckCircle style={{ width: '1rem', height: '1rem', color: 'green' }} />;
      case 'CANCELLED':
        return <XCircle style={{ width: '1rem', height: '1rem', color: 'var(--lk-error)' }} />;
      case 'PENDING':
        return <AlertCircle style={{ width: '1rem', height: '1rem', color: 'orange' }} />;
      default:
        return <Clock style={{ width: '1rem', height: '1rem', color: 'var(--lk-onsurfacevariant)' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'var(--lk-primary)';
      case 'COMPLETED':
        return 'green';
      case 'CANCELLED':
        return 'var(--lk-error)';
      case 'PENDING':
        return 'orange';
      default:
        return 'var(--lk-onsurfacevariant)';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'ALL' || booking.status === filterStatus;
    const matchesSearch = !searchTerm || 
      booking.physiotherapist?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.chief_complaint?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter(b => b.status === 'PENDING').length,
    CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
    COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  if (loading) {
    return (
      <Card variant="fill" scaleFactor="headline">
        <div className="p-xl" style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--lk-outline)',
            borderTop: '3px solid var(--lk-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
            Loading your bookings...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Header Card */}
      <Card variant="fill" scaleFactor="headline">
        <div className="p-xl">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <div>
              <div className="lk-typography-headline-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem'
              }}>
                My Bookings
              </div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                View your appointment history and upcoming sessions
              </div>
            </div>
            
            <Button
              variant="fill"
              size="md"
              label="Book Session"
              color="primary"
              onClick={() => window.location.href = '/'}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Calendar style={{ width: '1rem', height: '1rem' }} />
              Book Session
            </Button>
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { label: 'Total', value: statusCounts.ALL, color: 'var(--lk-primary)' },
              { label: 'Pending', value: statusCounts.PENDING, color: 'orange' },
              { label: 'Confirmed', value: statusCounts.CONFIRMED, color: 'var(--lk-primary)' },
              { label: 'Completed', value: statusCounts.COMPLETED, color: 'green' },
              { label: 'Cancelled', value: statusCounts.CANCELLED, color: 'var(--lk-error)' }
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--lk-surfacevariant)',
                  borderRadius: '0.75rem',
                  textAlign: 'center'
                }}
              >
                <div className="lk-typography-title-large" style={{ 
                  color: stat.color,
                  marginBottom: '0.25rem'
                }}>
                  {stat.value}
                </div>
                <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card variant="fill" scaleFactor="headline">
        <div className="p-lg">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr', 
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter style={{ width: '1rem', height: '1rem', color: 'var(--lk-onsurfacevariant)' }} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '2px solid var(--lk-outline)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)'
                }}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search style={{ 
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem', 
                height: '1rem', 
                color: 'var(--lk-onsurfacevariant)' 
              }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by therapist or complaint..."
                style={{
                  width: '100%',
                  padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                  border: '2px solid var(--lk-outline)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)'
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredBookings.map((booking) => (
            <Card key={booking.id} variant="fill" scaleFactor="headline">
              <div className="p-lg">
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'start'
                }}>
                  {/* Booking Details */}
                  <div>
                    {/* Header */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      {getStatusIcon(booking.status)}
                      <div className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                        {booking.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online Consultation'}
                      </div>
                      <div 
                        className="lk-typography-label-small"
                        style={{ 
                          padding: '0.25rem 0.5rem',
                          backgroundColor: getStatusColor(booking.status),
                          color: 'white',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                      >
                        {booking.status}
                      </div>
                    </div>

                    {/* Therapist Info */}
                    {booking.physiotherapist && (
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '1rem'
                      }}>
                        <div className="bg-primarycontainer" style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <User style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                        </div>
                        <div>
                          <div className="lk-typography-body-large" style={{ 
                            color: 'var(--lk-onsurface)',
                            marginBottom: '0.25rem'
                          }}>
                            Dr. {booking.physiotherapist.full_name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Phone style={{ width: '0.875rem', height: '0.875rem', color: 'var(--lk-onsurfacevariant)' }} />
                              <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                                {booking.physiotherapist.phone}
                              </span>
                            </div>
                            {booking.physiotherapist.rating && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Star style={{ width: '0.875rem', height: '0.875rem', color: 'gold' }} />
                                <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                                  {booking.physiotherapist.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Session Details */}
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar style={{ width: '1rem', height: '1rem', color: 'var(--lk-onsurfacevariant)' }} />
                        <span className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurface)' }}>
                          {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ width: '1rem', height: '1rem', color: 'var(--lk-onsurfacevariant)' }} />
                        <span className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurface)' }}>
                          {booking.duration_minutes} minutes
                        </span>
                      </div>

                      {booking.patient_address && booking.visit_mode === 'HOME_VISIT' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin style={{ width: '1rem', height: '1rem', color: 'var(--lk-onsurfacevariant)' }} />
                          <span className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurface)' }}>
                            {booking.patient_address}
                          </span>
                        </div>
                      )}

                      {booking.chief_complaint && (
                        <div>
                          <div className="lk-typography-label-medium" style={{ 
                            color: 'var(--lk-onsurfacevariant)',
                            marginBottom: '0.25rem'
                          }}>
                            Chief Complaint:
                          </div>
                          <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurface)' }}>
                            {booking.chief_complaint}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div style={{ textAlign: 'right' }}>
                    <div className="lk-typography-title-medium" style={{ 
                      color: 'var(--lk-primary)',
                      marginBottom: '1rem'
                    }}>
                      ₹{booking.total_amount}
                    </div>
                    
                    <Button
                      variant="text"
                      size="sm"
                      label="View Details"
                      color="primary"
                      onClick={() => {
                        // Navigate to booking details
                        console.log('View booking details:', booking.id);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Eye style={{ width: '0.875rem', height: '0.875rem' }} />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="fill" scaleFactor="headline">
          <div className="p-xl" style={{ textAlign: 'center' }}>
            <Calendar style={{ 
              width: '4rem', 
              height: '4rem', 
              color: 'var(--lk-onsurfacevariant)',
              margin: '0 auto 1rem'
            }} />
            <div className="lk-typography-title-large" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.5rem'
            }}>
              {searchTerm || filterStatus !== 'ALL' ? 'No bookings found' : 'No bookings yet'}
            </div>
            <div className="lk-typography-body-medium" style={{ 
              color: 'var(--lk-onsurfacevariant)',
              marginBottom: '2rem'
            }}>
              {searchTerm || filterStatus !== 'ALL' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Book your first physiotherapy session to get started'
              }
            </div>
            {!searchTerm && filterStatus === 'ALL' && (
              <Button
                variant="fill"
                size="lg"
                label="Book Your First Session"
                color="primary"
                onClick={() => window.location.href = '/'}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
              >
                <Calendar style={{ width: '1rem', height: '1rem' }} />
                Book Your First Session
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BookingsSection;