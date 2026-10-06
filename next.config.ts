import type { NextConfig } from 'next';

const WEEK = 60 * 60 * 24 * 7;

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75],
    // Optimised images are keyed by URL + width + quality, so a long browser/CDN cache is safe.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    // Widths actually requested by the layouts (thumbnails → full-bleed at 2× on large screens).
    deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2400],
    imageSizes: [72, 96, 128, 256, 384]
  },
  async headers() {
    return [
      // Source photos and brand files: cache for a week, refresh in the background after that.
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: `public, max-age=${WEEK}, stale-while-revalidate=${WEEK * 4}` }] },
      { source: '/brand/:path*', headers: [{ key: 'Cache-Control', value: `public, max-age=${WEEK}, stale-while-revalidate=${WEEK * 4}` }] }
    ];
  }
};

export default nextConfig;
