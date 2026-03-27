// lib/topics/storage.ts

import { promises as fs } from 'fs';
import path from 'path';
import type { Topic, TopicIndex, TopicIndexEntry, Pillar } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'topics');
const INDEX_PATH = path.join(CONTENT_DIR, 'index.json');

function getTopicPath(pillar: Pillar, slug: string): string {
  return path.join(CONTENT_DIR, pillar, `${slug}.json`);
}

export async function readIndex(): Promise<TopicIndex> {
  try {
    const data = await fs.readFile(INDEX_PATH, 'utf-8');
    return JSON.parse(data) as TopicIndex;
  } catch {
    return { topics: [], lastUpdated: new Date().toISOString() };
  }
}

export async function writeIndex(index: TopicIndex): Promise<void> {
  index.lastUpdated = new Date().toISOString();
  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2), 'utf-8');
}

export async function readTopic(pillar: Pillar, slug: string): Promise<Topic | null> {
  try {
    const filePath = getTopicPath(pillar, slug);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Topic;
  } catch {
    return null;
  }
}

export async function writeTopic(topic: Topic): Promise<void> {
  const filePath = getTopicPath(topic.pillar, topic.slug);
  await fs.writeFile(filePath, JSON.stringify(topic, null, 2), 'utf-8');

  // Update index
  const index = await readIndex();
  const entry: TopicIndexEntry = {
    slug: topic.slug,
    title: topic.title,
    pillar: topic.pillar,
    status: topic.status,
    hook: topic.hook,
    updatedAt: topic.updatedAt,
  };

  const existingIdx = index.topics.findIndex(t => t.slug === topic.slug);
  if (existingIdx >= 0) {
    index.topics[existingIdx] = entry;
  } else {
    index.topics.push(entry);
  }

  await writeIndex(index);
}

export async function deleteTopic(pillar: Pillar, slug: string): Promise<boolean> {
  try {
    const filePath = getTopicPath(pillar, slug);
    await fs.unlink(filePath);

    // Update index
    const index = await readIndex();
    index.topics = index.topics.filter(t => t.slug !== slug);
    await writeIndex(index);

    return true;
  } catch {
    return false;
  }
}

export async function findTopicBySlug(slug: string): Promise<{ topic: Topic; pillar: Pillar } | null> {
  const index = await readIndex();
  const entry = index.topics.find(t => t.slug === slug);
  if (!entry) return null;

  const topic = await readTopic(entry.pillar, slug);
  if (!topic) return null;

  return { topic, pillar: entry.pillar };
}

export async function listTopics(options?: {
  pillar?: Pillar;
  status?: 'draft' | 'review' | 'published';
}): Promise<TopicIndexEntry[]> {
  const index = await readIndex();
  let topics = index.topics;

  if (options?.pillar) {
    topics = topics.filter(t => t.pillar === options.pillar);
  }
  if (options?.status) {
    topics = topics.filter(t => t.status === options.status);
  }

  return topics;
}
