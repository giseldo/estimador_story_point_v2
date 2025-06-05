import { COMPLEXITY_KEYWORDS, SCOPE_KEYWORDS, DEPENDENCY_KEYWORDS } from "./estimator"

export interface EstimationBreakdown {
  basePoints: number
  basePointsReason: string
  complexityScore: number
  complexityDetails: {
    high: string[]
    medium: string[]
    low: string[]
    score: number
  }
  scopeScore: number
  scopeDetails: {
    large: string[]
    medium: string[]
    small: string[]
    score: number
  }
  dependencyScore: number
  dependencyDetails: {
    keywords: string[]
    score: number
  }
  lengthScore: number
  lengthDetails: {
    characterCount: number
    score: number
  }
  totalScore: number
  finalPoints: number
  fibonacciMapping: {
    originalScore: number
    mappedTo: number
    reason: string
  }
}

/**
 * Analisa uma descrição de tarefa e retorna um breakdown detalhado da estimativa
 */
export function explainEstimation(description: string, taskType: string): EstimationBreakdown {
  const lowerDesc = description.toLowerCase()

  // 1. Pontuação base por tipo de tarefa
  let basePoints = 0
  let basePointsReason = ""

  switch (taskType) {
    case "feature":
      basePoints = 3
      basePointsReason = "Nova funcionalidade geralmente requer desenvolvimento significativo"
      break
    case "bug":
      basePoints = 2
      basePointsReason = "Correções de bug são tipicamente menos complexas que novas funcionalidades"
      break
    case "refactor":
      basePoints = 3
      basePointsReason = "Refatorações requerem análise cuidadosa e podem afetar múltiplas partes do código"
      break
    case "documentation":
      basePoints = 1
      basePointsReason = "Documentação é importante mas geralmente menos complexa tecnicamente"
      break
    default:
      basePoints = 2
      basePointsReason = "Pontuação padrão para tipos não especificados"
  }

  // 2. Análise de complexidade
  const complexityDetails = {
    high: [] as string[],
    medium: [] as string[],
    low: [] as string[],
    score: 0,
  }

  COMPLEXITY_KEYWORDS.high.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) {
      complexityDetails.high.push(keyword)
      complexityDetails.score += 2
    }
  })

  COMPLEXITY_KEYWORDS.medium.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) {
      complexityDetails.medium.push(keyword)
      complexityDetails.score += 1
    }
  })

  COMPLEXITY_KEYWORDS.low.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) {
      complexityDetails.low.push(keyword)
      complexityDetails.score -= 1
    }
  })

  // 3. Análise de escopo
  const scopeDetails = {
    large: [] as string[],
    medium: [] as string[],
    small: [] as string[],
    score: 0,
  }

  SCOPE_KEYWORDS.large.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) {
      scopeDetails.large.push(keyword)
      scopeDetails.score += 2
    }
  })

  SCOPE_KEYWORDS.medium.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) {
      scopeDetails.medium.push(keyword)
      scopeDetails.score += 1
    }
  })

  SCOPE_KEYWORDS.small.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) {
      scopeDetails.small.push(keyword)
      scopeDetails.score -= 1
    }
  })

  // 4. Análise de dependências
  const dependencyDetails = {
    keywords: [] as string[],
    score: 0,
  }

  DEPENDENCY_KEYWORDS.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) {
      dependencyDetails.keywords.push(keyword)
      dependencyDetails.score += 1
    }
  })

  // 5. Análise de comprimento
  const lengthDetails = {
    characterCount: description.length,
    score: Math.min(3, Math.floor(description.length / 200)),
  }

  // 6. Cálculo final
  const totalScore =
    basePoints + complexityDetails.score + scopeDetails.score + dependencyDetails.score + lengthDetails.score

  // 7. Mapeamento para Fibonacci
  const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]
  const clampedScore = Math.max(1, Math.min(21, totalScore))

  let closestFibIndex = 0
  let minDiff = Math.abs(fibonacciPoints[0] - clampedScore)

  for (let i = 1; i < fibonacciPoints.length; i++) {
    const diff = Math.abs(fibonacciPoints[i] - clampedScore)
    if (diff < minDiff) {
      minDiff = diff
      closestFibIndex = i
    }
  }

  const finalPoints = fibonacciPoints[closestFibIndex]

  return {
    basePoints,
    basePointsReason,
    complexityScore: complexityDetails.score,
    complexityDetails,
    scopeScore: scopeDetails.score,
    scopeDetails,
    dependencyScore: dependencyDetails.score,
    dependencyDetails,
    lengthScore: lengthDetails.score,
    lengthDetails,
    totalScore,
    finalPoints,
    fibonacciMapping: {
      originalScore: clampedScore,
      mappedTo: finalPoints,
      reason:
        clampedScore === finalPoints
          ? "A pontuação já estava na sequência de Fibonacci"
          : `Mapeado para o valor mais próximo na sequência de Fibonacci (diferença: ${Math.abs(clampedScore - finalPoints)})`,
    },
  }
}
