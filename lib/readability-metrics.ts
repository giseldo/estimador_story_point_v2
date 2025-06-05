export interface ReadabilityMetrics {
  gunningFog: number
  fleschReadingEase: number
  fleschKincaidGrade: number
  smogIndex: number
  colemanLiauIndex: number
  automatedReadabilityIndex: number
  daleChallReadabilityScore: number
  difficultWords: number
  linsearWriteFormula: number
  wordCount: number
  sentenceCount: number
  syllableCount: number
  characterCount: number
}

// Lista de palavras comuns em português (simplificada)
const COMMON_WORDS = new Set([
  "a",
  "e",
  "o",
  "as",
  "os",
  "um",
  "uma",
  "de",
  "do",
  "da",
  "dos",
  "das",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "para",
  "por",
  "com",
  "sem",
  "sobre",
  "entre",
  "até",
  "desde",
  "durante",
  "após",
  "antes",
  "depois",
  "que",
  "qual",
  "quais",
  "quando",
  "onde",
  "como",
  "porque",
  "se",
  "mas",
  "ou",
  "nem",
  "também",
  "já",
  "ainda",
  "sempre",
  "nunca",
  "muito",
  "pouco",
  "mais",
  "menos",
  "bem",
  "mal",
  "melhor",
  "pior",
  "ser",
  "estar",
  "ter",
  "haver",
  "fazer",
  "ir",
  "vir",
  "dar",
  "ver",
  "saber",
  "poder",
  "querer",
  "dizer",
  "falar",
  "pensar",
  "achar",
  "ficar",
  "deixar",
  "passar",
  "chegar",
  "sair",
  "entrar",
  "eu",
  "tu",
  "ele",
  "ela",
  "nós",
  "vós",
  "eles",
  "elas",
  "me",
  "te",
  "se",
  "nos",
  "vos",
  "lhe",
  "lhes",
  "meu",
  "teu",
  "seu",
  "nosso",
  "vosso",
  "minha",
  "tua",
  "sua",
  "nossa",
  "vossa",
  "este",
  "esta",
  "esse",
  "essa",
  "aquele",
  "aquela",
  "isto",
  "isso",
  "aquilo",
  "mesmo",
  "próprio",
  "outro",
  "outra",
  "todo",
  "toda",
  "alguns",
  "algumas",
  "muitos",
  "muitas",
  "poucos",
  "poucas",
  "cada",
  "qualquer",
  "sistema",
  "dados",
  "usuário",
  "função",
  "método",
  "classe",
  "objeto",
  "arquivo",
  "código",
  "programa",
])

/**
 * Conta o número de sílabas em uma palavra (aproximação para português)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase()

  // Remover pontuação
  word = word.replace(/[^a-záàâãéêíóôõúç]/g, "")

  if (word.length === 0) return 0
  if (word.length <= 2) return 1

  // Contar vogais
  const vowels = word.match(/[aeiouáàâãéêíóôõúç]/g)
  let syllableCount = vowels ? vowels.length : 0

  // Ajustes para português
  // Ditongos e tritongos reduzem o número de sílabas
  const diphthongs = word.match(/[aeiou][aeiou]/g)
  if (diphthongs) {
    syllableCount -= diphthongs.length * 0.5
  }

  // Palavras terminadas em 'e' mudo
  if (word.endsWith("e") && syllableCount > 1) {
    syllableCount -= 0.5
  }

  return Math.max(1, Math.round(syllableCount))
}

/**
 * Conta sentenças no texto
 */
function countSentences(text: string): number {
  // Contar pontos finais, exclamações e interrogações
  const sentences = text.match(/[.!?]+/g)
  return sentences ? sentences.length : 1
}

/**
 * Conta palavras no texto
 */
function countWords(text: string): number {
  const words = text.trim().split(/\s+/)
  return words.filter((word) => word.length > 0).length
}

/**
 * Conta palavras difíceis (não estão na lista de palavras comuns)
 */
function countDifficultWords(text: string): number {
  const words = text.toLowerCase().split(/\s+/)
  let difficultCount = 0

  for (const word of words) {
    const cleanWord = word.replace(/[^a-záàâãéêíóôõúç]/g, "")
    if (cleanWord.length > 0 && !COMMON_WORDS.has(cleanWord)) {
      difficultCount++
    }
  }

  return difficultCount
}

/**
 * Conta o total de sílabas no texto
 */
function countTotalSyllables(text: string): number {
  const words = text.split(/\s+/)
  let totalSyllables = 0

  for (const word of words) {
    if (word.trim().length > 0) {
      totalSyllables += countSyllables(word)
    }
  }

  return totalSyllables
}

/**
 * Calcula o Gunning Fog Index
 */
function calculateGunningFog(words: number, sentences: number, complexWords: number): number {
  if (sentences === 0) return 0
  const avgSentenceLength = words / sentences
  const complexWordPercentage = (complexWords / words) * 100
  return 0.4 * (avgSentenceLength + complexWordPercentage)
}

/**
 * Calcula o Flesch Reading Ease
 */
function calculateFleschReadingEase(words: number, sentences: number, syllables: number): number {
  if (sentences === 0 || words === 0) return 0
  const avgSentenceLength = words / sentences
  const avgSyllablesPerWord = syllables / words
  return 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord
}

/**
 * Calcula o Flesch-Kincaid Grade Level
 */
function calculateFleschKincaidGrade(words: number, sentences: number, syllables: number): number {
  if (sentences === 0 || words === 0) return 0
  const avgSentenceLength = words / sentences
  const avgSyllablesPerWord = syllables / words
  return 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59
}

/**
 * Calcula o SMOG Index
 */
function calculateSmogIndex(sentences: number, complexWords: number): number {
  if (sentences === 0) return 0
  const complexWordsPerSentence = complexWords / sentences
  return 1.043 * Math.sqrt(complexWordsPerSentence * 30) + 3.1291
}

/**
 * Calcula o Coleman-Liau Index
 */
function calculateColemanLiauIndex(words: number, sentences: number, characters: number): number {
  if (words === 0) return 0
  const avgCharsPerWord = (characters / words) * 100
  const avgSentencesPerWord = (sentences / words) * 100
  return 0.0588 * avgCharsPerWord - 0.296 * avgSentencesPerWord - 15.8
}

/**
 * Calcula o Automated Readability Index
 */
function calculateAutomatedReadabilityIndex(words: number, sentences: number, characters: number): number {
  if (sentences === 0 || words === 0) return 0
  const avgCharsPerWord = characters / words
  const avgWordsPerSentence = words / sentences
  return 4.71 * avgCharsPerWord + 0.5 * avgWordsPerSentence - 21.43
}

/**
 * Calcula o Dale-Chall Readability Score
 */
function calculateDaleChallReadabilityScore(words: number, sentences: number, difficultWords: number): number {
  if (sentences === 0 || words === 0) return 0
  const avgSentenceLength = words / sentences
  const difficultWordPercentage = (difficultWords / words) * 100

  let score = 0.1579 * difficultWordPercentage + 0.0496 * avgSentenceLength

  if (difficultWordPercentage > 5) {
    score += 3.6365
  }

  return score
}

/**
 * Calcula o Linsear Write Formula
 */
function calculateLinsearWriteFormula(words: number, sentences: number, complexWords: number): number {
  if (sentences === 0 || words === 0) return 0

  const simpleWords = words - complexWords
  const score = (simpleWords * 1 + complexWords * 3) / sentences

  if (score > 20) {
    return score / 2
  } else {
    return (score - 2) / 2
  }
}

/**
 * Calcula todas as métricas de legibilidade para um texto
 */
export function calculateReadabilityMetrics(text: string): ReadabilityMetrics {
  if (!text || text.trim().length === 0) {
    return {
      gunningFog: 0,
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      smogIndex: 0,
      colemanLiauIndex: 0,
      automatedReadabilityIndex: 0,
      daleChallReadabilityScore: 0,
      difficultWords: 0,
      linsearWriteFormula: 0,
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      characterCount: 0,
    }
  }

  const wordCount = countWords(text)
  const sentenceCount = countSentences(text)
  const syllableCount = countTotalSyllables(text)
  const characterCount = text.replace(/\s/g, "").length
  const difficultWords = countDifficultWords(text)

  // Palavras complexas (3+ sílabas) para alguns cálculos
  const words = text.split(/\s+/)
  const complexWords = words.filter((word) => countSyllables(word) >= 3).length

  return {
    gunningFog: calculateGunningFog(wordCount, sentenceCount, complexWords),
    fleschReadingEase: calculateFleschReadingEase(wordCount, sentenceCount, syllableCount),
    fleschKincaidGrade: calculateFleschKincaidGrade(wordCount, sentenceCount, syllableCount),
    smogIndex: calculateSmogIndex(sentenceCount, complexWords),
    colemanLiauIndex: calculateColemanLiauIndex(wordCount, sentenceCount, characterCount),
    automatedReadabilityIndex: calculateAutomatedReadabilityIndex(wordCount, sentenceCount, characterCount),
    daleChallReadabilityScore: calculateDaleChallReadabilityScore(wordCount, sentenceCount, difficultWords),
    difficultWords,
    linsearWriteFormula: calculateLinsearWriteFormula(wordCount, sentenceCount, complexWords),
    wordCount,
    sentenceCount,
    syllableCount,
    characterCount,
  }
}

/**
 * Interpreta o nível de legibilidade baseado no Flesch Reading Ease
 */
export function interpretFleschReadingEase(score: number): { level: string; description: string; color: string } {
  if (score >= 90) {
    return {
      level: "Muito Fácil",
      description: "Facilmente compreendido por estudantes de 11 anos",
      color: "text-green-600",
    }
  } else if (score >= 80) {
    return { level: "Fácil", description: "Facilmente compreendido por estudantes de 13 anos", color: "text-green-500" }
  } else if (score >= 70) {
    return {
      level: "Razoavelmente Fácil",
      description: "Facilmente compreendido por estudantes de 15 anos",
      color: "text-blue-500",
    }
  } else if (score >= 60) {
    return {
      level: "Padrão",
      description: "Facilmente compreendido por estudantes de 17 anos",
      color: "text-yellow-600",
    }
  } else if (score >= 50) {
    return {
      level: "Razoavelmente Difícil",
      description: "Compreendido por estudantes universitários",
      color: "text-orange-500",
    }
  } else if (score >= 30) {
    return { level: "Difícil", description: "Compreendido por graduados universitários", color: "text-red-500" }
  } else {
    return { level: "Muito Difícil", description: "Compreendido por pós-graduados", color: "text-red-600" }
  }
}

/**
 * Interpreta o nível educacional baseado no Flesch-Kincaid Grade
 */
export function interpretFleschKincaidGrade(grade: number): { level: string; color: string } {
  if (grade <= 6) {
    return { level: "Ensino Fundamental I", color: "text-green-600" }
  } else if (grade <= 9) {
    return { level: "Ensino Fundamental II", color: "text-green-500" }
  } else if (grade <= 12) {
    return { level: "Ensino Médio", color: "text-blue-500" }
  } else if (grade <= 16) {
    return { level: "Ensino Superior", color: "text-yellow-600" }
  } else {
    return { level: "Pós-graduação", color: "text-red-500" }
  }
}
