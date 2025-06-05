"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  COMPLEXITY_KEYWORDS as DEFAULT_COMPLEXITY_KEYWORDS,
  SCOPE_KEYWORDS as DEFAULT_SCOPE_KEYWORDS,
  DEPENDENCY_KEYWORDS as DEFAULT_DEPENDENCY_KEYWORDS,
} from "@/lib/estimator"
import {
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  RotateCcw,
  Save,
  Info,
  Zap,
  Layers,
  Link,
  AlertTriangle,
} from "lucide-react"

interface KeywordsConfig {
  complexity: {
    high: string[]
    medium: string[]
    low: string[]
  }
  scope: {
    large: string[]
    medium: string[]
    small: string[]
  }
  dependency: string[]
}

export function KeywordsConfiguration() {
  const [config, setConfig] = useState<KeywordsConfig>({
    complexity: DEFAULT_COMPLEXITY_KEYWORDS,
    scope: DEFAULT_SCOPE_KEYWORDS,
    dependency: DEFAULT_DEPENDENCY_KEYWORDS,
  })

  const [isModified, setIsModified] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    complexity: true,
    scope: false,
    dependency: false,
  })

  // Carregar configurações salvas
  useEffect(() => {
    const savedConfig = localStorage.getItem("keywords-config")
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig(parsed)
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      }
    }
  }, [])

  const handleSaveConfig = () => {
    localStorage.setItem("keywords-config", JSON.stringify(config))
    setIsModified(false)

    // Atualizar as palavras-chave globalmente (seria necessário implementar um contexto)
    // Por enquanto, apenas salvamos no localStorage
  }

  const handleResetConfig = () => {
    setConfig({
      complexity: DEFAULT_COMPLEXITY_KEYWORDS,
      scope: DEFAULT_SCOPE_KEYWORDS,
      dependency: DEFAULT_DEPENDENCY_KEYWORDS,
    })
    setIsModified(true)
  }

  const addKeyword = (category: string, subcategory?: string) => {
    if (!newKeyword.trim()) return

    const keyword = newKeyword.trim().toLowerCase()
    const newConfig = { ...config }

    if (category === "dependency") {
      if (!newConfig.dependency.includes(keyword)) {
        newConfig.dependency.push(keyword)
        setIsModified(true)
      }
    } else if (subcategory) {
      const categoryConfig = newConfig[category as keyof typeof newConfig] as any
      if (!categoryConfig[subcategory].includes(keyword)) {
        categoryConfig[subcategory].push(keyword)
        setIsModified(true)
      }
    }

    setConfig(newConfig)
    setNewKeyword("")
  }

  const removeKeyword = (category: string, keyword: string, subcategory?: string) => {
    const newConfig = { ...config }

    if (category === "dependency") {
      newConfig.dependency = newConfig.dependency.filter((k) => k !== keyword)
    } else if (subcategory) {
      const categoryConfig = newConfig[category as keyof typeof newConfig] as any
      categoryConfig[subcategory] = categoryConfig[subcategory].filter((k: string) => k !== keyword)
    }

    setConfig(newConfig)
    setIsModified(true)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getScoreText = (category: string, subcategory?: string) => {
    if (category === "complexity") {
      switch (subcategory) {
        case "high":
          return "+2 pontos cada"
        case "medium":
          return "+1 ponto cada"
        case "low":
          return "-1 ponto cada"
      }
    } else if (category === "scope") {
      switch (subcategory) {
        case "large":
          return "+2 pontos cada"
        case "medium":
          return "+1 ponto cada"
        case "small":
          return "-1 ponto cada"
      }
    } else if (category === "dependency") {
      return "+1 ponto cada"
    }
    return ""
  }

  const getSubcategoryColor = (category: string, subcategory?: string) => {
    if (category === "complexity") {
      switch (subcategory) {
        case "high":
          return "bg-red-100 text-red-800"
        case "medium":
          return "bg-yellow-100 text-yellow-800"
        case "low":
          return "bg-green-100 text-green-800"
      }
    } else if (category === "scope") {
      switch (subcategory) {
        case "large":
          return "bg-red-100 text-red-800"
        case "medium":
          return "bg-yellow-100 text-yellow-800"
        case "small":
          return "bg-green-100 text-green-800"
      }
    } else if (category === "dependency") {
      return "bg-orange-100 text-orange-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração de Palavras-Chave
          </CardTitle>
          <CardDescription>
            Visualize e personalize as palavras-chave usadas no algoritmo de estimativa baseada em regras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Como funciona</AlertTitle>
            <AlertDescription>
              O algoritmo analisa a descrição da tarefa em busca dessas palavras-chave para calcular a estimativa. Você
              pode adicionar ou remover palavras para personalizar o comportamento do sistema.
            </AlertDescription>
          </Alert>

          {isModified && (
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Alterações não salvas</AlertTitle>
              <AlertDescription className="text-amber-700">
                Você fez alterações nas configurações. Clique em "Salvar Configurações" para aplicá-las.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 mt-4">
            <Button onClick={handleSaveConfig} disabled={!isModified}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
            <Button variant="outline" onClick={handleResetConfig}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrão
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Palavras-chave de Complexidade */}
      <Card>
        <Collapsible open={expandedSections.complexity} onOpenChange={() => toggleSection("complexity")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-600" />
                  <CardTitle>Palavras-chave de Complexidade</CardTitle>
                </div>
                {expandedSections.complexity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Palavras que indicam o nível de complexidade técnica da tarefa</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Alta Complexidade */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">Alta Complexidade</Badge>
                    <span className="text-sm text-slate-600">{getScoreText("complexity", "high")}</span>
                  </div>
                  <span className="text-sm text-slate-500">{config.complexity.high.length} palavras</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {config.complexity.high.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-md px-2 py-1"
                    >
                      <span className="text-sm text-red-800">{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-red-600 hover:text-red-800"
                        onClick={() => removeKeyword("complexity", keyword, "high")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar palavra-chave..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword("complexity", "high")}
                    className="flex-1"
                  />
                  <Button onClick={() => addKeyword("complexity", "high")} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Média Complexidade */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Média Complexidade</Badge>
                    <span className="text-sm text-slate-600">{getScoreText("complexity", "medium")}</span>
                  </div>
                  <span className="text-sm text-slate-500">{config.complexity.medium.length} palavras</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {config.complexity.medium.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-md px-2 py-1"
                    >
                      <span className="text-sm text-yellow-800">{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-yellow-600 hover:text-yellow-800"
                        onClick={() => removeKeyword("complexity", keyword, "medium")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar palavra-chave..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword("complexity", "medium")}
                    className="flex-1"
                  />
                  <Button onClick={() => addKeyword("complexity", "medium")} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Baixa Complexidade */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Baixa Complexidade</Badge>
                    <span className="text-sm text-slate-600">{getScoreText("complexity", "low")}</span>
                  </div>
                  <span className="text-sm text-slate-500">{config.complexity.low.length} palavras</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {config.complexity.low.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-md px-2 py-1"
                    >
                      <span className="text-sm text-green-800">{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-green-600 hover:text-green-800"
                        onClick={() => removeKeyword("complexity", keyword, "low")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar palavra-chave..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword("complexity", "low")}
                    className="flex-1"
                  />
                  <Button onClick={() => addKeyword("complexity", "low")} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Palavras-chave de Escopo */}
      <Card>
        <Collapsible open={expandedSections.scope} onOpenChange={() => toggleSection("scope")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <CardTitle>Palavras-chave de Escopo</CardTitle>
                </div>
                {expandedSections.scope ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Palavras que indicam o tamanho e abrangência da tarefa</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Grande Escopo */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">Grande Escopo</Badge>
                    <span className="text-sm text-slate-600">{getScoreText("scope", "large")}</span>
                  </div>
                  <span className="text-sm text-slate-500">{config.scope.large.length} palavras</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {config.scope.large.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-md px-2 py-1"
                    >
                      <span className="text-sm text-red-800">{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-red-600 hover:text-red-800"
                        onClick={() => removeKeyword("scope", keyword, "large")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar palavra-chave..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword("scope", "large")}
                    className="flex-1"
                  />
                  <Button onClick={() => addKeyword("scope", "large")} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Médio Escopo */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Médio Escopo</Badge>
                    <span className="text-sm text-slate-600">{getScoreText("scope", "medium")}</span>
                  </div>
                  <span className="text-sm text-slate-500">{config.scope.medium.length} palavras</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {config.scope.medium.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-md px-2 py-1"
                    >
                      <span className="text-sm text-yellow-800">{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-yellow-600 hover:text-yellow-800"
                        onClick={() => removeKeyword("scope", keyword, "medium")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar palavra-chave..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword("scope", "medium")}
                    className="flex-1"
                  />
                  <Button onClick={() => addKeyword("scope", "medium")} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Pequeno Escopo */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Pequeno Escopo</Badge>
                    <span className="text-sm text-slate-600">{getScoreText("scope", "small")}</span>
                  </div>
                  <span className="text-sm text-slate-500">{config.scope.small.length} palavras</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {config.scope.small.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-md px-2 py-1"
                    >
                      <span className="text-sm text-green-800">{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-green-600 hover:text-green-800"
                        onClick={() => removeKeyword("scope", keyword, "small")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar palavra-chave..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword("scope", "small")}
                    className="flex-1"
                  />
                  <Button onClick={() => addKeyword("scope", "small")} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Palavras-chave de Dependência */}
      <Card>
        <Collapsible open={expandedSections.dependency} onOpenChange={() => toggleSection("dependency")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-orange-600" />
                  <CardTitle>Palavras-chave de Dependência</CardTitle>
                </div>
                {expandedSections.dependency ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Palavras que indicam dependências externas ou integrações necessárias</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800">Dependências</Badge>
                    <span className="text-sm text-slate-600">{getScoreText("dependency")}</span>
                  </div>
                  <span className="text-sm text-slate-500">{config.dependency.length} palavras</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {config.dependency.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-md px-2 py-1"
                    >
                      <span className="text-sm text-orange-800">{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-orange-600 hover:text-orange-800"
                        onClick={() => removeKeyword("dependency", keyword)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar palavra-chave..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword("dependency")}
                    className="flex-1"
                  />
                  <Button onClick={() => addKeyword("dependency")} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Resumo das Configurações */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg">Resumo das Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Complexidade</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-red-600">Alta:</span>
                  <span>{config.complexity.high.length} palavras</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Média:</span>
                  <span>{config.complexity.medium.length} palavras</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Baixa:</span>
                  <span>{config.complexity.low.length} palavras</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-900 mb-2">Escopo</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-red-600">Grande:</span>
                  <span>{config.scope.large.length} palavras</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Médio:</span>
                  <span>{config.scope.medium.length} palavras</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Pequeno:</span>
                  <span>{config.scope.small.length} palavras</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-900 mb-2">Dependências</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-orange-600">Total:</span>
                  <span>{config.dependency.length} palavras</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
