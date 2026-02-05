"use client"

import { useState } from "react"
import type { R2File } from "@/lib/r2"

const typeColors: Record<string, string> = {
  PDF: 'bg-red-500',
  ZIP: 'bg-yellow-500',
  IMG: 'bg-blue-500',
  VIDEO: 'bg-purple-500',
  AUDIO: 'bg-green-500',
  TEXT: 'bg-gray-500',
  MD: 'bg-gray-500',
  JSON: 'bg-orange-500',
}

interface FileListProps {
  files: R2File[]
}

export function FileList({ files }: FileListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (files.length === 0) {
    return (
      <div className="text-center py-16 opacity-50">
        <p className="font-mono text-sm">No files found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <a
          key={file.key}
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group flex items-center gap-4 border border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 p-4 md:p-6"
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          <div className={`w-8 h-8 ${typeColors[file.type] || 'bg-gray-500'} flex-shrink-0 group-hover:scale-110 transition-transform`}></div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm md:text-base truncate mb-1">
              {file.name}
            </div>
            <div className="flex gap-3 text-xs font-mono opacity-50">
              <span>{file.type}</span>
              <span>{file.size}</span>
              <span>{file.date}</span>
            </div>
          </div>

          <div className={`text-2xl flex-shrink-0 transition-all duration-300 ${hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
            ↓
          </div>
        </a>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
