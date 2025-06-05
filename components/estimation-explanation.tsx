"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { explainEstimation } from "@/lib/estimation-explainer"
import { ChevronDown, ChevronUp, Info, Calculator, Target, Layers, Link, FileText, Zap } from "lucide-react"

interface EstimationExplanationProps {
  description: string
  taskType: string
  estimatedPoints: number
}

export function EstimationExplanation({ description, taskType, estimatedPoints }: EstimationExplanationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const breakdown = explainEstimation(description, taskType)

  const getScoreColor = (score: number) => {
    if (score > 0) return "text-green-600"
    if (score < 0) return "text-red-600"
    return "text-slate-600"
  }

  const getScoreIcon = (score: number) => {
    if (score > 0) return "+"
    return ""
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-blue-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-900">Como chegamos em {estimatedPoints} pontos?</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {isOpen ? "Ocultar" : "Mostrar"} detalhes
              </Button>
            </div>
            <CardDescription className="text-blue-700">
              Clique para ver o breakdown completo da estimativa baseada em regras
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Visão Geral do Algoritmo */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Como Funciona o Algoritmo
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                A estimativa baseada em regras analisa o texto da descrição da tarefa em busca de palavras-chave e
                padrões que indicam complexidade, escopo e dependências. Cada fator contribui com uma pontuação que é
                somada para chegar na estimativa final, que é então mapeada para a sequência de Fibonacci usada em story
                points.
              </p>
            </div>

            {/* Breakdown Detalhado */}
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Breakdown da Estimativa
              </h3>

              {/* Pontuação Base */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Pontuação Base (Tipo de Tarefa)</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {breakdown.basePoints} pontos
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{breakdown.basePointsReason}</p>
              </div>

              {/* Análise de Complexidade */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Análise de Complexidade</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-lg px-3 py-1 ${getScoreColor(breakdown.complexityScore)}`}
                  >
                    {getScoreIcon(breakdown.complexityScore)}
                    {breakdown.complexityScore} pontos
                  </Badge>
                </div>

                <div className="space-y-2">
                  {breakdown.complexityDetails.high.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        Alta (+2 cada)
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {breakdown.complexityDetails.high.map((keyword, index) => (
                          <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            "{keyword}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {breakdown.complexityDetails.medium.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Média (+1 cada)
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {breakdown.complexityDetails.medium.map((keyword, index) => (
                          <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            "{keyword}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {breakdown.complexityDetails.low.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Baixa (-1 cada)
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {breakdown.complexityDetails.low.map((keyword, index) => (
                          <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            "{keyword}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {breakdown.complexityDetails.high.length === 0 &&
                    breakdown.complexityDetails.medium.length === 0 &&
                    breakdown.complexityDetails.low.length === 0 && (
                      <p className="text-sm text-slate-500">Nenhuma palavra-chave de complexidade encontrada</p>
                    )}
                </div>
              </div>

              {/* Análise de Escopo */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Análise de Escopo</span>
                  </div>
                  <Badge variant="secondary" className={`text-lg px-3 py-1 ${getScoreColor(breakdown.scopeScore)}`}>
                    {getScoreIcon(breakdown.scopeScore)}
                    {breakdown.scopeScore} pontos
                  </Badge>
                </div>

                <div className="space-y-2">
                  {breakdown.scopeDetails.large.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        Grande (+2 cada)
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {breakdown.scopeDetails.large.map((keyword, index) => (
                          <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            "{keyword}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {breakdown.scopeDetails.medium.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Médio (+1 cada)
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {breakdown.scopeDetails.medium.map((keyword, index) => (
                          <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            "{keyword}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {breakdown.scopeDetails.small.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Pequeno (-1 cada)
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {breakdown.scopeDetails.small.map((keyword, index) => (
                          <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            "{keyword}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {breakdown.scopeDetails.large.length === 0 &&
                    breakdown.scopeDetails.medium.length === 0 &&
                    breakdown.scopeDetails.small.length === 0 && (
                      <p className="text-sm text-slate-500">Nenhuma palavra-chave de escopo encontrada</p>
                    )}
                </div>
              </div>

              {/* Análise de Dependências */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Análise de Dependências</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-lg px-3 py-1 ${getScoreColor(breakdown.dependencyScore)}`}
                  >
                    {getScoreIcon(breakdown.dependencyScore)}
                    {breakdown.dependencyScore} pontos
                  </Badge>
                </div>

                {breakdown.dependencyDetails.keywords.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Dependência (+1 cada)
                    </Badge>
                    <div className="flex flex-wrap gap-1">
                      {breakdown.dependencyDetails.keywords.map((keyword, index) => (
                        <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          "{keyword}"
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Nenhuma palavra-chave de dependência encontrada</p>
                )}
              </div>

              {/* Análise de Comprimento */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Análise de Comprimento</span>
                  </div>
                  <Badge variant="secondary" className={`text-lg px-3 py-1 ${getScoreColor(breakdown.lengthScore)}`}>
                    {getScoreIcon(breakdown.lengthScore)}
                    {breakdown.lengthScore} pontos
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Caracteres na descrição:</span>
                    <span className="font-medium">{breakdown.lengthDetails.characterCount}</span>
                  </div>
                  <Progress
                    value={Math.min(100, (breakdown.lengthDetails.characterCount / 600) * 100)}
                    className="h-2"
                  />
                  <p className="text-xs text-slate-500">
                    Descrições mais longas geralmente indicam maior complexidade (máximo: +3 pontos)
                  </p>
                </div>
              </div>

              {/* Cálculo Final */}
              <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
                <h4 className="font-semibold text-slate-900 mb-3">Cálculo Final</h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pontuação Base:</span>
                    <span className="font-medium">{breakdown.basePoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complexidade:</span>
                    <span className={`font-medium ${getScoreColor(breakdown.complexityScore)}`}>
                      {getScoreIcon(breakdown.complexityScore)}
                      {breakdown.complexityScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Escopo:</span>
                    <span className={`font-medium ${getScoreColor(breakdown.scopeScore)}`}>
                      {getScoreIcon(breakdown.scopeScore)}
                      {breakdown.scopeScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dependências:</span>
                    <span className={`font-medium ${getScoreColor(breakdown.dependencyScore)}`}>
                      {getScoreIcon(breakdown.dependencyScore)}
                      {breakdown.dependencyScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comprimento:</span>
                    <span className={`font-medium ${getScoreColor(breakdown.lengthScore)}`}>
                      {getScoreIcon(breakdown.lengthScore)}
                      {breakdown.lengthScore}
                    </span>
                  </div>

                  <hr className="border-slate-300" />

                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{breakdown.totalScore}</span>
                  </div>

                  <div className="flex justify-between text-blue-600 font-semibold">
                    <span>Mapeado para Fibonacci:</span>
                    <span>{breakdown.finalPoints} pontos</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3">{breakdown.fibonacciMapping.reason}</p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
