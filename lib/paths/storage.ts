// lib/paths/storage.ts

import { promises as fs } from 'fs';
import path from 'path';
import type { LearningPath, PathIndex, PathIndexEntry } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'paths');
const INDEX_PATH = path.join(CONTENT_DIR, 'index.json');

function getPathFilePath(slug: string): string {
  return path.join(CONTENT_DIR, `${slug}.json`);
}

export async function readPathIndex(): Promise<PathIndex> {
  try {
    const data = await fs.readFile(INDEX_PATH, 'utf-8');
    return JSON.parse(data) as PathIndex;
  } catch {
    return { paths: [], lastUpdated: new Date().toISOString() };
  }
}

export async function writePathIndex(index: PathIndex): Promise<void> {
  index.lastUpdated = new Date().toISOString();
  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2), 'utf-8');
}

export async function readPath(slug: string): Promise<LearningPath | null> {
  try {
    const filePath = getPathFilePath(slug);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as LearningPath;
  } catch {
    return null;
  }
}

export async function writePath(learningPath: LearningPath): Promise<void> {
  const filePath = getPathFilePath(learningPath.slug);
  await fs.writeFile(filePath, JSON.stringify(learningPath, null, 2), 'utf-8');

  const index = await readPathIndex();
  const entry: PathIndexEntry = {
    slug: learningPath.slug,
    title: learningPath.title,
    description: learningPath.description,
    pillar: learningPath.pillar,
    difficulty: learningPath.difficulty,
    estimatedMinutes: learningPath.estimatedMinutes,
    topicCount: learningPath.topics.length,
    status: learningPath.status,
    updatedAt: learningPath.updatedAt,
  };

  const existingIdx = index.paths.findIndex(p => p.slug === learningPath.slug);
  if (existingIdx >= 0) {
    index.paths[existingIdx] = entry;
  } else {
    index.paths.push(entry);
  }

  await writePathIndex(index);
}

export async function deletePath(slug: string): Promise<boolean> {
  try {
    const filePath = getPathFilePath(slug);
    await fs.unlink(filePath);

    const index = await readPathIndex();
    index.paths = index.paths.filter(p => p.slug !== slug);
    await writePathIndex(index);

    return true;
  } catch {
    return false;
  }
}

export async function listPaths(options?: {
  status?: 'draft' | 'published';
  pillar?: string;
  difficulty?: string;
}): Promise<PathIndexEntry[]> {
  const index = await readPathIndex();
  let paths = index.paths;

  if (options?.status) {
    paths = paths.filter(p => p.status === options.status);
  }
  if (options?.pillar) {
    paths = paths.filter(p => p.pillar === options.pillar);
  }
  if (options?.difficulty) {
    paths = paths.filter(p => p.difficulty === options.difficulty);
  }

  return paths;
}
