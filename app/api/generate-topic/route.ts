// app/api/generate-topic/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/ai/client';
import { buildTopicGenerationPrompt } from '@/lib/topics/prompts';
import type { Pillar, DeepDiveSection, ScriptureRef } from '@/lib/topics/types';

interface GeneratedContent {
  hook: string;
  overview: string;
  deepDive: DeepDiveSection[];
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, pillar, context } = body as {
      title: string;
      pillar: Pillar;
      context?: string;
    };

    if (!title || !pillar) {
      return NextResponse.json(
        { error: 'Missing required fields: title, pillar' },
        { status: 400 }
      );
    }

    const prompt = buildTopicGenerationPrompt(title, pillar, context);
    const client = getAnthropicClient();

    let lastError: Error | null = null;

    // Retry once on failure
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const textContent = response.content.find(c => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
          throw new Error('No text content in response');
        }

        // Parse the JSON response
        let content: GeneratedContent;
        try {
          content = JSON.parse(textContent.text);
        } catch {
          // Try to extract JSON from markdown code block if present
          const jsonMatch = textContent.text.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            content = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error('Failed to parse response as JSON');
          }
        }

        return NextResponse.json({ content });
      } catch (error) {
        lastError = error as Error;
        console.error(`Generation attempt ${attempt + 1} failed:`, error);
        if (attempt < 1) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    return NextResponse.json(
      { error: `Generation failed after retries: ${lastError?.message}` },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error generating topic:', error);
    return NextResponse.json(
      { error: 'Failed to generate topic content' },
      { status: 500 }
    );
  }
}
