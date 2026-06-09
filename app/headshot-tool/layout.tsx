import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Internal',
}

export default function HeadshotToolLayout({ children }: { children: React.ReactNode }) {
  return children
}
