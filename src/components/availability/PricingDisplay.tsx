'use client';

import React from 'react';
import { Home, Video, MapPin, Tag, Zap } from 'lucide-react';
import { PhysiotherapistPricing } from '@/lib/types';

interface PricingDisplayProps {
  pricing?: PhysiotherapistPricing;
  serviceType?: 'HOME_VISIT' | 'ONLINE' | 'ALL';
  variant?: 'full' | 'compact';
  userLocation?: { pincode?: string };
  loading?: boolean;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({
  pricing,
  serviceType = 'ALL',
  variant = 'full',
  userLocation,
  loading = false
}) => {
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: variant === 'compact' ? 'row' : 'column',
        gap: '8px'
      }}>
        <div style={{
          height: '32px',
          backgroundColor: 'rgba(200, 234, 235, 0.1)',
          borderRadius: '6px',
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
      </div>
    );
  }

  if (!pricing) return null;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString()}`;
  };

  const renderOnlinePrice = () => {
    if (serviceType === 'HOME_VISIT' || !pricing.online) return null;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: variant === 'compact' ? '6px 10px' : '8px 12px',
        backgroundColor: 'rgba(30, 95, 121, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(30, 95, 121, 0.1)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Video style={{ 
            width: variant === 'compact' ? '14px' : '16px', 
            height: variant === 'compact' ? '14px' : '16px', 
            color: '#1e5f79' 
          }} />
          <span style={{
            fontSize: variant === 'compact' ? '12px' : '13px',
            fontWeight: '500',
            color: '#1e5f79'
          }}>
            Online
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{
            fontSize: variant === 'compact' ? '14px' : '16px',
            fontWeight: '700',
            color: '#1e5f79'
          }}>
            {formatPrice(pricing.online.total)}
          </span>
          <Zap style={{ 
            width: '12px', 
            height: '12px', 
            color: '#10B981',
            fill: '#10B981'
          }} />
        </div>
      </div>
    );
  };

  const renderHomeVisitPrice = () => {
    if (serviceType === 'ONLINE' || !pricing.home_visit) return null;

    const hasDiscount = pricing.home_visit.zone_extra_charge === 0;
    const isInGreenZone = hasDiscount && userLocation?.pincode;
    
    // Calculate discount amount based on zone pricing
    const calculateDiscount = () => {
      if (!pricing.home_visit.zone_breakdown || !hasDiscount) return null;
      
      const yellowCharge = pricing.home_visit.zone_breakdown.yellow?.extra_charge || 0;
      const redCharge = pricing.home_visit.zone_breakdown.red?.extra_charge || 0;
      
      // Show discount compared to highest zone charge
      const maxDiscount = Math.max(yellowCharge, redCharge);
      return maxDiscount > 0 ? maxDiscount : null;
    };
    
    const discountAmount = calculateDiscount();

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: variant === 'compact' ? '6px 10px' : '8px 12px',
          backgroundColor: isInGreenZone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(30, 95, 121, 0.05)',
          borderRadius: '8px',
          border: `1px solid ${isInGreenZone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 95, 121, 0.1)'}`,
          transition: 'all 0.2s ease',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Home style={{ 
              width: variant === 'compact' ? '14px' : '16px', 
              height: variant === 'compact' ? '14px' : '16px', 
              color: isInGreenZone ? '#10B981' : '#1e5f79' 
            }} />
            <span style={{
              fontSize: variant === 'compact' ? '12px' : '13px',
              fontWeight: '500',
              color: isInGreenZone ? '#10B981' : '#1e5f79'
            }}>
              Home Visit
            </span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            <span style={{
              fontSize: variant === 'compact' ? '14px' : '16px',
              fontWeight: '700',
              color: isInGreenZone ? '#10B981' : '#1e5f79'
            }}>
              {formatPrice(pricing.home_visit.total)}
            </span>
            {isInGreenZone && discountAmount && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '2px'
              }}>
                <span style={{
                  fontSize: '10px',
                  color: '#10B981',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <MapPin style={{ width: '10px', height: '10px' }} />
                  Your pincode saves ₹{discountAmount}!
                </span>
                <span style={{
                  fontSize: '9px',
                  color: '#6B7280',
                  fontStyle: 'italic'
                }}>
                  vs other zones
                </span>
              </div>
            )}
          </div>

          {isInGreenZone && discountAmount && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#ffffff',
              padding: '4px 8px',
              borderRadius: '16px',
              fontSize: '10px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              border: '2px solid #ffffff'
            }}>
              <Gift style={{ width: '12px', height: '12px' }} />
              SAVE ₹{discountAmount}
            </div>
          )}
        </div>

        {variant === 'full' && pricing.home_visit.zone_breakdown && (
          <div style={{
            display: 'flex',
            gap: '4px',
            marginTop: '4px',
            justifyContent: 'center'
          }}>
            {Object.entries(pricing.home_visit.zone_breakdown).map(([zone, info]) => (
              <div
                key={zone}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: 
                    zone === 'green' ? 'rgba(16, 185, 129, 0.1)' :
                    zone === 'yellow' ? 'rgba(251, 146, 60, 0.1)' :
                    'rgba(239, 68, 68, 0.1)',
                  color:
                    zone === 'green' ? '#10B981' :
                    zone === 'yellow' ? '#F59E0B' :
                    '#EF4444',
                  border: `1px solid ${
                    zone === 'green' ? 'rgba(16, 185, 129, 0.2)' :
                    zone === 'yellow' ? 'rgba(251, 146, 60, 0.2)' :
                    'rgba(239, 68, 68, 0.2)'
                  }`
                }}
              >
                {zone}: +₹{info.extra_charge}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: variant === 'compact' ? '6px' : '8px'
    }}>
      {renderOnlinePrice()}
      {renderHomeVisitPrice()}
    </div>
  );
};

export default PricingDisplay;