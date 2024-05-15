import { ReactNode } from 'react'
import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })
const notoJp = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: 'DeTC',
  description: 'DeTC - Decentralized Trust Chain',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ja">
      <body className={notoJp.className}>{children}</body>
    </html>
  )
}
