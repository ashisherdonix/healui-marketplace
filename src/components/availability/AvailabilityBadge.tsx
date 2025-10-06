'use client';

import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { PhysiotherapistBatchAvailability } from '@/lib/types';

interface AvailabilityBadgeProps {
  availability?: PhysiotherapistBatchAvailability;
  serviceType?: 'HOME_VISIT' | 'ONLINE' | 'ALL';
  variant?: 'full' | 'compact';
  loading?: boolean;
}

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  availability,
  serviceType = 'ALL',
  variant = 'full',
  loading = false
}) => {
  if (loading) {
    return (
      <div style={{
        backgroundColor: 'rgba(200, 234, 235, 0.1)',
        padding: variant === 'compact' ? '6px 12px' : '8px 16px',
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}>
        <div style={{
          width: '14px',
          height: '14px',
          backgroundColor: 'rgba(200, 234, 235, 0.3)',
          borderRadius: '50%'
        }} />
        <div style={{
          width: '80px',
          height: '12px',
          backgroundColor: 'rgba(200, 234, 235, 0.3)',
          borderRadius: '4px'
        }} />
      </div>
    );
  }

  if (!availability?.availability) {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAvailability = availability.availability[today];

  const getNextAvailableSlot = () => {
    const dates = Object.keys(availability.availability).sort();
    
    for (const date of dates) {
      const dayData = availability.availability[date];
      
      if (serviceType === 'HOME_VISIT' && dayData.home_visit?.length > 0) {
        const availableSlot = dayData.home_visit.find(slot => slot.is_available);
        if (availableSlot) {
          return { date, time: availableSlot.start_time, type: 'home_visit' };
        }
      }
      
      if (serviceType === 'ONLINE' && dayData.online?.length > 0) {
        const availableSlot = dayData.online.find(slot => slot.is_available);
        if (availableSlot) {
          return { date, time: availableSlot.start_time, type: 'online' };
        }
      }
      
      if (serviceType === 'ALL') {
        const onlineSlot = dayData.online?.find(slot => slot.is_available);
        if (onlineSlot) {
          return { date, time: onlineSlot.start_time, type: 'online' };
        }
        
        const homeSlot = dayData.home_visit?.find(slot => slot.is_available);
        if (homeSlot) {
          return { date, time: homeSlot.start_time, type: 'home_visit' };
        }
      }
    }
    
    return null;
  };

  const nextSlot = getNextAvailableSlot();
  const hasToday = nextSlot?.date === today;
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  if (!nextSlot) {
    return (
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: variant === 'compact' ? '6px 12px' : '8px 16px',
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <AlertCircle style={{ 
          width: variant === 'compact' ? '14px' : '16px', 
          height: variant === 'compact' ? '14px' : '16px', 
          color: '#DC2626' 
        }} />
        <span style={{
          fontSize: variant === 'compact' ? '12px' : '13px',
          fontWeight: '600',
          color: '#DC2626'
        }}>
          All slots booked!
        </span>
      </div>
    );
  }

  const isToday = nextSlot.date === today;
  const bgColor = isToday ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 146, 60, 0.1)';
  const borderColor = isToday ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 146, 60, 0.2)';
  const textColor = isToday ? '#059669' : '#EA580C';
  const icon = isToday ? CheckCircle : Clock;
  const Icon = icon;

  return (
    <div style={{
      backgroundColor: bgColor,
      padding: variant === 'compact' ? '6px 12px' : '8px 16px',
      borderRadius: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      border: `1px solid ${borderColor}`,
      animation: isToday ? 'gentle-pulse 2s ease-in-out infinite' : 'none'
    }}>
      <Icon style={{ 
        width: variant === 'compact' ? '14px' : '16px', 
        height: variant === 'compact' ? '14px' : '16px', 
        color: textColor 
      }} />
      <span style={{
        fontSize: variant === 'compact' ? '12px' : '13px',
        fontWeight: '600',
        color: textColor
      }}>
        {isToday ? (
          `Available today at ${formatTime(nextSlot.time)}`
        ) : (
          `Next slot: ${formatTime(nextSlot.time)}`
        )}
      </span>
    </div>
  );
};

export default AvailabilityBadge;