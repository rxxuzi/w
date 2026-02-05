type FooterProps = {
  position?: 'absolute' | 'relative'
}

export function Footer({ position = 'absolute' }: FooterProps) {
  const positionClass = position === 'absolute' ? 'absolute bottom-8 left-0 right-0' : 'py-6'
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`${positionClass} text-center text-xs md:text-sm font-sans text-foreground opacity-30`}>
      © 2024-{currentYear} rxxuzi.com
    </footer>
  )
}
