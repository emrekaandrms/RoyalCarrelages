import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = 'https://royalcarrelages.fr';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/api/*',
          '/uploads',
        ],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}


