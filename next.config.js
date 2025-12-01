/**
 * Next.js configuration for Stacks - Modern Library Web App
 * Pages Router configuration - eliminates RSC compatibility issues with Capacitor
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for iOS builds only (not in development)
  // In development, we need server-side API routes to work
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  skipTrailingSlashRedirect: true,

  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Allow cross-origin requests from iOS device
  devIndicators: {
    allowedHosts: ['192.168.86.190', 'localhost'],
  },
  
  // Disable caching in development to prevent persistent cache issues
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      turbo: {
        memoryLimit: 2048,
      },
    },
  }),
  
  // Pages Router doesn't need RSC experimental flags
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
      },
      {
        protocol: 'https',
        hostname: 'www.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'archive.org',
      },
    ],
  },
  // Enable webpack bundle analyzer in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable webpack caching in development
      config.cache = false;
      
      // Add bundle analyzer for debugging
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
  // Security headers for production, CORS for development
  async headers() {
    const headers = [];

    if (process.env.NODE_ENV === 'production') {
      headers.push({
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https:",
              "manifest-src 'self'",
              "worker-src 'self'",
            ].join('; '),
          },
        ],
      });
    } else {
      // Development CORS headers for iOS + Cache busting
      headers.push({
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      });
    }

    return headers;
  },
  // Trailing slash only required for static export (production)
  ...(process.env.NODE_ENV === 'production' && { trailingSlash: true }),
  // Updated Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': ['@svgr/webpack'],
    },
  },
  // Server external packages for mobile compatibility
  serverExternalPackages: [],
  // Force static build ID for consistency
  generateBuildId: () => 'static-build',
};

module.exports = nextConfig;
