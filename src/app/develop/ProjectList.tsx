"use client"

import { useState } from "react"
import Link from "next/link"
import type { ProjectMeta } from "@/lib/mdx"

interface ProjectListProps {
  projects: ProjectMeta[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="space-y-px">
      {projects.map((project, index) => (
        <Link
          key={project.slug}
          href={`/dev/${project.slug}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group block relative overflow-hidden"
          style={{
            animation: `fadeIn 0.8s ease-out ${index * 0.15}s both`,
          }}
        >
          <div className="relative border-t border-foreground/20 py-8 md:py-12 transition-all duration-500 hover:px-8">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-baseline gap-6 mb-3">
                  <span className="font-mono text-xs tracking-[0.2em] opacity-30">
                    {project.year}
                  </span>
                  <span className={`font-mono text-xs tracking-[0.2em] uppercase transition-opacity ${hoveredIndex === index ? 'opacity-100' : 'opacity-30'}`}>
                    {project.status}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight transition-transform group-hover:translate-x-4">
                  {project.title}
                </h2>

                <p className="font-mono text-xs md:text-sm opacity-50 max-w-2xl leading-relaxed">
                  {project.tech}
                </p>
              </div>

              <div className={`text-4xl md:text-6xl font-black transition-all duration-300 ${hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                →
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
          </div>
        </Link>
      ))}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
