// app/api/reading-plans/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { readPlan, writePlan, deletePlan } from '@/lib/reading-plans/storage';
import type { ReadingPlan } from '@/lib/reading-plans/types';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const plan = await readPlan(slug);

  if (!plan) {
    return NextResponse.json({ error: 'Reading plan not found' }, { status: 404 });
  }

  return NextResponse.json({ plan });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const existingPlan = await readPlan(slug);
    if (!existingPlan) {
      return NextResponse.json({ error: 'Reading plan not found' }, { status: 404 });
    }

    const body = await request.json();
    const updatedPlan: ReadingPlan = {
      ...existingPlan,
      title: body.title ?? existingPlan.title,
      description: body.description ?? existingPlan.description,
      longDescription: body.longDescription ?? existingPlan.longDescription,
      readings: body.readings ?? existingPlan.readings,
      estimatedDays: body.estimatedDays ?? existingPlan.estimatedDays,
      difficulty: body.difficulty ?? existingPlan.difficulty,
      category: body.category ?? existingPlan.category,
      status: body.status ?? existingPlan.status,
      updatedAt: new Date().toISOString(),
    };

    await writePlan(updatedPlan);

    return NextResponse.json({ plan: updatedPlan });
  } catch (error) {
    console.error('Failed to update reading plan:', error);
    return NextResponse.json(
      { error: 'Failed to update reading plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  const success = await deletePlan(slug);
  if (!success) {
    return NextResponse.json({ error: 'Reading plan not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
