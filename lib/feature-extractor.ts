import { COMPLEXITY_KEYWORDS, SCOPE_KEYWORDS, DEPENDENCY_KEYWORDS } from "./estimator"

/**
 * Extrai características (features) de uma descrição de tarefa para uso em modelos de ML
 */
export function extractFeatures(description: string, taskType: string): number[] {
  const lowerDesc = description.toLowerCase()
  const features: number[] = []

  // Feature 1-4: Tipo de tarefa (one-hot encoding)
  features.push(taskType === "feature" ? 1 : 0)
  features.push(taskType === "bug" ? 1 : 0)
  features.push(taskType === "refactor" ? 1 : 0)
  features.push(taskType === "documentation" ? 1 : 0)

  // Feature 5: Comprimento da descrição (normalizado)
  features.push(Math.min(1, description.length / 1000))

  // Feature 6-8: Contagem de palavras-chave de complexidade
  let highComplexityCount = 0
  let mediumComplexityCount = 0
  let lowComplexityCount = 0

  COMPLEXITY_KEYWORDS.high.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) highComplexityCount++
  })

  COMPLEXITY_KEYWORDS.medium.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) mediumComplexityCount++
  })

  COMPLEXITY_KEYWORDS.low.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) lowComplexityCount++
  })

  // Normalizar contagens
  features.push(Math.min(1, highComplexityCount / 5))
  features.push(Math.min(1, mediumComplexityCount / 5))
  features.push(Math.min(1, lowComplexityCount / 5))

  // Feature 9-11: Contagem de palavras-chave de escopo
  let largeScope = 0
  let mediumScope = 0
  let smallScope = 0

  SCOPE_KEYWORDS.large.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) largeScope++
  })

  SCOPE_KEYWORDS.medium.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) mediumScope++
  })

  SCOPE_KEYWORDS.small.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) smallScope++
  })

  // Normalizar contagens
  features.push(Math.min(1, largeScope / 3))
  features.push(Math.min(1, mediumScope / 3))
  features.push(Math.min(1, smallScope / 3))

  // Feature 12: Contagem de palavras-chave de dependência
  let dependencyCount = 0
  DEPENDENCY_KEYWORDS.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) dependencyCount++
  })

  features.push(Math.min(1, dependencyCount / 3))

  // Feature 13: Número de palavras na descrição (normalizado)
  const wordCount = description.split(/\s+/).length
  features.push(Math.min(1, wordCount / 100))

  return features
}

/**
 * Converte um valor de story points para o índice correspondente na sequência de Fibonacci
 */
export function pointsToIndex(points: number): number {
  const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]
  return fibonacciPoints.indexOf(points)
}

/**
 * Converte um índice da sequência de Fibonacci para o valor de story points correspondente
 */
export function indexToPoints(index: number): number {
  const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]
  return fibonacciPoints[Math.max(0, Math.min(fibonacciPoints.length - 1, index))]
}
