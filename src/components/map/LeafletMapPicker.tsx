'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet to avoid SSR issues
let L: typeof import('leaflet') | null = null;

// Initialize Leaflet only on client side
const initializeLeaflet = async () => {
  if (typeof window !== 'undefined' && !L) {
    try {
      L = (await import('leaflet')).default;
      
      // Fix for default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    } catch (error) {
      console.error('Failed to load Leaflet:', error);
      return null;
    }
  }
  return L;
};

interface LeafletMapPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
  className?: string;
}

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

const LeafletMapPicker: React.FC<LeafletMapPickerProps> = ({
  onLocationSelect,
  initialLat = 28.6139, // Default to Delhi
  initialLng = 77.2090,
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const initMap = async () => {
      try {
        const leaflet = await initializeLeaflet();
        if (!leaflet || !mapRef.current) {
          console.error('Leaflet failed to initialize or map ref not available');
          setLoading(false);
          return;
        }

        // Clear any existing map instance
        if (mapRef.current._leaflet_id) {
          delete mapRef.current._leaflet_id;
        }
        // Clear innerHTML to ensure clean state
        mapRef.current.innerHTML = '';

        // Create map instance
        const map = leaflet.map(mapRef.current).setView([initialLat, initialLng], 15);

        // Add OpenStreetMap tiles
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Create initial marker
        const marker = leaflet.marker([initialLat, initialLng], {
          draggable: true
        }).addTo(map);

        // Handle marker drag
        marker.on('dragend', () => {
          const position = marker.getLatLng();
          reverseGeocode(position.lat, position.lng);
        });

        // Handle map click
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          reverseGeocode(lat, lng);
        });

        mapInstance.current = map;
        markerRef.current = marker;
        setLoading(false);

        // Initial reverse geocode
        reverseGeocode(initialLat, initialLng);

      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Clear the map container
      if (mapRef.current) {
        if (mapRef.current._leaflet_id) {
          delete mapRef.current._leaflet_id;
        }
        mapRef.current.innerHTML = '';
      }
    };
  }, [initialLat, initialLng]);

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        onLocationSelect(lat, lng, data.display_name);
      } else {
        onLocationSelect(lat, lng);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      onLocationSelect(lat, lng);
    }
  };

  // Search for places
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=in`
      );
      const data: NominatimResult[] = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 500);
  };

  // Handle search result selection
  const handleResultSelect = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    if (mapInstance.current && markerRef.current) {
      mapInstance.current.setView([lat, lng], 16);
      markerRef.current.setLatLng([lat, lng]);
      onLocationSelect(lat, lng, result.display_name);
    }
    
    setSearchValue(result.display_name);
    setShowResults(false);
  };

  // Get current location
  const getCurrentLocation = () => {
    setSearchLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (mapInstance.current && markerRef.current) {
            mapInstance.current.setView([lat, lng], 16);
            markerRef.current.setLatLng([lat, lng]);
            reverseGeocode(lat, lng);
          }
          setSearchLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setSearchLoading(false);
          alert('Unable to get your current location. Please ensure location permissions are enabled.');
        }
      );
    } else {
      setSearchLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search style={{ width: '1rem', height: '1rem', color: 'var(--lk-onsurfacevariant)' }} />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          style={{
            width: '100%',
            paddingLeft: '2.5rem',
            paddingRight: '3rem',
            padding: '0.75rem',
            border: '2px solid var(--lk-outline)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            backgroundColor: 'var(--lk-surface)',
            color: 'var(--lk-onsurface)'
          }}
          className="w-full focus:outline-none focus:border-primary"
          placeholder="Search area or pincode (e.g., Delhi, 110001, Connaught Place)..."
        />
        <button
          onClick={getCurrentLocation}
          disabled={searchLoading}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--lk-primary)',
            opacity: searchLoading ? 0.5 : 1
          }}
          title="Use current location"
        >
          {searchLoading ? (
            <Loader2 style={{ width: '1rem', height: '1rem' }} className="animate-spin" />
          ) : (
            <Navigation style={{ width: '1rem', height: '1rem' }} />
          )}
        </button>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            zIndex: 9999,
            width: '100%',
            marginTop: '0.25rem',
            backgroundColor: 'var(--lk-surface)',
            border: '1px solid var(--lk-outline)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            maxHeight: '15rem',
            overflowY: 'auto'
          }}>
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleResultSelect(result)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--lk-outline)',
                  cursor: 'pointer',
                  color: 'var(--lk-onsurface)'
                }}
                className="hover:bg-surfacevariant"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <MapPin style={{ 
                    width: '1rem', 
                    height: '1rem', 
                    color: 'var(--lk-onsurfacevariant)', 
                    marginTop: '0.125rem',
                    marginRight: '0.5rem',
                    flexShrink: 0
                  }} />
                  <div>
                    <p className="lk-typography-body-medium" style={{ 
                      color: 'var(--lk-onsurface)',
                      marginBottom: '0.25rem'
                    }}>
                      {result.display_name}
                    </p>
                    {result.address && (
                      <p className="lk-typography-body-small" style={{ 
                        color: 'var(--lk-onsurfacevariant)'
                      }}>
                        {[result.address.city, result.address.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div style={{
        position: 'relative',
        border: '1px solid var(--lk-outline)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--lk-surfacevariant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
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
        )}
        <div
          ref={mapRef}
          style={{ height, width: '100%' }}
        />
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '0.75rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--lk-onsurfacevariant)'
        }}>
          Search area/pincode above or click on map to select location
        </div>
      </div>

      {/* Map Attribution */}
      <div className="lk-typography-label-small" style={{ 
        color: 'var(--lk-onsurfacevariant)', 
        textAlign: 'center' 
      }}>
        Map data © <a 
          href="https://www.openstreetmap.org/copyright" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--lk-primary)' }}
          className="hover:underline"
        >
          OpenStreetMap
        </a> contributors
      </div>
    </div>
  );
};

export default LeafletMapPicker;