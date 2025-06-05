"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/types"

interface TaskHistoryProps {
  tasks: Task[]
}

export function TaskHistory({ tasks }: TaskHistoryProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Tarefas</CardTitle>
          <CardDescription>Nenhuma tarefa estimada ainda. Comece estimando sua primeira tarefa.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Tarefas</CardTitle>
        <CardDescription>Visualize todas as tarefas estimadas anteriormente.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-lg">{task.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {task.type}
                    </Badge>
                    <Badge variant="secondary">
                      {task.finalPoints} {task.finalPoints === 1 ? "ponto" : "pontos"}
                    </Badge>
                    {task.estimatedPoints !== task.finalPoints && (
                      <Badge variant="outline" className="text-slate-500">
                        Regras: {task.estimatedPoints}
                      </Badge>
                    )}
                    {task.mlEstimatedPoints !== null && task.mlEstimatedPoints !== task.finalPoints && (
                      <Badge variant="outline" className="text-emerald-600">
                        ML: {task.mlEstimatedPoints}
                      </Badge>
                    )}
                    {task.aiEstimatedPoints !== null && task.aiEstimatedPoints !== task.finalPoints && (
                      <Badge variant="outline" className="text-purple-600">
                        {task.aiModel === "groq" ? "Groq" : "Grok"}: {task.aiEstimatedPoints}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-500">{new Date(task.createdAt).toLocaleDateString()}</div>
              </div>
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{task.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
