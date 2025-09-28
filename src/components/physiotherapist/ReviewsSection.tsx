'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  patient_name: string;
  rating: number;
  review_text?: string;
  created_at: string;
  conditions_treated?: string[];
  tags?: string[];
}

interface ReviewsSectionProps {
  reviews: Review[];
  profile: {
    total_reviews?: number;
  };
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, profile }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #E5E7EB'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#1F2937',
        margin: '0 0 20px 0'
      }}>
        Patient Reviews ({profile.total_reviews || 0})
      </h3>
      
      {reviews.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: '20px',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ 
                    fontSize: '15px',
                    fontWeight: '600', 
                    color: '#1F2937',
                    marginBottom: '4px' 
                  }}>
                    {review.patient_name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: '16px',
                          height: '16px',
                          color: i < review.rating ? '#F59E0B' : '#E5E7EB',
                          fill: i < review.rating ? '#F59E0B' : '#E5E7EB'
                        }}
                      />
                    ))}
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '600',
                      color: '#1F2937',
                      marginLeft: '4px'
                    }}>
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: '#6B7280',
                  textAlign: 'right'
                }}>
                  {formatDate(review.created_at)}
                </div>
              </div>
              
              {review.review_text && (
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  "{review.review_text}"
                </div>
              )}
              
              {review.tags && review.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {review.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#EFF6FF',
                        color: '#1E40AF',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#6B7280'
        }}>
          <Star style={{ 
            width: '48px', 
            height: '48px', 
            margin: '0 auto 16px',
            opacity: 0.5
          }} />
          <div style={{ fontSize: '15px' }}>
            No reviews yet - be the first to leave a review!
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;