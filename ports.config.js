/**
 * Centralized port configuration for development
 * SINGLE SOURCE OF TRUTH - Update this file to change ports across the entire app
 */

const PORTS = {
  // Frontend Next.js development server
  FRONTEND: 4000,
  
  // Backend Fastify API server  
  BACKEND: 4001,
  
  // Your development machine IP (update if network changes)
  DEV_IP: '192.168.86.190'
};

module.exports = PORTS;