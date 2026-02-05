import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { getAllProjects } from "@/lib/mdx"
import { ProjectList } from "./ProjectList"

export default function DevelopPage() {
  const projects = getAllProjects('develop')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title="Develop" showBack />

      <div className="min-h-screen px-6 md:px-12 lg:px-24 py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 md:mb-32">
            <h1 className="text-[15vw] md:text-[12vw] lg:text-[10vw] font-black leading-none tracking-tight font-sans">
              Work
            </h1>
          </div>

          <ProjectList projects={projects} />
        </div>

        <Footer />
      </div>
    </div>
  )
}
