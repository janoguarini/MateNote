import OpenAI from "openai";

let client: OpenAI | null = null;

export class MissingApiKeyError extends Error {
  constructor(service: string) {
    super(`${service} API key is not configured.`);
    this.name = "MissingApiKeyError";
  }
}

export function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new MissingApiKeyError("OpenAI");
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const AI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
