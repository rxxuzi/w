import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Explorations and experiments by rxxuzi.',
  openGraph: {
    title: 'Explore | rxxuzi.com',
    description: 'Explorations and experiments by rxxuzi.',
    images: ['/og?title=Explore'],
  },
  twitter: {
    title: 'Explore | rxxuzi.com',
    description: 'Explorations and experiments by rxxuzi.',
    images: ['/og?title=Explore'],
  },
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
