/**
 * Next.js configuration for Stacks - Modern Library Web App
 * Enables App Router, TypeScript strict mode, PWA capabilities, and mobile testing
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable for Capacitor/mobile deployment
  output: 'export',
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
  // Security headers for production
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
    }

    return headers;
  },
  // Development server configuration
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      turbo: {
        loaders: {
          '.svg': ['@svgr/webpack'],
        },
      },
    },
  }),
};

module.exports = nextConfig;
