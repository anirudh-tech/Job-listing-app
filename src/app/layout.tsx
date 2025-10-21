import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KMMMS',
  description: 'Kamarajar Makkal Munnetra Sangam',
  icons: {
    icon: 'https://res.cloudinary.com/daob5eure/image/upload/v1761033298/Kamarajar_Makkal_Munnetra_Sangam-Logo_kcdjwf.png',
  },
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
