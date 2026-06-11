import type { Product, ProductImage } from "@prisma/client";

export type ProductWithImages = Product & { images: ProductImage[] };

export type ChannelResult =
  | { ok: true; externalId: string; message?: string }
  | { ok: false; error: string };

export interface ChannelAdapter {
  /** Stable id stored in the database (e.g. "etsy"). */
  id: string;
  /** Human label shown in the admin. */
  label: string;
  /** True when all required env vars are present. */
  isConfigured(): boolean;
  /** Create a new listing on the channel. */
  publish(product: ProductWithImages): Promise<ChannelResult>;
  /** Update an existing listing. */
  update(product: ProductWithImages, externalId: string): Promise<ChannelResult>;
}

export function productTags(product: ProductWithImages): string[] {
  return product.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
