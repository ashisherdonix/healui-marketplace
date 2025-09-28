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
import { Phone, User, Menu, X, ChevronDown, LogOut, Calendar, Users, Star } from 'lucide-react';

// Login Modal Component
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [phone, setPhone] = useState('+91 ');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [localConfirmationResult, setLocalConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  console.log('🔄 LoginModal - Render, isOpen:', isOpen);
  console.log('🔄 LoginModal - Current phone:', phone, 'length:', phone.length, 'disabled:', isLoading || phone.length < 8);
  
  const dispatch = useAppDispatch();
  const { isAuthenticated, error, otpSent, otpVerifying, confirmationResult } = useAppSelector((state) => state.auth);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');
    
    console.log('🔄 Header - Send OTP clicked, phone:', phone);
    
    try {
      // Following healui-clinic-web pattern exactly
      
      // 1. Initialize reCAPTCHA first
      console.log('🔄 Header - Initializing reCAPTCHA...');
      firebaseAuthService.initializeRecaptcha();
      
      // 2. Critical timing delay (from clinic-web)
      console.log('🔄 Header - Waiting 100ms for reCAPTCHA...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Send OTP via Firebase directly (following clinic-web pattern)
      console.log('🔄 Header - Calling Firebase sendOTP...');
      const result = await firebaseAuthService.sendOTP(phone);
      
      console.log('✅ Header - Firebase OTP result:', result);
      
      // Check if we got the confirmationResult
      if (!result.success || !result.confirmationResult) {
        throw new Error(result.error || 'Failed to get confirmation result');
      }
      
      console.log('✅ Header - Firebase OTP sent successfully');
      
      // 4. Update state and move to next step
      setStep('otp');
      
      // Store confirmationResult locally for later use
      setLocalConfirmationResult(result.confirmationResult);
      
    } catch (error: any) {
      console.error('❌ Header - Send OTP failed:', error);
      setLocalError(error.message || 'Failed to send OTP. Please try again.');
      
      // Reset reCAPTCHA on error (following clinic-web pattern)
      console.log('🔄 Header - Resetting reCAPTCHA due to error');
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
      console.log('🔄 Header - Verifying OTP with Firebase...');
      const firebaseUser = await localConfirmationResult.confirm(otp);
      console.log('✅ Header - Firebase OTP verified successfully');
      
      // Get Firebase ID token
      const firebaseToken = await firebaseUser.user.getIdToken();
      console.log('✅ Header - Got Firebase ID token');
      
      // Send to backend for JWT exchange (following clinic-web pattern)
      console.log('🔄 Header - Exchanging Firebase token for JWT...');
      console.log('🔄 Header - Login data:', {
        phone: firebaseUser.user.phoneNumber || phone,
        firebaseIdToken: firebaseToken.substring(0, 50) + '...' // Log first 50 chars
      });
      
      const response = await ApiManager.login({
        phone: firebaseUser.user.phoneNumber || phone,
        firebaseIdToken: firebaseToken
      });
      
      console.log('🔄 Header - Login API response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Header - Login successful, user data:', response.data.user);
        console.log('✅ Header - Tokens received:', {
          hasAccessToken: !!response.data.access_token,
          hasRefreshToken: !!response.data.refresh_token
        });
        
        // Manually dispatch login success to Redux since API no longer does it
        const authData = {
          user: response.data.user,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token
        };
        
        // Import the action dynamically to avoid circular dependency
        const { loginSuccess } = await import('@/store/slices/authSlice');
        dispatch(loginSuccess(authData));
        
        console.log('✅ Header - Login successful, closing modal');
        handleClose();
      } else {
        console.error('❌ Header - Login failed, response:', response);
        setLocalError(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Header - OTP verification failed:', error);
      setLocalError(error.message || 'OTP verification failed');
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
    // Clear Firebase reCAPTCHA
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
      inset: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <Card variant="fill" scaleFactor="headline">
        <div className="p-lg" style={{ maxWidth: '400px', width: '100%', position: 'relative' }}>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '1.5rem', height: '1.5rem', color: 'var(--lk-onsurfacevariant)' }} />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <div className="bg-primarycontainer" style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone style={{ width: '1.5rem', height: '1.5rem', color: 'var(--lk-primary)' }} />
              </div>
            </div>
            
            <div className="lk-typography-headline-medium mb-sm" style={{ color: 'var(--lk-onsurface)' }}>
              {step === 'phone' && 'Sign in to HealUI'}
              {step === 'otp' && 'Verify Phone Number'}
              {step === 'register' && 'Complete Registration'}
            </div>
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
              {step === 'phone' && 'Enter your phone number to get started'}
              {step === 'otp' && `We sent a verification code to ${phone}`}
              {step === 'register' && 'Just one more step to get started'}
            </div>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <Card variant="fill">
              <div className="bg-errorcontainer p-md mb-md" style={{ borderRadius: '0.5rem' }}>
                <div className="lk-typography-body-small" style={{ color: 'var(--lk-onerrorcontainer)' }}>
                  {error || localError}
                </div>
              </div>
            </Card>
          )}

          {/* Phone Step */}
          {step === 'phone' && (
            <form onSubmit={(e) => {
              console.log('🔄 Form submit triggered');
              handleSendOTP(e);
            }} style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <div className="lk-typography-label-large mb-sm" style={{ color: 'var(--lk-onsurface)' }}>
                  Phone Number
                </div>
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
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  required
                />
              </div>
              
              <Button
                variant="fill"
                size="lg"
                label={isLoading ? 'Sending OTP...' : 'Send OTP'}
                color="primary"
                disabled={isLoading || phone.length < 8}
                style={{ width: '100%' }}
                onClick={(e) => {
                  console.log('🔄 Send OTP button clicked directly');
                  // Create a fake form submit event and call our handler
                  const fakeEvent = {
                    preventDefault: () => {}
                  } as React.FormEvent;
                  handleSendOTP(fakeEvent);
                }}
              />
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <div className="lk-typography-label-large mb-sm" style={{ color: 'var(--lk-onsurface)' }}>
                  Enter Verification Code
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1.25rem',
                    textAlign: 'center',
                    letterSpacing: '0.5rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  required
                />
              </div>
              
              <Button
                variant="fill"
                size="lg"
                label={isLoading ? 'Verifying...' : 'Verify Code'}
                color="primary"
                disabled={isLoading || otp.length !== 6}
                style={{ width: '100%' }}
                onClick={(e) => {
                  console.log('🔄 Verify OTP button clicked directly');
                  // Create a fake form submit event and call our handler
                  const fakeEvent = {
                    preventDefault: () => {}
                  } as React.FormEvent;
                  handleVerifyOTP(fakeEvent);
                }}
              />
              
              <Button
                type="button"
                variant="text"
                size="md"
                label="Change phone number"
                color="primary"
                onClick={() => setStep('phone')}
                style={{ width: '100%' }}
              />
            </form>
          )}


          {/* reCAPTCHA Container */}
          <div id="recaptcha-container" style={{ marginTop: '1rem' }}></div>
        </div>
      </Card>
    </div>
  );
};

// User Menu Dropdown
const UserMenu = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
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
            width: '180px',
            zIndex: 50
          }}>
            <Card variant="fill" scaleFactor="headline">
              <div style={{
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                borderRadius: '0.75rem'
              }}>
                <div className="p-md">
                  {/* Menu Items */}
                  <div style={{ display: 'grid', gap: '0.25rem' }}>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="p-md" style={{ 
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--lk-surfacevariant)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      >
                        <User style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                        <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurface)' }}>
                          My Profile
                        </div>
                      </div>
                    </Link>
                    
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
                      <div className="p-md" style={{ 
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--lk-errorcontainer)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      >
                        <LogOut style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-error)' }} />
                        <div className="lk-typography-body-medium" style={{ color: 'var(--lk-error)' }}>
                          Sign Out
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navigation = [
    { name: 'Find Physiotherapists', href: '/search' },
    { name: 'Home Visits', href: '/home-visits' },
    { name: 'Online Consultation', href: '/online' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="bg-surface" style={{
        position: 'sticky',
        top: '0',
        zIndex: 40,
        borderBottom: '1px solid var(--lk-outline)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem'
          }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Image
                    src="/Healui Logo/Healui Logo Final-10.png"
                    alt="HealUI"
                    width={120}
                    height={40}
                    priority
                  />
              
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav style={{ 
              display: 'none',
              gap: '2rem',
              alignItems: 'center'
            }} className="md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{ textDecoration: 'none' }}
                >
                  <span className="lk-typography-body-medium" style={{ 
                    color: 'var(--lk-onsurfacevariant)',
                    transition: 'color 0.2s'
                  }}>
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Auth Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {initializing ? (
                // Show loading state while initializing
                <div style={{ 
                  width: '80px', 
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

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  display: 'none',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                className="md:hidden"
              >
                <Menu style={{ width: '1.5rem', height: '1.5rem', color: 'var(--lk-onsurface)' }} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div style={{
              display: 'block',
              borderTop: '1px solid var(--lk-outline)',
              paddingTop: '1rem',
              paddingBottom: '1rem'
            }} className="md:hidden">
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="p-md" style={{ borderRadius: '0.5rem' }}>
                      <span className="lk-typography-body-medium" style={{ 
                        color: 'var(--lk-onsurfacevariant)'
                      }}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
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