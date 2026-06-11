import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Up to 3 affordable add-on products, excluding ids already in the cart. */
export async function GET(req: NextRequest) {
  const exclude = (req.nextUrl.searchParams.get("exclude") ?? "")
    .split(",")
    .filter(Boolean)
    .slice(0, 50);

  const products = await db.product.findMany({
    where: { status: "active", id: { notIn: exclude } },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { priceCents: "asc" },
    take: 3,
  });

  return NextResponse.json({
    products: products.map((p) => ({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      priceCents: p.priceCents,
      image: p.images[0]?.url ?? "",
    })),
  });
}
