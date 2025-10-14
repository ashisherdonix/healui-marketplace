'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Heart } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { theme } from '@/utils/theme';

const SmartFloatingSupport: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { user } = useAppSelector((state) => state.auth);

  // Simple visibility with mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
        bottom: isMobile ? '24px' : '24px',
        right: '24px',
        zIndex: 100,
      }}>
        {/* Simple Support Widget */}
        {isExpanded && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: isMobile ? 'calc(100vw - 48px)' : '280px',
            maxWidth: '280px',
            backgroundColor: theme.colors.white,
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(30, 95, 121, 0.15)',
            border: `2px solid ${theme.colors.secondary}`,
            overflow: 'hidden',
            animation: 'fadeInUp 0.3s ease-out',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            {/* Simple Header */}
            <div style={{
              background: theme.gradients.primary,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: theme.colors.white
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Heart size={18} style={{ color: theme.colors.white }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', fontFamily: 'Inter, system-ui, sans-serif' }}>We're here to help!</div>
                  <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: '500' }}>Available 24/7</div>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: `rgba(255, 255, 255, 0.2)`,
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  padding: '6px',
                  color: theme.colors.white,
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Simple Content */}
            <div style={{ padding: '20px', backgroundColor: theme.colors.background }}>
              <div style={{ 
                fontSize: '13px', 
                color: theme.colors.text, 
                lineHeight: '1.5',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: '500',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>
                Have questions about our physiotherapy services? We're here to help you get the care you need.
              </div>
              
              {/* Simple WhatsApp Button */}
              <button
                onClick={() => handleWhatsAppOpen('Hi! I have a question about HealUI physiotherapy services.')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: theme.gradients.primary,
                  border: 'none',
                  borderRadius: '12px',
                  color: theme.colors.white,
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 4px 12px rgba(30, 95, 121, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 95, 121, 0.4)';
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.colors.primaryDark}, ${theme.colors.primary})`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 95, 121, 0.3)';
                  e.currentTarget.style.background = theme.gradients.primary;
                }}
              >
                💬 Chat with us
              </button>
              
              <div style={{ 
                fontSize: '11px', 
                color: theme.colors.gray[500], 
                textAlign: 'center',
                marginTop: '12px',
                fontWeight: '500',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>
                Quick response guaranteed
              </div>
            </div>
          </div>
        )}
        
        {/* Simple Floating Button */}
        <div style={{ position: 'relative' }}>
          {/* Trust Badge */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: `linear-gradient(135deg, ${theme.colors.success} 0%, #059669 100%)`,
            color: theme.colors.white,
            fontSize: '8px',
            fontWeight: '700',
            padding: '3px 6px',
            borderRadius: '10px',
            zIndex: 101,
            border: `2px solid ${theme.colors.white}`,
            boxShadow: `0 2px 8px rgba(16, 185, 129, 0.3)`,
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            24/7
          </div>
          
          {/* Main Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Open support chat"
            style={{
              width: isMobile ? '56px' : '52px',
              height: isMobile ? '56px' : '52px',
              borderRadius: '50%',
              background: theme.gradients.primary,
              border: `2px solid ${theme.colors.white}`,
              boxShadow: '0 4px 20px rgba(30, 95, 121, 0.12)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(30, 95, 121, 0.18)';
              e.currentTarget.style.borderColor = theme.colors.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(30, 95, 121, 0.12)';
              e.currentTarget.style.borderColor = theme.colors.white;
            }}
          >
            {isExpanded ? (
              <X size={isMobile ? 24 : 22} color={theme.colors.white} />
            ) : (
              <MessageCircle size={isMobile ? 24 : 22} color={theme.colors.white} fill={theme.colors.white} />
            )}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @media (max-width: 768px) {
          div[style*="bottom: 24px"] {
            bottom: 24px !important;
          }
        }
      `}</style>
    </>
  );
};

export default SmartFloatingSupport;