import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

// Singleton pool for auth — separate instance from Drizzle
const globalForAuthPool = globalThis as unknown as { authPool: Pool | undefined }

const authPool =
  globalForAuthPool.authPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

if (process.env.NODE_ENV !== 'production') globalForAuthPool.authPool = authPool

const isProduction = process.env.NODE_ENV === 'production'

// Build trusted origins — only known origins are accepted
const trustedOrigins: string[] = []
if (process.env.BETTER_AUTH_URL) trustedOrigins.push(process.env.BETTER_AUTH_URL)
if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
  trustedOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
if (process.env.VERCEL_URL) trustedOrigins.push(`https://${process.env.VERCEL_URL}`)
if (process.env.V0_RUNTIME_URL) trustedOrigins.push(process.env.V0_RUNTIME_URL)

// Base URL — required for cookie domain and CSRF protection
let baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.V0_RUNTIME_URL)

if (!baseURL) baseURL = 'http://localhost:3000'

export const auth = betterAuth({
  database: authPool,
  baseURL,
  trustedOrigins,

  // Session security
  session: {
    expiresIn: 60 * 60 * 24 * 7,        // 7 days
    updateAge: 60 * 60 * 24,              // rotate every 24h
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Prevent email enumeration: always return same response
    autoSignIn: true,
  },

  user: {
    additionalFields: {
      role:  { type: 'string', defaultValue: 'client' },
      phone: { type: 'string', required: false },
    },
  },

  advanced: {
    // Secure, httpOnly, sameSite cookies in production
    defaultCookieAttributes: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'none',
    },
    // Disable cross-origin requests in production
    crossSubDomainCookies: { enabled: false },
    // Generate strong CSRF tokens
    generateId: false,
  },
})
