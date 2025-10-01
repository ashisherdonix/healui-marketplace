'use client';

import React, { useState, useEffect } from 'react';
import ApiManager from '@/services/api';
import Card from '@/components/card';
import Button from '@/components/button';
import { 
  Star, 
  User, 
  Calendar, 
  MessageSquare,
  ThumbsUp,
  Award,
  TrendingUp,
  Edit3,
  Trash2
} from 'lucide-react';

interface Review {
  id: string;
  visit_id: string;
  rating: number;
  review_text?: string;
  conditions_treated?: string[];
  tags?: string[];
  ratings_breakdown?: {
    professionalism: number;
    effectiveness: number;
    communication: number;
    punctuality: number;
    value_for_money: number;
  };
  created_at: string;
  updated_at: string;
  physiotherapist?: {
    id: string;
    full_name: string;
    specializations?: string[];
  };
  visit?: {
    id: string;
    scheduled_date: string;
    visit_mode: string;
    chief_complaint?: string;
  };
}

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getMyReviews();
      if (response.success && response.data) {
        setReviews(response.data as Review[]);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeMap = {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem'
    };
    
    return (
      <div style={{ display: 'flex', gap: '0.125rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{
              width: sizeMap[size],
              height: sizeMap[size],
              color: star <= rating ? 'gold' : 'var(--lk-outline)',
              fill: star <= rating ? 'gold' : 'none'
            }}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <Card variant="fill" scaleFactor="heading">
        <div className="p-xl" style={{ textAlign: 'center' }}>
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
            Loading your reviews...
          </div>
        </div>
      </Card>
    );
  }

  const avgRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Header Card */}
      <Card variant="fill" scaleFactor="heading">
        <div className="p-xl">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <div>
              <div className="lk-typography-headline-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem'
              }}>
                My Reviews
              </div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                Your feedback and reviews for physiotherapists
              </div>
            </div>
          </div>

          {/* Review Statistics */}
          {reviews.length > 0 && (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: '2rem',
              alignItems: 'center',
              padding: '1.5rem',
              backgroundColor: 'var(--lk-primarycontainer)',
              borderRadius: '1rem'
            }}>
              {/* Average Rating */}
              <div style={{ textAlign: 'center' }}>
                <div className="lk-typography-display-small" style={{ 
                  color: 'var(--lk-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {avgRating}
                </div>
                {renderStars(parseFloat(String(avgRating)), 'lg')}
                <div className="lk-typography-body-small" style={{ 
                  color: 'var(--lk-onprimarycontainer)',
                  marginTop: '0.5rem'
                }}>
                  Average Rating
                </div>
              </div>

              {/* Rating Distribution */}
              <div>
                <div className="lk-typography-label-medium" style={{ 
                  color: 'var(--lk-onprimarycontainer)',
                  marginBottom: '1rem'
                }}>
                  Rating Distribution
                </div>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem'
                    }}>
                      <span className="lk-typography-body-small" style={{ 
                        color: 'var(--lk-onprimarycontainer)',
                        minWidth: '1rem'
                      }}>
                        {rating}
                      </span>
                      {renderStars(1, 'sm')}
                      <div style={{ 
                        flex: 1,
                        height: '0.5rem',
                        backgroundColor: 'var(--lk-primary)',
                        borderRadius: '0.25rem',
                        opacity: 0.3
                      }}>
                        <div style={{
                          width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%`,
                          height: '100%',
                          backgroundColor: 'var(--lk-primary)',
                          borderRadius: '0.25rem'
                        }}></div>
                      </div>
                      <span className="lk-typography-body-small" style={{ 
                        color: 'var(--lk-onprimarycontainer)',
                        minWidth: '1.5rem'
                      }}>
                        {ratingDistribution[rating as keyof typeof ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div style={{ 
                display: 'grid',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div>
                  <div className="lk-typography-title-large" style={{ color: 'var(--lk-primary)' }}>
                    {reviews.length}
                  </div>
                  <div className="lk-typography-body-small" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                    Total Reviews
                  </div>
                </div>
                <div>
                  <div className="lk-typography-title-large" style={{ color: 'var(--lk-primary)' }}>
                    {reviews.filter(r => r.rating >= 4).length}
                  </div>
                  <div className="lk-typography-body-small" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                    Positive Reviews
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {reviews.map((review) => (
            <Card key={review.id} variant="fill" scaleFactor="heading">
              <div className="p-lg">
                <div style={{ 
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {/* Review Header */}
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="bg-primarycontainer" style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
                      </div>
                      <div>
                        <div className="lk-typography-body-large" style={{ 
                          color: 'var(--lk-onsurface)',
                          marginBottom: '0.25rem'
                        }}>
                          Dr. {review.physiotherapist?.full_name || 'Unknown Therapist'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar style={{ width: '0.875rem', height: '0.875rem', color: 'var(--lk-onsurfacevariant)' }} />
                          <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {renderStars(review.rating)}
                      <span className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Visit Details */}
                  {review.visit && (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: 'var(--lk-surfacevariant)',
                      borderRadius: '0.75rem'
                    }}>
                      <div className="lk-typography-label-medium" style={{ 
                        color: 'var(--lk-onsurfacevariant)',
                        marginBottom: '0.5rem'
                      }}>
                        Session Details:
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurface)' }}>
                          {review.visit.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online Consultation'}
                        </span>
                        {review.visit.chief_complaint && (
                          <>
                            <span style={{ color: 'var(--lk-onsurfacevariant)' }}>•</span>
                            <span className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurface)' }}>
                              {review.visit.chief_complaint}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Review Text */}
                  {review.review_text && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <MessageSquare style={{ width: '1rem', height: '1rem', color: 'var(--lk-onsurfacevariant)' }} />
                        <span className="lk-typography-label-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                          Your Review:
                        </span>
                      </div>
                      <div className="lk-typography-body-medium" style={{ 
                        color: 'var(--lk-onsurface)',
                        lineHeight: '1.5',
                        fontStyle: 'italic'
                      }}>
                        &ldquo;{review.review_text}&rdquo;
                      </div>
                    </div>
                  )}

                  {/* Detailed Ratings */}
                  {review.ratings_breakdown && (
                    <div>
                      <div className="lk-typography-label-medium" style={{ 
                        color: 'var(--lk-onsurfacevariant)',
                        marginBottom: '0.75rem'
                      }}>
                        Detailed Ratings:
                      </div>
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.75rem'
                      }}>
                        {Object.entries(review.ratings_breakdown).map(([category, rating]) => (
                          <div key={category} style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurface)' }}>
                              {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            {renderStars(rating, 'sm')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div>
                      <div className="lk-typography-label-medium" style={{ 
                        color: 'var(--lk-onsurfacevariant)',
                        marginBottom: '0.5rem'
                      }}>
                        Tags:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {review.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="lk-typography-label-small"
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: 'var(--lk-primarycontainer)',
                              color: 'var(--lk-onprimarycontainer)',
                              borderRadius: '1rem',
                              fontSize: '0.75rem'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditions Treated */}
                  {review.conditions_treated && review.conditions_treated.length > 0 && (
                    <div>
                      <div className="lk-typography-label-medium" style={{ 
                        color: 'var(--lk-onsurfacevariant)',
                        marginBottom: '0.5rem'
                      }}>
                        Conditions Treated:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {review.conditions_treated.map((condition, index) => (
                          <span
                            key={index}
                            className="lk-typography-label-small"
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: 'var(--lk-secondarycontainer)',
                              color: 'var(--lk-onsecondarycontainer)',
                              borderRadius: '1rem',
                              fontSize: '0.75rem'
                            }}
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="fill" scaleFactor="heading">
          <div className="p-xl" style={{ textAlign: 'center' }}>
            <Star style={{ 
              width: '4rem', 
              height: '4rem', 
              color: 'var(--lk-onsurfacevariant)',
              margin: '0 auto 1rem'
            }} />
            <div className="lk-typography-title-large" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.5rem'
            }}>
              No reviews yet
            </div>
            <div className="lk-typography-body-medium" style={{ 
              color: 'var(--lk-onsurfacevariant)',
              marginBottom: '2rem'
            }}>
              Complete a session and share your experience to help others find the best care
            </div>
            <Button
              variant="fill"
              size="lg"
              label="Book Your First Session"
              color="primary"
              onClick={() => window.location.href = '/'}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
            >
              <Calendar style={{ width: '1rem', height: '1rem' }} />
              Book Your First Session
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReviewsSection;