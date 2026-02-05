import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Files',
  description: 'Public files and resources shared by rxxuzi.',
  openGraph: {
    title: 'Files | rxxuzi.com',
    description: 'Public files and resources shared by rxxuzi.',
    images: ['/og?title=Files'],
  },
  twitter: {
    title: 'Files | rxxuzi.com',
    description: 'Public files and resources shared by rxxuzi.',
    images: ['/og?title=Files'],
  },
}

export default function FilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
