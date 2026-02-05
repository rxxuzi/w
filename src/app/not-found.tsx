"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`min-h-screen bg-black text-white flex items-center justify-center px-6 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-8xl md:text-9xl font-black leading-none">
            404
          </h1>
          <p className="text-2xl md:text-3xl font-bold">
            Page not found
          </p>
          <p className="font-mono text-sm md:text-base opacity-70 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/"
            className="inline-block border-2 border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src="/images/404.png"
            alt="404 Ghost"
            width={400}
            height={400}
            className="w-64 md:w-96 h-auto animate-float"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
