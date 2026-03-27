// app/api/reading-plans/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { listPlans, writePlan, readPlan } from '@/lib/reading-plans/storage';
import type { ReadingPlan } from '@/lib/reading-plans/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'draft' | 'published' | null;
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');

  const plans = await listPlans({
    status: status || undefined,
    category: category || undefined,
    difficulty: difficulty || undefined,
  });

  return NextResponse.json({ plans });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.slug || !body.description || !body.readings) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, description, readings' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await readPlan(body.slug);
    if (existing) {
      return NextResponse.json(
        { error: 'A reading plan with this slug already exists' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const plan: ReadingPlan = {
      id: `plan_${Date.now()}`,
      slug: body.slug,
      title: body.title,
      description: body.description,
      longDescription: body.longDescription,
      readings: body.readings || [],
      estimatedDays: body.estimatedDays || body.readings?.length || 1,
      difficulty: body.difficulty || 'beginner',
      category: body.category || 'topical',
      status: body.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    await writePlan(plan);

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Failed to create reading plan:', error);
    return NextResponse.json(
      { error: 'Failed to create reading plan' },
      { status: 500 }
    );
  }
}
