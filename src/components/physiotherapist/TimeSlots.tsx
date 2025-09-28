'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface AvailabilitySlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  fee: number;
}

interface TimeSlotsProps {
  availability: AvailabilitySlot[];
  availabilityLoading: boolean;
  selectedSlot: AvailabilitySlot | null;
  setSelectedSlot: (slot: AvailabilitySlot | null) => void;
  consultationType: 'HOME_VISIT' | 'ONLINE';
  setConsultationType: (type: 'HOME_VISIT' | 'ONLINE') => void;
  profile: {
    consultation_fee?: number;
  };
  selectedDate: string;
  handleBookAppointment: () => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  availability,
  availabilityLoading,
  selectedSlot,
  setSelectedSlot,
  consultationType,
  setConsultationType,
  profile,
  selectedDate,
  handleBookAppointment
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatPrice = (price: number) => {
    return Math.floor(price || 0);
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    return endTotalMinutes - startTotalMinutes;
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1F2937',
          margin: 0
        }}>
          Available Time Slots
        </h3>
        {availability.length > 0 && (
          <div style={{
            padding: '6px 12px',
            backgroundColor: '#EFF6FF',
            color: '#1E40AF',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {availability.filter(slot => slot.is_available).length} {consultationType === 'HOME_VISIT' ? 'home visit' : 'online'} slots available
          </div>
        )}
      </div>
      
      {availabilityLoading ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '12px' 
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              padding: '16px',
              border: '2px solid #E5E7EB',
              borderRadius: '12px',
              backgroundColor: '#F3F4F6',
              animation: 'pulse 1.5s ease-in-out infinite',
              height: '80px'
            }} />
          ))}
        </div>
      ) : availability.length > 0 ? (
        <div className="time-slots-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {availability.map((slot) => {
            const isSelected = selectedSlot?.slot_id === slot.slot_id;
            const isAvailable = slot.is_available;
            const price = formatPrice(slot.fee || profile.consultation_fee || 600);
            
            return (
              <button
                key={slot.slot_id}
                className="time-slot-compact"
                onClick={() => isAvailable ? setSelectedSlot(slot) : null}
                disabled={!isAvailable}
                style={{
                  position: 'relative',
                  padding: '12px 8px',
                  border: `1.5px solid ${isSelected ? '#2563EB' : isAvailable ? '#E5E7EB' : '#F3F4F6'}`,
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#EFF6FF' : isAvailable ? 'white' : '#F9FAFB',
                  color: isAvailable ? (isSelected ? '#1E40AF' : '#1F2937') : '#9CA3AF',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  opacity: isAvailable ? 1 : 0.6,
                  minHeight: '60px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '2px'
                }}
                onMouseEnter={(e) => {
                  if (isAvailable && !isSelected) {
                    e.currentTarget.style.borderColor = '#93BBFB';
                    e.currentTarget.style.backgroundColor = '#F0F9FF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isAvailable && !isSelected) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ 
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  {formatTime(slot.start_time)}
                </div>
                <div style={{ 
                  fontSize: '15px',
                  fontWeight: '700',
                  color: isSelected ? '#1E40AF' : '#2563EB',
                  marginBottom: '1px'
                }}>
                  ₹{price}
                </div>
                <div style={{ 
                  fontSize: '10px',
                  opacity: 0.8
                }}>
                  {calculateDuration(slot.start_time, slot.end_time)} min
                </div>
                
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#2563EB',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    height: '8px',
                    color: 'white'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
          <Calendar style={{ 
            width: '48px', 
            height: '48px', 
            margin: '0 auto 16px',
            opacity: 0.5 
          }} />
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            No {consultationType === 'HOME_VISIT' ? 'home visit' : 'online'} slots available
          </div>
          <div style={{ fontSize: '14px', marginBottom: '12px' }}>
            Please select a different date or try switching to {consultationType === 'HOME_VISIT' ? 'online consultation' : 'home visit'}
          </div>
          <button
            onClick={() => setConsultationType(consultationType === 'HOME_VISIT' ? 'ONLINE' : 'HOME_VISIT')}
            style={{
              padding: '8px 16px',
              backgroundColor: consultationType === 'HOME_VISIT' ? '#10B981' : '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Try {consultationType === 'HOME_VISIT' ? 'Online' : 'Home Visit'} Instead
          </button>
        </div>
      )}

      {/* Book Appointment Button */}
      {selectedSlot && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#EFF6FF',
          borderRadius: '12px',
          border: '2px solid #2563EB'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1E40AF', marginBottom: '4px' }}>
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '14px', color: '#1E40AF' }}>
                {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)} ({consultationType === 'HOME_VISIT' ? 'Home Visit' : 'Online'})
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#2563EB' }}>
              ₹{formatPrice(selectedSlot.fee)}
            </div>
          </div>
          
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
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            <Calendar style={{ width: '18px', height: '18px' }} />
            Book This Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;