import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { getAllProjects } from "@/lib/mdx"
import { ProjectList } from "./ProjectList"

export default function DevelopPage() {
  const projects = getAllProjects('develop')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header title="Develop" showBack />

      <main className="flex-1 px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight font-sans">
              Work
            </h1>
          </div>

          <ProjectList projects={projects} />
        </div>
      </main>

      <Footer position="relative" />
    </div>
  )
}
