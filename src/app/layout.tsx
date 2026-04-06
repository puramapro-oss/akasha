import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AKASHA AI — Tous les outils IA. Un seul abonnement.',
  description: '47+ outils IA premium reunis en une seule plateforme. Cree, automatise, code et genere — sans jamais changer d\'app. Des 7EUR/mois.',
  metadataBase: new URL('https://akasha.purama.dev'),
  openGraph: {
    title: 'AKASHA AI — 47+ outils IA en un',
    description: 'Le premier ecosysteme IA tout-en-un au monde.',
    url: 'https://akasha.purama.dev',
    siteName: 'AKASHA AI',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AKASHA AI',
    description: '47+ outils IA. 1 abonnement. Des 7EUR/mois.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#00d4ff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[var(--bg-void)] font-[family-name:var(--font-body)] text-[var(--text-primary)] antialiased">
        <div className="nebula-orb fixed left-[10%] top-[20%] h-[400px] w-[400px] bg-[var(--cyan)]" />
        <div className="nebula-orb fixed right-[15%] top-[60%] h-[350px] w-[350px] bg-[var(--purple)]" style={{ animationDelay: '-7s' }} />
        <div className="nebula-orb fixed left-[60%] top-[10%] h-[300px] w-[300px] bg-[var(--pink)]" style={{ animationDelay: '-14s' }} />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#f0f2ff',
            },
          }}
        />
      </body>
    </html>
  )
}
