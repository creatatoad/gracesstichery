import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { adapters, syncProduct } from "@/lib/channels";

/** Reports which channels are configured (used by the admin UI). */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    channels: adapters.map((a) => ({
      id: a.id,
      label: a.label,
      configured: a.isConfigured(),
    })),
  });
}

/** Publishes/updates a product on the requested channels (all by default). */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : "";
  const channels = Array.isArray(body?.channels) ? (body.channels as string[]) : undefined;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const results = await syncProduct(product, channels);
  return NextResponse.json({ results });
}
