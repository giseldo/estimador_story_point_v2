"use client"

import type React from "react"

import { useEffect } from "react"
// import type { Metadata } from "next" // No metadata here
import "./globals.css"

// Metadados para o app
// export const metadata: Metadata = { // No metadata here
//   title: "Story Points Estimator",
//   description: "Estimador de story points com IA e ML",
//   generator: "v0.dev",
// }

// Inicialização dos polyfills essenciais
const initializePolyfills = () => {
  if (typeof window !== "undefined") {
    // Buffer polyfill (crítico para onnxruntime-web)
    if (!window.Buffer) {
      try {
        // Definir um Buffer mínimo para evitar erros imediatos
        window.Buffer = {
          from: (data: any) => new Uint8Array(data),
          isBuffer: () => false,
        } as any

        // Carregar o Buffer completo
        import("buffer")
          .then((bufferModule) => {
            window.Buffer = bufferModule.Buffer
            console.log("Buffer polyfill carregado")
          })
          .catch((err) => {
            console.error("Erro ao carregar Buffer:", err)
          })
      } catch (error) {
        console.error("Erro ao inicializar Buffer:", error)
      }
    }

    // Process polyfill
    if (!window.process) {
      window.process = { env: {} } as any
      try {
        import("process/browser").then((processModule) => {
          window.process = processModule.default
          console.log("Process polyfill carregado")
        })
      } catch (error) {
        console.error("Erro ao inicializar Process:", error)
      }
    }

    // Global polyfill
    if (!window.global) {
      window.global = window
    }
  }
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Inicializar polyfills no lado do cliente
  useEffect(() => {
    initializePolyfills()
  }, [])

  return (
    <html lang="pt-BR">
      <head>
        {/* Adicionar script para inicializar polyfills antes de qualquer coisa */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if (typeof window !== 'undefined') {
              // Buffer polyfill
              if (!window.Buffer) {
                window.Buffer = {
                  from: function(data) { return new Uint8Array(data); },
                  isBuffer: function() { return false; }
                };
              }
              
              // Process polyfill
              if (!window.process) {
                window.process = { env: {} };
              }
              
              // Global polyfill
              if (!window.global) {
                window.global = window;
              }
            }
          `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
