/**
 * Polyfills modernos para compatibilidade com bibliotecas Node.js no navegador
 */

// Função para carregar polyfills dinamicamente
export async function loadPolyfills() {
  if (typeof window === "undefined") return

  try {
    // Polyfill para Buffer - CRÍTICO para onnxruntime-web
    if (!window.Buffer) {
      try {
        // Definir um Buffer mínimo para evitar erros imediatos
        window.Buffer = {
          from: (data: any) => new Uint8Array(data),
          isBuffer: () => false,
          alloc: (size: number) => new Uint8Array(size),
        } as any

        // Carregar o Buffer completo
        const bufferModule = await import("buffer")
        window.Buffer = bufferModule.Buffer
        console.log("Buffer polyfill completo carregado")
      } catch (bufferError) {
        console.warn("Erro ao carregar Buffer completo:", bufferError)
      }
    }

    // Polyfill para process
    if (!window.process) {
      try {
        // Definir um process mínimo para evitar erros imediatos
        window.process = { env: {} } as any

        // Carregar o process completo
        const processModule = await import("process/browser")
        window.process = processModule.default || processModule
        console.log("Process polyfill carregado")
      } catch (processError) {
        console.warn("Erro ao carregar Process:", processError)
      }
    }

    // Polyfill para global
    if (!window.global) {
      window.global = window
      console.log("Global polyfill aplicado")
    }

    // Outros polyfills opcionais
    try {
      // Long (usado por onnxruntime-web)
      if (!window.Long) {
        const Long = await import("long")
        window.Long = Long.default || Long
        console.log("Long polyfill carregado")
      }
    } catch (error) {
      console.warn("Erro ao carregar polyfills opcionais:", error)
    }

    console.log("Polyfills carregados com sucesso")
    return true
  } catch (error) {
    console.error("Erro ao carregar polyfills:", error)
    return false
  }
}

// Carregar polyfills automaticamente
if (typeof window !== "undefined") {
  // Definir polyfills mínimos imediatamente
  if (!window.Buffer) {
    window.Buffer = {
      from: (data: any) => new Uint8Array(data),
      isBuffer: () => false,
      alloc: (size: number) => new Uint8Array(size),
    } as any
  }

  if (!window.process) {
    window.process = { env: {} } as any
  }

  if (!window.global) {
    window.global = window
  }

  // Carregar polyfills completos
  loadPolyfills().catch(console.error)
}

// Declarações de tipos para TypeScript
declare global {
  interface Window {
    Buffer: any
    process: any
    global: any
    Long: any
    EventEmitter: any
    assert: any
  }
}
