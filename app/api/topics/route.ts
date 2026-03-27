// app/api/topics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { listTopics, writeTopic, readIndex } from '@/lib/topics/storage';
import type { Topic, Pillar } from '@/lib/topics/types';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pillar = searchParams.get('pillar') as Pillar | null;
  const status = searchParams.get('status') as 'draft' | 'review' | 'published' | null;

  try {
    const topics = await listTopics({
      pillar: pillar || undefined,
      status: status || undefined,
    });

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error listing topics:', error);
    return NextResponse.json(
      { error: 'Failed to list topics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, pillar, hook, overview, deepDive, scriptureRefs, relatedTopics, timelineEra } = body;

    if (!title || !pillar || !hook || !overview) {
      return NextResponse.json(
        { error: 'Missing required fields: title, pillar, hook, overview' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const index = await readIndex();
    if (index.topics.some(t => t.slug === slug)) {
      return NextResponse.json(
        { error: 'A topic with this title already exists' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const topic: Topic = {
      id: nanoid(),
      slug,
      title,
      pillar,
      status: 'draft',
      hook,
      overview,
      deepDive: deepDive || [],
      scriptureRefs: scriptureRefs || [],
      relatedTopics: relatedTopics || [],
      timelineEra,
      createdAt: now,
      updatedAt: now,
    };

    await writeTopic(topic);

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
