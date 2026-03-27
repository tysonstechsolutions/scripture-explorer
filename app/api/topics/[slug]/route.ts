// app/api/topics/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { findTopicBySlug, writeTopic, deleteTopic } from '@/lib/topics/storage';
import type { Topic } from '@/lib/topics/types';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const result = await findTopicBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ topic: result.topic });
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const result = await findTopicBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, hook, overview, deepDive, scriptureRefs, relatedTopics, timelineEra, status } = body;

    const updatedTopic: Topic = {
      ...result.topic,
      title: title ?? result.topic.title,
      hook: hook ?? result.topic.hook,
      overview: overview ?? result.topic.overview,
      deepDive: deepDive ?? result.topic.deepDive,
      scriptureRefs: scriptureRefs ?? result.topic.scriptureRefs,
      relatedTopics: relatedTopics ?? result.topic.relatedTopics,
      timelineEra: timelineEra !== undefined ? timelineEra : result.topic.timelineEra,
      status: status ?? result.topic.status,
      updatedAt: new Date().toISOString(),
    };

    await writeTopic(updatedTopic);

    return NextResponse.json({ topic: updatedTopic });
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const result = await findTopicBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const deleted = await deleteTopic(result.pillar, slug);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete topic' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}
