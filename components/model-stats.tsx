import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ModelStats } from "@/lib/types"

interface ModelStatsProps {
  stats: ModelStats
}

export function ModelStats({ stats }: ModelStatsProps) {
  const { trainedOn, lastTrainedAt, accuracy } = stats

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Estatísticas do Modelo de ML</CardTitle>
        <CardDescription>Informações sobre o modelo de aprendizado de máquina</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Treinado com</p>
            <p className="text-2xl font-bold">{trainedOn} tarefas</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Último treinamento</p>
            <p className="text-lg font-medium">
              {lastTrainedAt ? new Date(lastTrainedAt).toLocaleDateString() : "Nunca"}
            </p>
          </div>
        </div>

        {accuracy !== null && (
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium text-slate-500">Precisão do modelo</p>
              <p className="text-sm font-medium">{Math.round(accuracy * 100)}%</p>
            </div>
            <Progress value={accuracy * 100} className="h-2" />
          </div>
        )}

        <p className="text-xs text-slate-500 mt-2">
          O modelo melhora à medida que mais tarefas são estimadas e salvas.
          {trainedOn < 10 && " Recomendamos pelo menos 10 tarefas para obter estimativas confiáveis."}
        </p>
      </CardContent>
    </Card>
  )
}
