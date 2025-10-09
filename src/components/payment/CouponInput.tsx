'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import ApiManager from '@/services/api';

interface CouponInputProps {
  physiotherapistId: string;
  totalAmount: number;
  onCouponApplied: (couponData: {
    coupon_code: string;
    discount_amount: number;
    discount_type: 'PERCENTAGE' | 'FIXED';
    discount_value: number;
  } | null) => void;
}

const CouponInput: React.FC<CouponInputProps> = ({
  physiotherapistId,
  totalAmount,
  onCouponApplied
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    loadAvailableCoupons();
  }, [physiotherapistId, totalAmount]);

  const loadAvailableCoupons = async () => {
    try {
      const response = await ApiManager.getAvailableCoupons({
        physiotherapist_id: physiotherapistId,
        total_amount: totalAmount
      });
      
      if (response.success && response.data) {
        setAvailableCoupons(response.data);
      }
    } catch (error) {
      console.error('Failed to load available coupons:', error);
    }
  };

  const validateCoupon = async (code: string) => {
    if (!code.trim()) {
      clearCoupon();
      return;
    }

    setIsValidating(true);
    setValidationMessage('');

    try {
      const response = await ApiManager.validateCoupon({
        coupon_code: code.trim(),
        physiotherapist_id: physiotherapistId,
        total_amount: totalAmount
      });

      if (response.success && response.data) {
        const couponData = response.data;
        setIsValid(true);
        setAppliedCoupon(couponData);
        setValidationMessage(`Coupon applied! You save ₹${couponData.discount_amount}`);
        onCouponApplied(couponData);
      } else {
        setIsValid(false);
        setAppliedCoupon(null);
        setValidationMessage(response.message || 'Invalid coupon code');
        onCouponApplied(null);
      }
    } catch (error) {
      setIsValid(false);
      setAppliedCoupon(null);
      setValidationMessage('Failed to validate coupon');
      onCouponApplied(null);
    } finally {
      setIsValidating(false);
    }
  };

  const clearCoupon = () => {
    setCouponCode('');
    setIsValid(false);
    setAppliedCoupon(null);
    setValidationMessage('');
    onCouponApplied(null);
  };

  const handleCouponChange = (value: string) => {
    setCouponCode(value);
    if (appliedCoupon) {
      clearCoupon();
    }
  };

  const handleApplyCoupon = () => {
    validateCoupon(couponCode);
  };

  const handleQuickApply = (code: string) => {
    setCouponCode(code);
    validateCoupon(code);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: '#000000',
        margin: '0 0 12px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Tag style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
        Apply Coupon
      </h4>

      {/* Available Coupons */}
      {availableCoupons.length > 0 && !appliedCoupon && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '8px'
          }}>
            Available coupons:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableCoupons.slice(0, 3).map((coupon: any) => (
              <button
                key={coupon.code}
                onClick={() => handleQuickApply(coupon.code)}
                style={{
                  padding: '6px 12px',
                  background: '#eff8ff',
                  border: '1px solid #c8eaeb',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#1e5f79',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c8eaeb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff8ff';
                }}
              >
                {coupon.code} - {coupon.discount_type === 'PERCENTAGE' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Coupon Input */}
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => handleCouponChange(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            disabled={isValidating || appliedCoupon}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${isValid ? '#10b981' : validationMessage && !isValid ? '#ef4444' : '#c8eaeb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: appliedCoupon ? '#f0f9ff' : '#ffffff',
              color: '#000000',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && couponCode.trim() && !appliedCoupon) {
                handleApplyCoupon();
              }
            }}
          />
        </div>

        {appliedCoupon ? (
          <button
            onClick={clearCoupon}
            style={{
              padding: '12px',
              background: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        ) : (
          <button
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || isValidating}
            style={{
              padding: '12px 16px',
              background: (!couponCode.trim() || isValidating) ? '#9ca3af' : '#1e5f79',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: (!couponCode.trim() || isValidating) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: '80px',
              justifyContent: 'center'
            }}
          >
            {isValidating ? (
              <>
                <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                Checking
              </>
            ) : (
              'Apply'
            )}
          </button>
        )}
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: isValid ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${isValid ? '#bbf7d0' : '#fecaca'}`,
          color: isValid ? '#166534' : '#dc2626'
        }}>
          {isValid ? (
            <Check style={{ width: '14px', height: '14px' }} />
          ) : (
            <X style={{ width: '14px', height: '14px' }} />
          )}
          {validationMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CouponInput;