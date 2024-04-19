import '../globals.css'

import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { SessionProvider } from 'next-auth/react'
import { getMessages } from 'next-intl/server'

import { Toaster } from '@/components/ui/sonner'
import { auth } from '@/auth'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { ModalProvider } from '@/components/providers/modal-provider'

const font = Open_Sans({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Squad | Team Chat Application',
  description:
    "Experience seamless communication and collaboration with our Team Chat Application. Connect effortlessly with your team members, whether they're across the office or around the globe. Share ideas, files, and updates in real-time, keeping everyone on the same page. With intuitive features designed for productivity, streamline your workflow and enhance teamwork like never before. Elevate your team communication with our powerful, secure, and user-friendly Team Chat Application."
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages}>
        <html
          lang={locale}
          suppressHydrationWarning
        >
          <body className={cn(font.className, 'bg-white dark:bg-[#313338]')}>
            <Toaster />
            <ThemeProvider
              attribute='class'
              defaultTheme='dark'
              enableSystem={false}
              storageKey='squad-theme'
            >
              <ModalProvider />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
