'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import ApiManager from '@/services/api';
import Card from '@/components/card';
import Button from '@/components/button';
import PhysiotherapistCard from '@/components/shared/PhysiotherapistCard';
import { 
  Star, 
  TrendingUp, 
  MapPin, 
  ChevronRight,
  Award,
  Clock,
  Users
} from 'lucide-react';

interface FeaturedSectionProps {
  userLocation?: string;
}

interface TherapistProfile {
  id: string;
  full_name: string;
  consultation_fee: number;
  location: string;
  average_rating: number;
  years_of_experience?: number;
  is_verified?: boolean;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ userLocation }) => {
  const [featuredTherapists, setFeaturedTherapists] = useState<TherapistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedTherapists();
  }, [userLocation]);

  const loadFeaturedTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiManager.getFeaturedPhysiotherapists({
        location: userLocation,
        limit: 8
      });
      
      if (response.success && response.data && response.data.length > 0) {
        setFeaturedTherapists(response.data);
      } else {
        // If no featured physiotherapists, try a general search
        const searchResponse = await ApiManager.searchPhysiotherapists({
          location: userLocation,
          limit: 8
        });
        
        if (searchResponse.success && searchResponse.data && searchResponse.data.length > 0) {
          setFeaturedTherapists(searchResponse.data);
        } else {
          setFeaturedTherapists([]);
          setError('No physiotherapists are currently available on the platform.');
        }
      }
    } catch (error) {
      console.error('Featured therapists error:', error);
      setError('Unable to load physiotherapists. Please check your connection and try again.');
      setFeaturedTherapists([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="lk-typography-headline-medium" style={{ 
            color: 'var(--lk-onsurface)',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Featured Physiotherapists
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="fill" scaleFactor="headline">
                <div className="p-lg">
                  <div style={{
                    height: '200px',
                    backgroundColor: 'var(--lk-surfacevariant)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      border: '3px solid var(--lk-outline)',
                      borderTop: '3px solid var(--lk-primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <Card variant="fill" scaleFactor="headline">
            <div className="p-xl" style={{ textAlign: 'center' }}>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-error)' }}>
                {error}
              </div>
              <Button
                variant="text"
                color="primary"
                onClick={loadFeaturedTherapists}
                style={{ marginTop: '1rem' }}
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (featuredTherapists.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: '2rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: 'var(--lk-primary)' }} />
              <div className="lk-typography-headline-medium" style={{ color: 'var(--lk-onsurface)' }}>
                Featured Physiotherapists
              </div>
            </div>
            
            <Button
              variant="text"
              color="primary"
              onClick={() => window.location.href = '/search'}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              View All
              <ChevronRight style={{ width: '1rem', height: '1rem' }} />
            </Button>
          </div>
          
          <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
            {userLocation ? 
              `Top-rated physiotherapists near ${userLocation}` : 
              'Highly recommended physiotherapists across India'
            }
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <Card variant="fill" scaleFactor="headline">
            <div className="p-md" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Users style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                <span className="lk-typography-title-medium" style={{ color: 'var(--lk-primary)' }}>
                  {featuredTherapists.length}+
                </span>
              </div>
              <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                Featured Experts
              </div>
            </div>
          </Card>

          <Card variant="fill" scaleFactor="headline">
            <div className="p-md" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Star style={{ width: '1.25rem', height: '1.25rem', color: '#FFB800', fill: '#FFB800' }} />
                <span className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                  {featuredTherapists.length > 0 ? 
                    (featuredTherapists.reduce((sum, t) => sum + t.average_rating, 0) / featuredTherapists.length).toFixed(1) : 
                    '4.8'
                  }
                </span>
              </div>
              <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                Average Rating
              </div>
            </div>
          </Card>

          <Card variant="fill" scaleFactor="headline">
            <div className="p-md" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Award style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-tertiary)' }} />
                <span className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                  {featuredTherapists.length > 0 ? 
                    Math.round(featuredTherapists.reduce((sum, t) => sum + (t.years_of_experience || 8), 0) / featuredTherapists.length) : 
                    '10'
                  }+
                </span>
              </div>
              <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                Avg Experience
              </div>
            </div>
          </Card>

          <Card variant="fill" scaleFactor="headline">
            <div className="p-md" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Clock style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-secondary)' }} />
                <span className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                  24/7
                </span>
              </div>
              <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                Available
              </div>
            </div>
          </Card>
        </div>

        {/* Featured Therapists Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {featuredTherapists.slice(0, 6).map((therapist, index) => (
            <PhysiotherapistCard
              key={therapist.id || index}
              physiotherapist={{
                ...therapist,
                is_verified: index < 4 // Mark first 4 as verified for demo
              }}
              variant={index === 0 ? 'featured' : 'default'}
            />
          ))}
        </div>

        {/* Call to Action */}
        {featuredTherapists.length > 6 && (
          <Card variant="fill" scaleFactor="headline">
            <div className="p-xl" style={{ textAlign: 'center' }}>
              <div className="lk-typography-title-large" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem'
              }}>
                Find Your Perfect Physiotherapist
              </div>
              <div className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurfacevariant)',
                marginBottom: '1.5rem'
              }}>
                Browse through {featuredTherapists.length}+ verified professionals and book your appointment today
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="fill"
                  size="lg"
                  color="primary"
                  onClick={() => window.location.href = '/search'}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <MapPin style={{ width: '1rem', height: '1rem' }} />
                  Search Near Me
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  color="primary"
                  onClick={() => window.location.href = '/search?service_type=ONLINE'}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Online Consultation
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;