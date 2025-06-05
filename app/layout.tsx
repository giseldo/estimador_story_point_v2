import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"

// Metadados para o app
export const metadata: Metadata = {
  title: "Story Points Estimator",
  description: "Estimador de story points com IA e ML",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'