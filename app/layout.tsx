import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

import localFont from 'next/font/local'
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/constants'

const ibmPlexSans = localFont({
  src: [
    { path: '/fonts/IBMPlexSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '/fonts/IBMPlexSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '/fonts/IBMPlexSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '/fonts/IBMPlexSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
})

const bebasNeue = localFont({
  src: [
    { path: '/fonts/BebasNeue-Regular.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--bebas-neue',
})

export const metadata: Metadata = {
  title: {
    template: `%s | BookWise`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
        >
          {children}

          <Toaster position="top-right" expand={true} richColors closeButton />
          {/* <Toaster position="top-left" /> top-left */}
          {/* <Toaster /> default */}
        </body>
      </SessionProvider>
    </html>
  )
}

export default RootLayout
