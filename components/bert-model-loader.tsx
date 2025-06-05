"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { loadBertModel, isBertModelLoaded, isBertModelLoading, clearBertModel } from "@/lib/bert-classifier"
import { Download, CheckCircle, AlertCircle, Loader2, Trash2, Wifi, WifiOff, Info, RefreshCw } from "lucide-react"

interface BertModelLoaderProps {
  onStatusChange?: (status: "not-loaded" | "loading" | "loaded" | "error") => void
}

export function BertModelLoader({ onStatusChange }: BertModelLoaderProps) {
  const [status, setStatus] = useState<"not-loaded" | "loading" | "loaded" | "error">("not-loaded")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [browserSupport, setBrowserSupport] = useState<{
    webassembly: boolean
    sharedArrayBuffer: boolean
    webgl: boolean
    modules: boolean
    buffer: boolean
  }>({
    webassembly: false,
    sharedArrayBuffer: false,
    webgl: false,
    modules: false,
    buffer: false,
  })

  // Verificar suporte do navegador
  useEffect(() => {
    const checkBrowserSupport = () => {
      const support = {
        webassembly: typeof WebAssembly !== "undefined",
        sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
        webgl: (() => {
          try {
            const canvas = document.createElement("canvas")
            return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
          } catch {
            return false
          }
        })(),
        modules: typeof window !== "undefined" && "import" in window.document.createElement("script"),
        buffer: typeof window !== "undefined" && typeof window.Buffer !== "undefined",
      }
      setBrowserSupport(support)
    }

    checkBrowserSupport()

    // Verificar Buffer periodicamente
    const bufferCheckInterval = setInterval(() => {
      if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
        setBrowserSupport((prev) => ({ ...prev, buffer: true }))
        clearInterval(bufferCheckInterval)
      }
    }, 1000)

    return () => clearInterval(bufferCheckInterval)
  }, [])

  // Verificar status da conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Verificar status inicial
  useEffect(() => {
    const checkInitialStatus = () => {
      if (isBertModelLoaded()) {
        setStatus("loaded")
      } else if (isBertModelLoading()) {
        setStatus("loading")
      } else {
        setStatus("not-loaded")
      }
    }

    checkInitialStatus()
  }, [])

  // Notificar mudanças de status
  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  // Inicializar polyfills essenciais
  useEffect(() => {
    const initEssentialPolyfills = async () => {
      if (typeof window !== "undefined") {
        // Buffer polyfill (crítico para onnxruntime-web)
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
            console.log("Buffer polyfill carregado no componente")
            setBrowserSupport((prev) => ({ ...prev, buffer: true }))
          } catch (error) {
            console.error("Erro ao carregar Buffer no componente:", error)
          }
        }

        // Process polyfill
        if (!window.process) {
          window.process = { env: {} } as any
          try {
            const processModule = await import("process/browser")
            window.process = processModule.default || processModule
          } catch (error) {
            console.error("Erro ao carregar Process no componente:", error)
          }
        }

        // Global polyfill
        if (!window.global) {
          window.global = window
        }
      }
    }

    initEssentialPolyfills()
  }, [])

  const handleLoadModel = async () => {
    if (!isOnline) {
      setError("Conexão com a internet necessária para carregar o modelo")
      return
    }

    if (!browserSupport.webassembly) {
      setError("Seu navegador não suporta WebAssembly, que é necessário para o modelo BERT")
      return
    }

    setStatus("loading")
    setError(null)
    setProgress(0)

    try {
      // Tentar inicializar Buffer explicitamente
      if (!browserSupport.buffer) {
        try {
          const bufferModule = await import("buffer")
          window.Buffer = bufferModule.Buffer
          console.log("Buffer carregado explicitamente antes do modelo")
          setBrowserSupport((prev) => ({ ...prev, buffer: true }))
        } catch (bufferError) {
          console.error("Erro ao carregar Buffer explicitamente:", bufferError)
        }
      }

      // Simular progresso mais realista
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval)
            return 85
          }
          return prev + Math.random() * 8
        })
      }, 2500)

      await loadBertModel()

      clearInterval(progressInterval)
      setProgress(100)
      setStatus("loaded")
    } catch (err) {
      console.error("Erro ao carregar modelo:", err)

      let errorMessage = "Erro desconhecido"
      if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      setStatus("error")
      setProgress(0)
    }
  }

  const handleClearModel = () => {
    clearBertModel()
    setStatus("not-loaded")
    setProgress(0)
    setError(null)
  }

  const handleReloadPage = () => {
    window.location.reload()
  }

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "loaded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Download className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case "loading":
        return "Carregando modelo BERT... Isso pode demorar alguns minutos na primeira vez."
      case "loaded":
        return "Modelo BERT carregado e pronto para uso!"
      case "error":
        return `Erro ao carregar modelo: ${error}`
      default:
        return "Modelo BERT não carregado. Clique para carregar."
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "bg-blue-50 border-blue-200"
      case "loaded":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const canLoadModel = isOnline && browserSupport.webassembly

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Modelo BERT Local
          {!isOnline && <WifiOff className="h-4 w-4 text-red-500" />}
          {isOnline && <Wifi className="h-4 w-4 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Modelo DistilBERT fine-tuned para estimativa de story points que roda localmente no seu navegador.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={getStatusColor()}>
          <AlertTitle>Status do Modelo</AlertTitle>
          <AlertDescription>{getStatusMessage()}</AlertDescription>
        </Alert>

        {/* Verificação de suporte do navegador */}
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Compatibilidade do Navegador</AlertTitle>
          <AlertDescription>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm">
              <div
                className={`flex items-center gap-1 ${browserSupport.webassembly ? "text-green-700" : "text-red-700"}`}
              >
                {browserSupport.webassembly ? "✅" : "❌"} WebAssembly
              </div>
              <div className={`flex items-center gap-1 ${browserSupport.webgl ? "text-green-700" : "text-yellow-700"}`}>
                {browserSupport.webgl ? "✅" : "⚠️"} WebGL
              </div>
              <div
                className={`flex items-center gap-1 ${browserSupport.sharedArrayBuffer ? "text-green-700" : "text-yellow-700"}`}
              >
                {browserSupport.sharedArrayBuffer ? "✅" : "⚠️"} SharedArrayBuffer
              </div>
              <div
                className={`flex items-center gap-1 ${browserSupport.modules ? "text-green-700" : "text-yellow-700"}`}
              >
                {browserSupport.modules ? "✅" : "⚠️"} ES Modules
              </div>
              <div className={`flex items-center gap-1 ${browserSupport.buffer ? "text-green-700" : "text-red-700"}`}>
                {browserSupport.buffer ? "✅" : "❌"} Buffer
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {!isOnline && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Sem conexão</AlertTitle>
            <AlertDescription>
              Conexão com a internet é necessária para carregar o modelo pela primeira vez.
            </AlertDescription>
          </Alert>
        )}

        {!browserSupport.webassembly && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Navegador incompatível</AlertTitle>
            <AlertDescription>
              Seu navegador não suporta WebAssembly, que é necessário para o modelo BERT. Tente usar um navegador mais
              recente como Chrome, Firefox, Safari ou Edge.
            </AlertDescription>
          </Alert>
        )}

        {!browserSupport.buffer && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Módulo Buffer não disponível</AlertTitle>
            <AlertDescription>
              O módulo Buffer não está disponível, o que é necessário para o modelo BERT. Tente recarregar a página ou
              usar outro navegador.
            </AlertDescription>
          </Alert>
        )}

        {status === "loading" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso do carregamento</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-600">
              {progress < 15 && "Inicializando polyfills..."}
              {progress >= 15 && progress < 40 && "Baixando dependências..."}
              {progress >= 40 && progress < 70 && "Carregando modelo..."}
              {progress >= 70 && progress < 90 && "Configurando pipeline..."}
              {progress >= 90 && progress < 100 && "Finalizando..."}
              {progress >= 100 && "Concluído!"}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {status === "not-loaded" && (
            <>
              <Button onClick={handleLoadModel} className="flex-1" disabled={!canLoadModel || !browserSupport.buffer}>
                <Download className="h-4 w-4 mr-2" />
                Carregar Modelo BERT
              </Button>
              <Button onClick={handleReloadPage} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar Página
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <Button
                onClick={handleLoadModel}
                variant="outline"
                className="flex-1"
                disabled={!canLoadModel || !browserSupport.buffer}
              >
                <Download className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button onClick={handleReloadPage} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar
              </Button>
            </>
          )}

          {status === "loaded" && (
            <Button onClick={handleClearModel} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar da Memória
            </Button>
          )}
        </div>

        {status === "loaded" && (
          <div className="text-sm text-green-700 bg-green-50 rounded p-3">
            <strong>✅ Pronto para uso!</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Processamento 100% local</li>
              <li>Privacidade total</li>
              <li>Funciona offline (após carregamento)</li>
              <li>Sem limites de uso</li>
            </ul>
          </div>
        )}

        {status === "error" && (
          <div className="text-sm text-red-700 bg-red-50 rounded p-3">
            <strong>❌ Erro no carregamento</strong>
            <p className="mt-1">Possíveis soluções:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Verifique sua conexão com a internet</li>
              <li>Feche outras abas para liberar memória</li>
              <li>Tente usar um navegador mais recente</li>
              <li>Recarregue a página completamente</li>
              <li>Limpe o cache do navegador</li>
              <li>Use outros métodos de estimativa</li>
            </ul>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
          <strong>Requisitos:</strong> Navegador moderno com WebAssembly e ES Modules, ~100MB de download inicial,
          conexão com internet para primeiro carregamento.
        </div>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">Alternativa Disponível</AlertTitle>
          <AlertDescription className="text-amber-700">
            Se o modelo BERT não carregar, você ainda pode usar as estimativas baseadas em regras e IA generativa
            (Groq/Grok), que funcionam sem problemas.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
