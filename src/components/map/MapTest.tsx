'use client';

import React, { useState } from 'react';
import DynamicLeafletMap from './DynamicLeafletMap';

const MapTest: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setSelectedLocation({ lat, lng, address });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--lk-onsurface)' }}>
        Map Test Component
      </h2>
      
      <DynamicLeafletMap
        onLocationSelect={handleLocationSelect}
        height="400px"
      />
      
      {selectedLocation && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--lk-surfacevariant)',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: 'var(--lk-onsurface)', marginBottom: '0.5rem' }}>
            Selected Location:
          </h3>
          <p style={{ color: 'var(--lk-onsurface)', margin: '0.25rem 0' }}>
            <strong>Latitude:</strong> {selectedLocation.lat.toFixed(6)}
          </p>
          <p style={{ color: 'var(--lk-onsurface)', margin: '0.25rem 0' }}>
            <strong>Longitude:</strong> {selectedLocation.lng.toFixed(6)}
          </p>
          {selectedLocation.address && (
            <p style={{ color: 'var(--lk-onsurface)', margin: '0.25rem 0' }}>
              <strong>Address:</strong> {selectedLocation.address}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapTest;