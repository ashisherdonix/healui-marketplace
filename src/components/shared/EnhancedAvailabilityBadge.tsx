import React from 'react';
import { CheckCircle, Clock, XCircle, MapPin, Video, Home } from 'lucide-react';
import { theme } from '@/utils/theme';
import { getSmartAvailabilitySummary } from '@/utils/availabilityUtils';
import { PhysiotherapistBatchAvailability } from '@/lib/types';

interface EnhancedAvailabilityBadgeProps {
  availability?: PhysiotherapistBatchAvailability;
  showDistance?: boolean;
  compact?: boolean;
}

const EnhancedAvailabilityBadge: React.FC<EnhancedAvailabilityBadgeProps> = ({
  availability,
  showDistance = true,
  compact = false
}) => {
  const availabilitySummary = getSmartAvailabilitySummary(availability?.availability);
  const distanceInfo = availability?.distance_info;

  if (!availabilitySummary.hasAvailability) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: compact ? '11px' : '13px',
            fontWeight: '500',
            border: '1px solid #ffcdd2'
          }}
        >
          <XCircle size={compact ? 12 : 14} />
          Fully Booked
        </div>
        
        {showDistance && distanceInfo && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            fontSize: '12px',
            color: theme.colors.text.secondary 
          }}>
            <MapPin size={12} />
            {distanceInfo.min_distance_km.toFixed(1)} km from you
          </div>
        )}
      </div>
    );
  }

  const firstLine = availabilitySummary.lines[0];
  const hasToday = firstLine?.includes('today');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Main badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: hasToday ? '#e8f5e9' : '#fff3e0',
          color: hasToday ? theme.colors.success : '#f57c00',
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: compact ? '11px' : '13px',
          fontWeight: '500',
          border: `1px solid ${hasToday ? '#c8e6c9' : '#ffcc02'}`
        }}
      >
        {hasToday ? <CheckCircle size={compact ? 12 : 14} /> : <Clock size={compact ? 12 : 14} />}
        {compact ? (hasToday ? 'Available Today' : 'Next Available') : firstLine}
      </div>
      
      {/* Additional availability info for non-compact mode */}
      {!compact && availabilitySummary.lines[1] && (
        <div style={{ 
          fontSize: '11px', 
          color: theme.colors.text.secondary, 
          paddingLeft: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {availabilitySummary.lines[1].includes('Online') ? <Video size={10} /> : <Home size={10} />}
          <span>{availabilitySummary.lines[1]}</span>
        </div>
      )}
      
      {/* Distance info */}
      {showDistance && distanceInfo && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          fontSize: '12px',
          color: theme.colors.text.secondary 
        }}>
          <MapPin size={12} />
          {distanceInfo.min_distance_km.toFixed(1)} km from you
        </div>
      )}
    </div>
  );
};

export default EnhancedAvailabilityBadge;