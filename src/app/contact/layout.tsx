import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with rxxuzi. Available for collaborations, projects, and conversations.',
  openGraph: {
    title: 'Contact | rxxuzi.com',
    description: 'Get in touch with rxxuzi.',
    images: ['/og?title=Contact'],
  },
  twitter: {
    title: 'Contact | rxxuzi.com',
    description: 'Get in touch with rxxuzi.',
    images: ['/og?title=Contact'],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
