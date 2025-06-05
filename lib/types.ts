export interface Task {
  id: string
  title: string
  description: string
  type: string
  estimatedPoints: number
  finalPoints: number
  createdAt: string
  mlEstimatedPoints?: number | null
  aiEstimatedPoints?: number | null
  aiModel?: string | null
  bertEstimatedPoints?: number | null
  bertConfidence?: number | null
}

export interface ModelStats {
  trainedOn: number
  lastTrainedAt: string | null
  accuracy: number | null
}
