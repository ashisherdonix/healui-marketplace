import React from 'react';
import { Star, Clock, ArrowRight, Video, Home } from 'lucide-react';
import { theme } from '@/utils/theme';
import { getSmartAvailabilitySummary } from '@/utils/availabilityUtils';
import { PhysiotherapistBatchAvailability } from '@/lib/types';

interface CompactPhysioCardProps {
  physio: {
    id: string;
    full_name: string;
    profile_image?: string;
    years_experience: number;
    rating: number;
    total_reviews: number;
  };
  availability?: PhysiotherapistBatchAvailability;
  onViewDetails?: () => void;
}

const CompactPhysioCard: React.FC<CompactPhysioCardProps> = ({
  physio,
  availability,
  onViewDetails
}) => {
  const availabilitySummary = getSmartAvailabilitySummary(availability?.availability);
  const price = availability?.pricing?.online?.total || availability?.pricing?.home_visit?.total;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid #f0f0f0'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onClick={onViewDetails}
    >
      
      {/* Profile Section */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: theme.colors.secondary,
            backgroundImage: physio.profile_image ? `url(${physio.profile_image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginRight: '12px',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            margin: '0 0 4px 0',
            color: theme.colors.text.primary,
            lineHeight: '1.2'
          }}>
            Dr. {physio.full_name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Star
                size={14}
                fill={theme.colors.accent}
                color={theme.colors.accent}
              />
              <span style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
                {physio.rating}
              </span>
            </div>
            <span style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
              • {physio.years_experience}+ years
            </span>
          </div>
        </div>
      </div>
      
      {/* Availability Section */}
      <div style={{ marginBottom: '12px' }}>
        {availabilitySummary.hasAvailability ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Show first line of availability */}
            {availabilitySummary.lines[0] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {availabilitySummary.lines[0].includes('Online') ? (
                  <Video size={12} color={availabilitySummary.lines[0].includes('today') ? theme.colors.success : '#f57c00'} />
                ) : (
                  <Home size={12} color={availabilitySummary.lines[0].includes('today') ? theme.colors.success : '#f57c00'} />
                )}
                <span style={{ 
                  fontSize: '12px', 
                  color: availabilitySummary.lines[0].includes('today') ? theme.colors.success : '#f57c00',
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>
                  {availabilitySummary.lines[0]}
                </span>
              </div>
            )}
            
            {/* Show second line if exists (for both online and home) */}
            {availabilitySummary.lines[1] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {availabilitySummary.lines[1].includes('Online') ? (
                  <Video size={12} color={availabilitySummary.lines[1].includes('today') ? theme.colors.success : '#f57c00'} />
                ) : (
                  <Home size={12} color={availabilitySummary.lines[1].includes('today') ? theme.colors.success : '#f57c00'} />
                )}
                <span style={{ 
                  fontSize: '12px', 
                  color: availabilitySummary.lines[1].includes('today') ? theme.colors.success : '#f57c00',
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>
                  {availabilitySummary.lines[1]}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="#c62828" />
            <span style={{ 
              fontSize: '12px', 
              color: '#c62828',
              fontWeight: '500'
            }}>
              Fully booked
            </span>
          </div>
        )}
      </div>

      {/* Price Section */}
      {price && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
            Starting from
          </span>
          <span style={{ 
            fontSize: '1.125rem', 
            fontWeight: 'bold', 
            color: theme.colors.primary 
          }}>
            ₹{price}
          </span>
        </div>
      )}
      
      {/* CTA Button */}
      <button
        style={{
          width: '100%',
          padding: '10px 16px',
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: `1px solid ${theme.colors.primary}`,
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primary;
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.colors.primary;
        }}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails?.();
        }}
      >
        View Details
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default CompactPhysioCard;