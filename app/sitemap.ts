import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://royalcarrelages.fr';

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/carrelages`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/professionnels`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({ select: { slug: true } });
    productUrls = products
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${baseUrl}/carrelages/${p.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));
  } catch {
    // ignore
  }

  return [...staticUrls, ...productUrls];
}


