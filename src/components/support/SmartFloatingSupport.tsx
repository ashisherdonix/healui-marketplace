'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface QuickAction {
  id: string;
  label: string;
  message: string;
}

const SmartFloatingSupport: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  
  // Simple delayed visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Context-aware quick actions
  const getQuickActions = (): QuickAction[] => {
    if (pathname.includes('/booking')) {
      return [
        { id: 'booking-help', label: 'Help with booking', message: 'I need help with booking a physiotherapist' },
        { id: 'payment', label: 'Payment issue', message: 'I have a payment related query' },
        { id: 'timing', label: 'Change timing', message: 'I want to change my appointment timing' }
      ];
    }
    
    if (pathname.includes('/profile')) {
      return [
        { id: 'address', label: 'Address help', message: 'I need help with managing addresses' },
        { id: 'account', label: 'Account settings', message: 'I have a question about my account' },
        { id: 'history', label: 'Booking history', message: 'I want to check my booking history' }
      ];
    }
    
    // Default actions
    return [
      { id: 'book', label: 'Book physiotherapist', message: 'I want to book a physiotherapy session' },
      { id: 'emergency', label: 'Urgent booking', message: 'I need urgent physiotherapy assistance' },
      { id: 'general', label: 'General inquiry', message: 'I have a general question about HealUI' }
    ];
  };
  
  const handleWhatsAppOpen = (message?: string) => {
    const phoneNumber = '917006672937';
    const userInfo = user ? `\nUser: ${user.full_name || 'Guest'}\nPhone: ${user.phone || 'Not provided'}` : '';
    const finalMessage = encodeURIComponent(`${message || 'Hi, I need help with HealUI.'}${userInfo}`);
    window.open(`https://wa.me/${phoneNumber}?text=${finalMessage}`, '_blank');
    setIsExpanded(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Main Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
      }}>
        {/* Expanded Chat Widget - Clean & Simple */}
        {isExpanded && (
          <div style={{
            position: 'absolute',
            bottom: '56px',
            right: 0,
            width: '280px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
          }}>
            {/* Header - Simple */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <span style={{ color: '#1e293b', fontWeight: '500', fontSize: '14px' }}>
                Need Help?
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748b',
                }}
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Quick Actions - Clean List */}
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                Select an option or chat directly
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {getQuickActions().map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleWhatsAppOpen(action.message)}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#475569',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#eff8ff';
                      e.currentTarget.style.borderColor = '#c8eaeb';
                      e.currentTarget.style.color = '#1e5f79';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#475569';
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              
              {/* WhatsApp Button - Simple */}
              <button
                onClick={() => handleWhatsAppOpen()}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1e5f79',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '12px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#164a5e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e5f79';
                }}
              >
                Open WhatsApp Chat
              </button>
            </div>
          </div>
        )}
        
        {/* Floating Button - Clean & Simple */}
        <div style={{ position: 'relative' }}>
          {/* Small 24/7 Badge */}
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: '#1e5f79',
            color: '#ffffff',
            fontSize: '8px',
            fontWeight: '600',
            padding: '2px 4px',
            borderRadius: '8px',
            zIndex: 101,
            border: '2px solid #ffffff',
          }}>
            24/7
          </div>
          
          {/* Main Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#1e5f79',
              border: 'none',
              boxShadow: '0 4px 16px rgba(30, 95, 121, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = '#164a5e';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 95, 121, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#1e5f79';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 95, 121, 0.3)';
            }}
          >
            {isExpanded ? (
              <X size={20} color="#ffffff" />
            ) : (
              <MessageCircle size={20} color="#ffffff" fill="#ffffff" />
            )}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 640px) {
          div[style*="width: 280px"] {
            width: calc(100vw - 32px) !important;
            max-width: 280px !important;
            right: -8px !important;
          }
        }
      `}</style>
    </>
  );
};

export default SmartFloatingSupport;