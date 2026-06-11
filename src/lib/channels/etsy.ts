import { ChannelAdapter, ChannelResult, ProductWithImages, productTags } from "./types";

// Etsy Open API v3: https://developers.etsy.com/documentation/
// Requires an app API key plus an OAuth 2.0 access token with the
// `listings_w` scope for the connected shop.

const API = "https://openapi.etsy.com/v3/application";

function env() {
  return {
    apiKey: process.env.ETSY_API_KEY ?? "",
    token: process.env.ETSY_ACCESS_TOKEN ?? "",
    shopId: process.env.ETSY_SHOP_ID ?? "",
    taxonomyId: Number(process.env.ETSY_TAXONOMY_ID || 1),
  };
}

function listingBody(product: ProductWithImages) {
  const { taxonomyId } = env();
  // Etsy caps tags at 13, each ≤ 20 chars.
  const tags = productTags(product)
    .map((t) => t.slice(0, 20))
    .slice(0, 13);
  return {
    quantity: 999, // made to order
    title: (product.seoTitle || product.name).slice(0, 140),
    description: product.description || product.name,
    price: product.priceCents / 100,
    who_made: "i_did",
    when_made: "made_to_order",
    taxonomy_id: taxonomyId,
    tags,
    type: "physical",
    should_auto_renew: true,
  };
}

async function etsyFetch(pathname: string, init: RequestInit): Promise<ChannelResult> {
  const { apiKey, token } = env();
  const res = await fetch(`${API}${pathname}`, {
    ...init,
    headers: {
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: `Etsy ${res.status}: ${body?.error ?? JSON.stringify(body)}` };
  }
  return { ok: true, externalId: String(body.listing_id ?? "") };
}

export const etsy: ChannelAdapter = {
  id: "etsy",
  label: "Etsy",
  isConfigured() {
    const { apiKey, token, shopId } = env();
    return Boolean(apiKey && token && shopId);
  },
  async publish(product) {
    const { shopId } = env();
    return etsyFetch(`/shops/${shopId}/listings`, {
      method: "POST",
      body: JSON.stringify(listingBody(product)),
    });
  },
  async update(product, externalId) {
    const { shopId } = env();
    const result = await etsyFetch(`/shops/${shopId}/listings/${externalId}`, {
      method: "PATCH",
      body: JSON.stringify(listingBody(product)),
    });
    return result.ok ? { ok: true, externalId } : result;
  },
};
