/**
 * Next.js configuration for Stacks - Modern Library Web App
 * Enables App Router, TypeScript strict mode, PWA capabilities, and mobile testing
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable for Capacitor/mobile deployment
  output: 'export',
  // Allow dev requests from mobile devices
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['192.168.86.174', 'capacitor://localhost', '*.local'],
  }),
  images: {
    // Enable optimization for better performance
    unoptimized: false,
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
};

module.exports = nextConfig;
