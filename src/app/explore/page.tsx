"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { GrainGradient } from "@paper-design/shaders-react"
import { Header } from "@/components/Header"

const subdomains = [
  {
    name: "AI",
    url: "https://ai.rxxuzi.com",
    desc: "LLMs, deep learning, transformers",
  },
  {
    name: "Security",
    url: "https://security.rxxuzi.com",
    desc: "Threat detection, cryptography",
  },
  {
    name: "Quantum",
    url: "https://quantum.rxxuzi.com",
    desc: "Semiconductors, quantum computing",
  },
  {
    name: "Design",
    url: "https://design.rxxuzi.com",
    desc: "Brutalism, raw aesthetics",
  },
  {
    name: "Web3",
    url: "https://web3.rxxuzi.com",
    desc: "Blockchain, smart contracts",
  },
  {
    name: "Lab",
    url: "https://lab.rxxuzi.com",
    desc: "Experiments, prototypes",
  },
]

export default function ExplorePage() {
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === "dark"

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* GrainGradient — fixed bg, dimmed so text is readable */}
      <div
        className="fixed inset-0 opacity-0 transition-opacity duration-[2000ms]"
        style={{ opacity: mounted ? 0.45 : 0 }}
      >
        <GrainGradient
          style={{ width: "100%", height: "100%", display: "block" }}
          colors={isDark
            ? ["#5d00ff", "#ec91f2", "#33ddff"]
            : ["#ff6b6b", "#feca57", "#48dbfb"]
          }
          colorBack={isDark ? "#000000" : "#ffffff"}
          softness={0.6}
          intensity={isDark ? 0.35 : 0.25}
          noise={0.11}
          shape="corners"
          speed={0.9}
          scale={0.96}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header showBack title="Explore" />

        {/* Hero */}
        <div className="px-6 md:px-12 lg:px-24 pt-16 md:pt-28 pb-12 md:pb-20">
          <h1
            className={`text-7xl sm:text-8xl md:text-9xl font-black leading-[0.9] tracking-tight transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Explore
          </h1>
          <p
            className={`text-xs tracking-[0.2em] text-foreground/40 mt-6 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            *.rxxuzi.com
          </p>
        </div>

        {/* List */}
        <div className="mt-auto px-6 md:px-12 lg:px-24 pb-12 md:pb-20">
          <div className="max-w-5xl">
            {subdomains.map((s, i) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 md:gap-6 py-5 md:py-6 border-b border-foreground/10 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: `${500 + i * 70}ms` }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <span
                  className={`text-2xl md:text-3xl font-black tracking-tight min-w-[100px] md:min-w-[140px] transition-opacity duration-300 ${
                    hovered !== null && hovered !== i ? "opacity-20" : "opacity-100"
                  }`}
                >
                  {s.name}
                </span>

                <span
                  className={`hidden md:block text-xs text-foreground/40 transition-opacity duration-300 ${
                    hovered !== null && hovered !== i ? "opacity-10" : "opacity-100"
                  }`}
                >
                  {s.desc}
                </span>

                <span className="flex-1" />

                <span
                  className={`text-xs text-foreground/30 group-hover:text-foreground/70 transition-all duration-300 shrink-0 ${
                    hovered !== null && hovered !== i ? "opacity-10" : "opacity-100"
                  }`}
                >
                  {s.url.replace("https://", "")} ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
