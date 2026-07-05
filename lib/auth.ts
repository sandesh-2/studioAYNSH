import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

// Singleton pool for auth — separate instance from Drizzle
const globalForAuthPool = globalThis as unknown as {
  authPool: Pool | undefined
}

const authPool =
  globalForAuthPool.authPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })

if (process.env.NODE_ENV !== 'production') globalForAuthPool.authPool = authPool

// Build trusted origins
const trustedOrigins: string[] = []
if (process.env.BETTER_AUTH_URL) trustedOrigins.push(process.env.BETTER_AUTH_URL)
if (process.env.VERCEL_PROJECT_PRODUCTION_URL) 
  trustedOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
if (process.env.VERCEL_URL) trustedOrigins.push(`https://${process.env.VERCEL_URL}`)
if (process.env.V0_RUNTIME_URL) trustedOrigins.push(process.env.V0_RUNTIME_URL)

// Build base URL with production-safe fallback
let baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.V0_RUNTIME_URL)

// Ensure baseURL is always set for auth to work
if (!baseURL) {
  baseURL = 'http://localhost:3000'
}

export const auth = betterAuth({
  database: authPool,
  baseURL,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'client' },
      phone: { type: 'string', required: false },
    },
  },
  ...(process.env.NODE_ENV === 'development' && {
    advanced: {
      defaultCookieAttributes: { sameSite: 'none', secure: true },
    },
  }),
})
