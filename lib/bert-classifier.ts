import type { Pipeline } from "@xenova/transformers"
import { loadPolyfills } from "./polyfills"

// Variáveis globais para o modelo
let classifier: Pipeline | null = null
let isLoading = false
let loadingPromise: Promise<void> | null = null
let isEnvironmentReady = false

/**
 * Inicializa o ambiente necessário para o BERT
 */
async function initializeEnvironment(): Promise<boolean> {
  if (isEnvironmentReady) return true

  try {
    // Garantir que os polyfills estejam carregados
    await loadPolyfills()

    // Verificar se os polyfills essenciais estão disponíveis
    if (typeof window !== "undefined") {
      if (!window.Buffer) {
        console.error("Buffer não está disponível após carregar polyfills")
        return false
      }

      if (!window.process) {
        console.error("Process não está disponível após carregar polyfills")
        return false
      }

      if (!window.global) {
        console.error("Global não está disponível após carregar polyfills")
        return false
      }
    }

    isEnvironmentReady = true
    console.log("Ambiente inicializado com sucesso para BERT")
    return true
  } catch (error) {
    console.error("Erro ao inicializar ambiente para BERT:", error)
    return false
  }
}

/**
 * Carrega o modelo BERT fine-tuned para classificação de story points
 */
export async function loadBertModel(): Promise<void> {
  // Verificar se está no lado do cliente
  if (typeof window === "undefined") {
    throw new Error("BERT classifier só funciona no lado do cliente")
  }

  // Se já está carregado ou carregando, retorna
  if (classifier) return
  if (isLoading && loadingPromise) return loadingPromise

  isLoading = true

  loadingPromise = (async () => {
    try {
      console.log("Inicializando ambiente...")
      const envReady = await initializeEnvironment()

      if (!envReady) {
        throw new Error("Não foi possível inicializar o ambiente necessário para o BERT")
      }

      // Aguardar um pouco para garantir que os polyfills foram aplicados
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("Iniciando carregamento do modelo BERT...")

      // Importação dinâmica para evitar problemas de SSR
      const { pipeline, env } = await import("@xenova/transformers")

      // Configurar ambiente do transformers.js
      env.allowRemoteModels = true
      env.allowLocalModels = false
      env.useBrowserCache = true
      env.useCustomCache = true

      // Configurações específicas para evitar problemas
      env.backends.onnx.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/"

      // Configurações adicionais para estabilidade
      env.backends.onnx.wasm.numThreads = 1 // Usar apenas 1 thread para evitar problemas
      env.backends.onnx.wasm.simd = false // Desabilitar SIMD se causar problemas

      console.log("Carregando pipeline de classificação...")

      // Tentar carregar com configurações conservadoras primeiro
      try {
        classifier = await pipeline("text-classification", "giseldo/distilbert_bert_uncased_finetuned_story_point", {
          revision: "main",
          quantized: true, // Usar versão quantizada para menor uso de memória
          device: "cpu", // Forçar CPU para maior compatibilidade
          dtype: "q8", // Usar quantização int8
          progress_callback: (progress: any) => {
            if (progress.status === "downloading") {
              console.log(`Baixando: ${progress.name} - ${Math.round(progress.progress || 0)}%`)
            } else if (progress.status === "loading") {
              console.log(`Carregando: ${progress.name}`)
            }
          },
        })
      } catch (primaryError) {
        console.warn("Erro com configuração primária, tentando fallback:", primaryError)

        // Fallback: tentar com configurações ainda mais conservadoras
        classifier = await pipeline("text-classification", "giseldo/distilbert_bert_uncased_finetuned_story_point", {
          revision: "main",
          quantized: true,
          device: "cpu",
          dtype: "fp32",
        })
      }

      console.log("Modelo BERT carregado com sucesso!")
    } catch (error) {
      console.error("Erro ao carregar modelo BERT:", error)
      classifier = null

      // Fornecer mensagem de erro mais específica
      let errorMessage = "Erro desconhecido ao carregar modelo"

      if (error instanceof Error) {
        if (error.message.includes("fetch") || error.message.includes("network")) {
          errorMessage = "Erro de rede. Verifique sua conexão com a internet."
        } else if (error.message.includes("memory") || error.message.includes("Memory")) {
          errorMessage = "Memória insuficiente. Feche outras abas e tente novamente."
        } else if (error.message.includes("WebAssembly") || error.message.includes("wasm")) {
          errorMessage = "Seu navegador não suporta WebAssembly ou há um problema com os arquivos WASM."
        } else if (error.message.includes("buffer") || error.message.includes("Buffer")) {
          errorMessage = "Erro com o módulo Buffer. Tente recarregar a página."
        } else if (error.message.includes("require") || error.message.includes("module")) {
          errorMessage = "Erro de dependências. Tente recarregar a página."
        } else {
          errorMessage = error.message
        }
      }

      throw new Error(errorMessage)
    } finally {
      isLoading = false
      loadingPromise = null
    }
  })()

  return loadingPromise
}

/**
 * Classifica uma tarefa usando o modelo BERT fine-tuned
 */
export async function classifyWithBert(
  title: string,
  description: string,
): Promise<{
  points: number
  confidence: number
  allPredictions: any[]
} | null> {
  try {
    // Verificar se está no lado do cliente
    if (typeof window === "undefined") {
      throw new Error("BERT classifier só funciona no lado do cliente")
    }

    // Carregar modelo se ainda não foi carregado
    if (!classifier) {
      await loadBertModel()
    }

    if (!classifier) {
      throw new Error("Modelo BERT não pôde ser carregado")
    }

    // Combinar título e descrição
    const context = `${title}. ${description}`.trim()

    // Limitar o tamanho do texto para evitar problemas (BERT tem limite de tokens)
    const maxLength = 400 // Reduzido para maior compatibilidade
    const truncatedContext = context.length > maxLength ? context.substring(0, maxLength) + "..." : context

    console.log("Classificando com BERT:", truncatedContext.substring(0, 100) + "...")

    // Fazer a classificação com timeout
    const classificationPromise = classifier(truncatedContext, {
      top_k: null, // Retornar todas as classificações
    })

    // Adicionar timeout de 30 segundos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout na classificação")), 30000)
    })

    const results = await Promise.race([classificationPromise, timeoutPromise])

    console.log("Resultados BERT:", results)

    if (!Array.isArray(results) || results.length === 0) {
      throw new Error("Resultado inválido do modelo BERT")
    }

    // Encontrar a classificação com maior score
    const bestPrediction = results.reduce((prev: any, current: any) => (prev.score > current.score ? prev : current))

    // Extrair o número do label (assumindo que o label é o story point)
    const pointsMatch = bestPrediction.label.match(/\d+/)
    const points = pointsMatch ? Number.parseInt(pointsMatch[0], 10) : null

    // Verificar se o número está na sequência de Fibonacci
    const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]

    let finalPoints: number
    if (points && fibonacciPoints.includes(points)) {
      finalPoints = points
    } else {
      // Se não for um número válido da sequência, usar o mais próximo
      finalPoints = fibonacciPoints.reduce((prev, curr) =>
        Math.abs(curr - (points || 3)) < Math.abs(prev - (points || 3)) ? curr : prev,
      )
    }

    return {
      points: finalPoints,
      confidence: bestPrediction.score,
      allPredictions: results,
    }
  } catch (error) {
    console.error("Erro na classificação BERT:", error)
    return null
  }
}

/**
 * Verifica se o modelo está carregado
 */
export function isBertModelLoaded(): boolean {
  return classifier !== null
}

/**
 * Verifica se o modelo está sendo carregado
 */
export function isBertModelLoading(): boolean {
  return isLoading
}

/**
 * Obtém informações sobre o modelo
 */
export function getBertModelInfo(): {
  loaded: boolean
  loading: boolean
  modelName: string
} {
  return {
    loaded: classifier !== null,
    loading: isLoading,
    modelName: "giseldo/distilbert_bert_uncased_finetuned_story_point",
  }
}

/**
 * Limpa o modelo da memória
 */
export function clearBertModel(): void {
  if (classifier && typeof classifier.dispose === "function") {
    try {
      classifier.dispose()
    } catch (error) {
      console.warn("Erro ao limpar modelo:", error)
    }
  }

  classifier = null
  isLoading = false
  loadingPromise = null
}
