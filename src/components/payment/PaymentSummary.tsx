'use client';

import React from 'react';
import { CreditCard, Tag } from 'lucide-react';

interface PaymentSummaryProps {
  consultationFee: number;
  travelFee: number;
  discountAmount: number;
  appliedCoupon?: {
    coupon_code: string;
    discount_type: 'PERCENTAGE' | 'FIXED';
    discount_value: number;
  } | null;
  finalAmount: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  consultationFee,
  travelFee,
  discountAmount,
  appliedCoupon,
  finalAmount
}) => {
  const originalTotal = consultationFee + travelFee;

  return (
    <div style={{
      background: '#eff8ff',
      border: '1px solid #c8eaeb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <h4 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: '#1e5f79',
        margin: '0 0 12px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <CreditCard style={{ width: '16px', height: '16px' }} />
        Payment Summary
      </h4>
      
      <div style={{ display: 'grid', gap: '8px' }}>
        {/* Consultation Fee */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#000000' }}>Consultation Fee</span>
          <span style={{ fontSize: '14px', color: '#000000', fontWeight: '500' }}>₹{consultationFee}</span>
        </div>
        
        {/* Travel Fee */}
        {travelFee > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#000000' }}>Travel Fee</span>
            <span style={{ fontSize: '14px', color: '#000000', fontWeight: '500' }}>₹{travelFee}</span>
          </div>
        )}

        {/* Subtotal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Subtotal</span>
          <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>₹{originalTotal}</span>
        </div>
        
        {/* Discount */}
        {appliedCoupon && discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag style={{ width: '14px', height: '14px', color: '#10b981' }} />
              <span style={{ fontSize: '14px', color: '#10b981' }}>
                Discount ({appliedCoupon.coupon_code})
              </span>
            </div>
            <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '500' }}>-₹{discountAmount}</span>
          </div>
        )}
        
        <hr style={{ border: 'none', borderTop: '1px solid #c8eaeb', margin: '8px 0' }} />
        
        {/* Final Amount */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Amount to Pay</span>
          <div style={{ textAlign: 'right' }}>
            {discountAmount > 0 && (
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                textDecoration: 'line-through',
                marginBottom: '2px'
              }}>
                ₹{originalTotal}
              </div>
            )}
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#1e5f79'
            }}>
              ₹{finalAmount}
            </span>
          </div>
        </div>

        {/* Savings */}
        {discountAmount > 0 && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            padding: '8px 12px',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            <span style={{ 
              fontSize: '13px', 
              color: '#166534',
              fontWeight: '600'
            }}>
              🎉 You save ₹{discountAmount} with this coupon!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;