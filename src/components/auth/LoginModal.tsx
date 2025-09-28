'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError } from '@/store/slices/authSlice';
import { firebaseAuthService } from '@/services/firebase-auth';
import { ConfirmationResult } from 'firebase/auth';
import ApiManager from '@/services/api';
import Card from '@/components/card';
import Button from '@/components/button';
import { 
  X, 
  Phone, 
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Timer
} from 'lucide-react';

interface BookingContext {
  physiotherapist_id: string;
  physiotherapist_name: string;
  scheduled_date: string;
  scheduled_time: string;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  selectedSlot: any;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  context?: 'booking' | 'general';
  bookingContext?: BookingContext;
  urgencyMessage?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  context = 'general',
  bookingContext,
  urgencyMessage = 'Quick login to secure your appointment'
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state) => state.auth);

  const [phone, setPhone] = useState('+91 ');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [localConfirmationResult, setLocalConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Clear errors when modal opens
    if (isOpen) {
      dispatch(clearError());
      setLocalError('');
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');
    
    try {
      // Following healui-clinic-web pattern exactly
      
      // 1. Initialize reCAPTCHA first
      firebaseAuthService.initializeRecaptcha();
      
      // 2. Critical timing delay (from clinic-web)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Send OTP via Firebase directly (following clinic-web pattern)
      const result = await firebaseAuthService.sendOTP(phone);
      
      // Check if we got the confirmationResult
      if (!result.success || !result.confirmationResult) {
        throw new Error(result.error || 'Failed to get confirmation result');
      }
      
      // 4. Update state and move to next step
      setStep('otp');
      setCountdown(30);
      
      // Store confirmationResult locally for later use
      setLocalConfirmationResult(result.confirmationResult);
      
    } catch (error: any) {
      console.error('Send OTP failed:', error);
      setLocalError(error.message || 'Failed to send OTP. Please try again.');
      
      // Reset reCAPTCHA on error (following clinic-web pattern)
      firebaseAuthService.clearRecaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');
    
    if (!localConfirmationResult) {
      setLocalError('No confirmation result found. Please try sending OTP again.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Following healui-clinic-web pattern - verify OTP directly with Firebase
      const firebaseUser = await localConfirmationResult.confirm(otp);
      
      // Get Firebase ID token
      const firebaseToken = await firebaseUser.user.getIdToken();
      
      // Send to backend for JWT exchange (following clinic-web pattern)
      const response = await ApiManager.login({
        phone: firebaseUser.user.phoneNumber || phone,
        firebaseIdToken: firebaseToken
      });
      
      if (response.success && response.data) {
        // Manually dispatch login success to Redux since API no longer does it
        const authData = {
          user: response.data.user,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token
        };
        
        // Import the action dynamically to avoid circular dependency
        const { loginSuccess } = await import('@/store/slices/authSlice');
        dispatch(loginSuccess(authData));
        
        onSuccess();
      } else {
        setLocalError(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      setLocalError(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setLocalError('');
    dispatch(clearError());
  };

  const resetModal = () => {
    setPhone('+91 ');
    setOtp('');
    setStep('phone');
    setLocalError('');
    setIsLoading(false);
    setLocalConfirmationResult(null);
    setCountdown(0);
    // Clear Firebase reCAPTCHA
    firebaseAuthService.clearRecaptcha();
  };

  const handleClose = () => {
    resetModal();
    onClose();
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
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
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
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '400px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {step === 'otp' && (
                  <Button
                    variant="text"
                    size="sm"
                    onClick={handleBack}
                    style={{ padding: '0.5rem', minWidth: 'auto' }}
                    startIcon="ArrowLeft"
                  />
                )}
                <div className="lk-typography-title-large" style={{ color: 'var(--lk-onsurface)' }}>
                  {step === 'phone' ? 'Quick Login' : 'Enter OTP'}
                </div>
              </div>
              <Button
                variant="text"
                size="sm"
                onClick={handleClose}
                style={{ padding: '0.5rem', minWidth: 'auto' }}
                startIcon="X"
              />
            </div>

            {/* Booking Context - Show urgency */}
            {context === 'booking' && bookingContext && (
              <Card variant="outline" scaleFactor="headline">
                <div className="p-md" style={{ 
                  backgroundColor: 'var(--lk-primarycontainer)', 
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Timer style={{ width: '1rem', height: '1rem', color: 'var(--lk-primary)' }} />
                    <div className="lk-typography-body-medium" style={{ 
                      color: 'var(--lk-onprimarycontainer)',
                      fontWeight: '500'
                    }}>
                      {urgencyMessage}
                    </div>
                  </div>
                  <div className="lk-typography-body-small" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                    Dr. {bookingContext.physiotherapist_name} • {formatDate(bookingContext.scheduled_date)} • {formatTime(bookingContext.scheduled_time)}
                  </div>
                </div>
              </Card>
            )}

            {/* Error Message */}
            {(error || localError) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem',
                backgroundColor: 'var(--lk-errorcontainer)',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-error)' }} />
                <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onerrorcontainer)' }}>
                  {error || localError}
                </div>
              </div>
            )}

            {/* Phone Step */}
            {step === 'phone' && (
              <form onSubmit={handleSendOTP}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="lk-typography-body-medium" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem',
                    fontWeight: '500'
                  }}>
                    Phone Number
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{ 
                      position: 'absolute', 
                      left: '0.75rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      width: '1.25rem', 
                      height: '1.25rem', 
                      color: 'var(--lk-onsurfacevariant)' 
                    }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Ensure +91 prefix is always present
                        if (value.startsWith('+91 ')) {
                          setPhone(value);
                        } else if (value.length < 4) {
                          setPhone('+91 ');
                        }
                      }}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 3rem',
                        border: '2px solid var(--lk-outline)',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: 'var(--lk-surface)',
                        color: 'var(--lk-onsurface)',
                        fontFamily: 'inherit'
                      }}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="lk-typography-body-small" style={{ 
                    color: 'var(--lk-onsurfacevariant)', 
                    marginTop: '0.5rem' 
                  }}>
                    We'll send you a 6-digit OTP via SMS
                  </div>
                </div>

                <Button
                  variant="fill"
                  color="primary"
                  size="lg"
                  disabled={phone.length < 8 || isLoading}
                  style={{ width: '100%' }}
                  label={isLoading ? 'Sending OTP...' : 'Send OTP'}
                  onClick={(e) => {
                    // Create a fake form submit event and call our handler
                    const fakeEvent = {
                      preventDefault: () => {}
                    } as React.FormEvent;
                    handleSendOTP(fakeEvent);
                  }}
                />

                <div className="lk-typography-body-small" style={{ 
                  color: 'var(--lk-onsurfacevariant)',
                  textAlign: 'center',
                  marginTop: '1rem'
                }}>
                  Login takes just 30 seconds
                </div>
              </form>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="lk-typography-body-medium" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem',
                    fontWeight: '500'
                  }}>
                    Enter 6-digit OTP
                  </div>
                  <div className="lk-typography-body-small" style={{ 
                    color: 'var(--lk-onsurfacevariant)', 
                    marginBottom: '1rem' 
                  }}>
                    Sent to {phone}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <ShieldCheck style={{ 
                      position: 'absolute', 
                      left: '0.75rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      width: '1.25rem', 
                      height: '1.25rem', 
                      color: 'var(--lk-onsurfacevariant)' 
                    }} />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 3rem',
                        border: '2px solid var(--lk-outline)',
                        borderRadius: '0.5rem',
                        fontSize: '1.125rem',
                        backgroundColor: 'var(--lk-surface)',
                        color: 'var(--lk-onsurface)',
                        fontFamily: 'monospace',
                        letterSpacing: '0.5rem',
                        textAlign: 'center'
                      }}
                      autoFocus
                      required
                    />
                  </div>

                  {countdown > 0 && (
                    <div className="lk-typography-body-small" style={{ 
                      color: 'var(--lk-onsurfacevariant)', 
                      marginTop: '0.5rem',
                      textAlign: 'center'
                    }}>
                      Resend OTP in {countdown}s
                    </div>
                  )}
                </div>

                <Button
                  variant="fill"
                  color="primary"
                  size="lg"
                  disabled={otp.length !== 6 || isLoading}
                  style={{ width: '100%' }}
                  label={isLoading ? 'Verifying...' : 'Verify & Continue'}
                  onClick={(e) => {
                    // Create a fake form submit event and call our handler
                    const fakeEvent = {
                      preventDefault: () => {}
                    } as React.FormEvent;
                    handleVerifyOTP(fakeEvent);
                  }}
                />

                {countdown === 0 && (
                  <Button
                    variant="text"
                    color="primary"
                    size="md"
                    onClick={handleBack}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    label="Change Phone Number"
                  />
                )}
              </form>
            )}

            {/* Trust Indicators */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--lk-surfacecontainerhighest)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle style={{ width: '1rem', height: '1rem', color: 'var(--lk-primary)' }} />
                <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurface)' }}>
                  Secure & Private
                </div>
              </div>
              <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                Your booking details are saved. Complete login in 30 seconds to secure your appointment.
              </div>
            </div>

            {/* reCAPTCHA Container */}
            <div id="recaptcha-container" style={{ marginTop: '1rem' }}></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginModal;