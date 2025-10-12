'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingSupport: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Show button after a delay to not distract on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show after 3 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleWhatsAppClick = () => {
    // Format: https://wa.me/country_code+number
    const phoneNumber = '917006672937'; // 91 is India country code
    const message = encodeURIComponent('Hi, I need help with HealUI physiotherapy booking.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Floating Button Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
      }}>
        {/* 24/7 Badge */}
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#dc2626',
          color: '#ffffff',
          fontSize: '9px',
          fontWeight: '700',
          padding: '2px 5px',
          borderRadius: '10px',
          border: '2px solid #ffffff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          zIndex: 101,
          letterSpacing: '0.5px',
        }}>
          24/7
        </div>
        
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isHovered ? '#128C7E' : '#25D366', // WhatsApp colors
            border: 'none',
            boxShadow: isHovered 
              ? '0 6px 24px rgba(37, 211, 102, 0.4)' 
              : '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.85,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
        <svg 
          viewBox="0 0 24 24" 
          style={{ 
            width: '24px', 
            height: '24px',
            fill: '#ffffff'
          }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        </button>
      </div>
      
      {/* Tooltip - Only on hover */}
      {isHovered && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease',
        }}>
          24/7 Support • Chat with us
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '20px',
            width: '8px',
            height: '8px',
            backgroundColor: '#1e293b',
            transform: 'rotate(45deg)',
          }} />
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 640px) {
          div[style*="position: fixed"] {
            bottom: 16px !important;
            right: 16px !important;
          }
          
          button {
            width: 44px !important;
            height: 44px !important;
          }
          
          svg {
            width: 22px !important;
            height: 22px !important;
          }
          
          div[style*="24/7"] {
            font-size: 8px !important;
            padding: 1px 4px !important;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingSupport;