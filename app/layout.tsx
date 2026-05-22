import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vaxon Space',
  description: 'Real-time missile defense and connectivity today. Vaxon Space operates air-breathing satellites at 180-250 km altitude.',
  openGraph: {
    title: 'Vaxon Space — Air-Breathing Satellite Technology',
    description: 'Real-time missile defense and connectivity. Vaxon Space operates satellites at 180-250 km altitude — 10× closer than traditional LEO.',
    url: 'https://vaxon-space.vercel.app',
    siteName: 'Vaxon Space',
    images: [
      {
        url: 'https://vaxon-space.vercel.app/vaxon/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vaxon Space — Air-Breathing Satellite Technology',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaxon Space — Air-Breathing Satellite Technology',
    description: 'Real-time missile defense and connectivity. Satellites at 180-250 km altitude — 10× closer than traditional LEO.',
    images: ['https://vaxon-space.vercel.app/vaxon/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bitter:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#000', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
