import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  eslint: {
    // Üretim derlemelerinde ESLint çalıştırmayı devre dışı bırak
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Üretim derlemesinde tip hataları nedeniyle derlemenin kırılmasını engelle
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          // HSTS: yalnızca HTTPS'te etkili olur; süreyi ihtiyaçlarınıza göre güncelleyin
          { key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/tiles',
        destination: '/carrelages',
        permanent: true,
      },
      {
        source: '/tiles/:slug',
        destination: '/carrelages/:slug',
        permanent: true,
      },
      {
        source: '/professionals',
        destination: '/professionnels',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
