# Deployment & DevOps Guide

## Deployment Architecture

```
GitHub Repository (main branch)
  ↓ (push trigger)
Vercel CI/CD Pipeline
  ↓ (build step)
Next.js Build Process
  ↓ (env vars loaded)
Database Migrations (if needed)
  ↓ (deploy step)
Production on Vercel Edge Network
  ↓
studioaynsh.com (live)
```

## Prerequisites

- GitHub repository connected to Vercel project
- Neon PostgreSQL database provisioned
- Environment variables configured in Vercel dashboard
- Custom domain connected (studioaynsh.com)

## Environment Setup

### Required Environment Variables

```bash
# Authentication
BETTER_AUTH_SECRET=<generate-random-32-char-string>

# Database
DATABASE_URL=postgresql://user:password@host/db

# Optional but recommended
NEXT_PUBLIC_API_URL=https://studioaynsh.com
NODE_ENV=production
```

### Generate BETTER_AUTH_SECRET
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### Environment Variable Configuration

1. Open Vercel Dashboard → Project Settings → Environment Variables
2. Add each variable for both Production and Preview environments
3. Redeploy after adding variables

```plaintext
BETTER_AUTH_SECRET     = xxxxxxxxxxxxxxxxxxxxxxxxxxxx
DATABASE_URL           = postgresql://...
NEXT_PUBLIC_API_URL    = https://studioaynsh.com
```

## Deployment Process

### Automatic Deployment (Recommended)
1. Push changes to `main` branch on GitHub
2. Vercel automatically detects the push
3. Build process starts (visible in Vercel Dashboard)
4. Database migrations run (if using migration tool)
5. Deployment completes
6. Live on https://studioaynsh.com

### Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy current directory
vercel --prod

# Deploy with environment variables
vercel --prod --env BETTER_AUTH_SECRET=xxx
```

### Preview Deployments
- Created automatically for every Pull Request
- Accessible at `https://<pr-number>.studioaynsh.vercel.app`
- Perfect for testing changes before merging

## Building Locally

```bash
# Install dependencies
pnpm install

# Set environment variables
export DATABASE_URL=postgresql://...
export BETTER_AUTH_SECRET=xxxxx

# Run database migrations
pnpm run db:push

# Build for production
pnpm run build

# Start production server
pnpm run start
```

## Database Migrations

### Using Drizzle ORM

```bash
# Generate migration
pnpm run db:generate

# Apply migrations
pnpm run db:push

# Reset database (development only)
pnpm run db:reset
```

### Schema Changes
1. Modify `/lib/schema.ts`
2. Run `pnpm run db:generate`
3. Review migration file
4. Run `pnpm run db:push`
5. Commit changes
6. Deploy to Vercel

### Neon Console
Access Neon console directly:
1. Go to neon.tech dashboard
2. Select Studio AYNSH project
3. View database, run queries, manage backups

## Vercel Configuration

### next.config.ts
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'blob.vercel-storage.com' },
      { hostname: 'studioaynsh.com' }
    ]
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: securityHeaders
    }
  ],
  redirects: async () => [
    {
      source: '/old-page',
      destination: '/new-page',
      permanent: true
    }
  ]
}
```

### vercel.json (Optional)
```json
{
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next"
}
```

## Performance Optimization

### Image Optimization
- Vercel Image Optimization enabled by default
- Next.js Image component used for all images
- Automatic WebP conversion

### Function Optimization
```bash
# View function size
pnpm run build

# Analyze bundle
npx next-bundle-analyzer
```

### Caching Headers
```typescript
// Set Cache-Control headers for static assets
export const revalidate = 3600 // 1 hour ISR
```

## Monitoring & Observability

### Vercel Analytics
1. Dashboard → Analytics tab
- Web Vitals metrics
- Deployment history
- Build times
- Error rates

### Enable Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Error Tracking (Recommended: Sentry)
```bash
pnpm add @sentry/nextjs
```

Configure in `next.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
})
```

### Logging
```bash
# View Vercel logs
vercel logs --prod

# Stream real-time logs
vercel logs --prod --follow
```

## Rollback Procedures

### Rollback via Vercel Dashboard
1. Go to Deployments tab
2. Click on previous stable deployment
3. Click "Redeploy"

### Rollback via CLI
```bash
# List deployments
vercel list

# Rollback to specific deployment
vercel promote <deployment-id>
```

### Database Rollback
If database migrations caused issues:
1. Access Neon console
2. Create manual backup
3. Restore from backup
4. Revert code changes
5. Redeploy

## Production Checklist

Before deploying to production:

### Code Quality
- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes (`pnpm run lint`)
- [ ] No console.log or debug statements
- [ ] All imports resolved correctly
- [ ] Error handling implemented

### Security
- [ ] All environment variables configured
- [ ] No secrets in code or environment
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS settings correct
- [ ] Rate limiting enabled

### Performance
- [ ] Lighthouse score 90+
- [ ] Core Web Vitals pass
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Database queries efficient

### Functionality
- [ ] Authentication flows tested
- [ ] Booking creation works
- [ ] Admin dashboard functional
- [ ] Client portal accessible
- [ ] Payment processing (if enabled)

### Database
- [ ] Migrations applied
- [ ] Schema correct
- [ ] Backups configured
- [ ] Connection pooling enabled
- [ ] Indexes optimized

### Deployment
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] No build warnings
- [ ] Preview deployment tested
- [ ] Production ready

## Monitoring After Deployment

### First Hour
- [ ] Monitor error logs
- [ ] Check Web Vitals
- [ ] Verify all pages load
- [ ] Test authentication
- [ ] Confirm database connectivity

### Daily
- [ ] Review Vercel analytics
- [ ] Check error rates
- [ ] Monitor function duration
- [ ] Verify backups ran

### Weekly
- [ ] Review performance metrics
- [ ] Check security headers
- [ ] Analyze user sessions
- [ ] Update dependencies

## Disaster Recovery

### Backup Strategy
- **Database:** Automatic daily backups (Neon)
- **Code:** Git repository (GitHub)
- **Static Assets:** CDN cached by Vercel

### Recovery Procedures

#### Database Recovery
```bash
# Via Neon console:
1. Go to Backups tab
2. Select backup from last known good state
3. Restore to new database
4. Update DATABASE_URL environment variable
5. Redeploy application
```

#### Code Recovery
```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# Vercel automatically redeploys
```

### RTO & RPO
- **RTO (Recovery Time Objective):** < 15 minutes
- **RPO (Recovery Point Objective):** < 1 hour
- **Backup Retention:** 30 days

## Custom Domain Setup

### DNS Configuration
1. In Vercel dashboard: Settings → Domains
2. Add domain: studioaynsh.com
3. Follow DNS setup instructions:
   - A record pointing to Vercel IP
   - Or CNAME to Vercel project

### SSL Certificate
- Automatically provisioned by Vercel
- Auto-renewal enabled
- HTTPS enforced

### Redirects
- www.studioaynsh.com → studioaynsh.com
- Configured in `next.config.ts` or Vercel project settings

## Cost Optimization

### Vercel Pricing
- **Hobby:** Free tier (up to 100GB bandwidth)
- **Pro:** $20/month (unlimited projects, 1TB bandwidth)
- **Enterprise:** Custom pricing

### Database (Neon)
- **Free:** Up to 3 projects, 5GB storage
- **Growth:** $9/month per project

### Optimization Tips
1. Use Vercel Image Optimization (included)
2. Enable Incremental Static Regeneration (ISR)
3. Set appropriate cache headers
4. Monitor function execution time
5. Use serverless functions efficiently

## Troubleshooting

### Build Fails
```
Issue: "Module not found"
Solution: Check imports, verify dependencies installed, rebuild

Issue: "Environment variable not found"
Solution: Add variable to Vercel dashboard, redeploy

Issue: "TypeScript errors"
Solution: Run `pnpm run build` locally to identify
```

### Deployment Slow
```
Issue: Long build times
Solution: Analyze dependencies, check bundle size, verify no heavy operations

Issue: Deployment pending
Solution: Check GitHub status, verify Vercel webhooks configured
```

### Database Connection Issues
```
Issue: "Connection timeout"
Solution: Verify DATABASE_URL correct, check Neon status, test connection

Issue: "Migration failed"
Solution: Review migration file, check schema changes, rollback if needed
```

## Contact & Support

- **Vercel Support:** vercel.com/help
- **Neon Support:** neon.tech/docs
- **GitHub Support:** github.com/contact
- **v0 Support:** v0.app/docs

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** Production Ready
