// lib/topics/prompts.ts

import type { Pillar } from './types';
import { PILLAR_INFO } from './types';

export function buildTopicGenerationPrompt(
  title: string,
  pillar: Pillar,
  context?: string
): string {
  const pillarInfo = PILLAR_INFO[pillar];

  return `You are helping create educational content about biblical history and scholarship.

Generate a topic entry with three layers:

TOPIC: ${title}
PILLAR: ${pillarInfo.name} - ${pillarInfo.description}
${context ? `CONTEXT: ${context}` : ''}

## Layer 1: Hook (2-3 sentences)
Write a compelling hook that:
- Summarizes what this topic is about
- Explains why it matters or why skeptics raise it
- Creates curiosity to learn more

## Layer 2: Overview (800-1200 words)
Write an accessible overview that:
- Explains what happened or what the evidence shows
- Presents the main scholarly positions fairly
- Addresses common objections honestly
- Provides clear takeaways
- Uses headers to organize sections

## Layer 3: Deep Dive Sections
Create 3-5 expandable sections for deeper exploration:
- Include primary source quotes where relevant
- Cite scholarly sources (author, work, year)
- Address specific "but what about..." objections
- Suggest connections to related topics

TONE: Intellectually honest. Present evidence fairly, including challenges.
Don't be defensive or preachy. Let the evidence speak.

OUTPUT FORMAT: Return valid JSON matching this exact structure:
{
  "hook": "string - the 2-3 sentence hook",
  "overview": "string - the full overview in markdown format",
  "deepDive": [
    {
      "id": "string - unique id like 'section-1'",
      "title": "string - section title",
      "content": "string - section content in markdown"
    }
  ],
  "scriptureRefs": [
    {
      "bookId": "string - API.Bible format like 'GEN' or 'JHN'",
      "chapter": number,
      "verse": number,
      "verseEnd": number | null
    }
  ],
  "relatedTopics": ["string - suggested related topic titles"]
}

Return ONLY the JSON object, no markdown code blocks or other text.`;
}
