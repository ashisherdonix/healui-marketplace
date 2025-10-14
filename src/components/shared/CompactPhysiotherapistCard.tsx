'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Home, Video, User, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { theme } from '@/utils/theme';
import { PhysiotherapistBatchAvailability } from '@/lib/types';
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

const CompactPhysiotherapistCard: React.FC<PhysiotherapistCardProps> = ({ 
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
    
    const hasToday = availabilitySummary.lines.some(line => line.includes('today'));
    return hasToday ? theme.colors.primary : theme.colors.primaryLight;
  };

  const getAvailabilityText = () => {
    if (availabilityLoading) return 'Checking availability...';
    if (!availabilitySummary.hasAvailability) return 'All slots booked';
    
    const firstLine = availabilitySummary.lines[0];
    if (firstLine) {
      if (firstLine.includes('today')) {
        const timeMatch = firstLine.match(/from (\d+:\d+ [AP]M) - (\d+:\d+ [AP]M)/);
        if (timeMatch) {
          const serviceType = firstLine.includes('Online') ? 'Online' : 'Home visit';
          return `${serviceType} available today ${timeMatch[1]}-${timeMatch[2]}`;
        }
        return firstLine;
      } else {
        return firstLine.replace('available ', '');
      }
    }
    
    return 'Check availability';
  };

  const formatSpecialization = (spec: string) => {
    return spec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{
      backgroundColor: theme.colors.white,
      borderRadius: '12px',
      border: `1px solid ${theme.colors.secondary}`,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 12px rgba(30, 95, 121, 0.1)',
      position: 'relative'
    }}
    onClick={handleBookAppointment}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(30, 95, 121, 0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = theme.colors.primary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 12px rgba(30, 95, 121, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = theme.colors.secondary;
    }}>

      {/* Main Content Area */}
      <div style={{ 
        padding: '14px',
        background: `linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.white})`
      }}>
        {/* Profile Section */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Profile Image */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: theme.colors.gray[50],
            flexShrink: 0,
            border: `2px solid ${theme.colors.secondary}`,
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
                <User style={{ width: '24px', height: '24px', color: theme.colors.gray[500] }} />
              </div>
            )}
            
            {/* Verification Badge */}
            {physiotherapist.is_verified && (
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary,
                border: `2px solid ${theme.colors.white}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 style={{ width: '10px', height: '10px', color: '#ffffff' }} />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: theme.colors.text,
              margin: 0,
              marginBottom: '2px',
              lineHeight: '1.2',
              fontFamily: 'Inter, system-ui, sans-serif',
              textAlign: 'left'
            }}>
              Dr. {physiotherapist.full_name}
            </h3>
            
            {/* Experience & Rating Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {physiotherapist.years_of_experience && (
                <span style={{
                  fontSize: '12px',
                  color: theme.colors.gray[600],
                  fontWeight: '500'
                }}>
                  {physiotherapist.years_of_experience} yrs exp
                </span>
              )}
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Star style={{ width: '11px', height: '11px', color: theme.colors.primary, fill: theme.colors.primary }} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme.colors.text
                }}>
                  {physiotherapist.average_rating && physiotherapist.average_rating > 0 
                    ? Number(physiotherapist.average_rating).toFixed(1) 
                    : '4.5'}
                </span>
                <span style={{ fontSize: '10px', color: theme.colors.gray[500] }}>
                  ({physiotherapist.total_reviews || '0'})
                </span>
              </div>
            </div>

            {/* Specializations */}
            {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px',
                marginTop: '6px'
              }}>
                {(Array.isArray(physiotherapist.specializations) ? physiotherapist.specializations : []).map((spec, index) => (
                  <span 
                    key={index}
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '9px',
                      fontWeight: '500',
                      border: 'none'
                    }}
                  >
                    {formatSpecialization(spec)}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Availability Section - Keep Original Styling */}
      <div style={{ 
        padding: '10px 14px',
        borderTop: `1px solid ${theme.colors.secondary}`,
        backgroundColor: theme.colors.background,
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: getAvailabilityColor(),
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '11px',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          maxWidth: '100%'
        }}>
          <Clock style={{ width: '11px', height: '11px', flexShrink: 0 }} />
          <span style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {getAvailabilityText()}
          </span>
        </div>
      </div>

      {/* Pricing Row */}
      <div style={{ 
        padding: '12px 14px',
        borderTop: `1px solid ${theme.colors.secondary}`,
        backgroundColor: theme.colors.white,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Home Visit */}
        {physiotherapist.home_visit_available && physiotherapist.home_visit_fee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Home style={{ 
              width: '14px', 
              height: '14px', 
              color: theme.colors.primary
            }} />
            <div>
              <div style={{
                fontSize: '9px',
                color: theme.colors.gray[500],
                lineHeight: 1
              }}>
                Home Visit
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: theme.colors.primary,
                lineHeight: 1
              }}>
                ₹{parseInt(physiotherapist.home_visit_fee).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Online */}
        {physiotherapist.online_consultation_available && physiotherapist.consultation_fee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Video style={{ 
              width: '14px', 
              height: '14px', 
              color: theme.colors.primary
            }} />
            <div>
              <div style={{
                fontSize: '9px',
                color: theme.colors.gray[500],
                lineHeight: 1
              }}>
                Online
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: theme.colors.primary,
                lineHeight: 1
              }}>
                ₹{parseInt(physiotherapist.consultation_fee).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book Button */}
      <div style={{ padding: '12px 14px 14px 14px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookAppointment();
          }}
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: theme.colors.primary,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
          }}
        >
          Book Appointment
        </button>
      </div>
      
    </div>
  );
};

export default CompactPhysiotherapistCard;