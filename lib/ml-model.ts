import * as tf from "@tensorflow/tfjs"
import { extractFeatures, pointsToIndex, indexToPoints } from "./feature-extractor"
import type { Task } from "./types"

// Número de classes (valores possíveis de story points na sequência de Fibonacci)
const NUM_CLASSES = 7 // [1, 2, 3, 5, 8, 13, 21]

/**
 * Cria e treina um modelo de ML para estimar story points
 */
export async function trainModel(tasks: Task[]): Promise<tf.LayersModel | null> {
  if (tasks.length < 5) {
    console.log("Dados insuficientes para treinar o modelo")
    return null
  }

  // Preparar os dados de treinamento
  const features: number[][] = []
  const labels: number[] = []

  tasks.forEach((task) => {
    const taskFeatures = extractFeatures(task.description, task.type)
    features.push(taskFeatures)
    labels.push(pointsToIndex(task.finalPoints))
  })

  // Converter para tensores
  const xs = tf.tensor2d(features)
  const ys = tf.oneHot(tf.tensor1d(labels, "int32"), NUM_CLASSES)

  // Criar o modelo
  const model = tf.sequential()

  // Camada de entrada
  model.add(
    tf.layers.dense({
      units: 16,
      activation: "relu",
      inputShape: [features[0].length],
    }),
  )

  // Camada oculta
  model.add(
    tf.layers.dense({
      units: 16,
      activation: "relu",
    }),
  )

  // Camada de saída
  model.add(
    tf.layers.dense({
      units: NUM_CLASSES,
      activation: "softmax",
    }),
  )

  // Compilar o modelo
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  })

  // Treinar o modelo
  try {
    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: Math.min(32, tasks.length),
      shuffle: true,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`)
        },
      },
    })

    // Liberar os tensores
    xs.dispose()
    ys.dispose()

    return model
  } catch (error) {
    console.error("Erro ao treinar o modelo:", error)
    return null
  }
}

/**
 * Faz uma previsão de story points usando o modelo treinado
 */
export async function predictStoryPoints(
  model: tf.LayersModel | null,
  description: string,
  taskType: string,
): Promise<number | null> {
  if (!model) return null

  const features = extractFeatures(description, taskType)
  const input = tf.tensor2d([features])

  try {
    const prediction = model.predict(input) as tf.Tensor
    const probabilities = await prediction.data()

    // Obter o índice com maior probabilidade
    let maxIndex = 0
    let maxProb = probabilities[0]

    for (let i = 1; i < NUM_CLASSES; i++) {
      if (probabilities[i] > maxProb) {
        maxProb = probabilities[i]
        maxIndex = i
      }
    }

    // Liberar os tensores
    input.dispose()
    prediction.dispose()

    // Converter o índice para story points
    return indexToPoints(maxIndex)
  } catch (error) {
    console.error("Erro ao fazer previsão:", error)
    return null
  }
}

/**
 * Salva o modelo no localStorage
 */
export async function saveModel(model: tf.LayersModel): Promise<void> {
  try {
    const saveResults = await model.save("localstorage://story-points-model")
    console.log("Modelo salvo:", saveResults)
  } catch (error) {
    console.error("Erro ao salvar o modelo:", error)
  }
}

/**
 * Carrega o modelo do localStorage
 */
export async function loadModel(): Promise<tf.LayersModel | null> {
  try {
    const model = await tf.loadLayersModel("localstorage://story-points-model")
    console.log("Modelo carregado com sucesso")
    return model
  } catch (error) {
    console.log("Nenhum modelo encontrado no localStorage")
    return null
  }
}
