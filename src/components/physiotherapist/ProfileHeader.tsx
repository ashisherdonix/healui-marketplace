'use client';

import React from 'react';
import { ArrowLeft, MapPin, Star, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileHeaderProps {
  profile: {
    id: string;
    full_name: string;
    profile_image?: string;
    location?: string;
    experience_years?: number;
    rating?: number;
    total_reviews?: number;
    specializations?: string[];
    languages?: string[];
    education?: Array<{ degree: string; institution: string; year: string }>;
    certifications?: string[];
    bio?: string;
    consultation_fee?: number;
    home_visit_fee?: number;
    online_fee?: number;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const router = useRouter();

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)', 
      color: 'white', 
      padding: '20px 0',
      borderRadius: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute',
        top: 0,
        right: 0,
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        transform: 'translate(100px, -100px)'
      }} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <button
          onClick={() => router.back()}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
            marginBottom: '24px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Search
        </button>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '4px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'white',
            flexShrink: 0
          }}>
            {profile.profile_image ? (
              <img 
                src={profile.profile_image} 
                alt={profile.full_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: '700',
                color: '#2563EB',
                background: 'white'
              }}>
                {profile.full_name?.charAt(0) || '?'}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              marginBottom: '8px',
              color: 'white'
            }}>
              {profile.full_name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {profile.location && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <MapPin style={{ width: '14px', height: '14px' }} />
                  {profile.location}
                </div>
              )}
              
              {profile.experience_years && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Clock style={{ width: '14px', height: '14px' }} />
                  {profile.experience_years} years exp
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star style={{ width: '20px', height: '20px', fill: '#FCD34D', color: '#FCD34D' }} />
                <span style={{ fontSize: '18px', fontWeight: '700' }}>{profile.rating || 0}</span>
                <span style={{ opacity: 0.9, fontSize: '14px' }}>({profile.total_reviews || 0} reviews)</span>
              </div>
              
              {profile.specializations && profile.specializations.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Specializes in:</div>
                  <div style={{ 
                    padding: '4px 12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {profile.specializations[0]}
                  </div>
                  {profile.specializations.length > 1 && (
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      +{profile.specializations.length - 1} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;