'use client';

import React from 'react';
import { MapPin, Phone, CheckCircle } from 'lucide-react';

interface ServiceSelectionProps {
  profile: {
    home_visit_fee?: number;
    online_fee?: number;
    consultation_fee?: number;
  };
  consultationType: 'HOME_VISIT' | 'ONLINE';
  setConsultationType: (type: 'HOME_VISIT' | 'ONLINE') => void;
  setSelectedSlot: (slot: any) => void;
  availabilityLoading: boolean;
  dateSlotCounts: {[key: string]: {HOME_VISIT: number, ONLINE: number}};
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  profile,
  consultationType,
  setConsultationType,
  setSelectedSlot,
  availabilityLoading,
  dateSlotCounts
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #E5E7EB',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
        <button
          onClick={() => {
            if (consultationType !== 'HOME_VISIT') {
              setConsultationType('HOME_VISIT');
              setSelectedSlot(null);
            }
          }}
          disabled={availabilityLoading}
          style={{
            flex: 1,
            padding: '12px',
            border: `2px solid ${consultationType === 'HOME_VISIT' ? '#2563EB' : '#E5E7EB'}`,
            borderRadius: '8px',
            backgroundColor: consultationType === 'HOME_VISIT' ? '#EFF6FF' : 'white',
            cursor: availabilityLoading ? 'not-allowed' : 'pointer',
            opacity: availabilityLoading ? 0.7 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin style={{ width: '16px', height: '16px', color: '#2563EB' }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                Home Visit
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#2563EB' }}>
                ₹{profile.home_visit_fee || 800}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                {(() => {
                  const totalSlots = Object.values(dateSlotCounts).reduce((sum, counts) => sum + (counts?.HOME_VISIT || 0), 0);
                  return totalSlots > 0 ? `${totalSlots} slots this week` : 'No slots available';
                })()}
              </div>
            </div>
            {consultationType === 'HOME_VISIT' && (
              <CheckCircle style={{ width: '16px', height: '16px', color: '#2563EB' }} />
            )}
          </div>
        </button>
        
        <button
          onClick={() => {
            if (consultationType !== 'ONLINE') {
              setConsultationType('ONLINE');
              setSelectedSlot(null);
            }
          }}
          disabled={availabilityLoading}
          style={{
            flex: 1,
            padding: '12px',
            border: `2px solid ${consultationType === 'ONLINE' ? '#10B981' : '#E5E7EB'}`,
            borderRadius: '8px',
            backgroundColor: consultationType === 'ONLINE' ? '#F0FDF4' : 'white',
            cursor: availabilityLoading ? 'not-allowed' : 'pointer',
            opacity: availabilityLoading ? 0.7 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone style={{ width: '16px', height: '16px', color: '#10B981' }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                Online
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#10B981' }}>
                ₹{profile.online_fee || profile.consultation_fee || 600}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                {(() => {
                  const totalSlots = Object.values(dateSlotCounts).reduce((sum, counts) => sum + (counts?.ONLINE || 0), 0);
                  return totalSlots > 0 ? `${totalSlots} slots this week` : 'No slots available';
                })()}
              </div>
            </div>
            {consultationType === 'ONLINE' && (
              <CheckCircle style={{ width: '16px', height: '16px', color: '#10B981' }} />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;