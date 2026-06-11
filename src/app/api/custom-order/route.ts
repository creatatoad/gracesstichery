import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = str(body?.name, 200);
  const email = str(body?.email, 200);
  const description = str(body?.description, 5000);
  const budget = str(body?.budget, 100);

  if (!name || !email || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Optional structured fields from the detailed form; folded into the
  // request text so the admin inbox shows everything in one place.
  const details = [
    ["Item", str(body?.itemType, 100)],
    ["Quantity", str(body?.quantity, 10)],
    ["Sizes / colors", str(body?.sizesColors, 300)],
    ["Placement", str(body?.placement, 100)],
    ["Thread colors", str(body?.threadColors, 200)],
    ["Inspiration", str(body?.inspiration, 500)],
    ["Needed by", str(body?.deadline, 30)],
    ["Phone", str(body?.phone, 50)],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  await db.customOrderRequest.create({
    data: {
      name,
      email,
      description: details ? `${description}\n\n---\n${details}` : description,
      budget,
    },
  });
  return NextResponse.json({ ok: true });
}
