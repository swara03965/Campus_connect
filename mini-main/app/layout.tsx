import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { EventProvider } from "@/contexts/event-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Campus_Connect",
  description: "Created with team4",
  generator: "dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <EventProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </EventProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
