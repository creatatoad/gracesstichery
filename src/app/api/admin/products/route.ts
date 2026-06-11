import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export type ProductPayload = {
  name: string;
  description?: string;
  priceCents: number;
  category?: string;
  status?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string;
  images?: { url: string; alt?: string }[];
};

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as ProductPayload | null;
  if (!body?.name || !Number.isFinite(body.priceCents) || body.priceCents <= 0) {
    return NextResponse.json({ error: "Name and a positive price are required" }, { status: 400 });
  }

  let slug = slugify(body.name);
  if (await db.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const product = await db.product.create({
    data: {
      slug,
      name: body.name.trim(),
      description: body.description ?? "",
      priceCents: Math.round(body.priceCents),
      category: (body.category ?? "apparel").trim().toLowerCase() || "apparel",
      status: body.status === "draft" ? "draft" : "active",
      featured: Boolean(body.featured),
      seoTitle: body.seoTitle ?? "",
      seoDescription: body.seoDescription ?? "",
      tags: body.tags ?? "",
      images: {
        create: (body.images ?? []).map((img, i) => ({
          url: img.url,
          alt: img.alt ?? "",
          position: i,
        })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json({ product });
}
