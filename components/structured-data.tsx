// ─────────────────────────────────────────────────────────────────────────────
// Structured Data — Studio AYNSH
// All JSON-LD schemas injected as <script> tags for Google / rich results.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://studioaynsh.com'
const OG_IMAGE = `${BASE_URL}/api/og?title=Studio%20AYNSH`
const PHONE    = '+91-7084019414'
const EMAIL    = 'samratgupta7754@gmail.com'
const WHATSAPP = 'https://wa.me/917084019414'

// ── 1. LocalBusiness / PhotographyBusiness (homepage + global) ───────────────

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // Organisation
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'Studio AYNSH',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
          width: 1200,
          height: 630,
        },
        founder: {
          '@type': 'Person',
          '@id': `${BASE_URL}/#founder`,
          name: 'Praveen Gupta',
          jobTitle: 'Founder, CEO & Lead Photographer',
          worksFor: { '@id': `${BASE_URL}/#organization` },
          url: `${BASE_URL}/about`,
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: PHONE,
            contactType: 'customer service',
            contactOption: 'TollFree',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
          },
          {
            '@type': 'ContactPoint',
            url: WHATSAPP,
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
          },
        ],
        sameAs: [
          'https://www.instagram.com/studioaynsh',
          'https://www.facebook.com/studioaynsh',
          'https://www.youtube.com/@studioaynsh',
          WHATSAPP,
        ],
      },

      // PhotographyBusiness (LocalBusiness subtype)
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${BASE_URL}/#business`,
        name: 'Studio AYNSH',
        alternateName: [
          'Studio AYNSH Gorakhpur',
          'AYNSH Photography',
          'AYNSH Cinematography',
        ],
        description:
          'Studio AYNSH is a premium photography and cinematography studio based in Gorakhpur, Uttar Pradesh, India. Specialising in cinematic weddings, destination weddings, pre-wedding shoots, engagement photography, portraits, maternity shoots, fashion photography, drone photography, and commercial photography across India.',
        url: BASE_URL,
        telephone: PHONE,
        email: EMAIL,
        image: OG_IMAGE,
        logo: OG_IMAGE,
        priceRange: '₹₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, Bank Transfer, UPI',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Bhagat Chauraha, Taramandal',
          addressLocality: 'Gorakhpur',
          addressRegion: 'Uttar Pradesh',
          postalCode: '273016',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '26.722472',
          longitude: '83.390111',
        },
        hasMap: 'https://www.google.com/maps/place/Studio+AYNSH/',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '08:00',
            closes: '22:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '00:00',
            closes: '00:00',
          },
        ],
        areaServed: [
          'Gorakhpur', 'Varanasi', 'Prayagraj', 'Lucknow', 'Ayodhya',
          'Deoria', 'Kushinagar', 'Maharajganj', 'Basti', 'Azamgarh',
          'Ballia', 'Jaunpur', 'Kanpur', 'Noida', 'Patna', 'Delhi NCR',
          'Uttar Pradesh', 'India',
        ],
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: { '@type': 'GeoCoordinates', latitude: '26.722472', longitude: '83.390111' },
          geoRadius: '500000',
        },
        founder: { '@id': `${BASE_URL}/#founder` },
        parentOrganization: { '@id': `${BASE_URL}/#organization` },
        sameAs: [
          'https://www.instagram.com/studioaynsh',
          'https://www.facebook.com/studioaynsh',
          'https://www.youtube.com/@studioaynsh',
          WHATSAPP,
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '100',
          bestRating: '5',
          worstRating: '1',
        },
      },

      // WebSite
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'Studio AYNSH',
        description: 'Premium photography and cinematography studio — We Capture The Untold Story.',
        publisher: { '@id': `${BASE_URL}/#organization` },
        inLanguage: 'en-IN',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/portfolio?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── 2. Photography Service / OfferCatalog ─────────────────────────────────────

export function PhotographyServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}/services#service`,
    name: 'Studio AYNSH Photography & Cinematography Services',
    provider: { '@id': `${BASE_URL}/#business` },
    url: `${BASE_URL}/services`,
    description:
      'Premium photography and cinematography services in Gorakhpur and across India, including wedding photography, pre-wedding shoots, portrait photography, fashion photography, drone photography, and commercial photography.',
    areaServed: 'India',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Photography Packages',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Wedding Photography',
          itemListElement: [
            { '@type': 'Offer', name: 'Classic Wedding Package', price: '45000', priceCurrency: 'INR', description: '6 hours, 500+ images' },
            { '@type': 'Offer', name: 'Premium Wedding Package', price: '75000', priceCurrency: 'INR', description: '10 hours, 1000+ images, second shooter' },
            { '@type': 'Offer', name: 'Signature Wedding Package', price: '120000', priceCurrency: 'INR', description: 'Full day, unlimited, album included' },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Pre-Wedding Photography',
          itemListElement: [
            { '@type': 'Offer', name: 'Intimate Pre-Wedding', price: '18000', priceCurrency: 'INR', description: '2 hours, 1 location, 100+ images' },
            { '@type': 'Offer', name: 'Story Pre-Wedding', price: '32000', priceCurrency: 'INR', description: '4 hours, 2 locations, 250+ images' },
            { '@type': 'Offer', name: 'Cinematic Pre-Wedding', price: '55000', priceCurrency: 'INR', description: '6 hours, unlimited, short film' },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Portrait Photography',
          itemListElement: [
            { '@type': 'Offer', name: 'Essential Portrait', price: '8000', priceCurrency: 'INR', description: '1 hour, studio, 30+ images' },
            { '@type': 'Offer', name: 'Extended Portrait', price: '15000', priceCurrency: 'INR', description: '2 hours, studio + outdoor, 75+ images' },
            { '@type': 'Offer', name: 'Editorial Portrait', price: '28000', priceCurrency: 'INR', description: '4 hours, full editorial session' },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Drone Photography',
          itemListElement: [
            { '@type': 'Offer', name: 'Aerial Stills', price: '12000', priceCurrency: 'INR', description: '1 hour, 20+ images' },
          ],
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── 3. BreadcrumbList ─────────────────────────────────────────────────────────

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── 4. FAQ Schema ─────────────────────────────────────────────────────────────

export function FAQSchema({ questions }: { questions: { q: string; a: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── 5. Article / BlogPost Schema ──────────────────────────────────────────────

export function ArticleSchema({
  title,
  description,
  url,
  image,
  imageAlt,
  datePublished,
  dateModified,
  authorName = 'Praveen Gupta',
}: {
  title: string
  description: string
  url: string
  image: string
  imageAlt: string
  datePublished: string
  dateModified?: string
  authorName?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: {
      '@type': 'ImageObject',
      url: image,
      description: imageAlt,
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${BASE_URL}/about`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'en-IN',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── 6. Person Schema (About page) ─────────────────────────────────────────────

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#founder`,
    name: 'Praveen Gupta',
    jobTitle: 'Founder, CEO & Lead Photographer',
    description:
      'Praveen Gupta is the founder and lead photographer of Studio AYNSH, a premium photography and cinematography studio based in Gorakhpur, Uttar Pradesh, India.',
    url: `${BASE_URL}/about`,
    image: OG_IMAGE,
    worksFor: { '@id': `${BASE_URL}/#organization` },
    sameAs: [
      'https://www.instagram.com/studioaynsh',
      'https://www.facebook.com/studioaynsh',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gorakhpur',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── 7. WebPage Schema (generic, per-page) ─────────────────────────────────────

export function WebPageSchema({
  title,
  description,
  url,
  breadcrumbItems,
}: {
  title: string
  description: string
  url: string
  breadcrumbItems?: { name: string; url: string }[]
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-IN',
  }

  if (breadcrumbItems) {
    schema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
