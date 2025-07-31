import { streamText } from "ai"
import { google } from "@ai-sdk/google"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    console.log("Received messages:", messages)

    // Debug environment variables
    console.log("Environment variables:", {
      GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    })

    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set")
      return new Response(
        JSON.stringify({
          error: "API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY environment variable.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system: "You are a helpful AI assistant. Be conversational and helpful.",
    })

    console.log("Streaming response started")
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("API Error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to get response from Gemini API",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
