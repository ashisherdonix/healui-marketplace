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
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Handle nested user structure - user.user.id is the actual ID
  const actualUser = user?.user || user;
  const userId = actualUser?.id;
  
  console.log('🔍 BookingForm - Auth state:', { user, isAuthenticated, userId, actualUser });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'patient' | 'details' | 'payment'>('patient');
  
  const [formData, setFormData] = useState({
    patient_user_id: userId || '',
    physiotherapist_id: physiotherapist.id,
    visit_mode: selectedSlot.visit_mode,
    scheduled_date: selectedDate,
    scheduled_time: selectedSlot.start_time,
    end_time: selectedSlot.end_time,
    duration_minutes: 60, // Default duration
    chief_complaint: '',
    patient_address: actualUser?.address || '',
    consultation_fee: Number(selectedSlot.fee) || 0,
    travel_fee: selectedSlot.visit_mode === 'HOME_VISIT' ? 100 : 0, // Default travel fee
    total_amount: (Number(selectedSlot.fee) || 0) + (selectedSlot.visit_mode === 'HOME_VISIT' ? 100 : 0),
    conditions: [] as string[],
    selected_family_member: ''
  });

  useEffect(() => {
    // Update patient_user_id when user changes
    if (userId) {
      setFormData(prev => ({
        ...prev,
        patient_user_id: userId,
        patient_address: actualUser?.address || prev.patient_address
      }));
    }
  }, [userId, actualUser]);

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
      setLoading(true);
      const response = await ApiManager.getFamilyMembers();
      if (response.success && response.data) {
        setFamilyMembers(response.data);
        console.log('✅ Family members loaded:', response.data);
      } else {
        console.log('⚠️ No family members found or API call failed:', response);
      }
    } catch (error) {
      console.error('❌ Failed to load family members:', error);
      // Don't set error here, just log it - family members are optional
    } finally {
      setLoading(false);
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
    // Validate user is authenticated
    if (!isAuthenticated || !userId) {
      setError('Please login to continue with booking');
      return;
    }

    // Validate patient selection
    const patientUserId = formData.selected_family_member || formData.patient_user_id;
    if (!patientUserId) {
      setError('Please select a patient for this appointment');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare booking data - ensure numeric fields are numbers
      const bookingData = {
        patient_user_id: patientUserId,
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

      console.log('Submitting booking with data:', bookingData);

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

          {/* Back Button */}
          {step !== 'patient' && (
            <button
              onClick={() => setStep(step === 'details' ? 'patient' : 'patient')}
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
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
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#000000" 
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}

          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#000000',
              margin: 0,
              marginBottom: '8px'
            }}>
              Book Appointment
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#000000',
              margin: 0,
              fontWeight: '500',
              opacity: 0.8
            }}>
              {step === 'patient' ? 'Select patient for appointment' : 
               step === 'details' ? 'Appointment details' : 'Payment & confirmation'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          padding: '20px',
          maxHeight: 'calc(90vh - 120px)',
          overflow: 'auto'
        }}>
          {/* Appointment Summary */}
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
                <span style={{ fontSize: '14px', color: '#000000' }}>Dr. {physiotherapist.full_name}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
                <span style={{ fontSize: '14px', color: '#000000' }}>{formatDate(selectedDate)}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
                <span style={{ fontSize: '14px', color: '#000000' }}>
                  {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedSlot.visit_mode === 'HOME_VISIT' ? (
                  <Home style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
                ) : (
                  <Video style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
                )}
                <span style={{ fontSize: '14px', color: '#000000' }}>
                  {selectedSlot.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online Consultation'}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle style={{ 
                width: '16px', 
                height: '16px', 
                color: '#dc2626', 
                flexShrink: 0 
              }} />
              <div style={{
                fontSize: '14px',
                color: '#dc2626',
                fontWeight: '500'
              }}>
                {error}
              </div>
            </div>
          )}

          {/* Form Steps */}
          {step === 'patient' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#000000',
                margin: '0 0 16px 0'
              }}>
                Select Patient
              </h3>

              
              {/* Loading state for family members */}
              {loading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Loading family members...
                </div>
              )}
              
              {/* Self Option */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px',
                border: `2px solid ${!formData.selected_family_member ? '#1e5f79' : '#c8eaeb'}`,
                borderRadius: '8px',
                backgroundColor: !formData.selected_family_member ? '#eff8ff' : '#ffffff',
                cursor: 'pointer',
                marginBottom: '12px',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name="patient"
                  value=""
                  checked={!formData.selected_family_member}
                  onChange={() => handleInputChange('selected_family_member', '')}
                  style={{ 
                    marginRight: '12px',
                    accentColor: '#1e5f79'
                  }}
                />
                <div>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    color: '#000000',
                    marginBottom: '2px'
                  }}>
                    Myself
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#6b7280' 
                  }}>
                    {actualUser?.full_name || 'Loading...'}
                  </div>
                </div>
              </label>

              {/* Family Members */}
              {familyMembers.length > 0 ? (
                <>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    Family Members:
                  </div>
                  {familyMembers.map((member) => (
                    <label
                      key={member.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px',
                        border: `2px solid ${formData.selected_family_member === member.id ? '#1e5f79' : '#c8eaeb'}`,
                        borderRadius: '8px',
                        backgroundColor: formData.selected_family_member === member.id ? '#eff8ff' : '#ffffff',
                        cursor: 'pointer',
                        marginBottom: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="radio"
                        name="patient"
                        value={member.id}
                        checked={formData.selected_family_member === member.id}
                        onChange={() => handleInputChange('selected_family_member', member.id)}
                        style={{ 
                          marginRight: '12px',
                          accentColor: '#1e5f79'
                        }}
                      />
                      <div>
                        <div style={{ 
                          fontSize: '15px', 
                          fontWeight: '600', 
                          color: '#000000',
                          marginBottom: '2px'
                        }}>
                          {member.full_name}
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#6b7280' 
                        }}>
                          {member.relationship}
                        </div>
                      </div>
                    </label>
                  ))}
                </>
              ) : (
                <div style={{
                  padding: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    No family members found
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#9ca3af'
                  }}>
                    You can add family members from your profile
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep('details')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#1e5f79',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e5f79';
                }}
              >
                Continue
              </button>
            </div>
          )}

          {step === 'details' && (
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#000000',
                margin: '0 0 16px 0'
              }}>
                Complete Booking Details
              </h3>

              {/* Chief Complaint */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#000000',
                  marginBottom: '8px'
                }}>
                  Chief Complaint *
                </label>
                <textarea
                  value={formData.chief_complaint}
                  onChange={(e) => handleInputChange('chief_complaint', e.target.value)}
                  placeholder="Describe your symptoms or reason for consultation"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #c8eaeb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1e5f79';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#c8eaeb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              {/* Address for Home Visit */}
              {formData.visit_mode === 'HOME_VISIT' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#000000',
                    marginBottom: '8px'
                  }}>
                    Home Address *
                  </label>
                  <textarea
                    value={formData.patient_address}
                    onChange={(e) => handleInputChange('patient_address', e.target.value)}
                    placeholder="Enter your complete address for home visit"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #c8eaeb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#1e5f79';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#c8eaeb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              )}

              {/* Fee Breakdown */}
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
                    <span style={{ fontSize: '14px', color: '#000000', fontWeight: '500' }}>₹{formData.consultation_fee}</span>
                  </div>
                  
                  {formData.visit_mode === 'HOME_VISIT' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#000000' }}>Travel Fee</span>
                      <span style={{ fontSize: '14px', color: '#000000', fontWeight: '500' }}>₹{formData.travel_fee}</span>
                    </div>
                  )}
                  
                  <hr style={{ border: 'none', borderTop: '1px solid #c8eaeb', margin: '8px 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Total Amount</span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e5f79' }}>
                      ₹{formData.total_amount}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep('patient')}
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
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.chief_complaint || (formData.visit_mode === 'HOME_VISIT' && !formData.patient_address) || loading}
                  style={{
                    flex: 2,
                    padding: '14px',
                    background: (!formData.chief_complaint || (formData.visit_mode === 'HOME_VISIT' && !formData.patient_address) || loading) 
                      ? '#9ca3af' 
                      : '#1e5f79',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: (!formData.chief_complaint || (formData.visit_mode === 'HOME_VISIT' && !formData.patient_address) || loading) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!(!formData.chief_complaint || (formData.visit_mode === 'HOME_VISIT' && !formData.patient_address) || loading)) {
                      e.currentTarget.style.backgroundColor = '#000000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!formData.chief_complaint || (formData.visit_mode === 'HOME_VISIT' && !formData.patient_address) || loading)) {
                      e.currentTarget.style.backgroundColor = '#1e5f79';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CSS for animations */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookingForm;