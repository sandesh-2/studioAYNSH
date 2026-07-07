# Security Documentation

## Security Overview

Studio AYNSH implements comprehensive security measures to protect user data, prevent attacks, and ensure platform reliability. This document outlines all security practices and vulnerability mitigation strategies.

## Authentication & Authorization

### Password Security
- Passwords hashed with bcrypt via Better Auth
- Minimum 8 characters required
- Password strength validation on registration
- Secure password reset via email token

### Session Management
- HTTP-only secure cookies (prevents XSS token theft)
- 30-day default session expiration
- Secure cookie flags:
  - `Secure`: HTTPS only
  - `HttpOnly`: Inaccessible to JavaScript
  - `SameSite=Lax`: CSRF protection

### Role-Based Access Control (RBAC)
```typescript
// Routes protected by role
/admin/*         → Requires admin role
/portal/*        → Requires authenticated user
/api/admin/*     → Admin endpoints only
/api/bookings/*  → Owner/admin endpoints
```

### Middleware Protection
```typescript
// Middleware checks authentication and redirects
export const middleware = (request: NextRequest) => {
  const session = getSession(request)
  if (!session && isProtectedRoute(request.pathname)) {
    return NextResponse.redirect('/sign-in')
  }
}
```

## Data Protection

### SQL Injection Prevention
All database queries use parameterized queries via Drizzle ORM:

```typescript
// ✓ SAFE - Parameterized query
const booking = await db.query.bookings.findFirst({
  where: eq(bookings.id, bookingId) // Parameterized
})

// ✗ UNSAFE - String concatenation (never used)
const query = `SELECT * FROM bookings WHERE id = '${bookingId}'`
```

### XSS Protection
- React automatically escapes all text content
- Sanitization libraries used for HTML content
- Content Security Policy (CSP) headers configured:

```typescript
// headers.ts
'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
```

### CSRF Protection
- All state-changing operations use Server Actions with CSRF tokens
- POST/PUT/DELETE requests require CSRF validation
- Tokens automatically managed by Next.js

```typescript
// Server Action with automatic CSRF protection
'use server'
export async function updateBooking(bookingId: string, data: any) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  // CSRF token auto-validated
}
```

## API Security

### Rate Limiting
Sensitive endpoints implement rate limiting:

```typescript
// Implemented via API middleware
POST /api/auth/signin     - 5 attempts per 15 minutes
POST /api/auth/signup    - 3 attempts per 24 hours
POST /api/bookings       - 100 requests per hour
GET /api/bookings        - 1000 requests per hour
```

### Input Validation
All API inputs validated server-side:

```typescript
// Example: Booking creation validation
const schema = z.object({
  serviceType: z.enum(['wedding', 'portrait', 'fashion', 'commercial']),
  date: z.date().min(new Date()),
  location: z.string().min(1).max(200),
  budget: z.number().positive().max(1000000),
  notes: z.string().max(5000).optional()
})

const result = schema.safeParse(data)
if (!result.success) throw new ValidationError(result.error)
```

### CORS Configuration
```typescript
// CORS restricted to trusted origins
const allowedOrigins = [
  'https://studioaynsh.com',
  'https://www.studioaynsh.com'
]

const corsOptions = {
  origin: (origin) => {
    if (allowedOrigins.includes(origin)) return true
    return false
  },
  credentials: true
}
```

## Environment Variables

### Secrets Management
Sensitive variables stored in `.env.local` (not in version control):

```
BETTER_AUTH_SECRET=<strong-random-string>
DATABASE_URL=<database-connection-string>
EMAIL_PASSWORD=<email-service-password>
STRIPE_SECRET_KEY=<stripe-secret>
```

### Validation
```typescript
// lib/env.ts - Validates required env vars at startup
const requiredEnvVars = [
  'BETTER_AUTH_SECRET',
  'DATABASE_URL'
]

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required env var: ${varName}`)
  }
})
```

## Infrastructure Security

### HTTPS Enforcement
- All traffic redirected from HTTP to HTTPS
- HSTS header configured (1 year max-age)
- Certificate auto-renewal via Vercel

### Security Headers
```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
]
```

### Database Security
- Connection over encrypted TLS
- Network isolation via Neon
- Automatic backups (daily retention)
- Connection pooling enabled
- Read-only replication for backups

## File Upload Security

### Validation
- File type validation (whitelist only allowed types)
- File size limits (10MB max for images)
- Virus scanning via external service (if implemented)

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large')
  }
}
```

### Storage
- Files stored in Vercel Blob Storage or AWS S3
- Private by default (auth required for access)
- Served with appropriate Content-Type headers

## Logging & Monitoring

### Security Logging
- Authentication attempts logged (with rate limiting)
- Failed access attempts logged
- Admin actions audited
- Sensitive data NOT logged

```typescript
// Never log passwords, tokens, or PII
console.log(`User ${userId} updated booking`) // ✓ OK
console.log(`Password: ${password}`) // ✗ NEVER
```

### Error Messages
- Production: Generic error messages ("Something went wrong")
- Development: Detailed error messages
- Errors logged to monitoring service

## Dependency Security

### Vulnerability Scanning
```bash
# Check for vulnerabilities
pnpm audit

# Update vulnerable packages
pnpm audit --fix
```

### Dependency Policy
- Regular updates scheduled (weekly)
- Security patches applied immediately
- Breaking changes reviewed before updating
- Versions pinned in package-lock files

### Trusted Dependencies
Key dependencies with security track records:
- Next.js (maintained by Vercel)
- React (maintained by Meta)
- Drizzle ORM (open source, audited)
- Better Auth (focused on auth security)

## Compliance

### GDPR Compliance
- User data exportable on request
- Deletion available (right to be forgotten)
- Privacy policy updated annually
- Data processing agreement with hosting provider

### Data Retention
- Active bookings: retained until completion
- Inactive accounts: deleted after 2 years
- Backups retained for 30 days
- Audit logs retained for 90 days

## Security Best Practices

### For Developers
1. Never commit secrets or sensitive data
2. Use environment variables for all sensitive config
3. Validate all user input server-side
4. Use parameterized queries for database
5. Keep dependencies updated
6. Review security headers before deployment
7. Test authentication and authorization flows
8. Use HTTPS in development (or localhost)

### For Operations
1. Monitor error logs for attacks
2. Review rate limiting metrics
3. Check database backups regularly
4. Update SSL certificates automatically
5. Monitor for unusual access patterns
6. Keep infrastructure patched
7. Maintain incident response plan
8. Conduct security audits quarterly

## Incident Response

### Security Incident Process
1. **Detection** - Automated alerts or manual discovery
2. **Containment** - Immediately stop ongoing attack
3. **Investigation** - Analyze logs and impact
4. **Remediation** - Fix vulnerability and deploy patch
5. **Notification** - Inform affected users if needed
6. **Review** - Post-incident analysis and lessons learned

### Contact for Security Issues
Security vulnerabilities should be reported privately:
- Email: security@studioaynsh.com
- Do NOT create public issues for security problems

## Third-Party Integrations

### Google Maps
- API key restricted to specific domains
- Usage monitored for unusual activity
- Fallback to OpenStreetMap if needed

### Stripe (if implemented)
- API keys never exposed to frontend
- PCI compliance managed by Stripe
- Only payment IDs sent to client

### Email Service
- SMTP credentials stored in environment variables
- SPF/DKIM/DMARC configured for domain
- No sensitive data sent via email

## Security Checklist

Production deployment requires:
- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] SSL certificate valid
- [ ] Security headers configured
- [ ] CORS settings restrictive
- [ ] Rate limiting active
- [ ] Logging configured
- [ ] Backups tested
- [ ] Incident response plan ready
- [ ] Team trained on security practices

## Resources

- [OWASP Top 10](https://owasp.org/Top10/) - Common vulnerabilities
- [Next.js Security Best Practices](https://nextjs.org/learn/foundations/how-nextjs-works/security)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated:** December 2024  
**Next Review:** June 2025  
**Status:** Active
