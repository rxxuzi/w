"use client"

import { useState } from "react"
import type { R2File } from "@/lib/r2"
import { X, Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

interface FileListProps {
  files: R2File[]
}

export function FileList({ files }: FileListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedFile = selectedIndex !== null ? files[selectedIndex] : null

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < files.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedIndex(null)
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
  }

  if (files.length === 0) {
    return (
      <div className="border-2 border-dashed border-foreground/20 p-16 text-center">
        <p className="font-mono text-xs tracking-widest opacity-50">NO FILES FOUND</p>
      </div>
    )
  }

  const isViewable = (type: string) => ['IMG', 'VIDEO', 'PDF'].includes(type)

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-1">
        {files.map((file, index) => (
          <button
            key={file.key}
            onClick={() => isViewable(file.type) ? setSelectedIndex(index) : window.open(file.url, '_blank')}
            className="group relative aspect-square bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 text-left overflow-hidden"
          >
            {/* Thumbnail for images */}
            {file.type === 'IMG' && (
              <img
                src={file.url}
                alt={file.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
            )}

            {/* Video thumbnail */}
            {file.type === 'VIDEO' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">▶</div>
              </div>
            )}

            {/* Non-media files */}
            {!['IMG', 'VIDEO'].includes(file.type) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-2xl md:text-3xl font-black opacity-20 group-hover:opacity-40 transition-opacity">
                  {file.type}
                </span>
              </div>
            )}

            {/* Labels */}
            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
              {/* Top: Index */}
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] opacity-50">
                  {String(index + 1).padStart(3, '0')}
                </span>
                {!isViewable(file.type) && (
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                )}
              </div>

              {/* Bottom: Info */}
              <div className={`${file.type === 'IMG' ? 'bg-black/60 -mx-3 -mb-3 p-3' : ''}`}>
                <p className="font-mono text-[10px] tracking-wider truncate opacity-70 group-hover:opacity-100 transition-opacity">
                  {file.name.toUpperCase()}
                </p>
                <p className="font-mono text-[9px] opacity-40 mt-0.5">
                  {file.size} · {file.date}
                </p>
              </div>
            </div>

            {/* Hover border */}
            <div className="absolute inset-0 border border-transparent group-hover:border-foreground transition-colors pointer-events-none" />
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-foreground/10 text-right font-mono text-[10px] opacity-30">
        FX.RXXUZI.COM
      </div>

      {/* Viewer Modal */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          ref={(el) => el?.focus()}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-white/50">
                {String(selectedIndex! + 1).padStart(3, '0')} / {String(files.length).padStart(3, '0')}
              </span>
              <span className="font-mono text-xs text-white/80 hidden sm:inline">
                {selectedFile.name.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={selectedFile.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-white/70 hover:text-white" />
              </a>
              <a
                href={selectedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 transition-colors"
                title="Open original"
              >
                <ExternalLink className="w-5 h-5 text-white/70 hover:text-white" />
              </a>
              <button
                onClick={() => setSelectedIndex(null)}
                className="p-2 hover:bg-white/10 transition-colors ml-2"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Navigation arrows */}
            {selectedIndex! > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8 text-white/70 hover:text-white" />
              </button>
            )}
            {selectedIndex! < files.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8 text-white/70 hover:text-white" />
              </button>
            )}

            {/* Media */}
            {selectedFile.type === 'IMG' && (
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="max-w-full max-h-full object-contain"
              />
            )}
            {selectedFile.type === 'VIDEO' && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            )}
            {selectedFile.type === 'PDF' && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full bg-white"
                title={selectedFile.name}
              />
            )}
          </div>

          {/* Bottom bar */}
          <div className="p-4 md:p-6 border-t border-white/10 font-mono text-xs text-white/50 flex justify-between">
            <span>{selectedFile.type} · {selectedFile.size}</span>
            <span className="hidden sm:inline">← → NAVIGATE · ESC CLOSE</span>
          </div>
        </div>
      )}
    </>
  )
}
