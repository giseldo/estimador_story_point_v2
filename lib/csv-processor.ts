import type { Task } from "./types"

export interface CSVRow {
  title: string
  description: string
  type: string
  storyPoints: number
}

/**
 * Processa o conteúdo de um arquivo CSV e retorna as linhas parseadas
 */
export function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.trim().split("\n")

  if (lines.length < 2) {
    throw new Error("O arquivo CSV deve ter pelo menos um cabeçalho e uma linha de dados")
  }

  // Processar cabeçalho
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""))

  // Mapear colunas esperadas
  const columnMap = {
    title: findColumnIndex(headers, ["title", "titulo", "nome", "name", "task"]),
    description: findColumnIndex(headers, ["description", "descricao", "desc", "details", "detalhes"]),
    type: findColumnIndex(headers, ["type", "tipo", "category", "categoria"]),
    storyPoints: findColumnIndex(headers, ["storypoints", "story_points", "points", "pontos", "sp"]),
  }

  // Verificar se todas as colunas necessárias foram encontradas
  const missingColumns = Object.entries(columnMap)
    .filter(([_, index]) => index === -1)
    .map(([column]) => column)

  if (missingColumns.length > 0) {
    throw new Error(`Colunas obrigatórias não encontradas: ${missingColumns.join(", ")}. 
    Certifique-se de que o CSV contém as colunas: title, description, type, storyPoints`)
  }

  // Processar dados
  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Pular linhas vazias

    const values = parseCSVLine(line)

    if (values.length < Math.max(...Object.values(columnMap)) + 1) {
      console.warn(`Linha ${i + 1} tem menos colunas que o esperado, pulando...`)
      continue
    }

    try {
      const row: CSVRow = {
        title: cleanValue(values[columnMap.title]),
        description: cleanValue(values[columnMap.description]),
        type: normalizeTaskType(cleanValue(values[columnMap.type])),
        storyPoints: parseStoryPoints(cleanValue(values[columnMap.storyPoints])),
      }

      // Validar dados
      if (!row.title || !row.description) {
        console.warn(`Linha ${i + 1}: título ou descrição vazio, pulando...`)
        continue
      }

      rows.push(row)
    } catch (error) {
      console.warn(`Erro ao processar linha ${i + 1}: ${error}`)
    }
  }

  return rows
}

/**
 * Encontra o índice de uma coluna baseado em possíveis nomes
 */
function findColumnIndex(headers: string[], possibleNames: string[]): number {
  for (const name of possibleNames) {
    const index = headers.findIndex((h) => h.includes(name))
    if (index !== -1) return index
  }
  return -1
}

/**
 * Faz o parse de uma linha CSV considerando aspas e vírgulas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

/**
 * Remove aspas e espaços extras de um valor
 */
function cleanValue(value: string): string {
  return value.replace(/^"|"$/g, "").trim()
}

/**
 * Normaliza o tipo de tarefa para os valores aceitos
 */
function normalizeTaskType(type: string): string {
  const lowerType = type.toLowerCase()

  if (lowerType.includes("feature") || lowerType.includes("funcionalidade") || lowerType.includes("nova")) {
    return "feature"
  }
  if (lowerType.includes("bug") || lowerType.includes("erro") || lowerType.includes("correção")) {
    return "bug"
  }
  if (lowerType.includes("refactor") || lowerType.includes("refatoração")) {
    return "refactor"
  }
  if (lowerType.includes("doc") || lowerType.includes("documentação")) {
    return "documentation"
  }

  // Valor padrão
  return "feature"
}

/**
 * Converte string para story points válidos (sequência de Fibonacci)
 */
function parseStoryPoints(value: string): number {
  const num = Number.parseInt(value, 10)

  if (isNaN(num)) {
    throw new Error(`Valor de story points inválido: ${value}`)
  }

  // Mapear para a sequência de Fibonacci mais próxima
  const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]

  if (fibonacciPoints.includes(num)) {
    return num
  }

  // Encontrar o valor mais próximo
  let closest = fibonacciPoints[0]
  let minDiff = Math.abs(num - closest)

  for (const point of fibonacciPoints) {
    const diff = Math.abs(num - point)
    if (diff < minDiff) {
      minDiff = diff
      closest = point
    }
  }

  return closest
}

/**
 * Converte dados CSV para formato de Task
 */
export function csvRowsToTasks(csvRows: CSVRow[]): Task[] {
  return csvRows.map((row, index) => ({
    id: `csv-import-${Date.now()}-${index}`,
    title: row.title,
    description: row.description,
    type: row.type,
    estimatedPoints: row.storyPoints, // Usar o valor do CSV como estimativa inicial
    finalPoints: row.storyPoints,
    createdAt: new Date().toISOString(),
  }))
}

/**
 * Gera um CSV de exemplo para download
 */
export function generateSampleCSV(): string {
  const headers = ["title", "description", "type", "storyPoints"]
  const sampleData = [
    [
      "Implementar login de usuário",
      "Criar tela de login com validação de email e senha, integração com backend de autenticação",
      "feature",
      "5",
    ],
    [
      "Corrigir bug no carrinho de compras",
      "Produtos duplicados aparecem no carrinho quando adicionados rapidamente",
      "bug",
      "3",
    ],
    [
      "Refatorar componente de navegação",
      "Melhorar performance e organização do código do menu principal",
      "refactor",
      "8",
    ],
    [
      "Documentar API de pagamentos",
      "Criar documentação completa dos endpoints de pagamento com exemplos",
      "documentation",
      "2",
    ],
  ]

  const csvContent = [headers.join(","), ...sampleData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
    "\n",
  )

  return csvContent
}
