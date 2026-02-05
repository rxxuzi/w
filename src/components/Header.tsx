import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

type HeaderProps = {
  title?: string
  showBack?: boolean
  backHref?: string
  minimal?: boolean
}

export function Header({ title, showBack = false, backHref = "/", minimal = false }: HeaderProps) {
  if (minimal) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 text-foreground">
        <div className="flex items-center justify-end px-4 py-2 md:px-8 md:py-3">
          <ThemeToggle />
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 text-foreground">
      <div className="flex items-center justify-between px-4 py-2 md:px-8 md:py-3">
        {showBack ? (
          <Link
            href={backHref}
            className="text-sm md:text-base font-sans hover:opacity-50 transition-opacity"
          >
            ←
          </Link>
        ) : (
          <Link
            href="/"
            className="font-sans text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
          >
            rxxuzi
          </Link>
        )}

        <div className="flex items-center gap-4">
          <span className="font-sans text-xs uppercase tracking-widest opacity-70">
            {title || ''}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
