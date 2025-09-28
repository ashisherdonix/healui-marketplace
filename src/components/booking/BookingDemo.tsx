'use client';

import React, { useState } from 'react';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import Button from '@/components/button';
import Card from '@/components/card';

// Demo component to test the complete booking flow
const BookingDemo: React.FC = () => {
  const [showBooking, setShowBooking] = useState(false);

  // Sample data for testing
  const samplePhysiotherapist = {
    id: 'physio-123',
    full_name: 'Rajesh Kumar',
    consultation_fee: 800,
    location: 'Mumbai, Maharashtra'
  };

  const sampleSlot = {
    slot_id: 'slot-456',
    start_time: '10:00',
    end_time: '11:00',
    is_available: true,
    visit_mode: 'HOME_VISIT' as const,
    fee: 800
  };

  const sampleDate = '2024-01-15';

  const handleBookingSuccess = () => {
    console.log('Booking flow completed successfully!');
    setShowBooking(false);
  };

  const handleBookingClose = () => {
    console.log('Booking flow closed');
    setShowBooking(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Card variant="fill" scaleFactor="headline">
        <div className="p-xl">
          <div className="lk-typography-headline-medium" style={{ 
            color: 'var(--lk-onsurface)',
            marginBottom: '1rem'
          }}>
            Complete Booking Flow Demo
          </div>
          
          <div className="lk-typography-body-medium" style={{ 
            color: 'var(--lk-onsurfacevariant)',
            marginBottom: '2rem'
          }}>
            Test the complete booking flow including:
            <br />• Login modal for non-authenticated users
            <br />• Booking context preservation
            <br />• Complete booking form
            <br />• Success confirmation
          </div>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <strong>Sample Physiotherapist:</strong> Dr. {samplePhysiotherapist.full_name}
            </div>
            <div>
              <strong>Sample Slot:</strong> {sampleSlot.start_time} - {sampleSlot.end_time} on {sampleDate}
            </div>
            <div>
              <strong>Service Type:</strong> {sampleSlot.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online'}
            </div>
            <div>
              <strong>Fee:</strong> ₹{sampleSlot.fee}
            </div>
          </div>

          <Button
            variant="fill"
            color="primary"
            size="lg"
            onClick={() => setShowBooking(true)}
            style={{ width: '100%' }}
            label="Start Booking Demo"
          />

          <div className="lk-typography-body-small" style={{ 
            color: 'var(--lk-onsurfacevariant)',
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            Note: This will use Firebase Auth for OTP verification
          </div>
        </div>
      </Card>

      {showBooking && (
        <EnhancedBookingForm
          physiotherapist={samplePhysiotherapist}
          selectedSlot={sampleSlot}
          selectedDate={sampleDate}
          onClose={handleBookingClose}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default BookingDemo;