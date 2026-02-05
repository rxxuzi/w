import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Security & AI Developer. Learn more about rxxuzi - background, skills, and contact information.',
  openGraph: {
    title: 'About | rxxuzi.com',
    description: 'Security & AI Developer. Learn more about rxxuzi.',
    images: ['/og?title=About'],
  },
  twitter: {
    title: 'About | rxxuzi.com',
    description: 'Security & AI Developer. Learn more about rxxuzi.',
    images: ['/og?title=About'],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
