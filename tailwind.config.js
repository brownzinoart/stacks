/**
 * Tailwind CSS configuration for Stacks - Ultra Bold Gen Z Design
 * Vibrant, saturated colors with dramatic styling
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ultra vibrant Gen Z colors
        'primary-green': '#4ADE80',
        'primary-yellow': '#FBBF24',
        'primary-orange': '#FB7185',
        'primary-purple': '#A78BFA',
        'primary-teal': '#14B8A6',
        'primary-pink': '#EC4899',
        'primary-blue': '#3B82F6',

        // Background colors
        'bg-light': '#F8FAFC',
        'bg-dark': '#0F172A',

        // Text colors
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-white': '#FFFFFF',
      },
      borderRadius: {
        card: '24px',
        'xl-card': '32px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        mega: '0 32px 64px -12px rgba(0, 0, 0, 0.25)',
      },
      spacing: {
        card: '32px',
      },
      fontWeight: {
        'extra-bold': '800',
        black: '900',
      },
      fontSize: {
        mega: ['clamp(2rem, 8vw, 4rem)', { lineHeight: '0.85', letterSpacing: '-0.03em' }],
        huge: ['clamp(1.5rem, 6vw, 3rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'xl-bold': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
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
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
