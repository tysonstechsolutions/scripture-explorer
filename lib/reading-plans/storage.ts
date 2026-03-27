// lib/reading-plans/storage.ts

import { promises as fs } from 'fs';
import path from 'path';
import type { ReadingPlan, ReadingPlanIndexEntry } from './types';

interface ReadingPlanIndex {
  plans: ReadingPlanIndexEntry[];
  lastUpdated: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'reading-plans');
const INDEX_PATH = path.join(CONTENT_DIR, 'index.json');

function getPlanFilePath(slug: string): string {
  return path.join(CONTENT_DIR, `${slug}.json`);
}

async function ensureDir(): Promise<void> {
  try {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

export async function readPlanIndex(): Promise<ReadingPlanIndex> {
  try {
    const data = await fs.readFile(INDEX_PATH, 'utf-8');
    return JSON.parse(data) as ReadingPlanIndex;
  } catch {
    return { plans: [], lastUpdated: new Date().toISOString() };
  }
}

export async function writePlanIndex(index: ReadingPlanIndex): Promise<void> {
  await ensureDir();
  index.lastUpdated = new Date().toISOString();
  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2), 'utf-8');
}

export async function readPlan(slug: string): Promise<ReadingPlan | null> {
  try {
    const filePath = getPlanFilePath(slug);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as ReadingPlan;
  } catch {
    return null;
  }
}

export async function writePlan(plan: ReadingPlan): Promise<void> {
  await ensureDir();
  const filePath = getPlanFilePath(plan.slug);
  await fs.writeFile(filePath, JSON.stringify(plan, null, 2), 'utf-8');

  const index = await readPlanIndex();
  const entry: ReadingPlanIndexEntry = {
    slug: plan.slug,
    title: plan.title,
    description: plan.description,
    readingCount: plan.readings.length,
    estimatedDays: plan.estimatedDays,
    difficulty: plan.difficulty,
    category: plan.category,
    status: plan.status,
    updatedAt: plan.updatedAt,
  };

  const existingIdx = index.plans.findIndex(p => p.slug === plan.slug);
  if (existingIdx >= 0) {
    index.plans[existingIdx] = entry;
  } else {
    index.plans.push(entry);
  }

  await writePlanIndex(index);
}

export async function deletePlan(slug: string): Promise<boolean> {
  try {
    const filePath = getPlanFilePath(slug);
    await fs.unlink(filePath);

    const index = await readPlanIndex();
    index.plans = index.plans.filter(p => p.slug !== slug);
    await writePlanIndex(index);

    return true;
  } catch {
    return false;
  }
}

export async function listPlans(options?: {
  status?: 'draft' | 'published';
  category?: string;
  difficulty?: string;
}): Promise<ReadingPlanIndexEntry[]> {
  const index = await readPlanIndex();
  let plans = index.plans;

  if (options?.status) {
    plans = plans.filter(p => p.status === options.status);
  }
  if (options?.category) {
    plans = plans.filter(p => p.category === options.category);
  }
  if (options?.difficulty) {
    plans = plans.filter(p => p.difficulty === options.difficulty);
  }

  return plans;
}
