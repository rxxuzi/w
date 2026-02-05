import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, experiments, and notes by rxxuzi.',
  openGraph: {
    title: 'Blog | rxxuzi.com',
    description: 'Thoughts, experiments, and notes by rxxuzi.',
    images: ['/og?title=Blog'],
  },
  twitter: {
    title: 'Blog | rxxuzi.com',
    description: 'Thoughts, experiments, and notes by rxxuzi.',
    images: ['/og?title=Blog'],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
