import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // API endpoint for blog data
  env: {
    API_URL: process.env.API_URL || 'http://localhost:4000',
  },
  // Enable standalone output for Docker
  output: 'standalone',
}

export default nextConfig
