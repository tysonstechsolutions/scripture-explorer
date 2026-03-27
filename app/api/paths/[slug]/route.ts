// app/api/paths/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { readPath, writePath, deletePath } from '@/lib/paths/storage';
import { listTopics } from '@/lib/topics/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const path = await readPath(slug);

    if (!path) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    // Fetch topic data for each slug in the path
    const allTopics = await listTopics({ status: 'published' });
    const topics = path.topics
      .map(topicSlug => allTopics.find(t => t.slug === topicSlug))
      .filter(Boolean);

    return NextResponse.json({ path, topics });
  } catch (error) {
    console.error('Error fetching path:', error);
    return NextResponse.json({ error: 'Failed to fetch path' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const existing = await readPath(slug);

    if (!existing) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    const body = await request.json();
    const now = new Date().toISOString();

    const updatedPath = {
      ...existing,
      ...body,
      id: existing.id,
      slug: existing.slug,
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    await writePath(updatedPath);

    return NextResponse.json({ path: updatedPath });
  } catch (error) {
    console.error('Error updating path:', error);
    return NextResponse.json({ error: 'Failed to update path' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const success = await deletePath(slug);

    if (!success) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting path:', error);
    return NextResponse.json({ error: 'Failed to delete path' }, { status: 500 });
  }
}
