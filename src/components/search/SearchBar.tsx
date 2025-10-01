'use client';

import React, { useState, useEffect, useRef } from 'react';
import ApiManager from '@/services/api';
import Card from '@/components/card';
import Button from '@/components/button';
import { 
  Search, 
  MapPin, 
  Filter, 
  X, 
  Star,
  Calendar,
  DollarSign,
  User,
  Stethoscope
} from 'lucide-react';

interface SearchParams {
  query: string;
  location: string;
  specialization: string;
  service_type: 'HOME_VISIT' | 'ONLINE' | '';
  available_date: string;
  min_rating: string;
  max_price: string;
  gender: 'M' | 'F' | '';
}

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  onClear: () => void;
  loading?: boolean;
  variant?: 'hero' | 'compact';
}

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'city' | 'area' | 'pincode';
  display_name: string;
}

interface Specialization {
  id: string;
  name: string;
  category?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onClear, 
  loading = false,
  variant = 'hero'
}) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    location: '',
    specialization: '',
    service_type: '',
    available_date: '',
    min_rating: '',
    max_price: '',
    gender: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Load specializations on mount
  useEffect(() => {
    loadSpecializations();
  }, []);

  // Handle location search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchParams.location.length >= 2) {
        searchLocations(searchParams.location);
      } else {
        setLocationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams.location]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSpecializations = async () => {
    try {
      setLoadingSpecializations(true);
      const response = await ApiManager.getSpecializations();
      if (response.success && response.data) {
        setSpecializations(response.data as Specialization[]);
      }
    } catch (error) {
      console.error('Failed to load specializations:', error);
    } finally {
      setLoadingSpecializations(false);
    }
  };

  const searchLocations = async (query: string) => {
    try {
      setLoadingLocations(true);
      const response = await ApiManager.searchLocations(query, 8);
      if (response.success && response.data) {
        setLocationSuggestions(response.data as LocationSuggestion[]);
        setShowLocationDropdown(true);
      }
    } catch (error) {
      console.error('Failed to search locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSearchParams(prev => ({ ...prev, location: location.display_name }));
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
  };

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchParams({
      query: '',
      location: '',
      specialization: '',
      service_type: '',
      available_date: '',
      min_rating: '',
      max_price: '',
      gender: ''
    });
    setShowFilters(false);
    onClear();
  };

  const hasActiveFilters = Object.values(searchParams).some(value => value !== '');

  if (variant === 'compact') {
    return (
      <Card variant="fill" scaleFactor="heading">
        <div className="p-md">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={searchParams.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                placeholder="Search physiotherapists, conditions, treatments..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingLeft: '2.5rem',
                  border: '2px solid var(--lk-outline)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                color: 'var(--lk-onsurfacevariant)'
              }} />
            </div>

            {/* Action Buttons */}
            <Button
              variant={showFilters ? 'fill' : 'outline'}
              size="md"
              color="primary"
              label="Filters"
              startIcon="filter"
              onClick={() => setShowFilters(!showFilters)}
              style={{ minWidth: 'auto' }}
            />

            <Button
              variant="fill"
              size="md"
              color="primary"
              label={loading ? 'Searching...' : 'Search'}
              onClick={handleSearch}
              disabled={loading}
              style={{ minWidth: 'auto' }}
            />

            {hasActiveFilters && (
              <Button
                variant="text"
                size="md"
                color="primary"
                label="Clear"
                startIcon="x"
                onClick={handleClear}
                style={{ minWidth: 'auto' }}
              />
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Hero variant - Clean & Minimalistic
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {/* Clean Search - No Card Wrapper */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        alignItems: 'end'
      }}>
        
        {/* Search Query - Modern Design */}
        <div style={{ position: 'relative' }}>
          <input
            type="search"
            value={searchParams.query}
            onChange={(e) => handleInputChange('query', e.target.value)}
            placeholder="Search doctors, conditions, or treatments"
            className="border-solid border-width-3xs border-color-outline rounded-md bg-surface"
            style={{
              width: '100%',
              height: '3rem',
              paddingLeft: '3rem',
              paddingRight: '1rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={(e) => e.target.style.borderColor = 'var(--lk-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--lk-outline)'}
            aria-label="Search healthcare providers"
          />
          <Search style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '1rem',
            height: '1rem',
            color: 'var(--lk-onsurfacevariant)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Location - Modern Design */}
        <div ref={locationRef} style={{ position: 'relative' }}>
          <input
            ref={locationInputRef}
            type="text"
            value={searchParams.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, state, or ZIP code"
            className="border-solid border-width-3xs border-color-outline rounded-md bg-surface"
            style={{
              width: '100%',
              height: '3rem',
              paddingLeft: '3rem',
              paddingRight: '1rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--lk-primary)';
              if (searchParams.location.length >= 2) setShowLocationDropdown(true);
            }}
            onBlur={(e) => e.target.style.borderColor = 'var(--lk-outline)'}
            aria-label="Enter location"
          />
          <MapPin style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '1rem',
            height: '1rem',
            color: 'var(--lk-onsurfacevariant)',
            pointerEvents: 'none'
          }} />

          {/* Location Dropdown */}
          {showLocationDropdown && locationSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--lk-surface)',
              border: '1px solid var(--lk-outline)',
              borderTop: 'none',
              borderRadius: '0 0 0.75rem 0.75rem',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 100,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              {locationSuggestions.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--lk-onsurface)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--lk-surfacevariant)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MapPin style={{ width: '1rem', height: '1rem', color: 'var(--lk-onsurfacevariant)' }} />
                  <div>
                    <div className="lk-typography-body-medium">{location.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons - Modern Design */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant={showFilters ? 'fill' : 'outline'}
            size="md"
            color="primary"
            label="Filters"
            startIcon="filter"
            onClick={() => setShowFilters(!showFilters)}
            style={{ height: '3rem', minWidth: '6rem' }}
          />

          <Button
            variant="fill"
            size="md"
            color="primary"
            label={loading ? 'Searching...' : 'Search'}
            onClick={handleSearch}
            disabled={loading}
            style={{ height: '3rem', minWidth: '7rem' }}
          />
        </div>
      </div>

      {/* Advanced Filters - Mobile Responsive */}
      {showFilters && (
        <Card variant="fill" scaleFactor="heading">
          <div className="p-lg">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                Advanced Filters
              </div>
              <Button
                variant="text"
                size="sm"
                color="primary"
                label="Close"
                startIcon="x"
                onClick={() => setShowFilters(false)}
              />
            </div>

            {/* Mobile-First Filter Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              
              {/* Specialization */}
              <div>
                <div className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Stethoscope style={{ width: '1rem', height: '1rem' }} />
                  Specialization
                </div>
                <select
                  value={searchParams.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  disabled={loadingSpecializations}
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.name}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div>
                <div className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  Service Type
                </div>
                <select
                  value={searchParams.service_type}
                  onChange={(e) => handleInputChange('service_type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                >
                  <option value="">Both Home Visit & Online</option>
                  <option value="HOME_VISIT">Home Visit Only</option>
                  <option value="ONLINE">Online Consultation Only</option>
                </select>
              </div>

              {/* Available Date */}
              <div>
                <div className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Calendar style={{ width: '1rem', height: '1rem' }} />
                  Available Date
                </div>
                <input
                  type="date"
                  value={searchParams.available_date}
                  onChange={(e) => handleInputChange('available_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                />
              </div>

              {/* Min Rating */}
              <div>
                <div className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Star style={{ width: '1rem', height: '1rem' }} />
                  Minimum Rating
                </div>
                <select
                  value={searchParams.min_rating}
                  onChange={(e) => handleInputChange('min_rating', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="5">5 Stars Only</option>
                </select>
              </div>

              {/* Max Price */}
              <div>
                <div className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <DollarSign style={{ width: '1rem', height: '1rem' }} />
                  Max Price
                </div>
                <select
                  value={searchParams.max_price}
                  onChange={(e) => handleInputChange('max_price', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                >
                  <option value="">Any Price</option>
                  <option value="500">Under ₹500</option>
                  <option value="1000">Under ₹1000</option>
                  <option value="1500">Under ₹1500</option>
                  <option value="2000">Under ₹2000</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div>
                <div className="lk-typography-body-medium" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <User style={{ width: '1rem', height: '1rem' }} />
                  Gender Preference
                </div>
                <select
                  value={searchParams.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                >
                  <option value="">No Preference</option>
                  <option value="M">Male Physiotherapist</option>
                  <option value="F">Female Physiotherapist</option>
                </select>
              </div>
            </div>

            {/* Filter Actions - Mobile Responsive */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--lk-outline)',
              flexWrap: 'wrap'
            }}>
              <Button
                variant="text"
                size="md"
                color="primary"
                label="Clear All"
                onClick={handleClear}
              />
              <Button
                variant="fill"
                size="md"
                color="primary"
                label={loading ? 'Applying...' : 'Apply Filters'}
                onClick={handleSearch}
                disabled={loading}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;