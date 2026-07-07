export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://studioaynsh.com',
    name: 'Studio AYNSH',
    description:
      'Premium luxury photography and cinematography studio specializing in wedding, portrait, fashion, and commercial photography.',
    image: 'https://studioaynsh.com/api/og?title=Studio%20AYNSH',
    url: 'https://studioaynsh.com',
    telephone: '+91-9956976596',
    email: 'mr.p3124@protonmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bhagat Chauraha, Rampur Road, Taramandal',
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
    priceRange: '₹₹₹',
    areaServed: ['IN-UP', 'India'],
    founder: {
      '@type': 'Person',
      name: 'Praveen Gupta',
    },
    sameAs: [
      'https://www.instagram.com/studioaynsh',
      'https://www.facebook.com/studioaynsh',
      'https://www.youtube.com/studioaynsh',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function PhotoGraphyServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://studioaynsh.com/services',
    name: 'Photography & Cinematography Services',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Studio AYNSH',
      url: 'https://studioaynsh.com',
    },
    serviceType: [
      'Wedding Photography',
      'Portrait Photography',
      'Fashion Photography',
      'Drone Photography',
      'Cinematography',
      'Commercial Photography',
    ],
    areaServed: {
      '@type': 'Place',
      name: 'India',
    },
    description:
      'Premium photography and cinematography services for weddings, portraits, fashion, and commercial projects.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

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
