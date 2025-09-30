'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError } from '@/store/slices/authSlice';
import { firebaseAuthService } from '@/services/firebase-auth';
import { ConfirmationResult } from 'firebase/auth';
import ApiManager from '@/services/api';
import Image from 'next/image';
import { 
  X, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface BookingContext {
  physiotherapist_id: string;
  physiotherapist_name: string;
  scheduled_date: string;
  scheduled_time: string;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  selectedSlot: {
    start_time: string;
    end_time: string;
    visit_mode: 'HOME_VISIT' | 'ONLINE';
  };
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
      
    } catch (error) {
      console.error('Send OTP failed:', error);
      setLocalError((error as Error).message || 'Failed to send OTP. Please try again.');
      
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
    } catch (error) {
      console.error('OTP verification failed:', error);
      setLocalError((error as Error).message || 'OTP verification failed');
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
        maxWidth: '340px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Simple Header */}
        <div style={{
          background: '#c8eaeb',
          padding: '24px 20px',
          position: 'relative'
        }}>

          {/* Close Button */}
          <button
            onClick={handleClose}
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

          {/* Back Button for OTP Step */}
          {step === 'otp' && (
            <button
              onClick={handleBack}
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
              <ArrowLeft style={{ 
                width: '16px', 
                height: '16px', 
                color: '#000000',
                strokeWidth: 2
              }} />
            </button>
          )}

          {/* HealUI Logo */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <Image
              src="/Healui Logo/Healui Logo Final-02.png"
              alt="HealUI"
              width={80}
              height={26}
              style={{ 
                height: 'auto',
                width: '80px'
              }}
            />
          </div>

          {/* Title Section */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '14px',
              color: '#000000',
              margin: 0,
              fontWeight: '500',
              opacity: 0.8
            }}>
              {step === 'phone' 
                ? 'Secure your appointment' 
                : `Code sent to ${phone}`
              }
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '20px' }}>
          {/* Booking Context */}
          {context === 'booking' && bookingContext && (
            <div style={{
              fontSize: '13px',
              color: '#1e5f79',
              fontWeight: '500',
              marginBottom: '16px',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              Quick login to secure this appointment<br />
              <span style={{ color: '#000000', fontSize: '12px' }}>
                Dr. {bookingContext.physiotherapist_name} • {formatDate(bookingContext.scheduled_date)} • {formatTime(bookingContext.scheduled_time)}
              </span>
            </div>
          )}

          {/* Error Message */}
          {(error || localError) && (
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
                {error || localError}
              </div>
            </div>
          )}

          {/* Phone Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith('+91 ')) {
                      setPhone(value);
                    } else if (value.length < 4) {
                      setPhone('+91 ');
                    }
                  }}
                  placeholder="+91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '1px solid #c8eaeb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1e5f79';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#c8eaeb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={phone.length < 8 || isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: phone.length < 8 || isLoading 
                    ? '#9ca3af' 
                    : '#1e5f79',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: phone.length < 8 || isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  if (phone.length >= 8 && !isLoading) {
                    e.currentTarget.style.backgroundColor = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (phone.length >= 8 && !isLoading) {
                    e.currentTarget.style.backgroundColor = '#1e5f79';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>

              <div style={{
                textAlign: 'center',
                marginTop: '12px',
                fontSize: '11px',
                color: '#6b7280'
              }}>
                Quick & secure verification
              </div>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '1px solid #c8eaeb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textAlign: 'center',
                    letterSpacing: '2px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1e5f79';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 95, 121, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#c8eaeb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  autoFocus
                  required
                />
                
                {countdown > 0 && (
                  <div style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: '#1e5f79',
                    fontWeight: '500'
                  }}>
                    Resend in {countdown}s
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6 || isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: otp.length !== 6 || isLoading 
                    ? '#9ca3af' 
                    : '#1e5f79',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: otp.length !== 6 || isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '10px'
                }}
                onMouseEnter={(e) => {
                  if (otp.length === 6 && !isLoading) {
                    e.currentTarget.style.backgroundColor = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (otp.length === 6 && !isLoading) {
                    e.currentTarget.style.backgroundColor = '#1e5f79';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              {countdown === 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'none',
                    color: '#1e5f79',
                    border: '1px solid #c8eaeb',
                    borderRadius: '6px',
                    fontSize: '13px',
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
                  Change Number
                </button>
              )}
            </form>
          )}


          {/* reCAPTCHA Container */}
          <div id="recaptcha-container" style={{ 
            marginTop: '12px',
            display: 'flex',
            justifyContent: 'center'
          }}></div>
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

export default LoginModal;