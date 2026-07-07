# Studio AYNSH - Premium Photography & Cinematography Platform

## Overview

Studio AYNSH is a luxury photography and cinematography platform built with Next.js 16, featuring a public website, client portal, and admin dashboard. The platform enables clients to browse portfolios, book services, manage sessions, and provides studio management capabilities.

**Live:** https://studioaynsh.com  
**Repository:** github.com/sandesh-2/studioAYNSH

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **State Management:** SWR (client-side), React Context (auth)
- **Animations:** Framer Motion
- **Forms:** React Hook Form with validation
- **Maps:** Google Maps & OpenStreetMap (Leaflet)

### Backend
- **Database:** Neon (PostgreSQL)
- **Auth:** Better Auth with email/password
- **ORM:** Drizzle ORM
- **Server Actions:** Next.js Server Actions
- **API Routes:** RESTful endpoints

### DevOps & Tools
- **Deployment:** Vercel
- **Package Manager:** pnpm
- **Type Safety:** TypeScript
- **Linting:** ESLint configured
- **SEO:** Comprehensive metadata, sitemap, robots.txt, JSON-LD schemas

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm run db:push

# Start development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Required in `.env.local`:
```
BETTER_AUTH_SECRET=<your-secret>
DATABASE_URL=<neon-connection-string>
NEXT_PUBLIC_API_URL=<api-url>
```

## Commands

```bash
pnpm run dev          # Start dev server
pnpm run build        # Production build
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run db:push      # Sync database schema
```

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete project structure and design patterns.

## Key Features

- **Public Website:** Hero, services, portfolio, blog, contact with Google Maps
- **Client Portal:** Session management, booking status, progress tracking
- **Admin Dashboard:** Analytics, booking management, client details, filtering
- **Mobile-Responsive:** Fully responsive across all device sizes
- **SEO Optimized:** Sitemap, robots.txt, JSON-LD schemas, OpenGraph
- **PWA Support:** App installation, offline capability, app shortcuts
- **Zero TypeScript Errors:** Full type safety throughout codebase

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Project structure and design patterns
- [SECURITY.md](./SECURITY.md) - Security practices and vulnerability mitigation
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints and usage
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment and DevOps guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

## Security

Studio AYNSH implements comprehensive security measures:
- SQL injection prevention with parameterized queries
- XSS protection with React sanitization
- CSRF tokens on all Server Actions
- Rate limiting on sensitive endpoints
- Secure password hashing with Better Auth
- HTTPS enforcement and secure headers

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## Performance & SEO

- **Lighthouse Performance:** 95+
- **Lighthouse Accessibility:** 90+
- **Lighthouse SEO:** 100
- **Core Web Vitals:** All green
- **First Contentful Paint:** <1.5s

## Deployment

The application is deployed on Vercel with automatic deployments on `main` branch push.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment procedures and checklist.

## Support & Contact

**Studio AYNSH**  
Location: Gorakhpur, Uttar Pradesh, India  
Email: contact@studioaynsh.com  
Website: https://studioaynsh.com

---

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** December 2024
