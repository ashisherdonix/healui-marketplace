'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import LeafletMapPicker with no SSR
const LeafletMapPicker = dynamic(() => import('./LeafletMapPicker'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--lk-surfacevariant)',
      borderRadius: '0.5rem',
      border: '1px solid var(--lk-outline)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 style={{ 
          width: '2rem', 
          height: '2rem', 
          color: 'var(--lk-primary)',
          margin: '0 auto 0.5rem'
        }} className="animate-spin" />
        <p className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
          Loading map...
        </p>
      </div>
    </div>
  )
});

interface DynamicLeafletMapProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
  className?: string;
}

const DynamicLeafletMap: React.FC<DynamicLeafletMapProps> = (props) => {
  return <LeafletMapPicker {...props} />;
};

export default DynamicLeafletMap;