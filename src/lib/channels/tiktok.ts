import { createHmac } from "node:crypto";
import { ChannelAdapter, ChannelResult, ProductWithImages } from "./types";

// TikTok Shop Open Platform: https://partner.tiktokshop.com/docv2
// Requests are signed with HMAC-SHA256 over the path + sorted query params +
// body, keyed by the app secret (TikTok's standard signing scheme).

const API = "https://open-api.tiktokglobalshop.com";
const VERSION = "202309";

function env() {
  return {
    appKey: process.env.TIKTOK_APP_KEY ?? "",
    appSecret: process.env.TIKTOK_APP_SECRET ?? "",
    accessToken: process.env.TIKTOK_ACCESS_TOKEN ?? "",
    shopCipher: process.env.TIKTOK_SHOP_CIPHER ?? "",
    warehouseId: process.env.TIKTOK_WAREHOUSE_ID ?? "",
  };
}

function signRequest(pathname: string, params: Record<string, string>, body: string): string {
  const { appSecret } = env();
  const sorted = Object.keys(params)
    .filter((k) => k !== "sign" && k !== "access_token")
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join("");
  const base = `${appSecret}${pathname}${sorted}${body}${appSecret}`;
  return createHmac("sha256", appSecret).update(base).digest("hex");
}

async function tiktokFetch(
  pathname: string,
  method: "POST" | "PUT",
  payload: unknown,
): Promise<ChannelResult> {
  const { appKey, accessToken, shopCipher } = env();
  const body = JSON.stringify(payload);
  const params: Record<string, string> = {
    app_key: appKey,
    shop_cipher: shopCipher,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  params.sign = signRequest(pathname, params, body);
  const qs = new URLSearchParams(params).toString();

  const res = await fetch(`${API}${pathname}?${qs}`, {
    method,
    headers: { "Content-Type": "application/json", "x-tts-access-token": accessToken },
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || (json.code !== 0 && json.code !== undefined)) {
    return { ok: false, error: `TikTok Shop: ${json.message ?? res.status}` };
  }
  return { ok: true, externalId: String(json.data?.product_id ?? "") };
}

function productBody(product: ProductWithImages) {
  const { warehouseId } = env();
  return {
    title: (product.seoTitle || product.name).slice(0, 255),
    description: `<p>${(product.description || product.name).replace(/\n/g, "</p><p>")}</p>`,
    category_id: "601226", // apparel default; override per product in TikTok Seller Center
    skus: [
      {
        inventory: [{ warehouse_id: warehouseId, quantity: 999 }],
        price: { amount: (product.priceCents / 100).toFixed(2), currency: "USD" },
        seller_sku: product.slug,
      },
    ],
  };
}

export const tiktok: ChannelAdapter = {
  id: "tiktok",
  label: "TikTok Shop",
  isConfigured() {
    const { appKey, appSecret, accessToken, shopCipher } = env();
    return Boolean(appKey && appSecret && accessToken && shopCipher);
  },
  async publish(product) {
    return tiktokFetch(`/product/${VERSION}/products`, "POST", {
      ...productBody(product),
      save_mode: "LISTING",
    });
  },
  async update(product, externalId) {
    const result = await tiktokFetch(
      `/product/${VERSION}/products/${externalId}`,
      "PUT",
      productBody(product),
    );
    return result.ok ? { ok: true, externalId } : result;
  },
};
