'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import ApiManager from '@/services/api';
import Header from '@/components/layout/Header';
import PersonalInfoSection from '@/components/profile/PersonalInfoSection';
import FamilyMembersSection from '@/components/profile/FamilyMembersSection';
import ReviewsSection from '@/components/profile/ReviewsSection';
import Card from '@/components/card';
import { User } from '@/lib/types';

type TabType = 'profile' | 'members' | 'ratings';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, initializing } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);

  // Check URL parameters for direct tab navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['profile', 'members', 'ratings'].includes(tabParam)) {
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
          setProfileData(response.data as User);
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
    { id: 'profile' as TabType, label: 'Profile' },
    { id: 'members' as TabType, label: 'Members' },
    { id: 'ratings' as TabType, label: 'Ratings' }
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
      <div className="bg-background" style={{ minHeight: '100vh', paddingTop: '1rem', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          
          {/* Simple Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div className="lk-typography-title-large" style={{ 
              color: 'var(--lk-onsurface)',
              fontWeight: '600'
            }}>
              Profile
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--lk-outline)',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '1rem 1.5rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: isActive ? 'var(--lk-primary)' : 'var(--lk-onsurfacevariant)',
                      cursor: 'pointer',
                      borderBottom: isActive ? '2px solid var(--lk-primary)' : '2px solid transparent',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      fontWeight: isActive ? '600' : '400',
                      fontSize: '1rem',
                      minWidth: 'fit-content'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--lk-onsurface)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--lk-onsurfacevariant)';
                      }
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div style={{ minHeight: '400px' }}>
            {loading ? (
              <Card variant="fill" scaleFactor="heading">
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
                {activeTab === 'profile' && (
                  <PersonalInfoSection 
                    user={profileData || user} 
                    onUpdate={(updatedUser) => setProfileData(updatedUser)}
                  />
                )}
                {activeTab === 'members' && <FamilyMembersSection />}
                {activeTab === 'ratings' && <ReviewsSection />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;