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
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #E5E7EB',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}
    onClick={handleBookAppointment}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = theme.colors.primary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = theme.colors.gray[200];
    }}>
      {/* Header with Cover Image */}
      <div style={{ 
        position: 'relative',
        height: '120px',
        background: theme.gradients.card,
        overflow: 'hidden'
      }}>
        {physiotherapist.cover_photo_url && (
          <Image
            src={physiotherapist.cover_photo_url}
            alt="Cover"
            fill
            style={{ objectFit: 'cover' }}
            sizes="400px"
          />
        )}
        
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.gradients.overlay
        }} />

        {/* Verification Badge */}
        {physiotherapist.is_verified && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.colors.primary
          }}>
            <CheckCircle2 style={{ width: '14px', height: '14px' }} />
            Verified
          </div>
        )}

        {/* Profile Image */}
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '20px',
          width: '80px',
          height: '80px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#F3F4F6',
          border: '4px solid white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
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
              <User style={{
                width: '32px',
                height: '32px',
                color: '#9CA3AF'
              }} />
            </div>
          )}
          
          {/* Availability Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: getAvailabilityColor(),
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }} />
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', paddingTop: '40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name and Rating */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: theme.colors.text,
            margin: 0,
            marginBottom: '4px'
          }}>
            Dr. {physiotherapist.full_name}
          </h3>
          
          {/* Rating and Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star style={{
                width: '16px',
                height: '16px',
                color: '#F59E0B',
                fill: '#F59E0B'
              }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                {physiotherapist.average_rating > 0 ? physiotherapist.average_rating.toFixed(1) : 'New'}
              </span>
            </div>
            <span style={{
              fontSize: '13px',
              color: '#6B7280'
            }}>
              ({physiotherapist.total_reviews} reviews)
            </span>
            
            {/* Experience Badge */}
            {physiotherapist.years_of_experience && (
              <div style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.primary,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                marginLeft: 'auto'
              }}>
                <Award style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                {physiotherapist.years_of_experience}y exp
              </div>
            )}
          </div>

          {/* Availability Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar style={{ width: '14px', height: '14px', color: getAvailabilityColor() }} />
            <span style={{ 
              fontSize: '13px', 
              color: getAvailabilityColor(),
              fontWeight: '500'
            }}>
              {getAvailabilityText()}
            </span>
          </div>
        </div>

        {/* Specializations */}
        {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {physiotherapist.specializations.slice(0, 3).map((spec, index) => (
                <span key={index} style={{
                  padding: '4px 10px',
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: `1px solid ${theme.colors.primary}`
                }}>
                  {formatSpecialization(spec)}
                </span>
              ))}
              {physiotherapist.specializations.length > 3 && (
                <span style={{
                  padding: '4px 10px',
                  backgroundColor: '#F3F4F6',
                  color: '#6B7280',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  +{physiotherapist.specializations.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Location and Service Areas */}
        <div style={{ marginBottom: '16px' }}>
          {physiotherapist.practice_address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <MapPin style={{ width: '14px', height: '14px', color: '#6B7280' }} />
              <span style={{ 
                fontSize: '13px', 
                color: '#4B5563',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {physiotherapist.practice_address}
              </span>
            </div>
          )}
          {physiotherapist.service_areas && (
            <div style={{ 
              fontSize: '12px', 
              color: '#6B7280',
              marginLeft: '20px'
            }}>
              Service areas: {physiotherapist.service_areas}
            </div>
          )}
        </div>

        {/* Bio Preview */}
        {physiotherapist.bio && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              lineHeight: '1.4',
              margin: 0,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {physiotherapist.bio}
            </p>
          </div>
        )}

        {/* Services & Pricing */}
        <div style={{ 
          borderTop: '1px solid #F3F4F6',
          paddingTop: '16px',
          marginTop: 'auto'
        }}>
          {/* Services Available */}
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            marginBottom: '12px'
          }}>
            {physiotherapist.home_visit_available !== false && (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: theme.colors.background,
                color: theme.colors.primary,
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <Home style={{ width: '12px', height: '12px' }} />
                Home Visit
              </div>
            )}
            {physiotherapist.online_consultation_available !== false && (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <Video style={{ width: '12px', height: '12px' }} />
                Online
              </div>
            )}
          </div>

          {/* Pricing */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Starting from</div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1F2937'
              }}>
                {formatPrice(physiotherapist.consultation_fee)}
              </div>
            </div>
            
            {physiotherapist.home_visit_fee && physiotherapist.home_visit_fee !== physiotherapist.consultation_fee && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Home visit</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: theme.colors.primary
                }}>
                  {formatPrice(physiotherapist.home_visit_fee)}
                </div>
              </div>
            )}
          </div>

          {/* Book Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBookAppointment();
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: theme.gradients.primary,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 12px rgba(30, 95, 121, 0.3)`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(30, 95, 121, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 95, 121, 0.3)';
            }}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CleanPhysiotherapistCard;