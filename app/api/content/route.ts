import { NextRequest, NextResponse } from "next/server";
import { generateEraContent, generateTopicContent } from "@/lib/ai/generate";
import { getEraById } from "@/lib/timeline/eras";
import type { Lens } from "@/lib/supabase/types";

const VALID_LENSES: Lens[] = [
  "historical",
  "protestant",
  "catholic",
  "orthodox",
  "jewish",
  "islamic",
  "secular",
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type"); // "era" or "topic"
  const id = searchParams.get("id");
  const lens = (searchParams.get("lens") || "historical") as Lens;
  const category = searchParams.get("category");

  if (!type || !id) {
    return NextResponse.json(
      { error: "Missing type or id parameter" },
      { status: 400 }
    );
  }

  if (!VALID_LENSES.includes(lens)) {
    return NextResponse.json(
      { error: `Invalid lens. Must be one of: ${VALID_LENSES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    if (type === "era") {
      const era = getEraById(id);
      if (!era) {
        return NextResponse.json({ error: "Era not found" }, { status: 404 });
      }

      const content = await generateEraContent(era.name, era.tldr, lens);
      return NextResponse.json({
        type: "era",
        id: era.id,
        lens,
        content,
      });
    }

    if (type === "topic") {
      if (!category) {
        return NextResponse.json(
          { error: "Missing category parameter for topic" },
          { status: 400 }
        );
      }

      const content = await generateTopicContent(id, category, lens);
      return NextResponse.json({
        type: "topic",
        id,
        category,
        lens,
        content,
      });
    }

    return NextResponse.json(
      { error: "Invalid type. Must be 'era' or 'topic'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
