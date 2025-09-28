'use client';

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '8px',
  className,
  style 
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#E5E7EB',
        background: 'linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style
      }}
    />
  );
};

const PhysiotherapistProfileSkeleton: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Skeleton for cover image */}
      <div style={{ position: 'relative' }}>
        <Skeleton height="400px" borderRadius="0" />
        
        {/* Skeleton for back button */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
        }}>
          <Skeleton width="80px" height="36px" />
        </div>

        {/* Skeleton for doctor info overlay */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          right: '30px',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Skeleton width="300px" height="36px" style={{ marginBottom: '12px' }} />
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <Skeleton width="120px" height="24px" />
              <Skeleton width="100px" height="30px" borderRadius="20px" />
              <Skeleton width="100px" height="30px" borderRadius="20px" />
              <Skeleton width="100px" height="30px" borderRadius="20px" />
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <Skeleton width="150px" height="24px" />
              <Skeleton width="150px" height="24px" />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Skeleton width="250px" height="20px" />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Skeleton width="80px" height="28px" borderRadius="12px" />
              <Skeleton width="90px" height="28px" borderRadius="12px" />
              <Skeleton width="85px" height="28px" borderRadius="12px" />
              <Skeleton width="70px" height="28px" borderRadius="12px" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Profile Card Skeleton */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginTop: '-40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            {/* Profile Image Skeleton */}
            <Skeleton width="150px" height="150px" borderRadius="12px" />
            
            {/* Bio Content Skeleton */}
            <div style={{ flex: 1 }}>
              <Skeleton width="80%" height="16px" style={{ marginBottom: '8px' }} />
              <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
              <Skeleton width="95%" height="16px" style={{ marginBottom: '8px' }} />
              <Skeleton width="75%" height="16px" />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 380px' }}>
          {/* Left Column Skeleton */}
          <div>
            {/* About Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <Skeleton width="120px" height="24px" style={{ marginBottom: '20px' }} />
              
              <div style={{ marginBottom: '24px' }}>
                <Skeleton width="100px" height="18px" style={{ marginBottom: '12px' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Skeleton width="60px" height="32px" borderRadius="20px" />
                  <Skeleton width="80px" height="32px" borderRadius="20px" />
                  <Skeleton width="70px" height="32px" borderRadius="20px" />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Skeleton width="80px" height="18px" style={{ marginBottom: '12px' }} />
                <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
                <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
                <Skeleton width="80%" height="16px" />
              </div>

              <div>
                <Skeleton width="100px" height="18px" style={{ marginBottom: '12px' }} />
                <div style={{ display: 'grid', gap: '12px' }}>
                  <Skeleton height="60px" />
                  <Skeleton height="60px" />
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <Skeleton width="150px" height="24px" style={{ marginBottom: '20px' }} />
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {[1, 2, 3].map((index) => (
                  <div key={index} style={{
                    padding: '16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Skeleton width="120px" height="20px" />
                      <Skeleton width="100px" height="16px" />
                    </div>
                    <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
                    <Skeleton width="90%" height="16px" />
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <Skeleton width="60px" height="24px" borderRadius="12px" />
                      <Skeleton width="70px" height="24px" borderRadius="12px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Section Skeleton */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              position: 'sticky',
              top: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <Skeleton width="200px" height="24px" style={{ marginBottom: '16px' }} />
              
              {/* Consultation Type Skeleton */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <Skeleton width="50%" height="40px" />
                <Skeleton width="50%" height="40px" />
              </div>

              {/* Calendar View Toggle Skeleton */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Skeleton width="50%" height="36px" />
                <Skeleton width="50%" height="36px" />
              </div>

              {/* Date Selection Skeleton */}
              <div style={{ marginBottom: '20px' }}>
                <Skeleton height="200px" />
              </div>

              {/* Time Slots Skeleton */}
              <Skeleton width="100px" height="20px" style={{ marginBottom: '12px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Skeleton key={index} height="40px" />
                ))}
              </div>

              {/* Book Button Skeleton */}
              <Skeleton height="48px" />
            </div>
          </div>
        </div>
      </div>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export { Skeleton, PhysiotherapistProfileSkeleton };