'use client';

import React from 'react';
import Card from '@/components/card';
import Button from '@/components/button';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  Phone,
  MapPin,
  Home,
  Video,
  X
} from 'lucide-react';

interface BookingSuccessData {
  id: string;
  physiotherapist_name: string;
  physiotherapist_phone?: string;
  scheduled_date: string;
  scheduled_time: string;
  end_time: string;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  patient_address?: string;
  total_amount: number;
  consultation_fee: number;
  travel_fee?: number;
  status: string;
}

interface BookingSuccessProps {
  bookingData: BookingSuccessData;
  onClose: () => void;
  onViewBookings?: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  bookingData,
  onClose,
  onViewBookings
}) => {
  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      short: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    };
  };

  const dateFormatted = formatDate(bookingData.scheduled_date);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        backgroundColor: 'var(--lk-surface)',
        borderRadius: '1rem'
      }}>
        <Card variant="fill" scaleFactor="headline">
          <div className="p-xl">
            {/* Header with Close Button */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}>
              <div />
              <Button
                variant="text"
                size="sm"
                onClick={onClose}
                style={{ padding: '0.5rem', minWidth: 'auto' }}
                startIcon="X"
              />
            </div>

            {/* Success Icon and Message */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                margin: '0 auto 1rem',
                backgroundColor: 'var(--lk-primarycontainer)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  color: 'var(--lk-primary)' 
                }} />
              </div>
              <div className="lk-typography-headline-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem'
              }}>
                Booking Confirmed!
              </div>
              <div className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurfacevariant)',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                Your appointment has been successfully booked. You will receive a confirmation SMS shortly.
              </div>
            </div>

            {/* Appointment Details Card */}
            <Card variant="outline" scaleFactor="headline">
              <div className="p-lg">
                <div className="lk-typography-title-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '1.5rem'
                }}>
                  Appointment Details
                </div>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {/* Physiotherapist */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <User style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    <div>
                      <div className="lk-typography-body-large" style={{ fontWeight: '500' }}>
                        Dr. {bookingData.physiotherapist_name}
                      </div>
                      {bookingData.physiotherapist_phone && (
                        <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                          {bookingData.physiotherapist_phone}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Date & Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    <div>
                      <div className="lk-typography-body-large" style={{ fontWeight: '500' }}>
                        {dateFormatted.full}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    <div>
                      <div className="lk-typography-body-large" style={{ fontWeight: '500' }}>
                        {formatTime(bookingData.scheduled_time)} - {formatTime(bookingData.end_time)}
                      </div>
                      <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                        60 minutes session
                      </div>
                    </div>
                  </div>
                  
                  {/* Visit Mode */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {bookingData.visit_mode === 'HOME_VISIT' ? (
                      <Home style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    ) : (
                      <Video style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    )}
                    <div>
                      <div className="lk-typography-body-large" style={{ fontWeight: '500' }}>
                        {bookingData.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online Consultation'}
                      </div>
                      {bookingData.visit_mode === 'HOME_VISIT' && bookingData.patient_address && (
                        <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                          {bookingData.patient_address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Summary */}
            <Card variant="outline" scaleFactor="headline" style={{ marginTop: '1rem' }}>
              <div className="p-lg">
                <div className="lk-typography-title-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '1rem'
                }}>
                  Payment Summary
                </div>
                
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="lk-typography-body-medium">Consultation Fee</span>
                    <span className="lk-typography-body-medium">₹{bookingData.consultation_fee}</span>
                  </div>
                  
                  {bookingData.travel_fee && bookingData.travel_fee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="lk-typography-body-medium">Travel Fee</span>
                      <span className="lk-typography-body-medium">₹{bookingData.travel_fee}</span>
                    </div>
                  )}
                  
                  <hr style={{ border: 'none', borderTop: '1px solid var(--lk-outline)', margin: '0.5rem 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="lk-typography-title-medium">Total Paid</span>
                    <span className="lk-typography-title-medium" style={{ color: 'var(--lk-primary)' }}>
                      ₹{bookingData.total_amount}
                    </span>
                  </div>
                  
                  <div className="lk-typography-body-small" style={{ 
                    color: 'var(--lk-onsurfacevariant)',
                    textAlign: 'center',
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--lk-surfacecontainerhighest)',
                    borderRadius: '0.5rem'
                  }}>
                    💳 Payment will be collected at the time of service
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--lk-surfacecontainerhighest)',
              borderRadius: '0.5rem'
            }}>
              <div className="lk-typography-title-small" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.75rem'
              }}>
                What happens next?
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                  • You will receive an SMS confirmation with appointment details
                </div>
                <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                  • The physiotherapist will call you 15 minutes before the session
                </div>
                <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                  • You can reschedule or cancel up to 2 hours before the appointment
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              marginTop: '2rem'
            }}>
              {onViewBookings && (
                <Button
                  variant="outline"
                  color="primary"
                  size="lg"
                  onClick={onViewBookings}
                  style={{ flex: 1 }}
                  label="View All Bookings"
                />
              )}
              <Button
                variant="fill"
                color="primary"
                size="lg"
                onClick={onClose}
                style={{ flex: 1 }}
                label="Done"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingSuccess;