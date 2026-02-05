import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface ProjectMeta {
  slug: string
  title: string
  year: string
  tech: string
  status: string
  description?: string
}

export interface Project extends ProjectMeta {
  content: string
}

export function getProjectSlugs(category: string): string[] {
  const dir = path.join(contentDirectory, category)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace(/\.mdx$/, ''))
}

export function getProjectBySlug(category: string, slug: string): Project | null {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    year: data.year || '',
    tech: data.tech || '',
    status: data.status || '',
    description: data.description || '',
    content,
  }
}

export function getAllProjects(category: string): ProjectMeta[] {
  const slugs = getProjectSlugs(category)
  const projects = slugs
    .map(slug => getProjectBySlug(category, slug))
    .filter((p): p is Project => p !== null)
    .sort((a, b) => b.year.localeCompare(a.year))

  return projects.map(({ content, ...meta }) => meta)
}
