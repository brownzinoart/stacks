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
        // Light mode colors
        light: {
          primary: "#fafafa",
          secondary: "#ffffff",
          tertiary: "#f5f5f5",
          text: "#000000",
          textSecondary: "#333333",
          textTertiary: "#666666",
          border: "#000000",
          borderSecondary: "#e0e0e0",
        },
        // Dark mode colors
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
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-secondary": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "gradient-accent": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-success": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        "gradient-info": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-hero": "linear-gradient(135deg, #38f9d7 0%, #fee140 50%, #f5576c 100%)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brutal: "8px 8px 0 0 #000000",
        "brutal-sm": "4px 4px 0 0 #000000",
        "brutal-hover": "12px 12px 0 0 #000000",
        "brutal-badge": "3px 3px 0 0 #000000",
      },
    },
  },
  plugins: [],
};

export default config;
