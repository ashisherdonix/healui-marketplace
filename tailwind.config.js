/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 70%), radial-gradient(circle at 80% 20%, rgba(78, 172, 109, 0.1) 0%, transparent 70%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.05) 0%, transparent 50%)',
      },
      colors: {
        primary: {
          50: '#eff8ff',    // Very light blue - background
          100: '#c8eaeb',   // Light teal - containers
          500: '#1e607a',   // Deep blue/teal - main brand
          900: '#000000',   // Pure black - text/emphasis
        },
        secondary: {
          50: '#eff8ff',    // Very light blue
          100: '#c8eaeb',   // Light teal
          500: '#1e607a',   // Deep blue/teal (same as primary)
          900: '#000000',   // Pure black
        },
        accent: {
          50: '#eff8ff',    // Very light blue
          100: '#c8eaeb',   // Light teal
          500: '#1e607a',   // Deep blue/teal
          900: '#000000',   // Pure black
        },
        // Professional Healthcare Color Palette
        healthcare: {
          'black': '#000000',        // Pure black
          'deep-blue': '#1e607a',    // Deep blue/teal
          'light-teal': '#c8eaeb',   // Light teal
          'light-blue': '#eff8ff',   // Very light blue
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
    },
  },
  safelist: [
    {
      pattern: /bg-(primary|secondary|accent|success|warning|error|info|neutral)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  plugins: [],
}