'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearError, sendOTP, verifyOTP } from '@/store/slices/authSlice';
import { firebaseAuthService } from '@/services/firebase-auth';
import { ConfirmationResult } from 'firebase/auth';
import ApiManager from '@/services/api';
import { store } from '@/store/store';
import Button from '@/components/button';
import Card from '@/components/card';
import { Phone, User, Menu, X as CloseIcon, ChevronDown, LogOut, Calendar, Users, Star, Shield, CheckCircle, ArrowLeft, Settings, BookOpen } from 'lucide-react';
import { theme } from '@/utils/theme';

// Simple Login Modal Component
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [phone, setPhone] = useState('+91 ');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [localConfirmationResult, setLocalConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state) => state.auth);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');
    
    try {
      firebaseAuthService.initializeRecaptcha();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await firebaseAuthService.sendOTP(phone);
      
      if (!result.success || !result.confirmationResult) {
        throw new Error(result.error || 'Failed to send OTP');
      }
      
      setStep('otp');
      setLocalConfirmationResult(result.confirmationResult);
      
    } catch (error) {
      setLocalError((error as Error).message || 'Failed to send OTP');
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
      setLocalError('Please try sending OTP again');
      setIsLoading(false);
      return;
    }
    
    try {
      const firebaseUser = await localConfirmationResult.confirm(otp);
      const firebaseToken = await firebaseUser.user.getIdToken();
      
      const response = await ApiManager.login({
        phone: firebaseUser.user.phoneNumber || phone,
        firebaseIdToken: firebaseToken
      });
      
      if (response.success && response.data) {
        const authData = {
          user: response.data.user,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token
        };
        
        const { loginSuccess } = await import('@/store/slices/authSlice');
        dispatch(loginSuccess(authData));
        handleClose();
      } else {
        setLocalError(response.message || 'Login failed');
      }
    } catch (error) {
      setLocalError((error as Error).message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setPhone('+91 ');
    setOtp('');
    setStep('phone');
    setLocalError('');
    setIsLoading(false);
    setLocalConfirmationResult(null);
    firebaseAuthService.clearRecaptcha();
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

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
            <CloseIcon style={{ 
              width: '16px', 
              height: '16px', 
              color: '#000000',
              strokeWidth: 2
            }} />
          </button>

          {/* Back Button for OTP Step */}
          {step === 'otp' && (
            <button
              onClick={() => setStep('phone')}
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
                ? 'Welcome to HealUI' 
                : `Code sent to ${phone}`
              }
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '20px' }}>
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
                    Sending...
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
              
              <button
                type="button"
                onClick={() => setStep('phone')}
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

// User Menu Dropdown
interface User {
  full_name?: string;
  name?: string;
}

const UserMenu = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.25rem',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--lk-surfacevariant)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div className="bg-primary" style={{
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span className="lk-typography-label-large" style={{ color: 'var(--lk-onprimary)' }}>
            {user?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
          </span>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 49
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div style={{
            position: 'absolute',
            right: '0',
            top: 'calc(100% + 0.5rem)',
            width: '220px',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              padding: '1rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid #c8eaeb'
            }}>
              {/* User Info Header */}
              <div style={{
                padding: '0.75rem',
                marginBottom: '0.75rem',
                backgroundColor: '#eff8ff',
                borderRadius: '0.75rem',
                border: '1px solid #c8eaeb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: '#1e5f79',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ 
                      color: '#ffffff', 
                      fontSize: '1.125rem',
                      fontWeight: '600'
                    }}>
                      {user?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div style={{ 
                      color: '#000000',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginBottom: '0.125rem'
                    }}>
                      {user?.full_name || user?.name || 'User'}
                    </div>
                    <div style={{ 
                      color: '#1e5f79',
                      fontSize: '0.75rem'
                    }}>
                      {user?.phone || user?.email || ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ display: 'grid', gap: '0.25rem' }}>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{ 
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#c8eaeb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  >
                    <User style={{ width: '1.125rem', height: '1.125rem', color: '#1e5f79' }} />
                    <div style={{ color: '#000000', fontSize: '0.875rem', fontWeight: '500' }}>
                      My Profile
                    </div>
                  </div>
                </Link>

                <Link
                  href="/bookings"
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{ 
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#c8eaeb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  >
                    <Calendar style={{ width: '1.125rem', height: '1.125rem', color: '#1e5f79' }} />
                    <div style={{ color: '#000000', fontSize: '0.875rem', fontWeight: '500' }}>
                      My Bookings
                    </div>
                  </div>
                </Link>
                
                {/* Divider */}
                <div style={{
                  height: '1px',
                  backgroundColor: '#c8eaeb',
                  margin: '0.5rem 0'
                }} />
                
                {/* Logout Button */}
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0'
                  }}
                >
                  <div style={{ 
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  >
                    <LogOut style={{ width: '1.125rem', height: '1.125rem', color: '#dc2626' }} />
                    <div style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: '500' }}>
                      Sign Out
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Main Header Component
const Header: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  console.log('🔄 Header - Render, isLoginModalOpen:', isLoginModalOpen);
  const { isAuthenticated, user, initializing } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await ApiManager.logout();
      
      // Manually dispatch logout success to Redux since API no longer does it
      const { logoutSuccess } = await import('@/store/slices/authSlice');
      dispatch(logoutSuccess());
      
      // Don't reload, let Redux handle the state change
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [];

  return (
    <>
      <header className="bg-surface" style={{
        position: 'sticky',
        top: '0',
        zIndex: 40,
        borderBottom: '1px solid var(--lk-outline)',
        backgroundColor: 'var(--lk-surface)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem'
          }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Image
                    src="/Healui Logo/Healui Logo Final-10.png"
                    alt="HealUI"
                    width={120}
                    height={40}
                    priority
                    style={{
                      width: 'clamp(90px, 12vw, 120px)',
                      height: 'auto'
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Empty space for center balance */}
            <div style={{ flex: '1 1 auto' }}></div>

            {/* Right Section */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              flex: '0 0 auto'
            }}>
              {initializing ? (
                // Show loading state while initializing
                <div style={{ 
                  width: '60px', 
                  height: '36px', 
                  backgroundColor: 'var(--lk-surface)', 
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid var(--lk-outline)',
                    borderTop: '2px solid var(--lk-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
              ) : isAuthenticated && user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <Button
                  variant="fill"
                  size="md"
                  label="Sign In"
                  color="primary"
                  onClick={() => {
                    console.log('🔄 Header - Sign In button clicked');
                    setIsLoginModalOpen(true);
                    console.log('✅ Header - Modal should now be open');
                  }}
                />
              )}
            </div>
          </div>
        </div>

      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

    </>
  );
};

export default Header;