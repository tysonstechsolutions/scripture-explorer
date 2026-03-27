import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_TRANSLATION } from "@/lib/bible/translations";
import { API_BIBLE_BASE_URL } from "@/lib/bible/constants";
import { readIndex, findTopicBySlug } from "@/lib/topics/storage";
import { READING_PLANS } from "@/lib/reading-plans/plans";
import { getBookById } from "@/lib/bible/books";

function getApiKey(): string {
  const key = process.env.API_BIBLE_KEY;
  if (!key) {
    throw new Error("API_BIBLE_KEY environment variable is not configured");
  }
  return key;
}

interface VerseResult {
  type: 'verse';
  id: string;
  reference: string;
  bookId: string;
  chapterId: string;
  text: string;
}

interface TopicResult {
  type: 'topic';
  slug: string;
  title: string;
  pillar: string;
  hook: string;
  matchContext?: string;
}

interface ReadingPlanResult {
  type: 'reading-plan';
  id: string;
  name: string;
  description: string;
  duration: number;
}

type SearchResult = VerseResult | TopicResult | ReadingPlanResult;

async function searchTopics(query: string): Promise<TopicResult[]> {
  const queryLower = query.toLowerCase();
  const index = await readIndex();
  const results: TopicResult[] = [];

  for (const entry of index.topics) {
    // Only search published topics
    if (entry.status !== 'published') continue;

    // Search in title (highest priority)
    if (entry.title.toLowerCase().includes(queryLower)) {
      results.push({
        type: 'topic',
        slug: entry.slug,
        title: entry.title,
        pillar: entry.pillar,
        hook: entry.hook,
      });
      continue;
    }

    // Search in hook
    if (entry.hook.toLowerCase().includes(queryLower)) {
      results.push({
        type: 'topic',
        slug: entry.slug,
        title: entry.title,
        pillar: entry.pillar,
        hook: entry.hook,
        matchContext: entry.hook,
      });
      continue;
    }

    // Search in full topic content (overview + deep dive)
    const topicResult = await findTopicBySlug(entry.slug);
    if (topicResult) {
      const topic = topicResult.topic;

      // Check overview
      if (topic.overview.toLowerCase().includes(queryLower)) {
        const contextMatch = extractContext(topic.overview, queryLower);
        results.push({
          type: 'topic',
          slug: entry.slug,
          title: entry.title,
          pillar: entry.pillar,
          hook: entry.hook,
          matchContext: contextMatch,
        });
        continue;
      }

      // Check deep dive sections
      for (const section of topic.deepDive) {
        if (
          section.title.toLowerCase().includes(queryLower) ||
          section.content.toLowerCase().includes(queryLower)
        ) {
          const contextMatch = section.content.toLowerCase().includes(queryLower)
            ? extractContext(section.content, queryLower)
            : section.title;
          results.push({
            type: 'topic',
            slug: entry.slug,
            title: entry.title,
            pillar: entry.pillar,
            hook: entry.hook,
            matchContext: contextMatch,
          });
          break;
        }
      }
    }
  }

  return results;
}

function extractContext(text: string, query: string, contextLength: number = 100): string {
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(query);
  if (index === -1) return text.slice(0, contextLength);

  const start = Math.max(0, index - contextLength / 2);
  const end = Math.min(text.length, index + query.length + contextLength / 2);

  let context = text.slice(start, end);
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';

  return context.replace(/\n+/g, ' ').trim();
}

function searchReadingPlans(query: string): ReadingPlanResult[] {
  const queryLower = query.toLowerCase();
  const results: ReadingPlanResult[] = [];

  for (const plan of READING_PLANS) {
    // Search in name and description
    if (
      plan.name.toLowerCase().includes(queryLower) ||
      plan.description.toLowerCase().includes(queryLower)
    ) {
      results.push({
        type: 'reading-plan',
        id: plan.id,
        name: plan.name,
        description: plan.description,
        duration: plan.duration,
      });
      continue;
    }

    // Search in book names within the plan
    const bookNames = new Set<string>();
    for (const reading of plan.readings) {
      for (const passage of reading.passages) {
        const book = getBookById(passage.bookId);
        if (book) bookNames.add(book.name.toLowerCase());
      }
    }

    if (Array.from(bookNames).some(name => name.includes(queryLower))) {
      results.push({
        type: 'reading-plan',
        id: plan.id,
        name: plan.name,
        description: plan.description,
        duration: plan.duration,
      });
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const translation = searchParams.get("translation") || DEFAULT_TRANSLATION;
  const searchType = searchParams.get("type") || "all"; // "all", "scripture", "topics", "plans"

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const results: SearchResult[] = [];
    let verseTotal = 0;
    let topicTotal = 0;
    let planTotal = 0;

    // Search Scripture
    if (searchType === "all" || searchType === "scripture") {
      const response = await fetch(
        `${API_BIBLE_BASE_URL}/bibles/${translation}/search?query=${encodeURIComponent(query)}&limit=20`,
        {
          headers: {
            "api-key": getApiKey(),
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        verseTotal = json.data?.total || 0;

        const verseResults: VerseResult[] = json.data?.verses?.map((verse: {
          id: string;
          orgId: string;
          bookId: string;
          chapterId: string;
          reference: string;
          text: string;
        }) => ({
          type: 'verse' as const,
          id: verse.id,
          reference: verse.reference,
          bookId: verse.bookId,
          chapterId: verse.chapterId,
          text: verse.text?.replace(/<[^>]*>/g, "").trim() || "",
        })) || [];

        results.push(...verseResults);
      }
    }

    // Search Topics
    if (searchType === "all" || searchType === "topics") {
      const topicResults = await searchTopics(query);
      topicTotal = topicResults.length;
      results.push(...topicResults);
    }

    // Search Reading Plans
    if (searchType === "all" || searchType === "plans") {
      const planResults = searchReadingPlans(query);
      planTotal = planResults.length;
      results.push(...planResults);
    }

    return NextResponse.json({
      query,
      total: verseTotal + topicTotal + planTotal,
      verseCount: verseTotal,
      topicCount: topicTotal,
      planCount: planTotal,
      results,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to search. Please try again." },
      { status: 500 }
    );
  }
}
