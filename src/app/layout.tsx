import type { Metadata } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '3e Merwedehaven — REPP',
  description: 'Inschrijvingen 3e Merwedehaven — intern gebruik',
  robots: 'noindex, nofollow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${montserrat.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
