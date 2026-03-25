import { getAnthropicClient } from "./client";
import { getEraContentPrompt, getTopicContentPrompt } from "./prompts";
import type { Lens } from "@/lib/supabase/types";

export interface GeneratedEraContent {
  keyFigures: Array<{
    name: string;
    description: string;
    bibleReferences: string[];
  }>;
  keyEvents: Array<{
    name: string;
    description: string;
    significance: string;
  }>;
  worldEvents: Array<{
    name: string;
    description: string;
  }>;
  modernConnections: string[];
  deeperTopics: Array<{
    question: string;
    briefAnswer: string;
  }>;
}

export interface GeneratedTopicContent {
  summary: string;
  keyPoints: string[];
  commonQuestions: Array<{
    question: string;
    answer: string;
  }>;
  relatedTopics: string[];
  bibleReferences: string[];
  stakes: string;
}

export async function generateEraContent(
  eraName: string,
  tldr: string,
  lens: Lens
): Promise<GeneratedEraContent> {
  const client = getAnthropicClient();
  const prompt = getEraContentPrompt(eraName, tldr, lens);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  // Extract JSON from response (may be wrapped in markdown code blocks)
  let jsonStr = textContent.text;
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  return JSON.parse(jsonStr.trim()) as GeneratedEraContent;
}

export async function generateTopicContent(
  topic: string,
  category: string,
  lens: Lens
): Promise<GeneratedTopicContent> {
  const client = getAnthropicClient();
  const prompt = getTopicContentPrompt(topic, category, lens);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  // Extract JSON from response
  let jsonStr = textContent.text;
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  return JSON.parse(jsonStr.trim()) as GeneratedTopicContent;
}
