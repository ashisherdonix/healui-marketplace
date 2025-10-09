'use client';

import React, { useEffect } from 'react';
import { Loader2, Shield, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  paymentData: {
    order_id: string;
    amount: number;
    currency: string;
    transaction_id: string;
    key: string;
    is_test_mode?: boolean;
  };
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  onSuccess: (paymentResponse: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onError: (error: any) => void;
  loading?: boolean;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  paymentData,
  patientName,
  patientPhone,
  patientEmail,
  onSuccess,
  onError,
  loading = false
}) => {
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      onError(new Error('Failed to load payment gateway'));
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onError]);

  const handlePayment = () => {
    if (!window.Razorpay) {
      onError(new Error('Payment gateway not loaded. Please refresh and try again.'));
      return;
    }

    const options = {
      key: paymentData.key,
      amount: paymentData.amount, // Amount in paise
      currency: paymentData.currency,
      name: 'HealUI Marketplace',
      description: 'Physiotherapy Consultation Fee',
      image: '/logo.png', // Add your logo here
      order_id: paymentData.order_id,
      handler: function (response: any) {
        console.log('✅ Payment successful:', response);
        onSuccess({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });
      },
      prefill: {
        name: patientName,
        email: patientEmail || '',
        contact: patientPhone || ''
      },
      notes: {
        transaction_id: paymentData.transaction_id
      },
      theme: {
        color: '#1e5f79'
      },
      modal: {
        ondismiss: function() {
          console.log('💔 Payment dismissed by user');
          onError(new Error('Payment cancelled by user'));
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      console.error('❌ Payment failed:', response.error);
      onError(response.error);
    });

    rzp.open();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <Loader2 style={{ 
          width: '32px', 
          height: '32px', 
          color: '#1e5f79',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#000000',
          marginBottom: '8px'
        }}>
          Preparing Payment...
        </div>
        <div style={{
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Please wait while we set up your secure payment
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Payment Method Info */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h4 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#000000',
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Shield style={{ width: '16px', height: '16px', color: '#1e5f79' }} />
          Secure Payment
        </h4>
        
        <div style={{ 
          fontSize: '13px', 
          color: '#6b7280',
          lineHeight: '1.5',
          marginBottom: '12px'
        }}>
          Your payment is secured by Razorpay. We accept:
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            padding: '4px 8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            💳 Credit/Debit Cards
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            padding: '4px 8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            📱 UPI
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            padding: '4px 8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            🏦 Net Banking
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            padding: '4px 8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            💰 Wallets
          </div>
        </div>
      </div>

      {/* Test Mode Notice - Show only if in test mode */}
      {paymentData.is_test_mode && (
      <div style={{
        background: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '13px',
          color: '#92400e',
          fontWeight: '600',
          marginBottom: '4px'
        }}>
          🧪 Test Mode Active
        </div>
        <div style={{
          fontSize: '12px',
          color: '#92400e',
          lineHeight: '1.4'
        }}>
          This is a test payment. Use test cards: 4111 1111 1111 1111, CVV: 123, Any future date
        </div>
      </div>
      )}

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        style={{
          width: '100%',
          padding: '16px',
          background: '#1e5f79',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#000000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1e5f79';
        }}
      >
        <CreditCard style={{ width: '20px', height: '20px' }} />
        Pay ₹{(paymentData.amount / 100).toFixed(2)}
      </button>

      <div style={{
        textAlign: 'center',
        marginTop: '12px',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        Powered by <strong>Razorpay</strong> • Your payment is 100% secure
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RazorpayCheckout;