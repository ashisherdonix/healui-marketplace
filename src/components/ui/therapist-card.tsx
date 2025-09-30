import React from 'react'
import Image from 'next/image'
import Card from '@/components/card'
import Button from '@/components/button'

interface TherapistCardProps {
  name: string
  title: string
  image?: string
  rating: number
  reviewCount: number
  experience: string
  specialization: string[]
  availability: string
  location?: string
  isVideoAvailable?: boolean
  onBookSession?: () => void
  onViewProfile?: () => void
}

export function TherapistCard({
  name,
  title,
  image,
  rating,
  reviewCount,
  experience,
  specialization,
  availability,
  location,
  isVideoAvailable = false,
  onBookSession,
  onViewProfile
}: TherapistCardProps) {
  return (
    <Card variant="fill" scaleFactor="headline" material="glass">
      <div className="p-lg">
        <div className="display-flex align-items-start gap-md mb-md">
          <div 
            className="bg-surfacevariant"
            style={{ 
              width: '4rem', 
              height: '4rem', 
              borderRadius: '50%', 
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            {image && <Image src={image} alt={name} width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div className="lk-typography-headline-small">{name}</div>
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>{title}</div>
            <div className="display-flex align-items-center gap-2xs" style={{ marginTop: '0.25rem' }}>
              <div style={{ color: 'var(--lk-tertiary)', fontSize: '1rem' }}>★</div>
              <span className="lk-typography-label-medium">{rating.toFixed(1)} ({reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        
        <div className="mb-md">
          <div className="display-flex align-items-center gap-2xs mb-2xs">
            <div style={{ color: 'var(--lk-primary)', fontSize: '1rem' }}>🕒</div>
            <span className="lk-typography-body-small">{experience} experience</span>
          </div>
          
          {isVideoAvailable && (
            <div className="display-flex align-items-center gap-2xs mb-2xs">
              <div style={{ color: 'var(--lk-primary)', fontSize: '1rem' }}>📞</div>
              <span className="lk-typography-body-small">Available for video consultation</span>
            </div>
          )}
          
          {location && (
            <div className="display-flex align-items-center gap-2xs mb-2xs">
              <div style={{ color: 'var(--lk-primary)', fontSize: '1rem' }}>📍</div>
              <span className="lk-typography-body-small">{location}</span>
            </div>
          )}
          
          <div className="display-flex align-items-start gap-2xs mb-2xs">
            <div style={{ color: 'var(--lk-primary)', fontSize: '1rem', marginTop: '0.125rem' }}>🏆</div>
            <div style={{ flex: 1 }}>
              <span className="lk-typography-body-small">
                {specialization.join(', ')}
              </span>
            </div>
          </div>
          
          <div className="display-flex align-items-center gap-2xs">
            <div style={{ color: 'var(--lk-primary)', fontSize: '1rem' }}>✉️</div>
            <span className="lk-typography-body-small">{availability}</span>
          </div>
        </div>
        
        <div className="display-flex gap-sm">
          <Button 
            variant="fill" 
            size="md" 
            label="Book Session"
            onClick={onBookSession}
          />
          <Button 
            variant="outline" 
            size="md"
            label="View Profile"
            onClick={onViewProfile}
          />
        </div>
      </div>
    </Card>
  )
}