'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import Button from '@/components/button';
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Calendar as CalendarIcon,
  CheckCircle,
  Home,
  Video,
  Shield,
  User,
  Briefcase,
  Heart
} from 'lucide-react';
import Image from 'next/image';

interface PhysiotherapistCardProps {
  physiotherapist: {
    id: string;
    full_name: string;
    specializations?: string[];
    years_of_experience?: number;
    average_rating: number;
    total_reviews: number;
    practice_address?: string;
    location?: string;
    consultation_fee?: number;
    home_visit_fee?: number;
    online_consultation_fee?: number;
    profile_picture?: string;
    profile_photo_url?: string;
    availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    next_available_slot?: string;
    is_verified?: boolean;
    home_visit_available?: boolean;
    online_consultation_available?: boolean;
    bio?: string;
    gender?: string;
    service_areas?: string[];
  };
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
}

const PhysiotherapistCard: React.FC<PhysiotherapistCardProps> = ({ 
  physiotherapist, 
  variant = 'default',
  showActions = true 
}) => {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/physiotherapist/${physiotherapist.id}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '0.125rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{
              width: '0.875rem',
              height: '0.875rem',
              color: star <= rating ? '#FFB800' : 'var(--lk-outline)',
              fill: star <= rating ? '#FFB800' : 'none'
            }}
          />
        ))}
      </div>
    );
  };

  const getAvailabilityStatus = () => {
    switch (physiotherapist.availability_status) {
      case 'AVAILABLE':
        return { text: 'Available today', color: 'var(--lk-tertiary)', icon: CheckCircle };
      case 'BUSY':
        return { text: 'Next available tomorrow', color: 'var(--lk-secondary)', icon: Clock };
      case 'OFFLINE':
        return { text: 'Currently offline', color: 'var(--lk-onsurfacevariant)', icon: Clock };
      default:
        return { text: 'Available today', color: 'var(--lk-tertiary)', icon: CheckCircle };
    }
  };

  const availability = getAvailabilityStatus();
  const AvailabilityIcon = availability.icon;

  if (variant === 'compact') {
    return (
      <Card variant="fill" scaleFactor="heading">
        <div className="p-md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Avatar */}
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: physiotherapist.profile_photo_url || physiotherapist.profile_picture ? 'transparent' : 'var(--lk-primarycontainer)'
            }}>
              {(physiotherapist.profile_photo_url || physiotherapist.profile_picture) ? (
                <Image
                  src={physiotherapist.profile_photo_url || physiotherapist.profile_picture || ''}
                  alt={`Dr. ${physiotherapist.full_name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="40px"
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span className="lk-typography-body-large" style={{ 
                    color: 'var(--lk-onprimarycontainer)',
                    fontWeight: '500'
                  }}>
                    {physiotherapist.full_name?.charAt(0) || 'D'}
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.25rem',
                fontWeight: '500'
              }}>
                Dr. {physiotherapist.full_name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {renderStars(physiotherapist.average_rating)}
                <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                  {physiotherapist.average_rating.toFixed(1)} ({physiotherapist.total_reviews})
                </span>
              </div>
            </div>

            {/* Price */}
            <div style={{ textAlign: 'right' }}>
              {physiotherapist.consultation_fee && (
                <div className="lk-typography-body-medium" style={{ color: 'var(--lk-primary)', fontWeight: '500' }}>
                  ₹{physiotherapist.consultation_fee}
                </div>
              )}
              <Button
                variant="fill"
                size="sm"
                color="primary"
                onClick={handleViewProfile}
              >
                Book
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card variant="fill" scaleFactor="heading">
        <div className="p-lg">
          {/* Header with Badge */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            {physiotherapist.is_verified && (
              <div style={{
                position: 'absolute',
                top: '-0.5rem',
                right: '-0.5rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: 'var(--lk-tertiary)',
                color: 'var(--lk-ontertiary)',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                zIndex: 1
              }}>
                Verified
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Avatar */}
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: physiotherapist.profile_photo_url || physiotherapist.profile_picture ? 'transparent' : 'var(--lk-primary)'
              }}>
                {(physiotherapist.profile_photo_url || physiotherapist.profile_picture) ? (
                  <Image
                    src={physiotherapist.profile_photo_url || physiotherapist.profile_picture || ''}
                    alt={`Dr. ${physiotherapist.full_name}`}
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
                    justifyContent: 'center'
                  }}>
                    <span className="lk-typography-title-medium" style={{ color: 'var(--lk-onprimary)' }}>
                      {physiotherapist.full_name?.charAt(0) || 'D'}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Rating */}
              <div style={{ flex: 1 }}>
                <div className="lk-typography-title-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.25rem'
                }}>
                  Dr. {physiotherapist.full_name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {renderStars(physiotherapist.average_rating)}
                  <span className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                    {physiotherapist.average_rating.toFixed(1)} ({physiotherapist.total_reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations */}
          {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {physiotherapist.specializations.slice(0, 3).map((spec, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'var(--lk-primarycontainer)',
                      color: 'var(--lk-onprimarycontainer)',
                      borderRadius: '1rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    {spec}
                  </span>
                ))}
                {physiotherapist.specializations.length > 3 && (
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'var(--lk-surfacevariant)',
                      color: 'var(--lk-onsurfacevariant)',
                      borderRadius: '1rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    +{physiotherapist.specializations.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Services */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home style={{ width: '1rem', height: '1rem', color: 'var(--lk-primary)' }} />
              <span className="lk-typography-body-small">Home Visit</span>
              <span className="lk-typography-body-small" style={{ color: 'var(--lk-primary)', fontWeight: '500' }}>
                {physiotherapist.home_visit_fee || physiotherapist.consultation_fee ? `₹${physiotherapist.home_visit_fee || physiotherapist.consultation_fee}` : ''}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video style={{ width: '1rem', height: '1rem', color: 'var(--lk-secondary)' }} />
              <span className="lk-typography-body-small">Online</span>
              <span className="lk-typography-body-small" style={{ color: 'var(--lk-secondary)', fontWeight: '500' }}>
                {physiotherapist.online_consultation_fee ? `₹${physiotherapist.online_consultation_fee}` : (physiotherapist.consultation_fee ? `₹${physiotherapist.consultation_fee - 100}` : '')}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {physiotherapist.years_of_experience && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award style={{ width: '0.875rem', height: '0.875rem', color: 'var(--lk-onsurfacevariant)' }} />
                <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurface)' }}>
                  {physiotherapist.years_of_experience} years experience
                </span>
              </div>
            )}
            {(physiotherapist.practice_address || physiotherapist.location) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin style={{ width: '0.875rem', height: '0.875rem', color: 'var(--lk-onsurfacevariant)' }} />
                <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurface)' }}>
                  {physiotherapist.practice_address || physiotherapist.location}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AvailabilityIcon style={{ width: '0.875rem', height: '0.875rem', color: availability.color }} />
              <span className="lk-typography-body-small" style={{ color: availability.color }}>
                {availability.text}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {showActions && (
            <Button
              variant="fill"
              size="lg"
              color="primary"
              onClick={handleViewProfile}
              style={{ width: '100%' }}
            >
              View Profile & Book
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Default variant - Product Designer Enhanced
  return (
    <Card variant="fill" scaleFactor="heading">
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Modern Gradient Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: 0.1,
          zIndex: 0
        }} />
        
        <div className="p-lg" style={{ position: 'relative', zIndex: 1 }}>
          {/* Verification Badge - Enhanced Position */}
          {physiotherapist.is_verified && (
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.375rem 0.75rem',
              backgroundColor: '#00A859',
              color: 'white',
              borderRadius: '1.5rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(0, 168, 89, 0.3)',
              zIndex: 2
            }}>
              <Shield style={{ width: '0.75rem', height: '0.75rem' }} />
              Verified Pro
            </div>
          )}

          {/* Enhanced Profile Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', paddingTop: '0.5rem' }}>
            {/* Premium Profile Picture */}
            <div style={{
              position: 'relative',
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              flexShrink: 0,
              border: '4px solid white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              background: (physiotherapist.profile_photo_url || physiotherapist.profile_picture) ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              {(physiotherapist.profile_photo_url || physiotherapist.profile_picture) ? (
                <>
                  <Image
                    src={physiotherapist.profile_photo_url || physiotherapist.profile_picture || ''}
                    alt={`Dr. ${physiotherapist.full_name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="80px"
                  />
                  {/* Online Status Indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0.25rem',
                    right: '0.25rem',
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    backgroundColor: physiotherapist.availability_status === 'AVAILABLE' ? '#00C851' : '#FF6B35',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }} />
                </>
              ) : (
                <>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="lk-typography-title-large" style={{ 
                      color: 'white',
                      fontWeight: '700'
                    }}>
                      {physiotherapist.full_name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  {/* Online Status for Initials */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0.25rem',
                    right: '0.25rem',
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    backgroundColor: physiotherapist.availability_status === 'AVAILABLE' ? '#00C851' : '#FF6B35',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }} />
                </>
              )}
            </div>

            {/* Enhanced Name, Rating & Info Section */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name and Gender */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h3 className="lk-typography-title-large" style={{ 
                    color: 'var(--lk-onsurface)',
                    margin: 0,
                    fontWeight: '700'
                  }}>
                    Dr. {physiotherapist.full_name}
                  </h3>
                  {physiotherapist.gender && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: physiotherapist.gender === 'M' ? '#E3F2FD' : '#FCE4EC',
                      color: physiotherapist.gender === 'M' ? '#1976D2' : '#C2185B',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {physiotherapist.gender === 'M' ? 'Male' : 'Female'}
                    </span>
                  )}
                </div>
                
                {/* Professional Title */}
                {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
                  <div className="lk-typography-body-medium" style={{ 
                    color: 'var(--lk-onsurfacevariant)',
                    fontWeight: '500'
                  }}>
                    {physiotherapist.specializations[0]} Specialist
                  </div>
                )}
              </div>
              
              {/* Enhanced Rating Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#FFF8E1',
                  borderRadius: '1.5rem',
                  border: '1px solid #FFE082'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {renderStars(physiotherapist.average_rating || 0)}
                  </div>
                  <span className="lk-typography-body-medium" style={{ 
                    color: '#F57C00', 
                    fontWeight: '700'
                  }}>
                    {(physiotherapist.average_rating || 0).toFixed(1)}
                  </span>
                  <span className="lk-typography-body-small" style={{ color: '#E65100' }}>
                    ({physiotherapist.total_reviews || 0})
                  </span>
                </div>

                {/* Experience Chip */}
                {physiotherapist.years_of_experience && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    backgroundColor: '#E8F5E8',
                    color: '#2E7D32',
                    borderRadius: '1.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    border: '1px solid #A5D6A7'
                  }}>
                    <Award style={{ width: '0.75rem', height: '0.75rem' }} />
                    {physiotherapist.years_of_experience}+ years
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Premium Specializations Display */}
          {physiotherapist.specializations && physiotherapist.specializations.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.75rem',
                fontWeight: '600'
              }}>
                Specializations
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {physiotherapist.specializations.slice(0, 3).map((spec, index) => {
                  const colors = [
                    { bg: '#667eea', text: 'white' },
                    { bg: '#764ba2', text: 'white' },
                    { bg: '#f093fb', text: 'white' }
                  ];
                  const color = colors[index] || { bg: 'var(--lk-surfacevariant)', text: 'var(--lk-onsurfacevariant)' };
                  
                  return (
                    <span
                      key={index}
                      style={{
                        padding: '0.5rem 1rem',
                        background: index < 3 ? `linear-gradient(135deg, ${color.bg}, ${color.bg}dd)` : color.bg,
                        color: color.text,
                        borderRadius: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        boxShadow: index < 3 ? `0 2px 8px ${color.bg}40` : 'none'
                      }}
                    >
                      {spec}
                    </span>
                  );
                })}
                {physiotherapist.specializations.length > 3 && (
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'var(--lk-outline)',
                      color: 'var(--lk-onsurfacevariant)',
                      borderRadius: '2rem',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    +{physiotherapist.specializations.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Premium Service Indicators */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="lk-typography-body-medium" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Available Services
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {/* Home Visit Service */}
              {physiotherapist.home_visit_available !== false && (
                <div style={{
                  position: 'relative',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  borderRadius: '1rem',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)'
                }}>
                  <Home style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem' }} />
                  <div className="lk-typography-body-small" style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Home Visit
                  </div>
                  {(physiotherapist.home_visit_fee || physiotherapist.consultation_fee) && (
                    <div className="lk-typography-body-small" style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                      from ₹{physiotherapist.home_visit_fee || physiotherapist.consultation_fee}
                    </div>
                  )}
                </div>
              )}

              {/* Online Consultation */}
              {physiotherapist.online_consultation_available !== false && (
                <div style={{
                  position: 'relative',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                  borderRadius: '1rem',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(74, 144, 226, 0.3)'
                }}>
                  <Video style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem' }} />
                  <div className="lk-typography-body-small" style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Online
                  </div>
                  {physiotherapist.consultation_fee && (
                    <div className="lk-typography-body-small" style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                      from ₹{physiotherapist.consultation_fee - 100}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        {/* Bio Preview */}
        {physiotherapist.bio && (
          <div style={{ marginBottom: '1.25rem' }}>
            <p className="lk-typography-body-small" style={{ 
              color: 'var(--lk-onsurfacevariant)',
              lineHeight: '1.4',
              margin: 0
            }}>
              {physiotherapist.bio.length > 120 ? `${physiotherapist.bio.substring(0, 120)}...` : physiotherapist.bio}
            </p>
          </div>
        )}

        {/* Location & Availability */}
        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {physiotherapist.practice_address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
              <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurface)' }}>
                {physiotherapist.practice_address}
              </span>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AvailabilityIcon style={{ width: '1rem', height: '1rem', color: availability.color }} />
            <span className="lk-typography-body-small" style={{ color: availability.color, fontWeight: '500' }}>
              {availability.text}
            </span>
          </div>
        </div>

          {/* Premium Pricing and CTA Section */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '1rem',
            padding: '1.25rem',
            marginTop: '0.5rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div>
                <div className="lk-typography-body-small" style={{ 
                  color: 'var(--lk-onsurfacevariant)',
                  marginBottom: '0.375rem',
                  fontWeight: '500'
                }}>
                  Starting from
                </div>
                {physiotherapist.consultation_fee && (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span className="lk-typography-title-large" style={{ 
                      color: '#00A859',
                      fontWeight: '800'
                    }}>
                      ₹{physiotherapist.consultation_fee}
                    </span>
                    <span className="lk-typography-body-small" style={{ 
                      color: 'var(--lk-onsurfacevariant)',
                      textDecoration: 'line-through'
                    }}>
                      ₹{physiotherapist.consultation_fee + 200}
                    </span>
                  </div>
                )}
                
                {/* Availability Status */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  marginTop: '0.5rem'
                }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    backgroundColor: physiotherapist.availability_status === 'AVAILABLE' ? '#00C851' : '#FF6B35'
                  }} />
                  <span className="lk-typography-body-small" style={{ 
                    color: physiotherapist.availability_status === 'AVAILABLE' ? '#00C851' : '#FF6B35',
                    fontWeight: '600'
                  }}>
                    {availability.text}
                  </span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div style={{ textAlign: 'right' }}>
                <div className="lk-typography-body-small" style={{ 
                  color: 'var(--lk-onsurfacevariant)',
                  marginBottom: '0.25rem'
                }}>
                  Next available
                </div>
                <div className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  fontWeight: '600'
                }}>
                  Today 2:00 PM
                </div>
              </div>
            </div>
            
            {showActions && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button
                  variant="outline"
                  size="lg"
                  color="primary"
                  label="View Profile"
                  onClick={handleViewProfile}
                  style={{ 
                    flex: '1',
                    borderColor: '#667eea',
                    color: '#667eea'
                  }}
                />
                <Button
                  variant="fill"
                  size="lg"
                  color="primary"
                  label="Book Appointment"
                  startIcon="calendar"
                  onClick={handleViewProfile}
                  style={{ 
                    flex: '2',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PhysiotherapistCard;