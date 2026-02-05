"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const contacts = [
  { label: "Email", value: "contact@rxxuzi.com", href: "mailto:contact@rxxuzi.com" },
  { label: "X", value: "x.com/rxxuzi", href: "https://x.com/rxxuzi" },
  { label: "GitHub", value: "github.com/rxxuzi", href: "https://github.com/rxxuzi" },
  { label: "LinkedIn", value: "linkedin.com/in/rxxuzi", href: "https://linkedin.com/in/rxxuzi" },
]

export default function ContactPage() {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = (value: string, idx: number) => {
    navigator.clipboard.writeText(value)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="text-sm hover:opacity-50 transition-opacity">
          ←
        </Link>
        <span className="text-xs tracking-[0.2em] uppercase text-neutral-400">
          Contact
        </span>
      </nav>

      {/* Main */}
      <main className="px-6 md:px-12 lg:px-24 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: Title */}
          <div className="lg:sticky lg:top-24">
            <h1
              className={`text-7xl sm:text-8xl md:text-9xl font-black leading-[0.9] tracking-tight transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Get in
              <br />
              Touch
            </h1>
            <div
              className={`w-16 h-1 bg-foreground mt-8 transition-all duration-700 delay-200 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            />
            <p
              className={`text-xs tracking-[0.15em] text-foreground/40 mt-6 transition-all duration-700 delay-300 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              c/o rxxuzi
            </p>
          </div>

          {/* Right: Contact list */}
          <div>
            {contacts.map((c, i) => (
              <div
                key={c.label}
                className={`group py-5 border-b border-foreground/20 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: `${400 + i * 80}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base md:text-lg font-medium hover:opacity-50 transition-opacity truncate"
                  >
                    {c.value}
                  </a>
                  <button
                    onClick={() => handleCopy(c.value, i)}
                    className="text-[0.6rem] tracking-wider uppercase text-foreground/40 hover:text-foreground transition-colors shrink-0"
                  >
                    {copied === i ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ))}

            {/* Availability */}
            <p
              className={`text-xs leading-relaxed text-foreground/40 mt-8 transition-all duration-700 delay-700 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              Available for collaborations,
              <br />
              projects, and conversations.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}