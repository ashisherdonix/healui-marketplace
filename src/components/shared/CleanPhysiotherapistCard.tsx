'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Shield, Calendar, Home, Video, User, Award, CheckCircle2, Zap, AlertTriangle, TrendingUp, Tag, Gift, Percent } from 'lucide-react';
import Image from 'next/image';
import { theme } from '@/utils/theme';
import { PhysiotherapistBatchAvailability } from '@/lib/types';
import AvailabilityBadge from '@/components/availability/AvailabilityBadge';
import PricingDisplay from '@/components/availability/PricingDisplay';

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

  const getTodayAvailability = () => {
    if (!availability?.availability) return null;
    
    const today = new Date().toISOString().split('T')[0];
    const todaySlots = availability.availability[today];
    
    // Check home visit slots for today
    if (todaySlots?.home_visit?.length > 0) {
      const availableSlots = todaySlots.home_visit.filter(slot => slot.is_available);
      if (availableSlots.length > 0) {
        const formatTime = (time: string) => {
          const [hours, minutes] = time.split(':');
          const hour = parseInt(hours);
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${displayHour}:${minutes} ${period}`;
        };
        
        const firstSlot = availableSlots[0];
        const lastSlot = availableSlots[availableSlots.length - 1];
        
        return {
          startTime: formatTime(firstSlot.start_time),
          endTime: formatTime(lastSlot.end_time),
          count: availableSlots.length
        };
      }
    }
    return null;
  };

  const calculateDiscount = () => {
    if (!availability?.pricing?.home_visit?.zone_breakdown) return null;
    
    const breakdown = availability.pricing.home_visit.zone_breakdown;
    const yellowCharge = breakdown.yellow?.extra_charge || 0;
    const redCharge = breakdown.red?.extra_charge || 0;
    const maxSaving = Math.max(yellowCharge, redCharge);
    
    return maxSaving > 0 ? maxSaving : null;
  };

  const todayAvailability = getTodayAvailability();
  const discount = calculateDiscount();
  const isInGreenZone = availability?.pricing?.home_visit?.zone_extra_charge === 0;

  return (
    <div style={{
      backgroundColor: theme.colors.white,
      borderRadius: '12px',
      border: `1px solid ${theme.colors.gray[200]}`,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'relative'
    }}
    onClick={handleBookAppointment}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = theme.colors.primary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = theme.colors.gray[200];
    }}>

      {/* Doctor Profile Header */}
      <div style={{ 
        padding: '20px 20px 16px 20px',
        background: theme.colors.white
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          {/* Profile Image */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: theme.colors.gray[100],
            flexShrink: 0,
            border: `3px solid ${theme.colors.white}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
                backgroundColor: theme.colors.gray[200]
              }}>
                <User style={{ width: '32px', height: '32px', color: theme.colors.gray[500] }} />
              </div>
            )}
            
            {/* Verification Badge */}
            {physiotherapist.is_verified && (
              <div style={{
                position: 'absolute',
                bottom: '-3px',
                right: '-3px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: theme.colors.success,
                border: `3px solid ${theme.colors.white}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 style={{ width: '12px', height: '12px', color: '#ffffff' }} />
              </div>
            )}
          </div>

          {/* Name and Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ flex: 1, paddingRight: '8px' }}>
                <h3 style={{
                  fontSize: '19px',
                  fontWeight: '700',
                  color: theme.colors.text,
                  margin: 0,
                  marginBottom: '6px',
                  lineHeight: '1.3',
                  fontFamily: '"IBM Plex Sans", Inter, system-ui, sans-serif'
                }}>
                  Dr. {physiotherapist.full_name}
                </h3>
                
                {/* Experience Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  <Award style={{ width: '12px', height: '12px' }} />
                  {physiotherapist.years_of_experience || 5} years experience
                </div>
              </div>
              
              {/* Rating - Right aligned */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: theme.colors.gray[50],
                padding: '6px 10px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.gray[200]}`,
                flexShrink: 0
              }}>
                <Star style={{ width: '14px', height: '14px', color: '#FFC107', fill: '#FFC107' }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: theme.colors.text
                }}>
                  {physiotherapist.average_rating && physiotherapist.average_rating > 0 
                    ? Number(physiotherapist.average_rating).toFixed(1) 
                    : '4.5'}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: theme.colors.gray[600]
                }}>
                  ({physiotherapist.total_reviews || 'New'})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations Section */}
      {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
        <div style={{ 
          padding: '0 20px 18px 20px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            alignItems: 'center'
          }}>
            {physiotherapist.specializations.slice(0, 3).map((spec, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: theme.colors.gray[100],
                  color: theme.colors.gray[700],
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: `1px solid ${theme.colors.gray[200]}`,
                  lineHeight: '1.2'
                }}
              >
                {formatSpecialization(spec)}
              </span>
            ))}
            {physiotherapist.specializations.length > 3 && (
              <span style={{
                color: theme.colors.gray[500],
                fontSize: '12px',
                fontWeight: '500',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                lineHeight: '1.2'
              }}>
                +{physiotherapist.specializations.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Availability Section */}
      <div style={{ 
        padding: '16px 20px',
        borderTop: `1px solid ${theme.colors.gray[200]}`,
        backgroundColor: theme.colors.gray[25] || '#fafafa'
      }}>
        {/* Availability Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          {todayAvailability ? (
            <>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: theme.colors.success
              }} />
              <span style={{ 
                fontSize: '13px', 
                color: theme.colors.success, 
                fontWeight: '700'
              }}>
                Available Today
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: theme.colors.gray[600]
              }}>
                • {todayAvailability.startTime} - {todayAvailability.endTime}
              </span>
            </>
          ) : (
            <>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: theme.colors.warning
              }} />
              <span style={{ 
                fontSize: '13px', 
                color: theme.colors.warning, 
                fontWeight: '700'
              }}>
                High Demand
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: theme.colors.gray[600]
              }}>
                • Book for tomorrow
              </span>
            </>
          )}
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div style={{ padding: '0 20px 16px 20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: (availability?.pricing?.home_visit && availability?.pricing?.online) 
            ? '1fr 1fr' 
            : '1fr',
          gap: '12px'
        }}>
          {/* Home Visit Pricing Card */}
          {availability?.pricing?.home_visit && (
            <div style={{
              backgroundColor: theme.colors.white,
              border: `2px solid ${isInGreenZone && discount ? theme.colors.success : theme.colors.gray[200]}`,
              borderRadius: '12px',
              padding: '16px',
              position: 'relative',
              textAlign: 'center'
            }}>
              {/* Discount Badge */}
              {isInGreenZone && discount && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '8px',
                  backgroundColor: theme.colors.success,
                  color: theme.colors.white,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}>
                  {Math.round((discount / (parseFloat(availability.pricing.home_visit.total) + discount)) * 100)}% OFF
                </div>
              )}
              
              <div style={{ marginBottom: '8px' }}>
                <Home style={{ 
                  width: '20px', 
                  height: '20px', 
                  color: theme.colors.primary,
                  margin: '0 auto'
                }} />
              </div>
              
              <div style={{ marginBottom: '4px' }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: theme.colors.gray[600],
                  fontWeight: '500'
                }}>
                  Home Visit
                </span>
              </div>
              
              {isInGreenZone && discount ? (
                <div style={{ marginBottom: '4px' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    color: theme.colors.gray[500], 
                    textDecoration: 'line-through',
                    fontWeight: '500'
                  }}>
                    ₹{(parseFloat(availability.pricing.home_visit.total) + discount).toLocaleString()}
                  </div>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: theme.colors.success
                  }}>
                    ₹{parseFloat(availability.pricing.home_visit.total).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: theme.colors.text,
                  marginBottom: '4px'
                }}>
                  ₹{parseFloat(availability.pricing.home_visit.total).toLocaleString()}
                </div>
              )}
              
              <div style={{ 
                fontSize: '11px', 
                color: theme.colors.gray[500],
                fontWeight: '500'
              }}>
                per session
              </div>
            </div>
          )}

          {/* Online Pricing Card */}
          {availability?.pricing?.online && (
            <div style={{
              backgroundColor: theme.colors.white,
              border: `2px solid ${theme.colors.gray[200]}`,
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <Video style={{ 
                  width: '20px', 
                  height: '20px', 
                  color: theme.colors.primary,
                  margin: '0 auto'
                }} />
              </div>
              
              <div style={{ marginBottom: '4px' }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: theme.colors.gray[600],
                  fontWeight: '500'
                }}>
                  Online
                </span>
              </div>
              
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: theme.colors.text,
                marginBottom: '4px'
              }}>
                ₹{parseFloat(availability.pricing.online.total).toLocaleString()}
              </div>
              
              <div style={{ 
                fontSize: '11px', 
                color: theme.colors.gray[500],
                fontWeight: '500'
              }}>
                per session
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced CTA Button */}
      <div style={{ padding: '0 20px 20px 20px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookAppointment();
          }}
          style={{
            width: '100%',
            padding: '14px 20px',
            minHeight: '52px',
            backgroundColor: theme.colors.primary,
            color: theme.colors.white,
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(30, 95, 121, 0.25)',
            letterSpacing: '0.01em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(30, 95, 121, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 95, 121, 0.25)';
          }}
        >
          {todayAvailability ? (
            <>
              <Calendar style={{ width: '18px', height: '18px' }} />
              Book Today's Slot
            </>
          ) : (
            <>
              View Profile & Book
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CleanPhysiotherapistCard;