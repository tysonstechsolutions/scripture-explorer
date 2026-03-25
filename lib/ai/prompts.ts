import type { Lens } from "@/lib/supabase/types";

export const LENS_DESCRIPTIONS: Record<Lens, string> = {
  historical: "Academic/archaeological perspective focusing on historical evidence and scholarly consensus",
  protestant: "Mainstream Protestant Christian interpretation emphasizing scripture alone (sola scriptura)",
  catholic: "Roman Catholic tradition including church teaching and apostolic succession",
  orthodox: "Eastern Orthodox perspective with emphasis on tradition and theosis",
  jewish: "Jewish interpretation focusing on Torah, Talmud, and rabbinic tradition",
  islamic: "Islamic perspective viewing Jesus as prophet and biblical figures in Quranic context",
  secular: "Critical/skeptical scholarship examining texts as historical documents",
};

export function getEraContentPrompt(eraName: string, tldr: string, lens: Lens): string {
  return `You are an expert biblical historian and theologian. Generate comprehensive content about the "${eraName}" era of biblical history.

PERSPECTIVE: ${LENS_DESCRIPTIONS[lens]}

Context: ${tldr}

Provide the following in JSON format:
{
  "keyFigures": [
    {
      "name": "Figure Name",
      "description": "2-3 sentence description of their significance",
      "bibleReferences": ["Genesis 12:1-3", "etc"]
    }
  ],
  "keyEvents": [
    {
      "name": "Event Name",
      "description": "2-3 sentence description",
      "significance": "Why this matters"
    }
  ],
  "worldEvents": [
    {
      "name": "Contemporary World Event",
      "description": "What was happening elsewhere in the world"
    }
  ],
  "modernConnections": [
    "How this era connects to modern faith or culture"
  ],
  "deeperTopics": [
    {
      "question": "A deeper question to explore",
      "briefAnswer": "1-2 sentence answer"
    }
  ]
}

Include 3-5 items per category. Be accurate, engaging, and appropriate for the ${lens} perspective.`;
}

export function getTopicContentPrompt(topic: string, category: string, lens: Lens): string {
  return `You are an expert biblical scholar. Generate comprehensive content about "${topic}" in the category of "${category}".

PERSPECTIVE: ${LENS_DESCRIPTIONS[lens]}

Provide the following in JSON format:
{
  "summary": "A clear 2-3 paragraph overview",
  "keyPoints": ["Important point 1", "Important point 2", ...],
  "commonQuestions": [
    {
      "question": "A common question about this topic",
      "answer": "Clear, helpful answer"
    }
  ],
  "relatedTopics": ["Related topic 1", "Related topic 2", ...],
  "bibleReferences": ["Relevant scripture references"],
  "stakes": "Why this topic matters to believers from this perspective"
}

Be accurate, balanced, and appropriate for the ${lens} perspective. If perspectives differ significantly, acknowledge this respectfully.`;
}
