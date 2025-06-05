import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { description, taskType, model } = await req.json()

    if (!description || !taskType || !model) {
      return Response.json({ error: "Descrição, tipo de tarefa e modelo são obrigatórios" }, { status: 400 })
    }

    const prompt = `
    Você é um especialista em metodologias ágeis e estimativa de story points.
    
    Analise a seguinte descrição de tarefa e estime quantos story points ela deve receber.
    
    Descrição da tarefa: "${description}"
    Tipo da tarefa: "${taskType}"
    
    Considere os seguintes fatores na sua análise:
    1. Complexidade técnica
    2. Esforço necessário
    3. Incertezas e riscos
    4. Dependências
    
    Responda APENAS com um número da sequência de Fibonacci (1, 2, 3, 5, 8, 13, 21) que melhor representa a estimativa de story points para esta tarefa.
    
    Sua resposta deve ser APENAS o número, sem explicações ou texto adicional.
    `

    let result

    try {
      if (model === "groq") {
        result = await generateText({
          model: groq("llama-3.1-8b-instant"),
          prompt,
          temperature: 0.2,
          maxTokens: 10,
        })
      } else if (model === "grok") {
        // Use the correct xAI Grok model name
        result = await generateText({
          model: xai("grok-3-mini"),
          prompt,
          temperature: 0.2,
          maxTokens: 10,
        })
      } else {
        return Response.json({ error: "Modelo não suportado" }, { status: 400 })
      }
    } catch (apiError: any) {
      console.error("Erro na API do modelo:", apiError)

      // Check for specific error types
      if (apiError.message?.includes("credits") || apiError.message?.includes("spending limit")) {
        return Response.json(
          {
            error: "CREDIT_LIMIT_EXCEEDED",
            message:
              "Limite de créditos da API atingido. Tente novamente mais tarde ou use a estimativa baseada em regras.",
            userMessage:
              "O serviço de IA está temporariamente indisponível devido ao limite de créditos. Use a estimativa baseada em regras por enquanto.",
          },
          { status: 429 },
        )
      }

      if (apiError.message?.includes("rate limit")) {
        return Response.json(
          {
            error: "RATE_LIMIT_EXCEEDED",
            message: "Muitas solicitações. Tente novamente em alguns segundos.",
            userMessage: "Muitas solicitações simultâneas. Aguarde alguns segundos e tente novamente.",
          },
          { status: 429 },
        )
      }

      if (apiError.message?.includes("does not exist") || apiError.message?.includes("does not have access")) {
        return Response.json(
          {
            error: "MODEL_ACCESS_ERROR",
            message: "Modelo não disponível ou sem acesso.",
            userMessage: `O modelo ${model === "grok" ? "Grok" : "Groq"} não está disponível no momento. Tente o outro modelo ou use a estimativa baseada em regras.`,
          },
          { status: 403 },
        )
      }

      if (apiError.message?.includes("API key")) {
        return Response.json(
          {
            error: "API_KEY_ERROR",
            message: "Problema com a chave da API.",
            userMessage: "Erro de configuração da API. Use a estimativa baseada em regras por enquanto.",
          },
          { status: 401 },
        )
      }

      // Generic API error
      return Response.json(
        {
          error: "API_ERROR",
          message: "Erro na comunicação com o modelo de IA. Tente novamente ou use a estimativa baseada em regras.",
          userMessage: "Erro temporário no serviço de IA. Tente novamente em alguns instantes.",
        },
        { status: 503 },
      )
    }

    // Extrair apenas o número da resposta
    const pointsMatch = result.text.match(/\d+/)
    const points = pointsMatch ? Number.parseInt(pointsMatch[0], 10) : null

    // Verificar se o número está na sequência de Fibonacci
    const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]

    if (points && fibonacciPoints.includes(points)) {
      return Response.json({ points })
    } else {
      // Se não for um número válido da sequência, fazer uma estimativa aproximada
      return Response.json({
        points: 3,
        note: "Estimativa padrão usada devido a resposta não padrão do modelo",
      })
    }
  } catch (error) {
    console.error("Erro ao estimar story points:", error)
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: "Erro interno do servidor",
        userMessage: "Erro interno. Tente novamente ou use a estimativa baseada em regras.",
      },
      { status: 500 },
    )
  }
}
