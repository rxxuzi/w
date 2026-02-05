"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/Button"
import Link from "next/link"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error("[v0] Error:", error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
            <div className="mx-auto max-w-2xl text-center">
                <div className="mb-8 flex justify-center animate-fade-in">
                    <div className="rounded-full bg-white/5 p-6">
                        <AlertCircle className="h-16 w-16 text-white/80" />
                    </div>
                </div>

                <div className="mb-8 space-y-4 animate-fade-in-delay-200">
                    <h2 className="text-balance font-serif text-3xl font-light tracking-tight text-white md:text-4xl">
                        Something went wrong
                    </h2>
                    <p className="text-pretty font-light leading-relaxed text-white/60 md:text-lg">
                        An unexpected error occurred. Please try again or return to the home page.
                    </p>
                    {error.message && (
                        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 text-left">
                            <p className="font-mono text-xs text-white/40">Error Details:</p>
                            <p className="mt-2 font-mono text-sm text-white/60">{error.message}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center gap-3 animate-fade-in-delay-400 sm:flex-row">
                    <Button size="lg" className="bg-white font-medium text-black hover:bg-white/90" onClick={() => reset()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/20 bg-transparent font-medium text-white hover:bg-white/5"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {error.digest && <div className="mt-16 font-mono text-xs text-white/20">Error ID: {error.digest}</div>}
            </div>
        </div>
    )
}
