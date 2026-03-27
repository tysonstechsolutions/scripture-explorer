// app/api/topics/by-era/[eraId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { readIndex, findTopicBySlug } from '@/lib/topics/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eraId: string }> }
) {
  try {
    const { eraId } = await params;
    const index = await readIndex();

    // Filter to only published topics
    const publishedTopics = index.topics.filter(t => t.status === 'published');

    // Fetch full topic data to check timelineEra
    const matchingTopics = [];

    for (const entry of publishedTopics) {
      const topicResult = await findTopicBySlug(entry.slug);
      if (topicResult && topicResult.topic.timelineEra === eraId) {
        matchingTopics.push(entry);
      }
    }

    return NextResponse.json({ topics: matchingTopics });
  } catch (error) {
    console.error('Error fetching topics by era:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}
