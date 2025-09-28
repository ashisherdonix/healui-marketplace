export const theme = {
  colors: {
    primary: '#1e5f79',      // Deep blue - primary brand color
    secondary: '#c8eaeb',    // Light cyan - secondary accent
    background: '#eff8ff',   // Very light blue - background
    text: '#000000',         // Black - primary text
    
    // Derived colors
    primaryDark: '#164a5e',  // Darker shade of primary
    primaryLight: '#2b7a9b', // Lighter shade of primary
    secondaryDark: '#a5d6d7', // Darker shade of secondary
    
    // Functional colors
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Gradients using theme colors
  gradients: {
    primary: 'linear-gradient(135deg, #1e5f79, #2b7a9b)',
    hero: 'linear-gradient(135deg, rgba(30, 95, 121, 0.95), rgba(200, 234, 235, 0.9))',
    card: 'linear-gradient(135deg, #1e5f79, #c8eaeb)',
    overlay: 'linear-gradient(135deg, rgba(30, 95, 121, 0.8), rgba(200, 234, 235, 0.6))',
  }
};