import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/dev', '/buttons', '/design-system', '/feedback'],
      },
    ],
    sitemap: 'https://bvp-main-site.vercel.app/sitemap.xml',
  };
}
