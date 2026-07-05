/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Limit server action payloads to prevent abuse
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
}

export default nextConfig
