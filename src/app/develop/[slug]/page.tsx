import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getProjectSlugs('develop')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug('develop', slug)
  if (!project) return { title: 'Not Found' }

  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug('develop', slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header title={project.title} showBack backHref="/dev" />

      <main className="flex-1 px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-baseline gap-6 mb-4">
              <span className="font-mono text-xs tracking-[0.2em] opacity-50">
                {project.year}
              </span>
              <span className="font-mono text-xs tracking-[0.2em] uppercase opacity-50">
                {project.status}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight">
              {project.title}
            </h1>

            <p className="font-mono text-sm opacity-50">
              {project.tech}
            </p>
          </div>

          <article className="mdx-content">
            <MDXRemote source={project.content} />
          </article>
        </div>
      </main>

      <Footer position="relative" />
    </div>
  )
}
