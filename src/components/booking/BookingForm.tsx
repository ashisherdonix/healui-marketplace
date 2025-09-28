'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import ApiManager from '@/services/api';
import Card from '@/components/card';
import Button from '@/components/button';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  Home,
  Video
} from 'lucide-react';

interface AvailabilitySlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  fee: number;
}

interface PhysiotherapistProfile {
  id: string;
  full_name: string;
  consultation_fee: number;
  location: string;
}

interface FamilyMember {
  id: string;
  full_name: string;
  relationship: string;
  date_of_birth?: string;
  gender?: string;
}

interface BookingFormProps {
  physiotherapist: PhysiotherapistProfile;
  selectedSlot: AvailabilitySlot;
  selectedDate: string;
  onClose: () => void;
  onSuccess: (bookingData?: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  physiotherapist,
  selectedSlot,
  selectedDate,
  onClose,
  onSuccess
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'patient' | 'details' | 'payment'>('patient');
  
  const [formData, setFormData] = useState({
    patient_user_id: user?.id || '',
    physiotherapist_id: physiotherapist.id,
    visit_mode: selectedSlot.visit_mode,
    scheduled_date: selectedDate,
    scheduled_time: selectedSlot.start_time,
    end_time: selectedSlot.end_time,
    duration_minutes: 60, // Default duration
    chief_complaint: '',
    patient_address: user?.address || '',
    consultation_fee: Number(selectedSlot.fee) || 0,
    travel_fee: selectedSlot.visit_mode === 'HOME_VISIT' ? 100 : 0, // Default travel fee
    total_amount: (Number(selectedSlot.fee) || 0) + (selectedSlot.visit_mode === 'HOME_VISIT' ? 100 : 0),
    conditions: [] as string[],
    selected_family_member: ''
  });

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  useEffect(() => {
    // Recalculate total when fees change - ensure both values are numbers
    const consultationFee = Number(formData.consultation_fee) || 0;
    const travelFee = Number(formData.travel_fee) || 0;
    const total = consultationFee + travelFee;
    setFormData(prev => ({ ...prev, total_amount: total }));
  }, [formData.consultation_fee, formData.travel_fee]);

  const loadFamilyMembers = async () => {
    try {
      const response = await ApiManager.getFamilyMembers();
      if (response.success && response.data) {
        setFamilyMembers(response.data);
      }
    } catch (error) {
      console.error('Failed to load family members:', error);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare booking data - ensure numeric fields are numbers
      const bookingData = {
        patient_user_id: formData.selected_family_member || formData.patient_user_id,
        physiotherapist_id: formData.physiotherapist_id,
        visit_mode: formData.visit_mode,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        end_time: formData.end_time,
        duration_minutes: Number(formData.duration_minutes),
        chief_complaint: formData.chief_complaint,
        patient_address: formData.patient_address,
        consultation_fee: Number(formData.consultation_fee),
        travel_fee: Number(formData.travel_fee),
        total_amount: Number(formData.total_amount),
        conditions: formData.conditions
      };

      const response = await ApiManager.createBooking(bookingData);
      
      if (response.success) {
        // Pass the booking data to the success callback
        onSuccess(response.data);
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Booking failed:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        backgroundColor: 'var(--lk-surface)',
        borderRadius: '1rem'
      }}>
        <Card variant="fill" scaleFactor="headline">
          <div className="p-xl">
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div className="lk-typography-title-large" style={{ color: 'var(--lk-onsurface)' }}>
                Book Appointment
              </div>
              <Button
                variant="text"
                size="sm"
                onClick={onClose}
                style={{ padding: '0.5rem', minWidth: 'auto' }}
                startIcon="x"
              />
            </div>

            {/* Appointment Summary */}
            <Card variant="outline" scaleFactor="headline">
              <div className="p-lg">
                <div className="lk-typography-title-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '1rem'
                }}>
                  Appointment Details
                </div>
                
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <User style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    <span className="lk-typography-body-medium">Dr. {physiotherapist.full_name}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    <span className="lk-typography-body-medium">{formatDate(selectedDate)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    <span className="lk-typography-body-medium">
                      {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {selectedSlot.visit_mode === 'HOME_VISIT' ? (
                      <Home style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    ) : (
                      <Video style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                    )}
                    <span className="lk-typography-body-medium">
                      {selectedSlot.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online Consultation'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Error Message */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem',
                backgroundColor: 'var(--lk-errorcontainer)',
                borderRadius: '0.5rem',
                margin: '1rem 0'
              }}>
                <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-error)' }} />
                <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onerrorcontainer)' }}>
                  {error}
                </div>
              </div>
            )}

            {/* Form Steps */}
            <div style={{ marginTop: '1.5rem' }}>
              {step === 'patient' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                    Select Patient
                  </div>
                  
                  {/* Self Option */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: `2px solid ${!formData.selected_family_member ? 'var(--lk-primary)' : 'var(--lk-outline)'}`,
                    borderRadius: '0.5rem',
                    backgroundColor: !formData.selected_family_member ? 'var(--lk-primarycontainer)' : 'transparent',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="patient"
                      value=""
                      checked={!formData.selected_family_member}
                      onChange={() => handleInputChange('selected_family_member', '')}
                      style={{ marginRight: '1rem' }}
                    />
                    <div>
                      <div className="lk-typography-body-large" style={{ fontWeight: '500' }}>
                        Myself
                      </div>
                      <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                        {user?.full_name}
                      </div>
                    </div>
                  </label>

                  {/* Family Members */}
                  {familyMembers.map((member) => (
                    <label
                      key={member.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        border: `2px solid ${formData.selected_family_member === member.id ? 'var(--lk-primary)' : 'var(--lk-outline)'}`,
                        borderRadius: '0.5rem',
                        backgroundColor: formData.selected_family_member === member.id ? 'var(--lk-primarycontainer)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="patient"
                        value={member.id}
                        checked={formData.selected_family_member === member.id}
                        onChange={() => handleInputChange('selected_family_member', member.id)}
                        style={{ marginRight: '1rem' }}
                      />
                      <div>
                        <div className="lk-typography-body-large" style={{ fontWeight: '500' }}>
                          {member.full_name}
                        </div>
                        <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                          {member.relationship}
                        </div>
                      </div>
                    </label>
                  ))}

                  <Button
                    variant="fill"
                    color="primary"
                    size="lg"
                    onClick={() => setStep('details')}
                    style={{ marginTop: '1rem' }}
                    label="Continue"
                  />
                </div>
              )}

              {step === 'details' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                    Appointment Details
                  </div>

                  {/* Chief Complaint */}
                  <div>
                    <div className="lk-typography-body-medium" style={{ 
                      color: 'var(--lk-onsurface)',
                      marginBottom: '0.5rem',
                      fontWeight: '500'
                    }}>
                      Chief Complaint *
                    </div>
                    <textarea
                      value={formData.chief_complaint}
                      onChange={(e) => handleInputChange('chief_complaint', e.target.value)}
                      placeholder="Describe your symptoms or reason for consultation"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--lk-outline)',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: 'var(--lk-surface)',
                        color: 'var(--lk-onsurface)',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      required
                    />
                  </div>

                  {/* Address for Home Visit */}
                  {formData.visit_mode === 'HOME_VISIT' && (
                    <div>
                      <div className="lk-typography-body-medium" style={{ 
                        color: 'var(--lk-onsurface)',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                      }}>
                        Home Address *
                      </div>
                      <textarea
                        value={formData.patient_address}
                        onChange={(e) => handleInputChange('patient_address', e.target.value)}
                        placeholder="Enter your complete address for home visit"
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid var(--lk-outline)',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          backgroundColor: 'var(--lk-surface)',
                          color: 'var(--lk-onsurface)',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                        required
                      />
                    </div>
                  )}

                  {/* Fee Breakdown */}
                  <Card variant="outline" scaleFactor="headline">
                    <div className="p-lg">
                      <div className="lk-typography-title-medium" style={{ 
                        color: 'var(--lk-onsurface)',
                        marginBottom: '1rem'
                      }}>
                        Fee Breakdown
                      </div>
                      
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="lk-typography-body-medium">Consultation Fee</span>
                          <span className="lk-typography-body-medium">₹{formData.consultation_fee}</span>
                        </div>
                        
                        {formData.visit_mode === 'HOME_VISIT' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="lk-typography-body-medium">Travel Fee</span>
                            <span className="lk-typography-body-medium">₹{formData.travel_fee}</span>
                          </div>
                        )}
                        
                        <hr style={{ border: 'none', borderTop: '1px solid var(--lk-outline)', margin: '0.5rem 0' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="lk-typography-title-medium">Total Amount</span>
                          <span className="lk-typography-title-medium" style={{ color: 'var(--lk-primary)' }}>
                            ₹{formData.total_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button
                      variant="text"
                      color="primary"
                      size="lg"
                      onClick={() => setStep('patient')}
                      style={{ flex: 1 }}
                      label="Back"
                    />
                    <Button
                      variant="fill"
                      color="primary"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={!formData.chief_complaint || (formData.visit_mode === 'HOME_VISIT' && !formData.patient_address) || loading}
                      style={{ flex: 2 }}
                      label={loading ? 'Booking...' : 'Confirm Booking'}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingForm;