"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const links = [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/dev", label: "Develop" },
    { href: "/explore", label: "Explore" },
    { href: "/files", label: "Files" },
  ]

  return (
    <div className={`min-h-screen bg-background text-foreground transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Header minimal />
      <div className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 relative py-16">
        <h1 className="font-serif text-[20vw] md:text-[15vw] lg:text-[12vw] leading-none tracking-tight mb-12 md:mb-16">
          rxxuzi.com
        </h1>

        <nav className="w-full max-w-5xl mb-12">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xl md:text-2xl lg:text-3xl font-medium hover:opacity-50 transition-opacity"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <Footer />
      </div>
    </div>
  )
}
