import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import type { ProductPayload } from "../route";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const body = (await req.json().catch(() => null)) as Partial<ProductPayload> | null;
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const product = await db.product.update({
    where: { id },
    data: {
      ...(body.name ? { name: body.name.trim() } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(Number.isFinite(body.priceCents) && body.priceCents! > 0
        ? { priceCents: Math.round(body.priceCents!) }
        : {}),
      ...(body.category ? { category: body.category.trim().toLowerCase() } : {}),
      ...(body.status ? { status: body.status } : {}),
      ...(body.featured !== undefined ? { featured: Boolean(body.featured) } : {}),
      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDescription !== undefined ? { seoDescription: body.seoDescription } : {}),
      ...(body.tags !== undefined ? { tags: body.tags } : {}),
      ...(body.images
        ? {
            images: {
              deleteMany: {},
              create: body.images.map((img, i) => ({
                url: img.url,
                alt: img.alt ?? "",
                position: i,
              })),
            },
          }
        : {}),
    },
    include: { images: true },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  await db.product.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
