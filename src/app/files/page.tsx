import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { listFiles } from "@/lib/r2"
import { FileList } from "./FileList"

export const dynamic = 'force-dynamic' // Always fetch fresh data from R2

export default async function FilesPage() {
  const files = await listFiles()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header title="Files" showBack />

      <main className="flex-1 px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 md:mb-20">
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-4 font-sans">
              FILES
            </h1>
            <p className="font-mono text-sm opacity-50">Archive · Documents · Media</p>
          </div>

          <FileList files={files} />
        </div>
      </main>

      <Footer position="relative" />
    </div>
  )
}
