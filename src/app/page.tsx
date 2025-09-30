'use client';

import React, { useState, useEffect } from 'react';
import ApiManager from '@/services/api';
import Header from '@/components/layout/Header';
import CleanSearchBar from '@/components/search/CleanSearchBar';
import CleanPhysiotherapistCard from '@/components/shared/CleanPhysiotherapistCard';
import Card from '@/components/card';
import Button from '@/components/button';
import { theme } from '@/utils/theme';
import { 
  Search, 
  Users
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

interface Physiotherapist {
  id: string;
  full_name: string;
  specializations?: string[];
  years_of_experience?: number;
  average_rating: number;
  total_reviews: number;
  practice_address?: string;
  service_areas?: string;
  consultation_fee?: string;
  home_visit_fee?: string;
  profile_picture?: string;
  profile_photo_url?: string;
  cover_photo_url?: string;
  bio?: string;
  availability_status?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  is_verified?: boolean;
  home_visit_available?: boolean;
  online_consultation_available?: boolean;
  gender?: string;
}

const HomePage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Physiotherapist[]>([]);
  const [allPhysiotherapists, setAllPhysiotherapists] = useState<Physiotherapist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'part1' | 'part2' | 'part3' | 'complete'>('part1');

  // Rotating headlines with professional messaging
  const headlines = [
    {
      part1: "Physiotherapists",
      part2: "Extending", 
      part3: "Clinical Practice",
      subtitle: "Professional home rehabilitation by certified experts"
    },
    {
      part1: "Expert Practitioners",
      part2: "Extending",
      part3: "Clinical Care", 
      subtitle: "Bringing advanced physiotherapy to your home"
    },
    {
      part1: "Clinical Practice",
      part2: "Extended",
      part3: "Beyond Clinics",
      subtitle: "Senior physiotherapists delivering personalized home care"
    },
    {
      part1: "Leading Physiotherapists",
      part2: "Extending",
      part3: "Their Clinical Practice",
      subtitle: "Home-based professional consultations available"
    }
  ];

  useEffect(() => {
    // Get user's location for better recommendations
    getUserLocation();
    // Load all physiotherapists on page load
    loadAllPhysiotherapists();
  }, []);

  // Progressive reveal animation for headlines
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      if (animationPhase === 'part1') {
        setAnimationPhase('part2');
      } else if (animationPhase === 'part2') {
        setAnimationPhase('part3');
      } else if (animationPhase === 'part3') {
        setAnimationPhase('complete');
      }
    }, 400);

    return () => clearTimeout(animationTimer);
  }, [animationPhase]);

  // Rotate headlines every 5 seconds after complete animation
  useEffect(() => {
    if (animationPhase === 'complete') {
      const rotationTimer = setTimeout(() => {
        setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
        setAnimationPhase('part1');
      }, 5000);

      return () => clearTimeout(rotationTimer);
    }
  }, [animationPhase, currentHeadlineIndex, headlines.length]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In a real app, you'd reverse geocode this to get city name
          console.log('Location access granted');
        },
        () => {
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
        statusCode: featuredResponse.statusCode,
        message: featuredResponse.message,
        dataLength: featuredResponse.data ? (featuredResponse.data as unknown[]).length : 'null/undefined',
        fullResponse: featuredResponse
      });
      
      if (featuredResponse.success && featuredResponse.data && (featuredResponse.data as Physiotherapist[]).length > 0) {
        const physiotherapists = featuredResponse.data as Physiotherapist[];
        console.log('✅ Featured physiotherapists loaded successfully:', physiotherapists.length, 'items');
        console.log('📋 First physiotherapist sample:', physiotherapists[0]);
        setAllPhysiotherapists(physiotherapists);
        return;
      }

      // If no featured physiotherapists, try a general search
      console.log('🔄 Featured failed, trying searchPhysiotherapists with limit 50...');
      const searchResponse = await ApiManager.searchPhysiotherapists({
        limit: 50 // Show up to 50 physiotherapists
      });
      
      console.log('📊 Search physiotherapists response:', {
        success: searchResponse.success,
        statusCode: searchResponse.statusCode,
        message: searchResponse.message,
        dataLength: searchResponse.data ? (searchResponse.data as unknown[]).length : 'null/undefined',
        fullResponse: searchResponse
      });
      
      if (searchResponse.success && searchResponse.data && (searchResponse.data as Physiotherapist[]).length > 0) {
        const physiotherapists = searchResponse.data as Physiotherapist[];
        console.log('✅ Search physiotherapists loaded successfully:', physiotherapists.length, 'items');
        console.log('📋 First physiotherapist sample:', physiotherapists[0]);
        setAllPhysiotherapists(physiotherapists);
        return;
      }

      // If both API calls return empty data, set empty array and show appropriate message
      console.log('❌ Both API calls returned no data');
      setAllPhysiotherapists([]);
      setError('No physiotherapists are currently available on the platform.');
      
    } catch (error) {
      console.error('❌ Failed to load physiotherapists - Error details:', {
        error,
        message: (error as Error).message,
        stack: (error as Error).stack
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
      const apiParams: Record<string, string | number> = {};
      
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
        statusCode: response.statusCode,
        message: response.message,
        dataLength: response.data ? (response.data as unknown[]).length : 'null/undefined',
        fullResponse: response
      });
      
      if (response.success && response.data) {
        const physiotherapists = response.data as Physiotherapist[];
        console.log('✅ Search successful, found:', physiotherapists.length, 'physiotherapists');
        if (physiotherapists.length > 0) {
          console.log('📋 First search result sample:', physiotherapists[0]);
        }
        setSearchResults(physiotherapists);
        setError('');
      } else {
        console.log('❌ Search failed:', response.message);
        setError(response.message || 'Failed to search physiotherapists');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('❌ Search error - Full details:', {
        error,
        message: (error as Error).message,
        stack: (error as Error).stack
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
        
        {/* Clean Hero Section */}
        <section style={{ 
          backgroundColor: theme.colors.background,
          padding: 'clamp(2rem, 6vw, 4rem) 0',
          position: 'relative',
          backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.85)), url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}>
          <div style={{ 
            maxWidth: '700px',
            margin: '0 auto',
            padding: '0 clamp(1rem, 4vw, 1.5rem)',
            textAlign: 'center'
          }}>
            {/* Dynamic Headline with Progressive Animation */}
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4.5vw, 3.75rem)',
              fontWeight: '600',
              lineHeight: '1.2',
              color: theme.colors.text,
              marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
              fontFamily: '"IBM Plex Sans", "Source Sans Pro", system-ui, sans-serif',
              minHeight: 'clamp(4rem, 10vw, 9rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{
                  opacity: animationPhase === 'part1' || animationPhase === 'part2' || animationPhase === 'part3' || animationPhase === 'complete' ? 1 : 0,
                  transition: 'opacity 0.4s ease-in-out'
                }}>
                  {headlines[currentHeadlineIndex].part1}
                </span>
                <span style={{
                  opacity: animationPhase === 'part2' || animationPhase === 'part3' || animationPhase === 'complete' ? 1 : 0,
                  transform: animationPhase === 'part2' || animationPhase === 'part3' || animationPhase === 'complete' ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.4s ease-in-out',
                  color: theme.colors.primary,
                  fontWeight: '700'
                }}>
                  {headlines[currentHeadlineIndex].part2}
                </span>
                <span style={{
                  opacity: animationPhase === 'part3' || animationPhase === 'complete' ? 1 : 0,
                  transition: 'opacity 0.4s ease-in-out 0.1s'
                }}>
                  {headlines[currentHeadlineIndex].part3}
                </span>
              </div>
            </h1>

            <p style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
              color: theme.colors.gray[600],
              marginBottom: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto clamp(2rem, 5vw, 3rem)',
              opacity: animationPhase === 'complete' ? 1 : 0,
              transform: animationPhase === 'complete' ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.4s ease-in-out 0.2s',
              fontWeight: '500'
            }}>
              {headlines[currentHeadlineIndex].subtitle}
            </p>

            {/* Enhanced Search Bar */}
            <div style={{ 
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto clamp(2rem, 4vw, 3rem)'
            }}>
              <CleanSearchBar 
                onSearch={handleSearch}
                loading={loading}
              />
            </div>

            {/* Common Conditions */}
            <div>
              <p style={{
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                color: theme.colors.gray[600],
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                fontWeight: '500'
              }}>
                Common Conditions:
              </p>
              
              <div style={{
                display: 'flex',
                gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                {['Back Pain', 'Knee Pain', 'Neck Pain', 'Sports Injury', 'Post Surgery', 'Stroke Recovery'].map((condition, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log(`Selected condition: ${condition}`);
                      // You can implement search functionality here
                    }}
                    style={{
                      padding: 'clamp(0.375rem, 1.5vw, 0.625rem) clamp(0.75rem, 2.5vw, 1.125rem)',
                      backgroundColor: theme.colors.white,
                      border: `1px solid ${theme.colors.secondary}`,
                      borderRadius: '20px',
                      color: theme.colors.primary,
                      fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.primary;
                      e.currentTarget.style.color = theme.colors.white;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.white;
                      e.currentTarget.style.color = theme.colors.primary;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    }}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Responsive CSS */}
          <style jsx>{`
            @media (max-width: 768px) {
              section {
                padding: clamp(1.5rem, 5vw, 2.5rem) 0 !important;
                background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9)), url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80") !important;
              }
              
              section > div {
                padding: 0 clamp(1rem, 4vw, 1.25rem) !important;
              }
            }
            
            @media (max-width: 480px) {
              section {
                padding: clamp(1.25rem, 4vw, 2rem) 0 !important;
              }
              
              section > div {
                padding: 0 clamp(0.875rem, 3vw, 1rem) !important;
              }
              
              section > div > div:last-child > div {
                gap: clamp(0.375rem, 1.5vw, 0.5rem) !important;
              }
            }
            
            @media (max-width: 480px) {
              section > div > h1 {
                font-size: 1.5rem !important;
                line-height: 1.3 !important;
                min-height: 5rem !important;
              }
              
              section > div > p {
                font-size: 0.875rem !important;
              }
            }
            
            @media (max-width: 360px) {
              section > div > h1 {
                font-size: 1.25rem !important;
                line-height: 1.3 !important;
                min-height: 4rem !important;
              }
              
              section > div > h1 > div {
                flex-direction: column !important;
                gap: 0.25rem !important;
              }
              
              section > div > p {
                font-size: 0.8rem !important;
              }
              
              section > div > div:last-child > div {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 0.5rem !important;
                justify-items: center !important;
              }
              
              section > div > div:last-child > div > button {
                width: 100% !important;
                min-width: 0 !important;
                font-size: 0.7rem !important;
                padding: 0.375rem 0.5rem !important;
              }
            }
          `}</style>
        </section>

        {/* Results Section */}
        {searchPerformed ? (
          <section style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem) 0' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 1.5rem)' }}>
              
              {/* Search Results Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 'clamp(24px, 6vw, 32px)',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: 'clamp(20px, 5vw, 24px)',
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: '4px'
                  }}>
                    Search Results
                  </h2>
                  <p style={{ 
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    color: theme.colors.gray[500]
                  }}>
                    {searchResults.length} physiotherapists found
                  </p>
                </div>
                <button
                  onClick={handleClearSearch}
                  style={{
                    padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)',
                    backgroundColor: 'transparent',
                    color: theme.colors.gray[500],
                    border: `1px solid ${theme.colors.gray[200]}`,
                    borderRadius: '8px',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
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
                <Card variant="fill" scaleFactor="heading">
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
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', 
                  gap: 'clamp(16px, 4vw, 24px)' 
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
                <Card variant="fill" scaleFactor="heading">
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
          <section style={{ padding: 'clamp(1.5rem, 4vw, 2rem) 0' }} data-physiotherapists-section>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 1rem)' }}>
              

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
                <Card variant="fill" scaleFactor="heading">
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
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', 
                  gap: 'clamp(16px, 4vw, 24px)' 
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
                <Card variant="fill" scaleFactor="heading">
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