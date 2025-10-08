import React from 'react';
import { 
  Star, 
  MapPin, 
  Award, 
  Clock,
  Video,
  Home,
  ThumbsUp,
  Calendar
} from 'lucide-react';
import { theme } from '@/utils/theme';
import { getSmartAvailabilitySummary } from '@/utils/availabilityUtils';
import { PhysiotherapistBatchAvailability } from '@/lib/types';

interface FeaturedPhysioCardProps {
  physio: {
    id: string;
    full_name: string;
    profile_image?: string;
    years_experience: number;
    rating: number;
    total_reviews: number;
    specializations?: string[];
  };
  availability?: PhysiotherapistBatchAvailability;
  onBookClick?: () => void;
}

const FeaturedPhysioCard: React.FC<FeaturedPhysioCardProps> = ({
  physio,
  availability,
  onBookClick
}) => {
  const valueScore = availability?.value_score;
  const distanceInfo = availability?.distance_info;
  const pricing = availability?.pricing;
  
  // Get smart availability summary
  const availabilitySummary = getSmartAvailabilitySummary(availability?.availability);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative',
        height: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
      }}
    >
      {/* Value Badge */}
      {valueScore && valueScore > 80 && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: theme.colors.primary,
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Award size={16} />
          Recommended
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
        
        {/* Left: Profile & Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: theme.colors.secondary,
                backgroundImage: physio.profile_image ? `url(${physio.profile_image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginRight: '16px',
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                margin: '0 0 4px 0',
                color: theme.colors.primary 
              }}>
                Dr. {physio.full_name}
              </h2>
              <p style={{ 
                margin: '0 0 8px 0', 
                color: theme.colors.text.secondary,
                fontSize: '1rem'
              }}>
                {physio.years_experience}+ years experience
              </p>
              {distanceInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color={theme.colors.text.secondary} />
                  <span style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                    {distanceInfo.min_distance_km.toFixed(1)} km away
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Specializations */}
          {physio.specializations && physio.specializations.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ 
                fontSize: '14px', 
                color: theme.colors.text.secondary, 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Specializes in:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {physio.specializations.slice(0, 3).map((spec, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      color: theme.colors.primary,
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${theme.colors.primary}20`
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(physio.rating) ? theme.colors.accent : 'none'}
                  color={i < Math.floor(physio.rating) ? theme.colors.accent : theme.colors.text.secondary}
                />
              ))}
            </div>
            <span style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
              ({physio.total_reviews} reviews)
            </span>
          </div>
        </div>
        
        {/* Right: Availability & Pricing */}
        <div>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              margin: '0 0 12px 0',
              color: theme.colors.primary
            }}>
              Availability
            </h3>
            
            {availabilitySummary.hasAvailability ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {availabilitySummary.lines.map((line, index) => {
                  const isOnline = line.includes('Online');
                  const isToday = line.includes('today');
                  
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isOnline ? (
                        <Video size={16} color={isToday ? theme.colors.success : '#f57c00'} />
                      ) : (
                        <Home size={16} color={isToday ? theme.colors.success : '#f57c00'} />
                      )}
                      <span style={{ 
                        fontSize: '14px', 
                        color: isToday ? theme.colors.success : '#f57c00',
                        fontWeight: '500'
                      }}>
                        {line}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#c62828" />
                <span style={{ color: '#c62828', fontWeight: '500' }}>
                  Fully booked
                </span>
              </div>
            )}
          </div>
          
          {/* Pricing Options */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              margin: '0 0 12px 0',
              color: theme.colors.text.primary
            }}>
              Consultation Options
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Online Consultation */}
              {pricing?.online && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Video size={16} color={theme.colors.primary} />
                    <span>Online</span>
                  </div>
                  <span style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 'bold', 
                    color: theme.colors.primary 
                  }}>
                    ₹{pricing.online.total}
                  </span>
                </div>
              )}
              
              {/* Home Visit */}
              {pricing?.home_visit && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Home size={16} color={theme.colors.primary} />
                      <span>Home Visit</span>
                      {distanceInfo && (
                        <span
                          style={{
                            backgroundColor: theme.colors.secondary,
                            color: theme.colors.primary,
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        >
                          {distanceInfo.min_distance_km.toFixed(1)} km
                        </span>
                      )}
                    </div>
                    <span style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: 'bold', 
                      color: theme.colors.primary 
                    }}>
                      ₹{pricing.home_visit.total}
                    </span>
                  </div>
                  
                  {/* Pricing Breakdown */}
                  <div style={{ paddingLeft: '24px', fontSize: '12px', color: theme.colors.text.secondary }}>
                    <div>Consultation: ₹{pricing.home_visit.consultation_fee}</div>
                    <div>Travel: ₹{pricing.home_visit.travel_fee + pricing.home_visit.zone_extra_charge}</div>
                  </div>
                </div>
              )}
              
              {/* Savings Alert */}
              {pricing?.online && pricing?.home_visit && pricing.home_visit.total > pricing.online.total && (
                <div
                  style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    border: '1px solid #bbdefb'
                  }}
                >
                  <ThumbsUp size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Save ₹{pricing.home_visit.total - pricing.online.total} with online consultation
                </div>
              )}
            </div>
          </div>
          
          {/* CTA Button */}
          <button
            onClick={onBookClick}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Book Consultation Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPhysioCard;