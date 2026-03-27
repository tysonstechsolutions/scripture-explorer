// app/api/paths/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { readPathIndex, writePath } from '@/lib/paths/storage';
import type { LearningPath } from '@/lib/paths/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const pillar = searchParams.get('pillar');
  const difficulty = searchParams.get('difficulty');

  try {
    const index = await readPathIndex();
    let paths = index.paths;

    if (status) {
      paths = paths.filter(p => p.status === status);
    }
    if (pillar) {
      paths = paths.filter(p => p.pillar === pillar);
    }
    if (difficulty) {
      paths = paths.filter(p => p.difficulty === difficulty);
    }

    return NextResponse.json({ paths });
  } catch (error) {
    console.error('Error fetching paths:', error);
    return NextResponse.json({ error: 'Failed to fetch paths' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const newPath: LearningPath = {
      id,
      slug: body.slug,
      title: body.title,
      description: body.description,
      longDescription: body.longDescription,
      pillar: body.pillar,
      difficulty: body.difficulty,
      estimatedMinutes: body.estimatedMinutes,
      topics: body.topics || [],
      status: body.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    await writePath(newPath);

    return NextResponse.json({ path: newPath }, { status: 201 });
  } catch (error) {
    console.error('Error creating path:', error);
    return NextResponse.json({ error: 'Failed to create path' }, { status: 500 });
  }
}
