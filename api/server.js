/**
 * Fastify backend server for Stacks - Modern Library Web App
 * Provides API gateway and health check endpoints
 */

const fastify = require('fastify')({ logger: true });

// Health check route
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'stacks-api',
    version: '0.1.0'
  };
});

// API routes placeholder
fastify.register(async function (fastify) {
  // TODO: Add authentication routes
  // TODO: Add book search routes  
  // TODO: Add AI recommendation routes
  // TODO: Add queue management routes
  // TODO: Add reading streak routes
  
  fastify.get('/api/books/search', async (request, reply) => {
    // Placeholder for book search
    return { books: [], total: 0, query: request.query.q };
  });
  
  fastify.get('/api/recommendations', async (request, reply) => {
    // Placeholder for AI recommendations
    return { recommendations: [], mood: request.query.mood };
  });
});

// Error handling
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// CORS configuration for development
if (process.env.NODE_ENV === 'development') {
  fastify.register(require('@fastify/cors'), {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
  });
}

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '127.0.0.1';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Stacks API server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    fastify.log.info(`Received ${signal}, shutting down gracefully`);
    await fastify.close();
    process.exit(0);
  });
});

start(); 