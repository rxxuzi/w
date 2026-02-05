import type * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost"
    size?: "default" | "sm" | "lg"
    children: React.ReactNode
}

export function Button({ variant = "default", size = "default", className = "", children, ...props }: ButtonProps) {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
        default: "bg-white text-black hover:bg-white/90 active:bg-white/80",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/30 active:bg-white/10",
        ghost: "bg-transparent text-white hover:bg-white/5 active:bg-white/10",
    }

    const sizes = {
        default: "h-10 px-6 py-2 text-sm",
        sm: "h-8 px-4 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
    }

    return (
      <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
          {children}
      </button>
    )
}
