import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/ai/client";
import { LENS_DESCRIPTIONS } from "@/lib/ai/prompts";
import type { Lens } from "@/lib/supabase/types";

const SYSTEM_PROMPT = `You are a knowledgeable biblical scholar and theologian assistant for Scripture Explorer, an interactive Bible study platform.

Your role is to:
1. Answer questions about the Bible, biblical history, theology, and related topics
2. Provide accurate, well-researched information
3. Cite specific Bible verses when relevant (e.g., John 3:16)
4. Explain complex theological concepts in accessible language
5. Acknowledge when topics are debated among scholars or traditions
6. Be respectful of all faith traditions while being informative

Guidelines:
- Keep responses focused and concise (2-4 paragraphs for most questions)
- Use markdown formatting for clarity
- When asked about controversial topics, present multiple perspectives
- Recommend relevant Bible passages for further reading
- If you're uncertain about something, say so honestly`;

export async function POST(request: NextRequest) {
  try {
    const { messages, lens = "historical" } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = getAnthropicClient();
    const lensContext = LENS_DESCRIPTIONS[lens as Lens] || LENS_DESCRIPTIONS.historical;

    const systemPrompt = `${SYSTEM_PROMPT}

Current perspective lens: ${lens}
${lensContext}

When answering, consider this perspective while remaining balanced and informative.`;

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: anthropicMessages,
      stream: true,
    });

    // Create a ReadableStream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of response) {
            if (event.type === "content_block_delta") {
              const delta = event.delta;
              if ("text" in delta) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: delta.text })}\n\n`)
                );
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
