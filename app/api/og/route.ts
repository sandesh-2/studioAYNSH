export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Studio AYNSH'
  const description = searchParams.get('description') || 'We Capture The Untold Story'

  // Generate SVG OG image
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1c1a17;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a2723;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Logo -->
      <rect x="60" y="60" width="48" height="48" fill="#d4a574" rx="4"/>
      <text x="84" y="96" font-size="28" font-weight="bold" fill="#1c1a17" text-anchor="middle" dominant-baseline="middle">A</text>
      
      <!-- Header text -->
      <text x="120" y="84" font-size="20" font-weight="600" fill="#f7f3ee" letter-spacing="2">STUDIO AYNSH</text>
      
      <!-- Main title -->
      <text x="60" y="280" font-size="72" font-weight="300" fill="#f7f3ee" font-family="serif">${title}</text>
      
      <!-- Description -->
      <text x="60" y="380" font-size="28" fill="#d4a574" font-weight="300">${description}</text>
      
      <!-- Footer -->
      <text x="60" y="570" font-size="14" fill="#a39f9a" letter-spacing="2" text-transform="uppercase">PREMIUM LUXURY PHOTOGRAPHY &amp; CINEMATOGRAPHY</text>
    </svg>
  `.trim()

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
