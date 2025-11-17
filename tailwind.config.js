/**
 * Tailwind CSS configuration for Stacks - Ultra Bold Gen Z Design
 * Vibrant, saturated colors with dramatic styling
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Ensure all gradient combinations are generated
    'bg-gradient-to-br',
    'from-primary-blue',
    'to-primary-teal',
    'from-primary-purple', 
    'to-primary-pink',
    'from-primary-orange',
    'from-primary-green',
    'text-gray-900',
    'text-white',
    // Complete gradient classes
    'bg-gradient-to-br from-primary-blue to-primary-teal',
    'bg-gradient-to-br from-primary-purple to-primary-pink',
    'bg-gradient-to-br from-primary-orange to-primary-pink', 
    'bg-gradient-to-br from-primary-green to-primary-teal',
  ],
  theme: {
    extend: {
      colors: {
        // v2.0 Light mode - Warm Neutrals
        light: {
          primary: '#F4EFEA',      // Warm beige background
          secondary: '#FFFFFF',    // White cards
          tertiary: '#FAFAFA',     // Light gray
          text: '#383838',         // Dark charcoal
          textSecondary: '#6B6B6B', // Medium gray
          textTertiary: '#999999',  // Light gray
          border: '#383838',       // Dark borders
          borderSecondary: '#C4C4C4', // Light borders
        },
        // v2.0 Dark mode
        dark: {
          primary: '#1a1a1a',
          secondary: '#2a2a2a',
          tertiary: '#1f1f1f',
          text: '#ffffff',
          textSecondary: '#e0e0e0',
          textTertiary: '#999999',
          border: '#ffffff',
          borderSecondary: '#444444',
        },
        // v2.0 Accent Colors
        accent: {
          cyan: '#6FC2FF',
          cyanHover: '#2BA5FF',
          yellow: '#EAC435',
          coral: '#FF7169',
          teal: '#53DBC9',
          purple: '#667eea',
        },
        // Ultra vibrant Gen Z colors (legacy)
        'primary-green': '#4ADE80',
        'primary-yellow': '#FBBF24',
        'primary-orange': '#FB7185',
        'primary-purple': '#A78BFA',
        'primary-teal': '#14B8A6',
        'primary-pink': '#EC4899',
        'primary-blue': '#3B82F6',
      },
      borderRadius: {
        card: '24px',
        'xl-card': '32px',
        pill: '999px',
      },
      boxShadow: {
        // v2.0 Shadows - Offset Style (MotherDuck-inspired)
        'brutal-card': '-8px 8px 0 0 rgb(var(--shadow-color))',
        'brutal-button': '-4px 4px 0 0 rgb(var(--shadow-color))',
        'brutal-button-hover': '-6px 6px 0 0 rgb(var(--shadow-color))',
        'brutal-badge': '-3px 3px 0 0 rgb(var(--shadow-color))',
        'brutal-input-focus': '-5px 5px 0 0 #6FC2FF',
        'brutal-active': '-2px 2px 0 0 rgb(var(--shadow-color))',
        // Legacy shadows
        card: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        mega: '0 32px 64px -12px rgba(0, 0, 0, 0.25)',
      },
      spacing: {
        card: '32px',
        'safe-area-inset-top': 'env(safe-area-inset-top)',
        // Accessibility touch targets
        'touch-sm': '36px',
        'touch-md': '44px', 
        'touch-lg': '52px',
      },
      fontWeight: {
        'extra-bold': '800',
        black: '900',
      },
      fontSize: {
        mega: ['clamp(2rem, 8vw, 4rem)', { lineHeight: '0.85', letterSpacing: '-0.03em' }],
        huge: ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }], // Reduced for mobile
        'xl-bold': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // Reduced for mobile
        // Responsive text sizes for mobile optimization
        'text-responsive-xl': ['1.25rem', { lineHeight: '1.4' }],
        'text-responsive-lg': ['1.125rem', { lineHeight: '1.4' }],
      },
      letterSpacing: {
        'super-tight': '-0.03em',
        'extra-tight': '-0.025em',
        tighter: '-0.02em',
        tight: '-0.01em',
      },
      lineHeight: {
        'super-tight': '0.85',
        'extra-tight': '0.9',
        tight: '0.95',
      },
      // Safe area utilities for iOS
      padding: {
        'safe-area-inset-top': 'env(safe-area-inset-top)',
        'safe-area-inset-right': 'env(safe-area-inset-right)',
        'safe-area-inset-bottom': 'env(safe-area-inset-bottom)',
        'safe-area-inset-left': 'env(safe-area-inset-left)',
      },
      // Accessibility design tokens
      minHeight: {
        'touch-sm': '36px',
        'touch-md': '44px',
        'touch-lg': '52px',
      },
      minWidth: {
        'touch-sm': '36px', 
        'touch-md': '44px',
        'touch-lg': '52px',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
