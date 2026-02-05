"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function BlogPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header title="Blog" showBack />

      <main className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 pb-24 pt-16">
        <div className="max-w-5xl">
          {/* Label */}
          <div
            className={`mb-6 transition-all duration-700 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">
              Status: Preparing
            </span>
          </div>

          {/* Main typography */}
          <h1
            className={`text-[15vw] md:text-[12vw] lg:text-[10vw] font-black leading-[0.85] tracking-tight transition-all duration-1000 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            Coming
            <br />
            <span className="text-foreground/20">Soon</span>
          </h1>

          {/* Divider */}
          <div
            className={`w-24 h-px bg-foreground/20 mt-12 mb-8 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Description */}
          <p
            className={`font-mono text-xs leading-relaxed opacity-50 max-w-md transition-all duration-700 delay-500 ${
              mounted ? "opacity-50 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            I'll write something eventually.
          </p>
        </div>
      </main>

      <Footer position="relative" />
    </div>
  )
}
