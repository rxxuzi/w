import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore projects and work by rxxuzi. Security tools, AI research, and more.',
  openGraph: {
    title: 'Projects | rxxuzi.com',
    description: 'Explore projects and work by rxxuzi.',
    images: ['/og?title=Projects'],
  },
  twitter: {
    title: 'Projects | rxxuzi.com',
    description: 'Explore projects and work by rxxuzi.',
    images: ['/og?title=Projects'],
  },
}

export default function DevelopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
