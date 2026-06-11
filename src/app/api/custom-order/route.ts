import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const budget = typeof body?.budget === "string" ? body.budget.trim() : "";

  if (!name || !email || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await db.customOrderRequest.create({
    data: {
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      description: description.slice(0, 5000),
      budget: budget.slice(0, 100),
    },
  });
  return NextResponse.json({ ok: true });
}
