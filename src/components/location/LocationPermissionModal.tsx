'use client';

import React from 'react';
import { MapPin, X, ChevronRight } from 'lucide-react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onAllow,
  onDeny
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '420px',
        overflow: 'hidden',
        position: 'relative',
        animation: 'slideUp 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 0 24px',
          textAlign: 'center'
        }}>
          {/* Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#eff8ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <MapPin size={28} color="#1e5f79" />
          </div>
          
          {/* Title */}
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Enable Location Services
          </h3>
          
          {/* Description */}
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '1.5',
            marginBottom: '20px'
          }}>
            Get personalized service recommendations based on your area
          </p>
        </div>

        {/* Benefits List */}
        <div style={{
          padding: '0 24px 24px'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ChevronRight size={12} color="#ffffff" />
              </div>
              <span style={{ fontSize: '13px', color: '#475569' }}>
                Find physiotherapists near you instantly
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ChevronRight size={12} color="#ffffff" />
              </div>
              <span style={{ fontSize: '13px', color: '#475569' }}>
                Check service availability in your area
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ChevronRight size={12} color="#ffffff" />
              </div>
              <span style={{ fontSize: '13px', color: '#475569' }}>
                Get accurate travel time estimates
              </span>
            </div>
          </div>


          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onDeny}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
            >
              Not Now
            </button>
            
            <button
              onClick={onAllow}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: '#1e5f79',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e5f79';
              }}
            >
              Allow Location
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={18} color="#64748b" />
        </button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LocationPermissionModal;