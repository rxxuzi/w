import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { listFiles } from "@/lib/r2"
import { FileList } from "./FileList"

export const dynamic = 'force-dynamic' // Always fetch fresh data from R2

export default async function FilesPage() {
  const files = await listFiles('pub')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header title="Files" showBack />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-none mb-2 font-sans tracking-tight">
              FILES
            </h1>
            <p className="font-mono text-[10px] tracking-widest opacity-40 uppercase">
              Public Archive
            </p>
          </div>
          <p className="font-mono text-[10px] opacity-30 hidden md:block">
            {files.length} ITEMS
          </p>
        </div>

        <FileList files={files} />
      </main>

      <Footer position="relative" />
    </div>
  )
}
