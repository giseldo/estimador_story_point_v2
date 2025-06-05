import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info, Zap, Brain } from "lucide-react"

interface AIFallbackNoticeProps {
  ruleBasedPoints: number
  mlPoints?: number | null
}

export function AIFallbackNotice({ ruleBasedPoints, mlPoints }: AIFallbackNoticeProps) {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900">IA Temporariamente Indisponível</AlertTitle>
      <AlertDescription className="text-blue-800">
        <div className="space-y-3 mt-2">
          <p className="text-sm">
            O serviço de IA está temporariamente indisponível, mas você ainda tem acesso a estimativas precisas:
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Estimativa Baseada em Regras:</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {ruleBasedPoints} {ruleBasedPoints === 1 ? "ponto" : "pontos"}
              </Badge>
            </div>

            {mlPoints && (
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Machine Learning:</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  {mlPoints} {mlPoints === 1 ? "ponto" : "pontos"}
                </Badge>
              </div>
            )}
          </div>

          <div className="text-xs text-blue-700 bg-blue-100 rounded p-2 mt-2">
            <strong>💡 Dica:</strong> A estimativa baseada em regras analisa palavras-chave e padrões no texto,
            oferecendo boa precisão mesmo sem IA.{" "}
            {mlPoints && "O modelo de ML treinado com seus dados históricos também está disponível."}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
