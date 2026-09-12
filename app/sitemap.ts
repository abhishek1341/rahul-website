import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const pages = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/services', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/portfolio', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${SITE_URL}${page.path === '/' ? '' : page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
