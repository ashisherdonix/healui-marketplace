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
  variant?: 'grid' | 'list';
}

const CleanPhysiotherapistCard: React.FC<PhysiotherapistCardProps> = ({ physiotherapist, variant = 'grid' }) => {
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

  if (variant === 'list') {
    return (
      <div style={{
        backgroundColor: '#eff8ff',
        borderRadius: '12px',
        border: '1px solid #c8eaeb',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        boxShadow: '0 2px 8px rgba(30, 95, 121, 0.08)',
        padding: '20px',
        gap: '20px',
        alignItems: 'center'
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
        {/* Profile Image */}
        <div style={{
          width: '80px',
          height: '80px',
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
              sizes="80px"
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
              <User style={{ width: '32px', height: '32px', color: '#9CA3AF' }} />
            </div>
          )}
          
          {physiotherapist.is_verified && (
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#1e5f79',
              border: '2px solid #eff8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 style={{ width: '12px', height: '12px', color: '#ffffff' }} />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Name and Rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#000000',
              margin: 0,
              fontFamily: 'Inter, "IBM Plex Sans", system-ui, sans-serif'
            }}>
              Dr. {physiotherapist.full_name}
            </h3>
            
            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star style={{ width: '16px', height: '16px', color: '#FFC107', fill: '#FFC107' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                {physiotherapist.average_rating.toFixed(1)}
              </span>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>
                ({physiotherapist.total_reviews} reviews)
              </span>
            </div>
          </div>

          {/* Experience and Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {physiotherapist.years_of_experience && (
              <div style={{ fontSize: '14px', color: '#1e5f79', fontWeight: '500' }}>
                {physiotherapist.years_of_experience} years experience
              </div>
            )}
            {physiotherapist.practice_address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin style={{ width: '14px', height: '14px', color: '#6B7280' }} />
                <span style={{ fontSize: '13px', color: '#4B5563', fontWeight: '500' }}>
                  {physiotherapist.practice_address}
                </span>
              </div>
            )}
          </div>

          {/* Specializations */}
          {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {physiotherapist.specializations.slice(0, 4).map((spec, index) => (
                <span 
                  key={index} 
                  style={{
                    backgroundColor: 'rgba(200, 234, 235, 0.4)',
                    color: '#1e5f79',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {formatSpecialization(spec)}
                </span>
              ))}
            </div>
          )}

          {/* Bio (List view only) */}
          {physiotherapist.bio && (
            <p style={{
              fontSize: '14px',
              color: '#4B5563',
              margin: 0,
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {physiotherapist.bio}
            </p>
          )}
        </div>

        {/* Pricing and Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', minWidth: '200px' }}>
          {/* Pricing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
            {(physiotherapist.home_visit_available !== false && physiotherapist.home_visit_fee) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Home style={{ width: '14px', height: '14px', color: '#1e5f79' }} />
                <span style={{ fontSize: '12px', color: '#4B5563' }}>Home Visit:</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e5f79' }}>
                  ₹{parseFloat(physiotherapist.home_visit_fee).toLocaleString()}
                </span>
              </div>
            )}
            
            {(physiotherapist.online_consultation_available !== false && physiotherapist.consultation_fee) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Video style={{ width: '14px', height: '14px', color: '#1e5f79' }} />
                <span style={{ fontSize: '12px', color: '#4B5563' }}>Online:</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e5f79' }}>
                  ₹{parseFloat(physiotherapist.consultation_fee).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookAppointment();
              }}
              style={{
                padding: '8px 16px',
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
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookAppointment();
              }}
              style={{
                padding: '8px 16px',
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
                e.currentTarget.style.backgroundColor = '#1a5469';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e5f79';
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fefefe',
      borderRadius: '16px',
      border: '1px solid rgba(200, 234, 235, 0.3)',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      height: '280px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(30, 95, 121, 0.08)',
      position: 'relative'
    }}
    onClick={handleBookAppointment}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(30, 95, 121, 0.15)';
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = 'rgba(30, 95, 121, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 95, 121, 0.08)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'rgba(200, 234, 235, 0.3)';
    }}>
      {/* Compact Profile Section */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 248, 255, 0.6)',
        padding: '14px 16px',
        borderBottom: '1px solid rgba(200, 234, 235, 0.2)',
        gap: '12px'
      }}>
        {/* Profile Image */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '3px solid #ffffff',
          position: 'relative',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          {physiotherapist.profile_photo_url ? (
            <Image
              src={physiotherapist.profile_photo_url}
              alt={physiotherapist.full_name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="60px"
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e5e7eb'
            }}>
              <User style={{
                width: '24px',
                height: '24px',
                color: '#9CA3AF'
              }} />
            </div>
          )}
          
          {/* Verification Badge */}
          {physiotherapist.is_verified && (
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 style={{ width: '10px', height: '10px', color: '#ffffff' }} />
            </div>
          )}
        </div>

        {/* Name and Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#000000',
            margin: 0,
            marginBottom: '4px',
            fontFamily: '"IBM Plex Sans", Inter, system-ui, sans-serif',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Dr. {physiotherapist.full_name}
          </h3>
          
          {/* Experience and Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px'
          }}>
            {physiotherapist.years_of_experience && (
              <div style={{
                backgroundColor: 'rgba(30, 95, 121, 0.1)',
                color: '#1e5f79',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                <Award style={{ width: '10px', height: '10px' }} />
                {physiotherapist.years_of_experience}y
              </div>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Star style={{
                width: '12px',
                height: '12px',
                color: '#FFC107',
                fill: '#FFC107'
              }} />
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#000'
              }}>
                {physiotherapist.average_rating.toFixed(1)}
              </span>
              <span style={{
                fontSize: '10px',
                color: '#6B7280'
              }}>
                ({physiotherapist.total_reviews})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div style={{
        padding: '12px 16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Specializations */}
        {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
          <div style={{
            marginBottom: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            justifyContent: 'center'
          }}>
            {physiotherapist.specializations.slice(0, 3).map((spec, index) => (
              <span 
                key={index} 
                style={{
                  backgroundColor: 'rgba(200, 234, 235, 0.3)',
                  color: '#1e5f79',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '11px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(30, 95, 121, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e5f79';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = '#1e5f79';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(200, 234, 235, 0.3)';
                  e.currentTarget.style.color = '#1e5f79';
                  e.currentTarget.style.borderColor = 'rgba(30, 95, 121, 0.1)';
                }}
              >
                {formatSpecialization(spec)}
              </span>
            ))}
            {physiotherapist.specializations.length > 3 && (
              <span style={{
                color: '#6B7280',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                +{physiotherapist.specializations.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Pricing Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: '1px solid rgba(200, 234, 235, 0.2)'
        }}>
          {/* Price Display */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {/* Online Consultation */}
            {(physiotherapist.online_consultation_available !== false && physiotherapist.consultation_fee) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                backgroundColor: 'rgba(30, 95, 121, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(30, 95, 121, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Video style={{ width: '14px', height: '14px', color: '#1e5f79' }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#1e5f79'
                  }}>
                    Online
                  </span>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1e5f79'
                }}>
                  ₹{parseFloat(physiotherapist.consultation_fee).toLocaleString()}
                </span>
              </div>
            )}

            {/* Home Visit */}
            {(physiotherapist.home_visit_available !== false && physiotherapist.home_visit_fee) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                backgroundColor: 'rgba(30, 95, 121, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(30, 95, 121, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Home style={{ width: '14px', height: '14px', color: '#1e5f79' }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#1e5f79'
                  }}>
                    Home Visit
                  </span>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1e5f79'
                }}>
                  ₹{parseFloat(physiotherapist.home_visit_fee).toLocaleString()}
                </span>
              </div>
            )}

            {/* No pricing available */}
            {(!physiotherapist.consultation_fee && !physiotherapist.home_visit_fee) && (
              <div style={{
                textAlign: 'center',
                padding: '8px',
                backgroundColor: 'rgba(107, 114, 128, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(107, 114, 128, 0.1)'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6B7280'
                }}>
                  Contact for pricing
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ 
        padding: '0 16px 16px',
        flexShrink: 0
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookAppointment();
          }}
          style={{
            width: '100%',
            height: '36px',
            backgroundColor: '#1e5f79',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#164458';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1e5f79';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Calendar style={{ width: '16px', height: '16px' }} />
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default CleanPhysiotherapistCard;