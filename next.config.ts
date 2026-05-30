import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  transpilePackages: ['@sanity/ui', '@sanity/icons', 'sanity'],
}

export default nextConfig
