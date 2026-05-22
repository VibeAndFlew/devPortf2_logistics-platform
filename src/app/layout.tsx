import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import AppProviders from "@/providers/app-providers"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "FLEETWATCH - Logistics Intelligence Platform",
  description: "Real-time fleet intelligence and logistics operations center",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AppProviders>
          <Sidebar />
          <div className="pl-56">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
