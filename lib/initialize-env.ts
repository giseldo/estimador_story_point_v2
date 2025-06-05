/**
 * Script de inicialização para configurar o ambiente antes de carregar bibliotecas dependentes
 */

// Polyfills essenciais para onnxruntime-web
if (typeof window !== "undefined") {
  // Polyfill para Buffer - CRÍTICO para onnxruntime-web
  if (!window.Buffer) {
    try {
      // Importar diretamente do pacote buffer
      import("buffer")
        .then((bufferModule) => {
          window.Buffer = bufferModule.Buffer
          console.log("Buffer polyfill aplicado com sucesso")
        })
        .catch((err) => {
          console.error("Erro ao carregar Buffer polyfill:", err)
        })
    } catch (error) {
      console.error("Erro ao inicializar Buffer polyfill:", error)
    }
  }

  // Polyfill para process
  if (!window.process) {
    try {
      window.process = { env: {} } as any
      import("process/browser")
        .then((processModule) => {
          window.process = processModule.default
          console.log("Process polyfill aplicado com sucesso")
        })
        .catch((err) => {
          console.error("Erro ao carregar Process polyfill:", err)
        })
    } catch (error) {
      console.error("Erro ao inicializar Process polyfill:", error)
    }
  }

  // Garantir que global esteja definido
  if (!window.global) {
    window.global = window
    console.log("Global polyfill aplicado")
  }
}

// Declarações de tipos para TypeScript
declare global {
  interface Window {
    Buffer: any
    process: any
    global: any
  }
}

export default function initializeEnvironment() {
  console.log("Ambiente inicializado para compatibilidade com bibliotecas Node.js")
  return true
}
