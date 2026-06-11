import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { generateProductCopy } from "@/lib/ai";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Give the product a name first" }, { status: 400 });
  }

  try {
    const copy = await generateProductCopy({
      name,
      category: typeof body?.category === "string" ? body.category : undefined,
      notes: typeof body?.notes === "string" ? body.notes : undefined,
      priceCents: Number.isFinite(body?.priceCents) ? body.priceCents : undefined,
      imageUrl: typeof body?.imageUrl === "string" ? body.imageUrl : undefined,
    });
    return NextResponse.json({ copy, ai: Boolean(process.env.ANTHROPIC_API_KEY) });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 },
    );
  }
}
