'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Home, Video, User, CheckCircle2, Stethoscope } from 'lucide-react';
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

// Skeleton Loading Component
const SkeletonCard = () => (
  <div style={{
    backgroundColor: theme.colors.white,
    borderRadius: '16px',
    border: `2px solid ${theme.colors.secondary}`,
    overflow: 'hidden',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(30, 95, 121, 0.12)',
    position: 'relative'
  }}>
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Skeleton Profile Image */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '16px',
          backgroundColor: theme.colors.gray[200],
          flexShrink: 0,
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Skeleton Name */}
          <div style={{
            height: '20px',
            backgroundColor: theme.colors.gray[200],
            borderRadius: '4px',
            marginBottom: '8px',
            width: '80%',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          
          {/* Skeleton Experience & Rating */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              height: '16px',
              backgroundColor: theme.colors.gray[200],
              borderRadius: '4px',
              width: '60px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{
              height: '16px',
              backgroundColor: theme.colors.gray[200],
              borderRadius: '12px',
              width: '80px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          </div>
          
          {/* Skeleton Specializations */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '24px',
                backgroundColor: theme.colors.gray[200],
                borderRadius: '12px',
                width: `${60 + i * 10}px`,
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
    
    {/* Skeleton Availability */}
    <div style={{ 
      padding: '12px 16px',
      borderTop: `1px solid ${theme.colors.secondary}`,
      backgroundColor: theme.colors.background,
      textAlign: 'center'
    }}>
      <div style={{
        height: '32px',
        backgroundColor: theme.colors.gray[200],
        borderRadius: '20px',
        width: '80%',
        margin: '0 auto',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
    
    {/* Skeleton Pricing */}
    <div style={{ 
      padding: '14px 16px',
      borderTop: `1px solid ${theme.colors.secondary}`,
      backgroundColor: theme.colors.white,
      display: 'flex',
      justifyContent: 'space-around',
      gap: '16px'
    }}>
      {[1, 2].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: theme.colors.gray[200],
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div>
            <div style={{
              height: '12px',
              backgroundColor: theme.colors.gray[200],
              borderRadius: '4px',
              width: '50px',
              marginBottom: '4px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{
              height: '16px',
              backgroundColor: theme.colors.gray[200],
              borderRadius: '4px',
              width: '40px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          </div>
        </div>
      ))}
    </div>
    
    {/* Skeleton Button */}
    <div style={{ padding: '14px 16px 16px 16px' }}>
      <div style={{
        width: '100%',
        height: '44px',
        backgroundColor: theme.colors.gray[200],
        borderRadius: '12px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
  </div>
);

// Error Fallback Component
const ErrorCard = ({ onRetry }: { onRetry?: () => void }) => (
  <div style={{
    backgroundColor: theme.colors.white,
    borderRadius: '16px',
    border: `2px solid #fecaca`,
    overflow: 'hidden',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.12)',
    position: 'relative'
  }}>
    <div style={{ 
      padding: '32px 16px',
      textAlign: 'center',
      color: '#dc2626'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        Failed to load physiotherapist
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
        Please try again or contact support
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

const CompactPhysiotherapistCard: React.FC<PhysiotherapistCardProps> = ({ 
  physiotherapist, 
  variant = 'grid',
  availability,
  serviceTypeFilter = 'ALL',
  userLocation,
  availabilityLoading = false
}) => {
  const router = useRouter();
  
  // Error handling - if no physiotherapist data
  if (!physiotherapist || !physiotherapist.id) {
    return <ErrorCard />;
  }

  const handleBookAppointment = () => {
    router.push(`/physiotherapist/${physiotherapist.id}`);
  };

  const availabilitySummary = getSmartAvailabilitySummary(availability?.availability);
  
  // Debug logging
  console.log('=== AVAILABILITY DEBUG ===');
  console.log('Raw availability data:', availability?.availability);
  console.log('Availability summary:', availabilitySummary);
  console.log('Summary lines:', availabilitySummary.lines);
  console.log('First line:', availabilitySummary.lines[0]);
  
  const getAvailabilityColor = () => {
    if (availabilityLoading) return theme.colors.gray[400];
    if (!availabilitySummary.hasAvailability) return theme.colors.gray[500];
    
    const hasToday = availabilitySummary.lines.some(line => line.includes('today'));
    return hasToday ? theme.colors.primary : theme.colors.primaryLight;
  };

  const getBookButtonText = () => {
    if (availabilityLoading) return 'Loading...';
    if (!availabilitySummary.hasAvailability) return 'View Profile';
    
    const hasToday = availabilitySummary.lines.some(line => line.includes('today'));
    return hasToday ? 'Book Today' : 'Book Now';
  };

  const getAvailabilityText = () => {
    if (availabilityLoading) return 'Checking availability...';
    if (!availabilitySummary.hasAvailability) return 'All slots booked';
    
    // Show complete availability information - no truncation
    const allLines = availabilitySummary.lines;
    if (allLines && allLines.length > 0) {
      const fullText = allLines[0];
      console.log('getAvailabilityText returning:', fullText);
      console.log('Text length:', fullText.length);
      // Return the full first line without any modifications or truncation
      return fullText;
    }
    
    return 'Check availability';
  };

  const getFullAvailabilityText = () => {
    return getAvailabilityText();
  };

  const getDoctorTitle = () => {
    return physiotherapist.title || 'Dr.';
  };

  const formatSpecialization = (spec: string) => {
    return spec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{
      backgroundColor: theme.colors.white,
      borderRadius: '16px',
      border: `2px solid ${theme.colors.secondary}`,
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(30, 95, 121, 0.12)',
      position: 'relative'
    }}
    onClick={handleBookAppointment}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(30, 95, 121, 0.18)';
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.borderColor = theme.colors.primary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(30, 95, 121, 0.12)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = theme.colors.secondary;
    }}>

      {/* Main Content Area */}
      <div style={{ 
        padding: '16px',
        background: `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.background} 50%, ${theme.colors.white} 100%)`
      }}>
        {/* Profile Section */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Profile Image */}
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: theme.colors.gray[50],
            flexShrink: 0,
            border: `3px solid ${theme.colors.white}`,
            boxShadow: '0 4px 12px rgba(30, 95, 121, 0.15)',
            position: 'relative'
          }}>
            {physiotherapist.profile_photo_url ? (
              <Image
                src={physiotherapist.profile_photo_url}
                alt={physiotherapist.full_name}
                width={76}
                height={76}
                loading="lazy"
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
                bottom: '-6px',
                right: '-6px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: `3px solid ${theme.colors.white}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}>
                <CheckCircle2 style={{ width: '12px', height: '12px', color: '#ffffff' }} />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: 'clamp(15px, 3vw, 17px)',
              fontWeight: '700',
              color: theme.colors.text,
              margin: 0,
              marginBottom: '4px',
              lineHeight: '1.2',
              fontFamily: 'Inter, system-ui, sans-serif',
              textAlign: 'left'
            }}>
              {getDoctorTitle()} {physiotherapist.full_name}
            </h3>
            
            {/* Experience & Rating Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              {physiotherapist.years_of_experience && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Stethoscope style={{ width: '12px', height: '12px', color: theme.colors.primary }} />
                  <span style={{
                    fontSize: '12px',
                    color: theme.colors.gray[600],
                    fontWeight: '500'
                  }}>
                    {physiotherapist.years_of_experience} years
                  </span>
                </div>
              )}
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#fef3c7',
                padding: '3px 8px',
                borderRadius: '12px'
              }}>
                <Star style={{ width: '12px', height: '12px', color: '#f59e0b', fill: '#f59e0b' }} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#92400e'
                }}>
                  {physiotherapist.average_rating && physiotherapist.average_rating > 0 
                    ? Number(physiotherapist.average_rating).toFixed(1) 
                    : '4.5'}
                </span>
                <span style={{ fontSize: '10px', color: '#92400e', fontWeight: '500' }}>
                  ({physiotherapist.total_reviews || '847'})
                </span>
              </div>
            </div>

            {/* Specializations */}
            {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px',
                marginTop: '8px'
              }}>
                {(Array.isArray(physiotherapist.specializations) ? physiotherapist.specializations : []).slice(0, 3).map((spec, index) => (
                  <span 
                    key={index}
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: 'clamp(10px, 2.5vw, 12px)',
                      fontWeight: '600',
                      border: `1px solid ${theme.colors.primaryLight}`,
                      lineHeight: 1
                    }}
                  >
                    {formatSpecialization(spec)}
                  </span>
                ))}
                {physiotherapist.specializations.length > 3 && (
                  <span style={{
                    fontSize: 'clamp(10px, 2.5vw, 12px)',
                    color: theme.colors.gray[500],
                    fontWeight: '500'
                  }}>
                    +{physiotherapist.specializations.length - 3} more
                  </span>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div style={{ 
        padding: '14px 16px',
        borderTop: `1px solid ${theme.colors.secondary}`,
        backgroundColor: theme.colors.background
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          fontSize: '13px',
          color: theme.colors.text,
          lineHeight: '1.4',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <Clock style={{ 
            width: '14px', 
            height: '14px', 
            flexShrink: 0, 
            marginTop: '1px',
            color: theme.colors.primary
          }} />
          <div style={{ 
            flex: 1,
            wordBreak: 'break-word'
          }}>
            {getFullAvailabilityText()}
          </div>
        </div>
      </div>

      {/* Pricing Row */}
      <div style={{ 
        padding: '14px 16px',
        borderTop: `1px solid ${theme.colors.secondary}`,
        backgroundColor: theme.colors.white,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Home Visit */}
        {physiotherapist.home_visit_available && physiotherapist.home_visit_fee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: `${theme.colors.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Home style={{ 
                width: '16px', 
                height: '16px', 
                color: theme.colors.primary
              }} />
            </div>
            <div>
              <div style={{
                fontSize: 'clamp(9px, 2vw, 10px)',
                color: theme.colors.gray[500],
                lineHeight: 1,
                fontWeight: '500'
              }}>
                Home Visit
              </div>
              <div style={{
                fontSize: 'clamp(13px, 3vw, 15px)',
                fontWeight: '700',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: `${theme.colors.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Video style={{ 
                width: '16px', 
                height: '16px', 
                color: theme.colors.primary
              }} />
            </div>
            <div>
              <div style={{
                fontSize: 'clamp(9px, 2vw, 10px)',
                color: theme.colors.gray[500],
                lineHeight: 1,
                fontWeight: '500'
              }}>
                Online
              </div>
              <div style={{
                fontSize: 'clamp(13px, 3vw, 15px)',
                fontWeight: '700',
                color: theme.colors.primary,
                lineHeight: 1
              }}>
                ₹{parseInt(physiotherapist.consultation_fee).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Book Button */}
      <div style={{ 
        padding: '16px',
        backgroundColor: theme.colors.white
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookAppointment();
          }}
          style={{
            width: '100%',
            padding: '16px 20px',
            background: theme.gradients.primary,
            color: theme.colors.white,
            border: 'none',
            borderRadius: '16px',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: '52px',
            boxShadow: '0 6px 20px rgba(30, 95, 121, 0.25)',
            fontFamily: 'Inter, system-ui, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(30, 95, 121, 0.35)';
            e.currentTarget.style.background = `linear-gradient(135deg, ${theme.colors.primaryDark}, ${theme.colors.primary})`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 95, 121, 0.25)';
            e.currentTarget.style.background = theme.gradients.primary;
          }}
        >
          {getBookButtonText()}
        </button>
      </div>
      
      {/* Responsive Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default CompactPhysiotherapistCard;
export { SkeletonCard, ErrorCard };