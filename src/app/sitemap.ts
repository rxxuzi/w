import { MetadataRoute } from 'next'
import { getProjectSlugs } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rxxuzi.com'

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/dev',
    '/explore',
    '/files',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic project pages
  const projectSlugs = getProjectSlugs('develop')
  const projectPages = projectSlugs.map((slug) => ({
    url: `${baseUrl}/dev/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...projectPages]
}
