/**
 * Environment variable utilities
 * Provides type-safe access and validation for environment variables
 */

/**
 * Get a required environment variable, throwing an error if not set
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Required environment variable ${key} is not set. ` +
      `Please add it to your .env.local file. See .env.example for reference.`
    );
  }
  return value;
}

/**
 * Get an optional environment variable, returning undefined if not set
 */
export function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

/**
 * Check if an environment variable is set
 */
export function hasEnv(key: string): boolean {
  return !!process.env[key];
}

/**
 * Validate required environment variables at startup (development only)
 * Call this in development to catch missing keys early
 */
export function validateEnvVars(): void {
  if (process.env.NODE_ENV === 'production') {
    return; // Skip in production to avoid startup overhead
  }

  const required: string[] = [];
  
  if (!hasEnv('ANTHROPIC_API_KEY')) {
    required.push('ANTHROPIC_API_KEY');
  }

  if (required.length > 0) {
    console.warn(
      `⚠️  Missing required environment variables:\n` +
      `   ${required.join(', ')}\n` +
      `   Add them to .env.local (see .env.example for reference)`
    );
  } else {
    console.log('✅ All required environment variables are set');
  }

  // Log optional keys status
  const optionalKeys = [
    'TMDB_API_KEY',
    'GOOGLE_BOOKS_API_KEY',
    'NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY',
    'NEXT_PUBLIC_NYT_API_KEY',
  ];

  const missingOptional = optionalKeys.filter(key => !hasEnv(key));
  if (missingOptional.length > 0) {
    console.log(
      `ℹ️  Optional environment variables not set: ${missingOptional.join(', ')}\n` +
      `   App will work without these, but some features may be limited.`
    );
  }
}

