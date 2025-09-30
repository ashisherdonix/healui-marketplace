'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Shield, Calendar, Home, Video, User, Award, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { theme } from '@/utils/theme';

interface PhysiotherapistCardProps {
  physiotherapist: {
    id: string;
    full_name: string;
    specializations?: string[];
    years_of_experience?: number;
    average_rating: number;
    total_reviews: number;
    practice_address?: string;
    service_areas?: string;
    consultation_fee?: string;
    home_visit_fee?: string;
    profile_picture?: string;
    profile_photo_url?: string;
    cover_photo_url?: string;
    bio?: string;
    availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    is_verified?: boolean;
    home_visit_available?: boolean;
    online_consultation_available?: boolean;
    gender?: string;
  };
}

const CleanPhysiotherapistCard: React.FC<PhysiotherapistCardProps> = ({ physiotherapist }) => {
  const router = useRouter();

  const handleBookAppointment = () => {
    router.push(`/physiotherapist/${physiotherapist.id}`);
  };

  const getAvailabilityColor = () => {
    switch (physiotherapist.availability_status) {
      case 'AVAILABLE':
        return theme.colors.success;
      case 'BUSY':
        return theme.colors.warning;
      case 'OFFLINE':
        return theme.colors.gray[500];
      default:
        return theme.colors.success;
    }
  };

  const getAvailabilityText = () => {
    switch (physiotherapist.availability_status) {
      case 'AVAILABLE':
        return 'Available today';
      case 'BUSY':
        return 'Next available tomorrow';
      case 'OFFLINE':
        return 'Currently offline';
      default:
        return 'Check availability';
    }
  };

  const formatSpecialization = (spec: string) => {
    return spec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return 'N/A';
    return `₹${parseFloat(price).toLocaleString()}`;
  };

  return (
    <div style={{
      backgroundColor: '#eff8ff',
      borderRadius: '12px',
      border: '1px solid #c8eaeb',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      height: '320px', // Reduced height for better content ratio
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(30, 95, 121, 0.08)',
      padding: '20px'
    }}
    onClick={handleBookAppointment}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 95, 121, 0.12)';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'rgba(30, 95, 121, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 95, 121, 0.08)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#c8eaeb';
    }}>
      {/* Profile Section */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '12px'
      }}>
        {/* Profile Image */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#F3F4F6',
          border: '3px solid #c8eaeb',
          position: 'relative',
          flexShrink: 0
        }}>
          {physiotherapist.profile_photo_url ? (
            <Image
              src={physiotherapist.profile_photo_url}
              alt={physiotherapist.full_name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="64px"
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F3F4F6'
            }}>
              <User style={{
                width: '24px',
                height: '24px',
                color: '#9CA3AF'
              }} />
            </div>
          )}
          
          {/* Verification Badge - only if verified */}
          {physiotherapist.is_verified && (
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#1e5f79',
              border: '2px solid #eff8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 style={{ width: '10px', height: '10px', color: '#ffffff' }} />
            </div>
          )}
        </div>

        {/* Name and Experience */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#000000',
            margin: 0,
            marginBottom: '4px',
            fontFamily: 'Inter, "IBM Plex Sans", system-ui, sans-serif'
          }}>
            Dr. {physiotherapist.full_name}
          </h3>
          
          {/* Experience */}
          {physiotherapist.years_of_experience && (
            <div style={{
              fontSize: '13px',
              color: '#1e5f79',
              fontWeight: '500'
            }}>
              {physiotherapist.years_of_experience} years experience
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      {physiotherapist.practice_address && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          marginBottom: '12px'
        }}>
          <MapPin style={{ width: '14px', height: '14px', color: '#6B7280' }} />
          <span style={{
            fontSize: '13px',
            color: '#4B5563',
            fontWeight: '500'
          }}>
            {physiotherapist.practice_address}
          </span>
        </div>
      )}

      {/* Specializations */}
      {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {physiotherapist.specializations.slice(0, 3).map((spec, index) => (
              <span 
                key={index} 
                style={{
                  backgroundColor: 'rgba(200, 234, 235, 0.4)',
                  color: '#1e5f79',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e5f79';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(200, 234, 235, 0.4)';
                  e.currentTarget.style.color = '#1e5f79';
                }}
              >
                {formatSpecialization(spec)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <div style={{ 
        marginBottom: '16px',
        padding: '8px 0'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {/* Home Visit Price */}
          {(physiotherapist.home_visit_available !== false && physiotherapist.home_visit_fee) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Home style={{ width: '12px', height: '12px', color: '#1e5f79' }} />
                <span style={{
                  fontSize: '12px',
                  color: '#4B5563',
                  fontWeight: '500'
                }}>
                  Home Visit
                </span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e5f79'
              }}>
                ₹{parseFloat(physiotherapist.home_visit_fee).toLocaleString()}
              </span>
            </div>
          )}
          
          {/* Online Consultation Price */}
          {(physiotherapist.online_consultation_available !== false && physiotherapist.consultation_fee) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Video style={{ width: '12px', height: '12px', color: '#1e5f79' }} />
                <span style={{
                  fontSize: '12px',
                  color: '#4B5563',
                  fontWeight: '500'
                }}>
                  Online
                </span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e5f79'
              }}>
                ₹{parseFloat(physiotherapist.consultation_fee).toLocaleString()}
              </span>
            </div>
          )}
          
          {/* Fallback if no pricing */}
          {(!physiotherapist.home_visit_fee && !physiotherapist.consultation_fee) && (
            <div style={{
              textAlign: 'center',
              fontSize: '12px',
              color: 'rgba(0, 0, 0, 0.5)',
              fontStyle: 'italic'
            }}>
              Contact for pricing
            </div>
          )}
        </div>
      </div>

      {/* CTA Buttons */}
      <div style={{ 
        display: 'flex',
        gap: '12px',
        marginTop: 'auto',
        flexShrink: 0 // Prevents buttons from shrinking
      }}>
        {/* Primary Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookAppointment();
          }}
          style={{
            flex: 1,
            height: '40px',
            backgroundColor: '#1e5f79',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a5469'; // 10% darker
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1e5f79';
          }}
        >
          Book Now
        </button>
        
        {/* Secondary Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookAppointment();
          }}
          style={{
            flex: 1,
            height: '40px',
            backgroundColor: 'transparent',
            color: '#1e5f79',
            border: '1px solid #1e5f79',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#eff8ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default CleanPhysiotherapistCard;