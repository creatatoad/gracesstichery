import { createHmac } from "node:crypto";
import { ChannelAdapter, ChannelResult, ProductWithImages, productTags } from "./types";

// Generic webhook channel: POSTs the full product as JSON to WEBHOOK_SYNC_URL.
// Point it at Zapier, Make, n8n, or your own endpoint to fan out to any other
// marketplace (Shopify, Square, Instagram Shopping, Facebook Marketplace…).

function payload(product: ProductWithImages, event: "publish" | "update") {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return {
    event,
    product: {
      id: product.id,
      slug: product.slug,
      url: `${site}/products/${product.slug}`,
      name: product.name,
      description: product.description,
      price: product.priceCents / 100,
      currency: "USD",
      category: product.category,
      tags: productTags(product),
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      images: product.images.map((i) => ({ url: `${site}${i.url}`, alt: i.alt })),
    },
  };
}

async function send(product: ProductWithImages, event: "publish" | "update"): Promise<ChannelResult> {
  const url = process.env.WEBHOOK_SYNC_URL!;
  const body = JSON.stringify(payload(product, event));
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.WEBHOOK_SYNC_SECRET;
  if (secret) {
    headers["x-signature"] = createHmac("sha256", secret).update(body).digest("hex");
  }
  const res = await fetch(url, { method: "POST", headers, body });
  if (!res.ok) return { ok: false, error: `Webhook responded ${res.status}` };
  return { ok: true, externalId: product.slug };
}

export const webhook: ChannelAdapter = {
  id: "webhook",
  label: "Webhook (Zapier / Make)",
  isConfigured: () => Boolean(process.env.WEBHOOK_SYNC_URL),
  publish: (p) => send(p, "publish"),
  update: (p) => send(p, "update"),
};
