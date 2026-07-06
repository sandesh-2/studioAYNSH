import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Singleton pattern — prevents connection pool exhaustion on hot reloads in dev
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
}

const isProduction = process.env.NODE_ENV === 'production'

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: isProduction ? { rejectUnauthorized: true } : false,
  })

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

export const db = drizzle(pool, { schema })
