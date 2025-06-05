import { TaskEstimator } from "@/components/task-estimator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Estimador de Story Points</h1>
          <p className="mt-3 text-lg text-slate-600">Estime automaticamente a complexidade das suas tarefas</p>
        </div>

        <TaskEstimator />
      </div>
    </main>
  )
}
