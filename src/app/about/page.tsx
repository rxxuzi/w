"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/Header"

export default function About() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div
            className={`min-h-screen bg-background text-foreground transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
            {/* Triangle animation overlay */}
            <div
                className={`fixed inset-0 z-50 bg-black flex items-end justify-center transition-all duration-2000 ${isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
                <div className={`triangle-expand ${isLoaded ? "expanded" : ""}`}></div>
            </div>

            <Header title="About" showBack />

            <div className="min-h-screen flex flex-col">
                {/* Hero section with oversized name */}
                <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-24 py-24">
                    <div className="w-full max-w-7xl">
                        <h1 className="hero-name leading-[0.85] mb-8 md:mb-12 font-sans">
                            Takeshi
                            <br />
                            Fukuda
                        </h1>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight max-w-2xl">
                            Security & AI Developer
                        </p>
                    </div>
                </div>

                {/* Content grid */}
                <div className="px-6 md:px-12 lg:px-24 pb-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        {/* Left column - Bio */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="space-y-4 font-mono text-sm md:text-base leading-relaxed">
                                <p>
                                    As a student, I was engaged in research on AI, specifically large language models (LLMs). I
                                    specialized in semiconductor engineering, quantum mechanics, and deep learning to build technical
                                    foundations.
                                </p>
                                <p>Since 2025, I have been working in a technical position in a cyber security company.</p>
                            </div>
                        </div>

                        {/* Right column - Contact & Links */}
                        <div className="lg:col-span-5 space-y-12">
                            {/* Contact */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono tracking-widest uppercase opacity-50">Contact</h3>
                                <button
                                    onClick={() => copyToClipboard("contact@rxxuzi.com")}
                                    className="text-base md:text-lg font-bold hover:opacity-50 transition-opacity block"
                                >
                                    contact@rxxuzi.com
                                </button>
                            </div>

                            {/* Connect */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono tracking-widest uppercase opacity-50">Connect</h3>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                    <a
                                        href="https://twitter.com/rxxuzi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm md:text-base font-mono hover:opacity-50 transition-opacity"
                                    >
                                        Twitter
                                    </a>
                                    <a
                                        href="https://github.com/rxxuzi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm md:text-base font-mono hover:opacity-50 transition-opacity"
                                    >
                                        GitHub
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/rxxuzi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm md:text-base font-mono hover:opacity-50 transition-opacity"
                                    >
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://instagram.com/rxxuzi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm md:text-base font-mono hover:opacity-50 transition-opacity"
                                    >
                                        Instagram
                                    </a>
                                    <a
                                        href="https://fb.com/rxxuzi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm md:text-base font-mono hover:opacity-50 transition-opacity"
                                    >
                                        Facebook
                                    </a>
                                </div>
                            </div>

                            {/* Crypto */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono tracking-widest uppercase opacity-50">Crypto</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-mono mb-1 opacity-50">BTC</p>
                                        <button
                                            onClick={() => copyToClipboard("1MeD4BF7woJ2fD163jBfEsMc1ok8KtBF1E")}
                                            className="text-xs md:text-sm font-mono hover:opacity-50 transition-opacity break-all text-left"
                                        >
                                            1MeD4BF7woJ2fD163jBfEsMc1ok8KtBF1E
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-xs font-mono mb-1 opacity-50">SOL</p>
                                        <button
                                            onClick={() => copyToClipboard("Fj8qncxrAmA1cpaVbo8529EY7HSPZ59ht1u9ApfctZsR")}
                                            className="text-xs md:text-sm font-mono hover:opacity-50 transition-opacity break-all text-left"
                                        >
                                            Fj8qncxrAmA1cpaVbo8529EY7HSPZ59ht1u9ApfctZsR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
