'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import ApiManager from '@/services/api';
import Header from '@/components/layout/Header';
import CleanSearchBar from '@/components/search/CleanSearchBar';
import CleanPhysiotherapistCard from '@/components/shared/CleanPhysiotherapistCard';
import Card from '@/components/card';
import Button from '@/components/button';
import { theme } from '@/utils/theme';
import { 
  Search, 
  Users,
  MapPin,
  Shield,
  Clock,
  Star,
  Award,
  CheckCircle,
  Phone,
  Calendar,
  ArrowRight,
  Building2,
  Globe,
  Video
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

const HomePage: React.FC = () => {
  const { therapists } = useAppSelector((state) => state.therapist);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allPhysiotherapists, setAllPhysiotherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');

  useEffect(() => {
    // Get user's location for better recommendations
    getUserLocation();
    // Load all physiotherapists on page load
    loadAllPhysiotherapists();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode this to get city name
          setUserLocation('Your Location');
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  };

  const loadAllPhysiotherapists = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Loading physiotherapists - Starting API calls...');
      
      // First try to get featured physiotherapists
      console.log('🔄 Calling getFeaturedPhysiotherapists with limit 50...');
      const featuredResponse = await ApiManager.getFeaturedPhysiotherapists({
        limit: 50 // Get more physiotherapists
      });
      
      console.log('📊 Featured physiotherapists response:', {
        success: featuredResponse.success,
        status: featuredResponse.status,
        message: featuredResponse.message,
        dataLength: featuredResponse.data ? featuredResponse.data.length : 'null/undefined',
        fullResponse: featuredResponse
      });
      
      if (featuredResponse.success && featuredResponse.data && featuredResponse.data.length > 0) {
        console.log('✅ Featured physiotherapists loaded successfully:', featuredResponse.data.length, 'items');
        console.log('📋 First physiotherapist sample:', featuredResponse.data[0]);
        setAllPhysiotherapists(featuredResponse.data);
        return;
      }

      // If no featured physiotherapists, try a general search
      console.log('🔄 Featured failed, trying searchPhysiotherapists with limit 50...');
      const searchResponse = await ApiManager.searchPhysiotherapists({
        limit: 50 // Show up to 50 physiotherapists
      });
      
      console.log('📊 Search physiotherapists response:', {
        success: searchResponse.success,
        status: searchResponse.status,
        message: searchResponse.message,
        dataLength: searchResponse.data ? searchResponse.data.length : 'null/undefined',
        fullResponse: searchResponse
      });
      
      if (searchResponse.success && searchResponse.data && searchResponse.data.length > 0) {
        console.log('✅ Search physiotherapists loaded successfully:', searchResponse.data.length, 'items');
        console.log('📋 First physiotherapist sample:', searchResponse.data[0]);
        setAllPhysiotherapists(searchResponse.data);
        return;
      }

      // If both API calls return empty data, set empty array and show appropriate message
      console.log('❌ Both API calls returned no data');
      setAllPhysiotherapists([]);
      setError('No physiotherapists are currently available on the platform.');
      
    } catch (error) {
      console.error('❌ Failed to load physiotherapists - Error details:', {
        error,
        message: error.message,
        stack: error.stack
      });
      setError('Unable to load physiotherapists at this time. Please check your connection and try again.');
      setAllPhysiotherapists([]);
    } finally {
      console.log('🏁 Loading physiotherapists completed');
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams: SearchParams) => {
    setLoading(true);
    setError('');
    setSearchPerformed(true);

    try {
      console.log('🔍 Starting search with params:', searchParams);
      
      // Convert search params to API params
      const apiParams: any = {};
      
      if (searchParams.query) apiParams.query = searchParams.query;
      if (searchParams.location) apiParams.location = searchParams.location;
      if (searchParams.specialization) apiParams.specialization = searchParams.specialization;
      if (searchParams.service_type) apiParams.service_type = searchParams.service_type;
      if (searchParams.available_date) apiParams.available_date = searchParams.available_date;
      if (searchParams.min_rating) apiParams.min_rating = parseFloat(searchParams.min_rating);
      if (searchParams.max_price) apiParams.max_price = parseInt(searchParams.max_price);
      if (searchParams.gender) apiParams.gender = searchParams.gender;

      console.log('🔄 Calling searchPhysiotherapists with processed params:', apiParams);
      const response = await ApiManager.searchPhysiotherapists(apiParams);
      
      console.log('📊 Search response:', {
        success: response.success,
        status: response.status,
        message: response.message,
        dataLength: response.data ? response.data.length : 'null/undefined',
        fullResponse: response
      });
      
      if (response.success && response.data) {
        console.log('✅ Search successful, found:', response.data.length, 'physiotherapists');
        if (response.data.length > 0) {
          console.log('📋 First search result sample:', response.data[0]);
        }
        setSearchResults(response.data);
        setError('');
      } else {
        console.log('❌ Search failed:', response.message);
        setError(response.message || 'Failed to search physiotherapists');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('❌ Search error - Full details:', {
        error,
        message: error.message,
        stack: error.stack
      });
      setError('An error occurred while searching. Please try again.');
      setSearchResults([]);
    } finally {
      console.log('🏁 Search completed');
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearchPerformed(false);
    setError('');
    // Reload all physiotherapists when clearing search
    loadAllPhysiotherapists();
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background }}>
        
        {/* Simple Hero Section */}
        <section style={{ 
          backgroundColor: theme.colors.background,
          padding: '60px 0',
          position: 'relative'
        }}>
          <div style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '48px',
              alignItems: 'center'
            }}>
              
              {/* Left Content */}
              <div>
                {/* Simple Headline */}
                <h1 style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: '700',
                  lineHeight: '1.3',
                  color: theme.colors.text,
                  marginBottom: '16px'
                }}>
                  Book Physiotherapists Near You
                </h1>

                <p style={{
                  fontSize: '18px',
                  color: theme.colors.gray[600],
                  marginBottom: '32px',
                  lineHeight: '1.5'
                }}>
                  Home visits and online consultations available
                </p>

                {/* Search Bar */}
                <div style={{ marginBottom: '24px' }}>
                  <CleanSearchBar 
                    onSearch={handleSearch}
                    loading={loading}
                  />
                </div>

                {/* Popular Locations */}
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: theme.colors.gray[600],
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}>
                    Popular Locations:
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {['Delhi', 'Mumbai', 'Bangalore', 'Gurgaon', 'Pune', 'Chennai'].map((city, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          console.log(`Selected city: ${city}`);
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: theme.colors.white,
                          border: `1px solid ${theme.colors.secondary}`,
                          borderRadius: '20px',
                          color: theme.colors.primary,
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.primary;
                          e.currentTarget.style.color = theme.colors.white;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.white;
                          e.currentTarget.style.color = theme.colors.primary;
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div style={{ 
                position: 'relative',
                height: '400px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(30, 95, 121, 0.2)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Professional physiotherapist providing treatment"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {/* Subtle overlay for better image aesthetics */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(30, 95, 121, 0.1), rgba(200, 234, 235, 0.1))'
                }} />
              </div>
            </div>
          </div>

          {/* Mobile Responsive CSS */}
          <style jsx>{`
            @media (max-width: 768px) {
              section > div > div {
                grid-template-columns: 1fr !important;
                gap: 32px !important;
                text-align: center;
              }
              
              section > div > div > div:first-child {
                order: 2;
              }
              
              section > div > div > div:last-child {
                order: 1;
                height: 280px !important;
                margin: 0 auto;
                max-width: 400px;
              }
            }
            
            @media (max-width: 480px) {
              section > div {
                padding: 0 16px !important;
              }
            }
          `}</style>
        </section>

        {/* Results Section */}
        {searchPerformed ? (
          <section style={{ padding: '48px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
              
              {/* Search Results Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '32px'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: '24px',
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: '4px'
                  }}>
                    Search Results
                  </h2>
                  <p style={{ 
                    fontSize: '16px',
                    color: theme.colors.gray[500]
                  }}>
                    {searchResults.length} physiotherapists found
                  </p>
                </div>
                <button
                  onClick={handleClearSearch}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: theme.colors.gray[500],
                    border: `1px solid ${theme.colors.gray[200]}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.color = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.gray[200];
                    e.currentTarget.style.color = theme.colors.gray[500];
                  }}
                >
                  Back to All
                </button>
              </div>

              {/* Loading State */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid var(--lk-outline)',
                    borderTop: '3px solid var(--lk-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                    Finding the best physiotherapists for you...
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card variant="fill" scaleFactor="headline">
                  <div className="p-xl" style={{ textAlign: 'center' }}>
                    <div className="lk-typography-body-medium" style={{ color: 'var(--lk-error)', marginBottom: '1rem' }}>
                      {error}
                    </div>
                    <Button
                      variant="fill"
                      color="primary"
                      label="Try Again"
                      onClick={handleClearSearch}
                    />
                  </div>
                </Card>
              )}

              {/* Search Results */}
              {!loading && !error && searchResults.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
                  gap: '24px' 
                }}>
                  {searchResults.map((physio, index) => (
                    <CleanPhysiotherapistCard
                      key={physio.id || index}
                      physiotherapist={physio}
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && !error && searchResults.length === 0 && (
                <Card variant="fill" scaleFactor="headline">
                  <div className="p-xl" style={{ textAlign: 'center' }}>
                    <Search style={{ 
                      width: '4rem', 
                      height: '4rem', 
                      color: 'var(--lk-onsurfacevariant)',
                      margin: '0 auto 1rem'
                    }} />
                    <div className="lk-typography-title-large" style={{ 
                      color: 'var(--lk-onsurface)',
                      marginBottom: '0.5rem'
                    }}>
                      No results found
                    </div>
                    <div className="lk-typography-body-medium" style={{ 
                      color: 'var(--lk-onsurfacevariant)',
                      marginBottom: '2rem'
                    }}>
                      Try a different search
                    </div>
                    <Button
                      variant="fill"
                      color="primary"
                      label="View All"
                      onClick={handleClearSearch}
                    />
                  </div>
                </Card>
              )}

              {/* Clear Search */}
              {!loading && (searchResults.length > 0 || error) && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Button
                    variant="text"
                    color="primary"
                    label="← Back"
                    onClick={handleClearSearch}
                  />
                </div>
              )}
            </div>
          </section>
        ) : (
          /* Physiotherapists Section */
          <section style={{ padding: '2rem 0' }} data-physiotherapists-section>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
              

              {/* Loading State */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid var(--lk-outline)',
                    borderTop: '3px solid var(--lk-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                    Loading physiotherapists...
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card variant="fill" scaleFactor="headline">
                  <div className="p-xl" style={{ textAlign: 'center' }}>
                    <div className="lk-typography-body-medium" style={{ color: 'var(--lk-error)', marginBottom: '1rem' }}>
                      {error}
                    </div>
                    <Button
                      variant="fill"
                      color="primary"
                      label="Retry Loading"
                      onClick={loadAllPhysiotherapists}
                    />
                  </div>
                </Card>
              )}

              {/* Physiotherapists Grid */}
              {!loading && !error && allPhysiotherapists.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
                  gap: '24px' 
                }}>
                  {allPhysiotherapists.map((physio, index) => (
                    <CleanPhysiotherapistCard
                      key={physio.id || index}
                      physiotherapist={physio}
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && allPhysiotherapists.length === 0 && !error && (
                <Card variant="fill" scaleFactor="headline">
                  <div className="p-xl" style={{ textAlign: 'center' }}>
                    <Users style={{ 
                      width: '4rem', 
                      height: '4rem', 
                      color: 'var(--lk-onsurfacevariant)',
                      margin: '0 auto 1rem'
                    }} />
                    <div className="lk-typography-title-large" style={{ 
                      color: 'var(--lk-onsurface)',
                      marginBottom: '0.5rem'
                    }}>
                      No physiotherapists found
                    </div>
                    <div className="lk-typography-body-medium" style={{ 
                      color: 'var(--lk-onsurfacevariant)',
                      marginBottom: '2rem'
                    }}>
                      The API returned no physiotherapists. Please check with the backend team or try again later.
                    </div>
                    <Button
                      variant="fill"
                      color="primary"
                      label="Contact Support"
                      onClick={() => window.location.href = 'tel:+1-800-HEALUI'}
                      startIcon="phone"
                    />
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Removed promotional sections */}
      </div>
    </>
  );
};

export default HomePage;