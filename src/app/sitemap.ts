import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await db.product.findMany({
    where: { status: "active" },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/gallery`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site}/custom`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site}/about`, changeFrequency: "yearly", priority: 0.4 },
    ...products.map((p) => ({
      url: `${site}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
