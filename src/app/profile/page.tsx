'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import ApiManager from '@/services/api';
import Header from '@/components/layout/Header';
import PersonalInfoSection from '@/components/profile/PersonalInfoSection';
import FamilyMembersSection from '@/components/profile/FamilyMembersSection';
import BookingsSection from '@/components/profile/BookingsSection';
import ReviewsSection from '@/components/profile/ReviewsSection';
import Card from '@/components/card';
import Button from '@/components/button';
import { User } from '@/lib/types';
import { Users, Calendar, Star, User as UserIcon, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type TabType = 'personal' | 'family' | 'bookings' | 'reviews';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, initializing } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);

  // Check URL parameters for direct tab navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['personal', 'family', 'bookings', 'reviews'].includes(tabParam)) {
        setActiveTab(tabParam as TabType);
      }
    }
  }, []);

  // Redirect if not authenticated (but only after initialization is complete)
  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, initializing]);

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const response = await ApiManager.getMyProfile();
        if (response.success && response.data) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const tabs = [
    { 
      id: 'personal' as TabType, 
      label: 'Personal Info', 
      icon: UserIcon,
      description: 'Manage your personal information and preferences'
    },
    { 
      id: 'family' as TabType, 
      label: 'Family Members', 
      icon: Users,
      description: 'Add and manage family members for appointments'
    },
    { 
      id: 'bookings' as TabType, 
      label: 'My Bookings', 
      icon: Calendar,
      description: 'View your appointment history and upcoming sessions'
    },
    { 
      id: 'reviews' as TabType, 
      label: 'My Reviews', 
      icon: Star,
      description: 'Your feedback and reviews for therapists'
    }
  ];

  // Show loading state during initialization
  if (initializing) {
    return (
      <>
        <Header />
        <div className="bg-background" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--lk-outline)',
              borderTop: '3px solid var(--lk-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
              Loading your profile...
            </div>
          </div>
        </div>
      </>
    );
  }

  // Redirect will happen in useEffect if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="bg-background" style={{ minHeight: '100vh', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          
          {/* Page Header - Simplified */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="lk-typography-title-large" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.25rem'
            }}>
              My Profile
            </div>
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
              Manage your account and healthcare information
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(250px, 280px) 1fr', 
            gap: '1.5rem', 
            alignItems: 'start'
          }}>
            
            {/* Sidebar Navigation - Improved */}
            <Card variant="fill" scaleFactor="headline">
              <div className="p-md">
                <div style={{ display: 'grid', gap: '0.25rem' }}>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          backgroundColor: isActive ? 'var(--lk-primarycontainer)' : 'transparent',
                          color: isActive ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurface)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'var(--lk-surfacevariant)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <Icon style={{ 
                          width: '1.125rem', 
                          height: '1.125rem',
                          color: isActive ? 'var(--lk-primary)' : 'var(--lk-onsurfacevariant)',
                          flexShrink: 0
                        }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div className="lk-typography-body-medium" style={{ 
                            fontWeight: isActive ? '500' : '400',
                            marginBottom: '0.125rem'
                          }}>
                            {tab.label}
                          </div>
                          <div className="lk-typography-body-small" style={{ 
                            color: isActive ? 'var(--lk-onprimarycontainer)' : 'var(--lk-onsurfacevariant)',
                            opacity: 0.75,
                            lineHeight: '1.3',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {tab.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Main Content */}
            <div>
              {loading ? (
                <Card variant="fill" scaleFactor="headline">
                  <div className="p-xl" style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      border: '3px solid var(--lk-outline)',
                      borderTop: '3px solid var(--lk-primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 1rem'
                    }}></div>
                    <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                      Loading profile data...
                    </div>
                  </div>
                </Card>
              ) : (
                <>
                  {activeTab === 'personal' && (
                    <PersonalInfoSection 
                      user={profileData || user} 
                      onUpdate={(updatedUser) => setProfileData(updatedUser)}
                    />
                  )}
                  {activeTab === 'family' && <FamilyMembersSection />}
                  {activeTab === 'bookings' && <BookingsSection />}
                  {activeTab === 'reviews' && <ReviewsSection />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;