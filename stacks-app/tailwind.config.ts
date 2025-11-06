import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // v2.0 Light mode - Warm Neutrals
        light: {
          primary: "#F4EFEA",      // Warm beige background
          secondary: "#FFFFFF",    // White cards
          tertiary: "#FAFAFA",     // Light gray
          text: "#383838",         // Dark charcoal
          textSecondary: "#6B6B6B", // Medium gray
          textTertiary: "#999999",  // Light gray
          border: "#383838",       // Dark borders
          borderSecondary: "#C4C4C4", // Light borders
        },
        // v2.0 Dark mode
        dark: {
          primary: "#1a1a1a",
          secondary: "#2a2a2a",
          tertiary: "#1f1f1f",
          text: "#ffffff",
          textSecondary: "#e0e0e0",
          textTertiary: "#999999",
          border: "#ffffff",
          borderSecondary: "#444444",
        },
        // v2.0 Accent Colors (Updated to match design system)
        accent: {
          cyan: "#6FC2FF",
          cyanHover: "#2BA5FF",
          yellow: "#EAC435",      // v2.0: Softer golden yellow (was bright neon)
          coral: "#FF7169",
          teal: "#53DBC9",
          purple: "#667eea",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-secondary": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "gradient-accent": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-success": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        "gradient-info": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-hero": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
      },
      fontSize: {
        // MotherDuck-inspired responsive typography
        'h1-mobile': ['30px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h1-tablet': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h1-desktop': ['80px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h2-mobile': ['24px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '900' }],
        'h2-tablet': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '900' }],
        'h2-desktop': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '900' }],
        'body-md': ['16px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      // v2.0 Shadows - Offset Style (MotherDuck-inspired)
      boxShadow: {
        "brutal-card": "-8px 8px 0 0 rgb(var(--shadow-color))",
        "brutal-button": "-4px 4px 0 0 rgb(var(--shadow-color))",
        "brutal-button-hover": "-6px 6px 0 0 rgb(var(--shadow-color))",
        "brutal-badge": "-3px 3px 0 0 rgb(var(--shadow-color))",
        "brutal-input-focus": "-5px 5px 0 0 #6FC2FF",
        "brutal-active": "-2px 2px 0 0 rgb(var(--shadow-color))",
      },
      // v2.0 Spacing - Generous breathing room (MotherDuck-inspired)
      spacing: {
        '14': '3.5rem',   // 56px - section spacing
        '18': '4.5rem',   // 72px - large spacing
        '20': '5rem',     // 80px - large gaps
        '22': '5.5rem',   // 88px - extra large
        '26': '6.5rem',   // 104px - major spacing
        '28': '7rem',     // 112px - major section breaks
        '32': '8rem',     // 128px - hero spacing
        '35': '8.75rem',  // 140px - bottom padding mobile
        '40': '10rem',    // 160px - major vertical rhythm
      },
      // v2.0 Border Widths - Contextual hierarchy
      borderWidth: {
        '5': '5px',  // Heavy (cards, CTAs)
        '3': '3px',  // Medium (badges)
        '2': '2px',  // Light (inputs, dividers)
      },
      // MotherDuck Responsive Grid System
      gridTemplateColumns: {
        // MotherDuck responsive grids
        'motherduck-mobile': '1fr',
        'motherduck-tablet': 'repeat(2, 1fr)',
        'motherduck-desktop': 'repeat(4, 1fr)',
        'motherduck-6col': 'repeat(6, 1fr)',
      },
      gap: {
        // MotherDuck gap scale
        '2': '8px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
      },
    },
  },
  plugins: [],
};

export default config;
