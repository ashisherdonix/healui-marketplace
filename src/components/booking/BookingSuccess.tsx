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
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          background: '#c8eaeb',
          padding: '24px 20px',
          position: 'relative'
        }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0, 0, 0, 0.15)',
              border: 'none',
              borderRadius: '6px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
            }}
          >
            <X style={{ 
              width: '16px', 
              height: '16px', 
              color: '#000000',
              strokeWidth: 2
            }} />
          </button>

          <div style={{ textAlign: 'center' }}>
            {/* Success Icon */}
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 16px',
              background: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
            }}>
              <CheckCircle style={{ 
                width: '32px', 
                height: '32px', 
                color: '#ffffff'
              }} />
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#000000',
              margin: 0,
              marginBottom: '8px'
            }}>
              Booking Confirmed!
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#000000',
              margin: 0,
              fontWeight: '500',
              opacity: 0.8
            }}>
              Your appointment has been successfully booked
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          padding: '20px',
          maxHeight: 'calc(90vh - 120px)',
          overflow: 'auto'
        }}>
          {/* Appointment Details */}
          <div style={{
            background: '#eff8ff',
            border: '1px solid #c8eaeb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e5f79',
              margin: '0 0 12px 0'
            }}>
              Appointment Details
            </h3>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
                <span style={{ fontSize: '14px', color: '#000000' }}>Dr. {bookingData.physiotherapist_name}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
                <span style={{ fontSize: '14px', color: '#000000' }}>{dateFormatted.short} • {formatTime(bookingData.scheduled_time)}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {bookingData.visit_mode === 'HOME_VISIT' ? (
                  <Home style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
                ) : (
                  <Video style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
                )}
                <span style={{ fontSize: '14px', color: '#000000' }}>
                  {bookingData.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online Consultation'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div style={{
            background: '#eff8ff',
            border: '1px solid #c8eaeb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h4 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1e5f79',
              margin: '0 0 12px 0'
            }}>
              Fee Breakdown
            </h4>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>Consultation Fee</span>
                <span style={{ fontSize: '14px', color: '#000000', fontWeight: '500' }}>₹{bookingData.consultation_fee}</span>
              </div>
              
              {bookingData.travel_fee && bookingData.travel_fee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#000000' }}>Travel Fee</span>
                  <span style={{ fontSize: '14px', color: '#000000', fontWeight: '500' }}>₹{bookingData.travel_fee}</span>
                </div>
              )}
              
              <hr style={{ border: 'none', borderTop: '1px solid #c8eaeb', margin: '8px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Total Amount</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e5f79' }}>
                  ₹{bookingData.total_amount}
                </span>
              </div>
              
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center',
                marginTop: '8px',
                padding: '8px',
                backgroundColor: 'rgba(200, 234, 235, 0.3)',
                borderRadius: '6px'
              }}>
                💳 Payment will be collected at the time of service
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div style={{
            background: '#eff8ff',
            border: '1px solid #c8eaeb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h4 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1e5f79',
              margin: '0 0 12px 0'
            }}>
              What happens next?
            </h4>
            <div style={{ display: 'grid', gap: '6px' }}>
              <div style={{ fontSize: '13px', color: '#000000' }}>
                • You will receive an SMS confirmation shortly
              </div>
              <div style={{ fontSize: '13px', color: '#000000' }}>
                • The physiotherapist will call you 15 minutes before the session
              </div>
              <div style={{ fontSize: '13px', color: '#000000' }}>
                • You can reschedule or cancel up to 2 hours before the appointment
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {onViewBookings && (
              <button
                onClick={onViewBookings}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'none',
                  color: '#1e5f79',
                  border: '1px solid #c8eaeb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff8ff';
                  e.currentTarget.style.borderColor = '#1e5f79';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#c8eaeb';
                }}
              >
                View All Bookings
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: '#1e5f79',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e5f79';
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;