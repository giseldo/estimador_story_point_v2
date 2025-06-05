"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
  Bot,
  Settings,
  Upload,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  Info,
  Lightbulb,
  BookOpen,
  BarChart3,
  Cpu,
  Network,
  Database,
  Layers,
  ArrowRight,
  Play,
  Download,
  RotateCcw,
  Sparkles,
} from "lucide-react"

export function HelpGuide() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    methods: false,
    deeplearning: false,
    stepbystep: false,
    faq: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Visão Geral */}
      <Card>
        <Collapsible open={expandedSections.overview} onOpenChange={() => toggleSection("overview")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  <CardTitle>Visão Geral do Sistema</CardTitle>
                </div>
                {expandedSections.overview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Entenda como funciona o estimador de story points</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">O que é Story Point?</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Story Points são uma unidade de medida usada em metodologias ágeis para estimar o esforço relativo
                  necessário para completar uma tarefa. Utilizamos a sequência de Fibonacci (1, 2, 3, 5, 8, 13, 21) para
                  representar a complexidade crescente das tarefas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    Objetivo
                  </h4>
                  <p className="text-sm text-slate-600">
                    Automatizar e padronizar o processo de estimativa de story points, reduzindo subjetividade e
                    melhorando a precisão das estimativas.
                  </p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Benefícios
                  </h4>
                  <p className="text-sm text-slate-600">
                    Estimativas mais consistentes, redução do tempo gasto em planning poker, e aprendizado contínuo
                    baseado em dados históricos.
                  </p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Métodos de Estimativa */}
      <Card>
        <Collapsible open={expandedSections.methods} onOpenChange={() => toggleSection("methods")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <CardTitle>6 Métodos de Estimativa Disponíveis</CardTitle>
                </div>
                {expandedSections.methods ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Conheça todas as formas de estimar story points na aplicação</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Método 1: Baseada em Regras */}
              <div className="border rounded-lg p-4 bg-slate-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-slate-600 text-white rounded-full text-sm font-bold">
                    1
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Estimativa Baseada em Regras</h3>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      Sempre Disponível
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 ml-11">
                  <p className="text-sm text-slate-700">
                    <strong>Como funciona:</strong> Analisa palavras-chave na descrição da tarefa para calcular a
                    complexidade, escopo e dependências.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded p-3 border">
                      <h4 className="text-xs font-medium text-red-600 mb-1">COMPLEXIDADE</h4>
                      <p className="text-xs text-slate-600">
                        Palavras como "complexo", "algoritmo", "integração" aumentam a pontuação
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border">
                      <h4 className="text-xs font-medium text-blue-600 mb-1">ESCOPO</h4>
                      <p className="text-xs text-slate-600">
                        Termos como "sistema", "plataforma" indicam maior abrangência
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border">
                      <h4 className="text-xs font-medium text-orange-600 mb-1">DEPENDÊNCIAS</h4>
                      <p className="text-xs text-slate-600">
                        Palavras como "integrar", "depende", "api" adicionam complexidade
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Instantâneo • Consistente • Explicável</span>
                  </div>
                </div>
              </div>

              {/* Método 2: Machine Learning */}
              <div className="border rounded-lg p-4 bg-emerald-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full text-sm font-bold">
                    2
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-900">Machine Learning (Deep Learning)</h3>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Aprende com Dados
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 ml-11">
                  <p className="text-sm text-emerald-800">
                    <strong>Como funciona:</strong> Rede neural treinada com suas tarefas históricas que aprende padrões
                    complexos e melhora com o tempo.
                  </p>

                  <div className="bg-white rounded p-3 border border-emerald-200">
                    <h4 className="text-xs font-medium text-emerald-700 mb-2">PROCESSO DE APRENDIZADO</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Extrai 14 características da descrição da tarefa</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Treina rede neural com 2 camadas ocultas</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Melhora precisão a cada nova tarefa salva</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-700">
                    <Info className="h-3 w-3" />
                    <span>Requer mínimo de 5 tarefas • Treina automaticamente • Salvo localmente</span>
                  </div>
                </div>
              </div>

              {/* Método 3: IA Groq */}
              <div className="border rounded-lg p-4 bg-purple-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold">
                    3
                  </div>
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">IA com Groq (Llama 3.1)</h3>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      IA Generativa
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 ml-11">
                  <p className="text-sm text-purple-800">
                    <strong>Como funciona:</strong> Utiliza o modelo Llama 3.1 8B via Groq para análise contextual
                    avançada da tarefa.
                  </p>

                  <div className="bg-white rounded p-3 border border-purple-200">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-purple-700">Modelo:</span> Llama 3.1 8B Instant
                      </div>
                      <div>
                        <span className="font-medium text-purple-700">Velocidade:</span> Ultra-rápida
                      </div>
                      <div>
                        <span className="font-medium text-purple-700">Análise:</span> Contextual profunda
                      </div>
                      <div>
                        <span className="font-medium text-purple-700">Precisão:</span> Alta para textos complexos
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-purple-700">
                    <Cpu className="h-3 w-3" />
                    <span>Processamento em nuvem • Análise semântica • Resposta em segundos</span>
                  </div>
                </div>
              </div>

              {/* Método 4: IA Grok */}
              <div className="border rounded-lg p-4 bg-indigo-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold">
                    4
                  </div>
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-indigo-900">IA com Grok (xAI)</h3>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                      IA Alternativa
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 ml-11">
                  <p className="text-sm text-indigo-800">
                    <strong>Como funciona:</strong> Modelo Grok da xAI que oferece uma perspectiva diferente na análise
                    de tarefas.
                  </p>

                  <div className="bg-white rounded p-3 border border-indigo-200">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-indigo-700">Modelo:</span> Grok Beta
                      </div>
                      <div>
                        <span className="font-medium text-indigo-700">Abordagem:</span> Alternativa ao Groq
                      </div>
                      <div>
                        <span className="font-medium text-indigo-700">Uso:</span> Backup e comparação
                      </div>
                      <div>
                        <span className="font-medium text-indigo-700">Vantagem:</span> Diversidade de análise
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-indigo-700">
                    <Database className="h-3 w-3" />
                    <span>Modelo xAI • Análise complementar • Fallback inteligente</span>
                  </div>
                </div>
              </div>

              {/* Método 5: BERT Fine-tuned - NOVO */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full text-sm font-bold">
                    5
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">BERT Fine-tuned Especializado</h3>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      NOVO • Especializado
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 ml-11">
                  <p className="text-sm text-orange-800">
                    <strong>Como funciona:</strong> Modelo DistilBERT fine-tuned especificamente para estimativa de
                    story points, treinado com dados reais de projetos de software.
                  </p>

                  <div className="bg-white rounded p-3 border border-orange-200">
                    <h4 className="text-xs font-medium text-orange-700 mb-2">CARACTERÍSTICAS ESPECIAIS</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Fine-tuned com dados reais de story points</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Combina título + descrição para análise contextual</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Retorna confiança da predição</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded p-3 border border-orange-200">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-orange-700">Modelo Base:</span> DistilBERT
                      </div>
                      <div>
                        <span className="font-medium text-orange-700">Treinamento:</span> Fine-tuning específico
                      </div>
                      <div>
                        <span className="font-medium text-orange-700">Dados:</span> Projetos reais
                      </div>
                      <div>
                        <span className="font-medium text-orange-700">Precisão:</span> Especializada em story points
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-orange-700">
                    <Sparkles className="h-3 w-3" />
                    <span>Hugging Face • Fine-tuned • Confiança da predição • Especializado</span>
                  </div>
                </div>
              </div>

              {/* Método 6: Ajuste Manual */}
              <div className="border rounded-lg p-4 bg-amber-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-full text-sm font-bold">
                    6
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-900">Ajuste Manual</h3>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      Controle Total
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 ml-11">
                  <p className="text-sm text-amber-800">
                    <strong>Como funciona:</strong> Permite que você ajuste manualmente qualquer estimativa gerada pelos
                    métodos automáticos.
                  </p>

                  <div className="bg-white rounded p-3 border border-amber-200">
                    <h4 className="text-xs font-medium text-amber-700 mb-2">QUANDO USAR</h4>
                    <div className="space-y-1 text-xs text-amber-800">
                      <div>• Quando você tem conhecimento específico sobre a tarefa</div>
                      <div>• Para ajustar estimativas baseadas em contexto da equipe</div>
                      <div>• Quando as estimativas automáticas parecem incorretas</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-700">
                    <Users className="h-3 w-3" />
                    <span>Experiência humana • Contexto específico • Decisão final</span>
                  </div>
                </div>
              </div>

              {/* Estratégia Recomendada */}
              <Alert className="bg-blue-50 border-blue-200">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Estratégia Recomendada</AlertTitle>
                <AlertDescription className="text-blue-800">
                  <div className="space-y-2 mt-2">
                    <p className="text-sm">
                      <strong>1. Comece</strong> com a estimativa baseada em regras (sempre disponível)
                    </p>
                    <p className="text-sm">
                      <strong>2. Use BERT</strong> para análise especializada em story points
                    </p>
                    <p className="text-sm">
                      <strong>3. Compare com IA</strong> (Groq ou Grok) para análise generativa
                    </p>
                    <p className="text-sm">
                      <strong>4. Consulte ML</strong> quando tiver dados históricos suficientes
                    </p>
                    <p className="text-sm">
                      <strong>5. Ajuste manualmente</strong> baseado no seu conhecimento específico
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Deep Learning Detalhado */}
      <Card>
        <Collapsible open={expandedSections.deeplearning} onOpenChange={() => toggleSection("deeplearning")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  <CardTitle>Como Funcionam os Modelos de ML</CardTitle>
                </div>
                {expandedSections.deeplearning ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              <CardDescription>Entenda em detalhes o funcionamento dos modelos de machine learning</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Arquitetura da Rede Neural Local */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Rede Neural Local (TensorFlow.js)
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded p-3 border border-emerald-200">
                      <h4 className="font-medium text-emerald-800 mb-2">Camada de Entrada</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <div>• 14 neurônios</div>
                        <div>• Features extraídas</div>
                        <div>• Dados normalizados</div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 border border-emerald-200">
                      <h4 className="font-medium text-emerald-800 mb-2">Camadas Ocultas</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <div>• 2 camadas de 16 neurônios</div>
                        <div>• Ativação ReLU</div>
                        <div>• Aprendizado profundo</div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 border border-emerald-200">
                      <h4 className="font-medium text-emerald-800 mb-2">Camada de Saída</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <div>• 7 neurônios (Fibonacci)</div>
                        <div>• Ativação Softmax</div>
                        <div>• Probabilidades</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BERT Fine-tuned */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  BERT Fine-tuned Especializado
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded p-3 border border-orange-200">
                      <h4 className="font-medium text-orange-800 mb-2">Arquitetura Base</h4>
                      <div className="text-sm text-orange-700 space-y-1">
                        <div>• DistilBERT (versão otimizada)</div>
                        <div>• 6 camadas Transformer</div>
                        <div>• 66M parâmetros</div>
                        <div>• Atenção multi-cabeça</div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 border border-orange-200">
                      <h4 className="font-medium text-orange-800 mb-2">Fine-tuning</h4>
                      <div className="text-sm text-orange-700 space-y-1">
                        <div>• Treinado com dados reais</div>
                        <div>• Classificação de story points</div>
                        <div>• Otimizado para contexto de software</div>
                        <div>• Validação cruzada</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded p-3 border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-2">Processo de Inferência</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded-full text-xs font-bold">
                          1
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-orange-800">Preparação do Contexto</h5>
                          <p className="text-sm text-orange-700">
                            Combina título e descrição em um texto único para análise contextual completa
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded-full text-xs font-bold">
                          2
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-orange-800">Tokenização e Encoding</h5>
                          <p className="text-sm text-orange-700">
                            Converte o texto em tokens e aplica encoding posicional para capturar relações semânticas
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded-full text-xs font-bold">
                          3
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-orange-800">Análise Transformer</h5>
                          <p className="text-sm text-orange-700">
                            Camadas de atenção analisam relações entre palavras e extraem features contextuais
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded-full text-xs font-bold">
                          4
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-orange-800">Classificação Final</h5>
                          <p className="text-sm text-orange-700">
                            Camada de classificação especializada retorna story point com score de confiança
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extração de Features */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Extração de Características (Features)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-800">Features Categóricas</h4>
                    <div className="bg-slate-50 rounded p-3 border">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tipo: Feature</span>
                          <Badge variant="outline" className="text-xs">
                            One-hot
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Tipo: Bug</span>
                          <Badge variant="outline" className="text-xs">
                            One-hot
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Tipo: Refactor</span>
                          <Badge variant="outline" className="text-xs">
                            One-hot
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Tipo: Documentation</span>
                          <Badge variant="outline" className="text-xs">
                            One-hot
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-800">Features Numéricas</h4>
                    <div className="bg-slate-50 rounded p-3 border">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Comprimento do texto</span>
                          <Badge variant="outline" className="text-xs">
                            Normalizado
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Palavras de alta complexidade</span>
                          <Badge variant="outline" className="text-xs">
                            Contagem
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Palavras de média complexidade</span>
                          <Badge variant="outline" className="text-xs">
                            Contagem
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Palavras de baixa complexidade</span>
                          <Badge variant="outline" className="text-xs">
                            Contagem
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded p-3 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Features Adicionais</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
                    <div>• Escopo grande/médio/pequeno</div>
                    <div>• Palavras de dependência</div>
                    <div>• Número total de palavras</div>
                    <div>• Densidade de informação</div>
                  </div>
                </div>
              </div>

              {/* Processo de Treinamento */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Processo de Treinamento
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-xs font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">Preparação dos Dados</h4>
                      <p className="text-sm text-slate-600">
                        Extrai features de cada tarefa salva e converte story points para índices da sequência de
                        Fibonacci
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-xs font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">Configuração da Rede</h4>
                      <p className="text-sm text-slate-600">
                        Cria rede neural sequencial com camadas densas, otimizador Adam e função de perda categórica
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-xs font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">Treinamento</h4>
                      <p className="text-sm text-slate-600">
                        50 épocas com validação cruzada (20%), batch size adaptativo e monitoramento de precisão
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-xs font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">Salvamento</h4>
                      <p className="text-sm text-slate-600">
                        Modelo treinado é salvo localmente no navegador e estatísticas são atualizadas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Melhoria Contínua */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 border">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-emerald-600" />
                  Aprendizado Contínuo
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Como Melhora</h4>
                    <div className="space-y-1 text-sm text-slate-700">
                      <div>• Cada nova tarefa salva = mais dados</div>
                      <div>• Retreinamento automático</div>
                      <div>• Padrões mais precisos</div>
                      <div>• Adaptação ao seu contexto</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Métricas de Qualidade</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Precisão inicial:</span>
                        <span className="font-medium">~70%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Com 20+ tarefas:</span>
                        <span className="font-medium">~80%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Com 50+ tarefas:</span>
                        <span className="font-medium">~85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Guia Passo a Passo */}
      <Card>
        <Collapsible open={expandedSections.stepbystep} onOpenChange={() => toggleSection("stepbystep")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  <CardTitle>Guia Passo a Passo</CardTitle>
                </div>
                {expandedSections.stepbystep ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Como usar a aplicação do início ao fim</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Primeiros Passos */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Primeiros Passos
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800">Primeira Estimativa</h4>
                      <p className="text-sm text-orange-700 mb-2">
                        Vá para a aba "Estimar Task" e preencha sua primeira tarefa:
                      </p>
                      <div className="bg-white rounded p-3 border border-orange-200 text-sm">
                        <div className="space-y-1">
                          <div>
                            • <strong>Título:</strong> Nome claro da tarefa
                          </div>
                          <div>
                            • <strong>Descrição:</strong> Detalhes, requisitos, complexidade
                          </div>
                          <div>
                            • <strong>Tipo:</strong> Feature, Bug, Refactor ou Documentation
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800">Obter Estimativas</h4>
                      <p className="text-sm text-orange-700 mb-2">Clique em "Estimar" para ver:</p>
                      <div className="bg-white rounded p-3 border border-orange-200 text-sm">
                        <div className="space-y-1">
                          <div>• Estimativa baseada em regras (instantânea)</div>
                          <div>• Explicação detalhada do cálculo</div>
                          <div>• Análise de legibilidade do texto</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800">Usar BERT e IA (Opcional)</h4>
                      <p className="text-sm text-orange-700 mb-2">Para análise mais avançada:</p>
                      <div className="bg-white rounded p-3 border border-orange-200 text-sm">
                        <div className="space-y-1">
                          <div>• Clique em "Analisar com BERT" para análise especializada</div>
                          <div>• Use "Analisar com Groq" ou "Analisar com Grok" para IA generativa</div>
                          <div>• Compare as diferentes estimativas</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800">Ajustar e Salvar</h4>
                      <p className="text-sm text-orange-700 mb-2">Finalize a estimativa:</p>
                      <div className="bg-white rounded p-3 border border-orange-200 text-sm">
                        <div className="space-y-1">
                          <div>• Ajuste manualmente se necessário</div>
                          <div>• Clique em "Salvar" para adicionar ao histórico</div>
                          <div>• A tarefa será usada para treinar o modelo ML</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Importação de Dados */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-blue-600" />
                  Importação de Dados Históricos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded p-3 border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Preparar CSV</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>1. Baixe o modelo CSV de exemplo</div>
                      <div>2. Preencha com suas tarefas históricas</div>
                      <div>3. Inclua: título, descrição, tipo, story points</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded p-3 border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Importar</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>1. Vá para aba "Importar CSV"</div>
                      <div>2. Selecione seu arquivo</div>
                      <div>3. Revise os dados e confirme</div>
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Download className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900">Dica de Importação</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    Importe pelo menos 10-20 tarefas históricas para que o modelo de ML tenha dados suficientes para
                    aprender padrões precisos.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Configuração Avançada */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-600" />
                  Configuração Avançada
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded p-3 border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">Palavras-Chave</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div>• Personalize palavras de complexidade</div>
                      <div>• Ajuste termos de escopo</div>
                      <div>• Configure dependências</div>
                      <div>• Adapte ao seu domínio</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded p-3 border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">Modelo ML</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div>• Monitore estatísticas</div>
                      <div>• Retreine quando necessário</div>
                      <div>• Acompanhe precisão</div>
                      <div>• Analise tendências</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fluxo Recomendado */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Fluxo Recomendado para Equipes
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-3 w-3 text-green-600" />
                    <span>
                      <strong>Semana 1:</strong> Importe dados históricos e configure palavras-chave específicas do
                      projeto
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-3 w-3 text-green-600" />
                    <span>
                      <strong>Semana 2-3:</strong> Use estimativa baseada em regras + BERT + IA para novas tarefas
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-3 w-3 text-green-600" />
                    <span>
                      <strong>Semana 4+:</strong> Modelo ML estará treinado e oferecerá estimativas personalizadas
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-3 w-3 text-green-600" />
                    <span>
                      <strong>Contínuo:</strong> Compare estimativas com realidade e ajuste conforme necessário
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* FAQ */}
      <Card>
        <Collapsible open={expandedSections.faq} onOpenChange={() => toggleSection("faq")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-red-600" />
                  <CardTitle>Perguntas Frequentes</CardTitle>
                </div>
                {expandedSections.faq ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Respostas para dúvidas comuns</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">❓ Qual método de estimativa é mais preciso?</h4>
                  <p className="text-sm text-slate-700">
                    Depende do contexto. A estimativa baseada em regras é consistente e explicável. O BERT fine-tuned é
                    especializado em story points. A IA oferece análise mais sofisticada. O ML se torna mais preciso com
                    o tempo. Recomendamos usar múltiplos métodos e comparar.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">❓ O que é o modelo BERT fine-tuned?</h4>
                  <p className="text-sm text-slate-700">
                    É um modelo DistilBERT que foi especificamente treinado (fine-tuned) com dados reais de story points
                    de projetos de software. Ele combina título e descrição para fazer uma análise contextual
                    especializada, retornando tanto a estimativa quanto a confiança da predição.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">❓ Quantas tarefas preciso para treinar o ML?</h4>
                  <p className="text-sm text-slate-700">
                    Mínimo de 5 tarefas para começar, mas recomendamos 20+ para boa precisão. O modelo melhora
                    continuamente com cada nova tarefa salva.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">❓ Os dados ficam seguros?</h4>
                  <p className="text-sm text-slate-700">
                    Sim! Todos os dados são armazenados localmente no seu navegador. O modelo ML também é salvo
                    localmente. Para o BERT e IA (Groq/Grok), apenas o texto da tarefa é enviado para processamento, sem
                    armazenamento permanente.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">❓ E se a IA ou BERT não funcionarem?</h4>
                  <p className="text-sm text-slate-700">
                    A estimativa baseada em regras sempre funciona como fallback. O sistema foi projetado para ser
                    resiliente - você sempre terá uma estimativa disponível, mesmo se os serviços externos estiverem
                    indisponíveis.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">❓ Posso personalizar as palavras-chave?</h4>
                  <p className="text-sm text-slate-700">
                    Sim! Na aba "Configurações" você pode adicionar, remover e modificar todas as palavras-chave usadas
                    na estimativa baseada em regras para adaptar ao seu domínio específico.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">❓ Como interpretar a análise de legibilidade?</h4>
                  <p className="text-sm text-slate-700">
                    A análise de legibilidade ajuda a identificar se a descrição da tarefa está clara. Textos mais
                    legíveis geralmente resultam em estimativas mais precisas e melhor entendimento da equipe.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">❓ Qual a diferença entre BERT e IA generativa?</h4>
                  <p className="text-sm text-slate-700">
                    O BERT é especializado em classificação de story points, treinado especificamente para essa tarefa.
                    A IA generativa (Groq/Grok) oferece análise mais ampla e contextual, mas não foi treinada
                    especificamente para story points. Use ambos para comparação e maior precisão.
                  </p>
                </div>
              </div>

              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Dica Final</AlertTitle>
                <AlertDescription className="text-green-800">
                  <p className="mb-2">
                    A ferramenta é mais eficaz quando usada consistentemente. Comece simples, vá adicionando
                    complexidade gradualmente, e sempre compare as estimativas com a realidade para melhorar o sistema.
                  </p>
                  <p className="text-sm">
                    <strong>Lembre-se:</strong> Story points são relativos à sua equipe. Use esta ferramenta como apoio,
                    não como substituto do julgamento humano. O BERT fine-tuned oferece uma perspectiva especializada,
                    mas a decisão final sempre deve considerar o contexto específico do seu projeto.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
