# Architecture Documentation

## Project Overview

Studio AYNSH is a full-stack Next.js 16 application with three distinct user interfaces:
1. **Public Website** - Marketing and service showcase
2. **Client Portal** - Booking management and progress tracking
3. **Admin Dashboard** - Studio management and analytics

## Directory Structure

```
studioAYNSH/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with metadata & schemas
│   ├── page.tsx               # Homepage
│   ├── sitemap.ts             # Dynamic XML sitemap
│   ├── robots.ts              # SEO robots configuration
│   ├── (auth)/                # Authentication routes
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── admin/                 # Admin panel (protected)
│   │   └── page.tsx
│   ├── portal/                # Client portal (protected)
│   │   └── page.tsx
│   ├── services/              # Services showcase
│   ├── portfolio/             # Portfolio gallery
│   ├── blog/                  # Blog/Journal section
│   ├── contact/               # Contact page
│   └── api/                   # API routes
│       ├── auth/              # Authentication endpoints
│       └── bookings/          # Booking endpoints
│
├── components/
│   ├── admin/                 # Admin-specific components
│   │   ├── admin-dashboard.tsx
│   │   └── [other admin components]
│   ├── portal/                # Client portal components
│   │   ├── client-portal-ui.tsx
│   │   └── [other portal components]
│   ├── home/                  # Homepage sections
│   │   ├── hero-section.tsx
│   │   ├── services-preview.tsx
│   │   ├── showcase-section.tsx
│   │   └── [other sections]
│   ├── structured-data.tsx    # JSON-LD schemas
│   ├── navigation.tsx         # Main navigation bar
│   ├── footer.tsx             # Footer
│   └── [other shared components]
│
├── lib/
│   ├── db.ts                  # Database connection
│   ├── auth.ts                # Auth configuration
│   ├── schema.ts              # Database schema (Drizzle)
│   ├── actions.ts             # Server actions
│   └── utils.ts               # Utility functions
│
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── og-image.jpg           # OpenGraph image
│   ├── twitter-image.jpg      # Twitter card image
│   └── [static assets]
│
├── v0_plans/                  # Documentation and plans
│   ├── audit-fixes-documentation.md
│   ├── comprehensive-fixes.md
│   ├── layout-restructuring.md
│   └── seo-audit-implementation.md
│
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── package.json               # Dependencies
└── README.md                  # Master documentation
```

## Data Flow

### User Authentication
```
Sign In/Sign Up → Better Auth → Neon DB → Session Cookie → Protected Routes
```

### Public User Journey
```
Homepage → Services → Portfolio → Blog → Contact → Booking
```

### Client Portal Journey
```
Sign In → Dashboard → View Bookings → Select Booking → View Progress → Download Assets
```

### Admin Management Flow
```
Sign In → Dashboard (Stats) → Bookings Tab → Select Booking → Manage Status → Client Details
```

## Database Schema (Simplified)

```typescript
users {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  createdAt: timestamp
}

bookings {
  id: string
  userId: string
  serviceType: 'wedding' | 'portrait' | 'fashion' | 'commercial'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  date: date
  location: string
  budget: decimal
  notes: text
  createdAt: timestamp
  updatedAt: timestamp
}

sessions {
  id: string
  userId: string
  bookingId: string
  type: 'shoot' | 'editing' | 'delivery'
  progress: 0-100
  notes: text
}
```

## Component Architecture

### Layout Structure
```
HTML (fixed nav h-20)
  └── Body (pt-20 for padding)
      ├── Navigation (fixed, top-0, z-50)
      └── Main Content
          ├── Admin Header (sticky, top-20, z-30)
          ├── Content Section
          └── Footer
```

### Responsive Design
- **Mobile:** `grid-cols-1`
- **Tablet (sm:):** `grid-cols-2`
- **Desktop (lg:):** `grid-cols-3` / `grid-cols-4`

### State Management Patterns

**Global Auth State:**
```typescript
// Managed by Better Auth
const session = useSession() // Client-side hook
```

**Client-side Data Fetching:**
```typescript
// Using SWR for reusable data
const { data, error, isLoading } = useSWR('/api/bookings', fetcher)
```

**Local Component State:**
```typescript
// React hooks for UI state
const [activeBooking, setActiveBooking] = useState(null)
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## Key Features Implementation

### Admin Dashboard Stats
- Real-time calculation from database
- 4-column responsive grid (mobile: 1 col, tablet: 2 col, desktop: 4 col)
- Color-coded status indicators

### Booking Management
- Server-side filtering and searching
- Real-time status updates
- Progress timeline with visual indicators
- Client detail panel with full booking history

### Client Portal
- Personalized dashboard
- Booking status tracking
- Progress timeline visualization
- Download deliverables section

## Performance Optimizations

1. **Image Optimization**
   - Next.js Image component for automatic optimization
   - Lazy loading enabled by default
   - Responsive srcset generation

2. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based code splitting
   - Component-level lazy loading with Suspense

3. **Caching Strategies**
   - SWR for client-side data caching
   - Next.js ISR (Incremental Static Regeneration)
   - Browser cache headers configured

4. **Bundle Size**
   - Tree-shaking enabled
   - CSS purging in production
   - Minification by default

## Security Architecture

1. **Authentication**
   - Better Auth (email/password hashing)
   - Session-based authentication
   - Secure HTTP-only cookies

2. **Authorization**
   - Route-level protection with middleware
   - Role-based access control (user vs admin)
   - Per-resource ownership checks

3. **Data Protection**
   - Parameterized queries (SQL injection prevention)
   - Input validation and sanitization
   - XSS protection with React escaping

4. **API Security**
   - CORS configured appropriately
   - Rate limiting on sensitive endpoints
   - CSRF tokens on state-changing operations

See [SECURITY.md](./SECURITY.md) for detailed security implementation.

## SEO Architecture

1. **Metadata Management**
   - `metadataBase` configured in root layout
   - Dynamic per-page metadata
   - OpenGraph and Twitter Card support

2. **Structured Data**
   - LocalBusiness JSON-LD schema
   - Service schema for each offering
   - Breadcrumb schema for navigation

3. **Technical SEO**
   - Dynamic sitemap generation
   - Robots.txt configuration
   - Canonical URLs
   - Mobile-first design

See [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md) for complete SEO setup.

## Deployment Architecture

```
GitHub Repository
  ↓
Vercel CI/CD Pipeline
  ↓
Environment Setup (env vars)
  ↓
Build Process (Next.js build)
  ↓
Database Migration (if needed)
  ↓
Deployment
  ↓
Production (studioaynsh.com)
```

## Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Make changes and test locally
   - Commit with descriptive messages

2. **Code Review**
   - Push to GitHub
   - Create Pull Request
   - Request review

3. **Testing**
   - Vercel Preview deployments
   - Manual testing in preview
   - TypeScript type checking

4. **Deployment**
   - Merge to `main` after approval
   - Automatic Vercel deployment
   - Production live instantly

## Configuration Files

### next.config.ts
- Image optimization settings
- Redirects and rewrites
- Environment variable configuration
- Build optimization

### tsconfig.json
- Strict type checking enabled
- Path aliases configured (`@/`)
- Module resolution settings

### tailwind.config.ts
- Design tokens (colors, spacing, fonts)
- Custom theme configuration
- Responsive breakpoints

### package.json
- Dependencies and versions
- Scripts for development and deployment
- Build and analysis tools

## Error Handling

1. **Global Error Boundary**
   - Catches unhandled exceptions
   - Displays user-friendly error messages
   - Logs to monitoring service

2. **API Error Handling**
   - Standardized error responses
   - Proper HTTP status codes
   - Detailed error messages in development

3. **Form Validation**
   - Client-side validation with React Hook Form
   - Server-side validation on submission
   - Clear error messaging to users

## Monitoring & Analytics

- **Vercel Analytics:** Performance metrics
- **Google Analytics:** User behavior tracking
- **Error Tracking:** Sentry integration ready
- **Performance Monitoring:** Web Vitals tracking

---

For deployment procedures, see [DEPLOYMENT.md](./DEPLOYMENT.md)  
For security details, see [SECURITY.md](./SECURITY.md)  
For API usage, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
