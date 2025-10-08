import React, { useState } from 'react';
import { 
  Award, 
  IndianRupee, 
  Star, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { theme } from '@/utils/theme';

interface SmartFilterBarProps {
  onFilterChange: (filters: {
    sort_by: 'zone' | 'price' | 'rating' | 'distance' | 'experience';
  }) => void;
  defaultSort?: 'zone' | 'price' | 'rating' | 'distance' | 'experience';
}

const SmartFilterBar: React.FC<SmartFilterBarProps> = ({
  onFilterChange,
  defaultSort = 'zone'
}) => {
  const [activeSortBy, setActiveSortBy] = useState(defaultSort);

  const sortOptions = [
    { 
      value: 'zone' as const, 
      label: 'Best Match', 
      icon: Award,
      description: 'Recommended for you',
      displayLabel: 'Best Match'
    },
    { 
      value: 'price' as const, 
      label: 'Lowest Price', 
      icon: IndianRupee,
      description: 'Most affordable options',
      displayLabel: 'Price'
    },
    { 
      value: 'rating' as const, 
      label: 'Highest Rated', 
      icon: Star,
      description: 'Top rated by patients',
      displayLabel: 'Rating'
    },
    { 
      value: 'distance' as const, 
      label: 'Nearest', 
      icon: MapPin,
      description: 'Closest to you',
      displayLabel: 'Distance'
    },
    { 
      value: 'experience' as const, 
      label: 'Most Experienced', 
      icon: Clock,
      description: 'Senior specialists',
      displayLabel: 'Experience'
    }
  ];

  const handleSortChange = (sortValue: 'zone' | 'price' | 'rating' | 'distance' | 'experience') => {
    setActiveSortBy(sortValue);
    onFilterChange({ sort_by: sortValue });
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f0f0f0'
      }}
    >
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: 'bold', 
        margin: '0 0 16px 0',
        color: theme.colors.text.primary
      }}>
        Sort by Preference
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
        gap: '12px' 
      }}>
        {sortOptions.map((option) => {
          const IconComponent = option.icon;
          const isActive = activeSortBy === option.value;
          
          return (
            <div
              key={option.value}
              style={{
                backgroundColor: isActive ? theme.colors.primary : 'white',
                color: isActive ? 'white' : theme.colors.text.primary,
                border: `2px solid ${isActive ? theme.colors.primary : '#e0e0e0'}`,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 4px 12px rgba(33, 150, 243, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => handleSortChange(option.value)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <IconComponent 
                  size={24} 
                  color={isActive ? 'white' : theme.colors.primary}
                />
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    marginBottom: '4px' 
                  }}>
                    {option.displayLabel}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.8,
                    lineHeight: '1.3'
                  }}>
                    {option.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Filter Display */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '14px',
        color: theme.colors.text.secondary
      }}>
        <strong>Currently sorting by:</strong> {sortOptions.find(opt => opt.value === activeSortBy)?.label}
      </div>
    </div>
  );
};

export default SmartFilterBar;