import React from 'react'
import Card from '@/components/card'
import Button from '@/components/button'

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'secondary' | 'tertiary'
  variant?: 'fill' | 'outline' | 'transparent'
  onLearnMore?: () => void
}

export function ServiceCard({
  icon,
  title,
  description,
  color,
  variant = 'fill',
  onLearnMore
}: ServiceCardProps) {
  const colorMap = {
    primary: {
      bg: 'bg-primarycontainer',
      iconColor: 'var(--lk-primary)'
    },
    secondary: {
      bg: 'bg-secondarycontainer', 
      iconColor: 'var(--lk-secondary)'
    },
    tertiary: {
      bg: 'bg-tertiarycontainer',
      iconColor: 'var(--lk-tertiary)'
    }
  }

  const colors = colorMap[color]

  return (
    <Card variant={variant} scaleFactor="headline">
      <div className="p-lg">
        <div 
          className={`${colors.bg} mb-md`}
          style={{ 
            width: '3rem', 
            height: '3rem', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            style: { 
              width: '1.5rem', 
              height: '1.5rem', 
              color: colors.iconColor 
            }
          })}
        </div>
        <div className="lk-typography-headline-small mb-sm">{title}</div>
        <div className="lk-typography-body-medium mb-md" style={{ color: 'var(--lk-onsurfacevariant)' }}>
          {description}
        </div>
        {onLearnMore && (
          <Button 
            variant="text" 
            size="md" 
            label="Learn more"
            onClick={onLearnMore}
          />
        )}
      </div>
    </Card>
  )
}