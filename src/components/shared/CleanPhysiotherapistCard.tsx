'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Shield, Calendar, Home, Video, User, Award, CheckCircle2, Zap, AlertTriangle, TrendingUp, Tag, Gift, Percent } from 'lucide-react';
import Image from 'next/image';
import { theme } from '@/utils/theme';
import { PhysiotherapistBatchAvailability } from '@/lib/types';
import AvailabilityBadge from '@/components/availability/AvailabilityBadge';
import PricingDisplay from '@/components/availability/PricingDisplay';
import { getSmartAvailabilitySummary } from '@/utils/availabilityUtils';

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
  availability?: PhysiotherapistBatchAvailability;
  serviceTypeFilter?: 'HOME_VISIT' | 'ONLINE' | 'ALL';
  userLocation?: { pincode?: string };
  availabilityLoading?: boolean;
}

const CleanPhysiotherapistCard: React.FC<PhysiotherapistCardProps> = ({ 
  physiotherapist, 
  variant = 'grid',
  availability,
  serviceTypeFilter = 'ALL',
  userLocation,
  availabilityLoading = false
}) => {
  const router = useRouter();

  const handleBookAppointment = () => {
    router.push(`/physiotherapist/${physiotherapist.id}`);
  };

  const availabilitySummary = getSmartAvailabilitySummary(availability?.availability);
  
  const getAvailabilityColor = () => {
    if (availabilityLoading) return theme.colors.gray[400];
    if (!availabilitySummary.hasAvailability) return theme.colors.gray[500];
    
    // Check if available today
    const hasToday = availabilitySummary.lines.some(line => line.includes('today'));
    return hasToday ? theme.colors.success : theme.colors.warning;
  };

  const getAvailabilityText = () => {
    if (availabilityLoading) return 'Checking availability...';
    if (!availabilitySummary.hasAvailability) return 'All slots booked';
    
    // Return the first availability line, or a shorter version for compact display
    const firstLine = availabilitySummary.lines[0];
    if (firstLine) {
      // Shorten for card display - just show the key info
      if (firstLine.includes('today')) {
        const timeMatch = firstLine.match(/from (\d+:\d+ [AP]M) - (\d+:\d+ [AP]M)/);
        if (timeMatch) {
          const serviceType = firstLine.includes('Online') ? 'Online' : 'Home visit';
          return `${serviceType} available today ${timeMatch[1]}-${timeMatch[2]}`;
        }
        return firstLine;
      } else {
        // For future dates, show when next available
        return firstLine.replace('available ', '');
      }
    }
    
    return 'Check availability';
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
                {physiotherapist.average_rating && physiotherapist.average_rating > 0 
                  ? Number(physiotherapist.average_rating).toFixed(1) 
                  : '4.5'}
              </span>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>
                ({physiotherapist.total_reviews || 'New'} reviews)
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
          {/* Availability Status */}
          <div style={{
            backgroundColor: getAvailabilityColor(),
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            maxWidth: '180px',
            overflow: 'hidden'
          }}>
            <Clock style={{ width: '12px', height: '12px', flexShrink: 0 }} />
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {getAvailabilityText()}
            </span>
          </div>
          
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
      backgroundColor: theme.colors.white,
      borderRadius: '16px',
      border: 'none',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
      position: 'relative'
    }}
    onClick={handleBookAppointment}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.06)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>

      {/* Doctor Profile Header */}
      <div style={{ 
        padding: '20px',
        background: theme.colors.white
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          {/* Profile Image */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: theme.colors.gray[50],
            flexShrink: 0,
            border: `2px solid ${theme.colors.gray[100]}`,
            position: 'relative'
          }}>
            {physiotherapist.profile_photo_url ? (
              <Image
                src={physiotherapist.profile_photo_url}
                alt={physiotherapist.full_name}
                width={72}
                height={72}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.gray[50]
              }}>
                <User style={{ width: '32px', height: '32px', color: theme.colors.gray[500] }} />
              </div>
            )}
            
            {/* Verification Badge */}
            {physiotherapist.is_verified && (
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                border: `2px solid ${theme.colors.white}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 style={{ width: '10px', height: '10px', color: '#ffffff' }} />
              </div>
            )}
          </div>

          {/* Name and Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ flex: 1, paddingRight: '8px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: theme.colors.text,
                  margin: 0,
                  marginBottom: '2px',
                  lineHeight: '1.3',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                  Dr. {physiotherapist.full_name}
                </h3>
                
                {/* Experience Only */}
                {physiotherapist.years_of_experience && (
                  <div style={{ marginTop: '2px' }}>
                    <span style={{
                      fontSize: '12px',
                      color: theme.colors.gray[600],
                      fontWeight: '500'
                    }}>
                      {physiotherapist.years_of_experience} years experience
                    </span>
                  </div>
                )}
              </div>
              
              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'transparent',
                flexShrink: 0
              }}>
                <Star style={{ width: '14px', height: '14px', color: '#FFC107', fill: '#FFC107' }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.colors.text
                }}>
                  {physiotherapist.average_rating && physiotherapist.average_rating > 0 
                    ? Number(physiotherapist.average_rating).toFixed(1) 
                    : '4.5'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations */}
      {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
        <div style={{ 
          padding: '0 20px 16px 20px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '6px',
            alignItems: 'center'
          }}>
            {physiotherapist.specializations.slice(0, 2).map((spec, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: theme.colors.gray[50],
                  color: theme.colors.gray[700],
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  border: 'none'
                }}
              >
                {formatSpecialization(spec)}
              </span>
            ))}
            {physiotherapist.specializations.length > 2 && (
              <span style={{
                color: theme.colors.gray[500],
                fontSize: '11px',
                fontWeight: '500'
              }}>
                +{physiotherapist.specializations.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Availability */}
      <div style={{ 
        padding: '16px 20px',
        borderTop: `1px solid ${theme.colors.gray[100]}`,
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#f8fafc',
          color: theme.colors.gray[700],
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          maxWidth: '100%',
          border: `1px solid ${theme.colors.gray[200]}`
        }}>
          <Clock style={{ width: '12px', height: '12px', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {availabilityLoading ? 'Checking...' : getAvailabilityText()}
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: '0 20px 16px 20px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'space-between'
        }}>
          {/* Home Visit */}
          {physiotherapist.home_visit_available && physiotherapist.home_visit_fee && (
            <div style={{
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '4px' }}>
                <Home style={{ 
                  width: '16px', 
                  height: '16px', 
                  color: theme.colors.gray[600]
                }} />
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: theme.colors.gray[500],
                marginBottom: '2px'
              }}>
                Home Visit
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: theme.colors.text
              }}>
                ₹{parseInt(physiotherapist.home_visit_fee).toLocaleString()}
              </div>
            </div>
          )}

          {/* Online */}
          {physiotherapist.online_consultation_available && physiotherapist.consultation_fee && (
            <div style={{
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '4px' }}>
                <Video style={{ 
                  width: '16px', 
                  height: '16px', 
                  color: theme.colors.gray[600]
                }} />
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: theme.colors.gray[500],
                marginBottom: '2px'
              }}>
                Online
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: theme.colors.text
              }}>
                ₹{parseInt(physiotherapist.consultation_fee).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ padding: '0 20px 20px 20px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookAppointment();
          }}
          style={{
            width: '100%',
            padding: '12px 20px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          Book Appointment
        </button>
      </div>
      
    </div>
  );
};

export default CleanPhysiotherapistCard;