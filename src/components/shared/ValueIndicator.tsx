import React from 'react';
import { ThumbsUp, Award, CheckCircle } from 'lucide-react';
import { theme } from '@/utils/theme';

interface ValueIndicatorProps {
  score?: number;
  style?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
}

const ValueIndicator: React.FC<ValueIndicatorProps> = ({
  score,
  style = {},
  size = 'medium'
}) => {
  if (!score || score < 70) return null;

  const getIndicatorInfo = (score: number) => {
    if (score > 90) {
      return { 
        text: 'Excellent Choice', 
        color: '#4CAF50',
        backgroundColor: '#E8F5E9',
        icon: Award
      };
    }
    if (score > 80) {
      return { 
        text: 'Great Value', 
        color: theme.colors.primary,
        backgroundColor: '#E3F2FD',
        icon: ThumbsUp
      };
    }
    return { 
      text: 'Good Option', 
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
      icon: CheckCircle
    };
  };

  const sizeConfig = {
    small: {
      padding: '4px 8px',
      fontSize: '11px',
      iconSize: 12,
      borderRadius: '12px'
    },
    medium: {
      padding: '6px 12px',
      fontSize: '12px',
      iconSize: 14,
      borderRadius: '16px'
    },
    large: {
      padding: '8px 16px',
      fontSize: '14px',
      iconSize: 16,
      borderRadius: '20px'
    }
  };

  const { text, color, backgroundColor, icon: IconComponent } = getIndicatorInfo(score);
  const config = sizeConfig[size];

  return (
    <div
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor,
        color,
        padding: config.padding,
        borderRadius: config.borderRadius,
        fontSize: config.fontSize,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        border: `1px solid ${color}20`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 2,
        ...style
      }}
    >
      <IconComponent size={config.iconSize} />
      {text}
    </div>
  );
};

export default ValueIndicator;