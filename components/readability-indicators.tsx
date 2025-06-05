"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  calculateReadabilityMetrics,
  interpretFleschReadingEase,
  interpretFleschKincaidGrade,
} from "@/lib/readability-metrics"
import { BookOpen, ChevronDown, ChevronUp, Info, TrendingUp, Users, GraduationCap } from "lucide-react"

interface ReadabilityIndicatorsProps {
  description: string
}

export function ReadabilityIndicators({ description }: ReadabilityIndicatorsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const metrics = calculateReadabilityMetrics(description)

  if (!description || description.trim().length === 0) {
    return null
  }

  const fleschInterpretation = interpretFleschReadingEase(metrics.fleschReadingEase)
  const gradeInterpretation = interpretFleschKincaidGrade(metrics.fleschKincaidGrade)

  const getScoreColor = (score: number, reverse = false) => {
    if (reverse) {
      if (score <= 6) return "text-green-600"
      if (score <= 10) return "text-yellow-600"
      return "text-red-600"
    } else {
      if (score >= 70) return "text-green-600"
      if (score >= 50) return "text-yellow-600"
      return "text-red-600"
    }
  }

  const getProgressValue = (score: number, max = 100) => {
    return Math.min(100, (score / max) * 100)
  }

  return (
    <Card className="border-purple-200 bg-purple-50">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-purple-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg text-purple-900">Análise de Legibilidade</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-600">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {isExpanded ? "Ocultar" : "Mostrar"} detalhes
              </Button>
            </div>
            <CardDescription className="text-purple-700">
              Análise da clareza e complexidade da descrição da tarefa
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Estatísticas Básicas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Palavras</div>
                <div className="text-2xl font-bold text-purple-900">{metrics.wordCount}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Sentenças</div>
                <div className="text-2xl font-bold text-purple-900">{metrics.sentenceCount}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Sílabas</div>
                <div className="text-2xl font-bold text-purple-900">{metrics.syllableCount}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Palavras Difíceis</div>
                <div className="text-2xl font-bold text-purple-900">{metrics.difficultWords}</div>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Índices de Legibilidade
              </h3>

              {/* Flesch Reading Ease */}
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Flesch Reading Ease</span>
                  </div>
                  <Badge className={`${fleschInterpretation.color} bg-transparent border-current`}>
                    {metrics.fleschReadingEase.toFixed(1)}
                  </Badge>
                </div>
                <Progress value={getProgressValue(metrics.fleschReadingEase)} className="h-2 mb-2" />
                <div className="text-sm">
                  <span className={`font-medium ${fleschInterpretation.color}`}>{fleschInterpretation.level}</span>
                  <span className="text-slate-600 ml-2">{fleschInterpretation.description}</span>
                </div>
              </div>

              {/* Flesch-Kincaid Grade */}
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Flesch-Kincaid Grade Level</span>
                  </div>
                  <Badge className={`${gradeInterpretation.color} bg-transparent border-current`}>
                    {metrics.fleschKincaidGrade.toFixed(1)}
                  </Badge>
                </div>
                <Progress value={getProgressValue(metrics.fleschKincaidGrade, 20)} className="h-2 mb-2" />
                <div className="text-sm">
                  <span className={`font-medium ${gradeInterpretation.color}`}>{gradeInterpretation.level}</span>
                </div>
              </div>
            </div>

            {/* Métricas Detalhadas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Métricas Detalhadas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gunning Fog Index */}
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Gunning Fog Index</span>
                    <span className={`text-sm font-bold ${getScoreColor(metrics.gunningFog, true)}`}>
                      {metrics.gunningFog.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={getProgressValue(metrics.gunningFog, 20)} className="h-1" />
                  <div className="text-xs text-slate-500 mt-1">Anos de educação necessários</div>
                </div>

                {/* SMOG Index */}
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">SMOG Index</span>
                    <span className={`text-sm font-bold ${getScoreColor(metrics.smogIndex, true)}`}>
                      {metrics.smogIndex.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={getProgressValue(metrics.smogIndex, 20)} className="h-1" />
                  <div className="text-xs text-slate-500 mt-1">Nível de escolaridade</div>
                </div>

                {/* Coleman-Liau Index */}
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Coleman-Liau Index</span>
                    <span className={`text-sm font-bold ${getScoreColor(metrics.colemanLiauIndex, true)}`}>
                      {metrics.colemanLiauIndex.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={getProgressValue(metrics.colemanLiauIndex, 20)} className="h-1" />
                  <div className="text-xs text-slate-500 mt-1">Baseado em caracteres</div>
                </div>

                {/* Automated Readability Index */}
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Automated Readability</span>
                    <span className={`text-sm font-bold ${getScoreColor(metrics.automatedReadabilityIndex, true)}`}>
                      {metrics.automatedReadabilityIndex.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={getProgressValue(metrics.automatedReadabilityIndex, 20)} className="h-1" />
                  <div className="text-xs text-slate-500 mt-1">Índice automatizado</div>
                </div>

                {/* Dale-Chall Readability Score */}
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Dale-Chall Score</span>
                    <span className={`text-sm font-bold ${getScoreColor(metrics.daleChallReadabilityScore, true)}`}>
                      {metrics.daleChallReadabilityScore.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={getProgressValue(metrics.daleChallReadabilityScore, 15)} className="h-1" />
                  <div className="text-xs text-slate-500 mt-1">Baseado em palavras familiares</div>
                </div>

                {/* Linsear Write Formula */}
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Linsear Write</span>
                    <span className={`text-sm font-bold ${getScoreColor(metrics.linsearWriteFormula, true)}`}>
                      {metrics.linsearWriteFormula.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={getProgressValue(metrics.linsearWriteFormula, 20)} className="h-1" />
                  <div className="text-xs text-slate-500 mt-1">Fórmula simplificada</div>
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Recomendações</h4>
              <div className="space-y-2 text-sm">
                {metrics.fleschReadingEase < 50 && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      <strong>Texto muito complexo:</strong> Considere simplificar as sentenças e usar palavras mais
                      comuns para melhorar a clareza.
                    </span>
                  </div>
                )}
                {metrics.sentenceCount > 0 && metrics.wordCount / metrics.sentenceCount > 20 && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      <strong>Sentenças longas:</strong> Tente dividir sentenças longas em partes menores para facilitar
                      a compreensão.
                    </span>
                  </div>
                )}
                {metrics.difficultWords > metrics.wordCount * 0.3 && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      <strong>Muitas palavras técnicas:</strong> Considere explicar termos técnicos ou usar sinônimos
                      mais simples quando possível.
                    </span>
                  </div>
                )}
                {metrics.fleschReadingEase >= 70 && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      <strong>Boa legibilidade:</strong> O texto está claro e fácil de entender. Continue mantendo esse
                      padrão.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
