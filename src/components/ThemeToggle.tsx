"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    setIsRotating(true)
    setTheme(theme === "dark" ? "light" : "dark")
    setTimeout(() => setIsRotating(false), 500)
  }

  if (!mounted) {
    return <div className="w-5 h-5" />
  }

  return (
    <button
      onClick={handleToggle}
      className="hover:opacity-50 transition-opacity"
      aria-label="Toggle theme"
    >
      <div
        className={`transition-transform duration-500 ${
          isRotating ? "rotate-[360deg]" : "rotate-0"
        }`}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </div>
    </button>
  )
}
