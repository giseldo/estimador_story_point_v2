// Palavras-chave que indicam complexidade
export const COMPLEXITY_KEYWORDS = {
  high: [
    "complexo",
    "complexa",
    "difícil",
    "desafiador",
    "desafiadora",
    "integração",
    "integrações",
    "múltiplos",
    "múltiplas",
    "vários",
    "várias",
    "algoritmo",
    "algoritmos",
    "otimização",
    "performance",
    "segurança",
    "arquitetura",
    "refatoração",
    "completa",
    "completo",
    "redesenho",
  ],
  medium: [
    "moderado",
    "moderada",
    "médio",
    "média",
    "implementar",
    "implementação",
    "criar",
    "desenvolver",
    "atualizar",
    "melhorar",
    "modificar",
    "adicionar",
    "funcionalidade",
    "feature",
    "componente",
    "módulo",
    "api",
  ],
  low: [
    "simples",
    "fácil",
    "básico",
    "básica",
    "pequeno",
    "pequena",
    "mínimo",
    "mínima",
    "corrigir",
    "ajustar",
    "atualizar",
    "texto",
    "label",
    "estilo",
    "css",
    "documentação",
    "comentário",
    "comentários",
    "typo",
    "erro de digitação",
  ],
}

// Palavras-chave que indicam escopo
export const SCOPE_KEYWORDS = {
  large: [
    "sistema",
    "plataforma",
    "aplicação",
    "aplicativo",
    "completo",
    "completa",
    "todos",
    "todas",
    "inteiro",
    "inteira",
    "global",
    "abrangente",
  ],
  medium: [
    "módulo",
    "componente",
    "página",
    "tela",
    "feature",
    "funcionalidade",
    "serviço",
    "api",
    "endpoint",
    "fluxo",
    "processo",
  ],
  small: [
    "botão",
    "campo",
    "texto",
    "label",
    "ícone",
    "imagem",
    "estilo",
    "validação",
    "mensagem",
    "notificação",
    "alerta",
    "tooltip",
  ],
}

// Palavras-chave que indicam dependências
export const DEPENDENCY_KEYWORDS = [
  "depende",
  "dependência",
  "dependências",
  "requer",
  "necessita",
  "após",
  "depois",
  "antes",
  "integrar",
  "integração",
  "conectar",
  "terceiros",
  "externo",
  "externa",
  "api",
  "serviço",
  "banco de dados",
]

/**
 * Estima a quantidade de story points com base na descrição da tarefa
 */
export function estimateStoryPoints(description: string, taskType: string): number {
  const lowerDesc = description.toLowerCase()

  // Pontuação base por tipo de tarefa
  let basePoints = 0
  switch (taskType) {
    case "feature":
      basePoints = 3
      break
    case "bug":
      basePoints = 2
      break
    case "refactor":
      basePoints = 3
      break
    case "documentation":
      basePoints = 1
      break
    default:
      basePoints = 2
  }

  // Análise de complexidade
  let complexityScore = 0
  COMPLEXITY_KEYWORDS.high.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) complexityScore += 2
  })

  COMPLEXITY_KEYWORDS.medium.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) complexityScore += 1
  })

  COMPLEXITY_KEYWORDS.low.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) complexityScore -= 1
  })

  // Análise de escopo
  let scopeScore = 0
  SCOPE_KEYWORDS.large.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) scopeScore += 2
  })

  SCOPE_KEYWORDS.medium.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) scopeScore += 1
  })

  SCOPE_KEYWORDS.small.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) scopeScore -= 1
  })

  // Análise de dependências
  let dependencyScore = 0
  DEPENDENCY_KEYWORDS.forEach((keyword) => {
    if (lowerDesc.includes(keyword)) dependencyScore += 1
  })

  // Comprimento da descrição (mais detalhes geralmente indicam mais complexidade)
  const lengthScore = Math.min(3, Math.floor(description.length / 200))

  // Cálculo final
  let totalScore = basePoints + complexityScore + scopeScore + dependencyScore + lengthScore

  // Mapeamento para a sequência de Fibonacci (comum em story points)
  const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]

  // Garantir que o score está dentro de limites razoáveis
  totalScore = Math.max(1, Math.min(21, totalScore))

  // Encontrar o valor de Fibonacci mais próximo
  let closestFibIndex = 0
  let minDiff = Math.abs(fibonacciPoints[0] - totalScore)

  for (let i = 1; i < fibonacciPoints.length; i++) {
    const diff = Math.abs(fibonacciPoints[i] - totalScore)
    if (diff < minDiff) {
      minDiff = diff
      closestFibIndex = i
    }
  }

  return fibonacciPoints[closestFibIndex]
}
