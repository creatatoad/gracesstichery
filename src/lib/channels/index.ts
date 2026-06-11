import { db } from "@/lib/db";
import { etsy } from "./etsy";
import { tiktok } from "./tiktok";
import { webhook } from "./webhook";
import type { ChannelAdapter, ProductWithImages } from "./types";

export const adapters: ChannelAdapter[] = [etsy, tiktok, webhook];

export type SyncOutcome = {
  channel: string;
  label: string;
  configured: boolean;
  ok: boolean;
  externalId?: string;
  error?: string;
};

/**
 * Publish or update a product on the requested channels (all configured
 * channels by default), recording the result of each in ChannelListing.
 */
export async function syncProduct(
  product: ProductWithImages,
  channelIds?: string[],
): Promise<SyncOutcome[]> {
  const targets = adapters.filter((a) => !channelIds || channelIds.includes(a.id));
  const outcomes: SyncOutcome[] = [];

  for (const adapter of targets) {
    if (!adapter.isConfigured()) {
      outcomes.push({
        channel: adapter.id,
        label: adapter.label,
        configured: false,
        ok: false,
        error: "Not configured — add API credentials in .env.local",
      });
      continue;
    }

    const existing = await db.channelListing.findUnique({
      where: { productId_channel: { productId: product.id, channel: adapter.id } },
    });

    let result;
    try {
      result =
        existing?.externalId && existing.status === "live"
          ? await adapter.update(product, existing.externalId)
          : await adapter.publish(product);
    } catch (e) {
      result = { ok: false as const, error: e instanceof Error ? e.message : String(e) };
    }

    await db.channelListing.upsert({
      where: { productId_channel: { productId: product.id, channel: adapter.id } },
      update: {
        status: result.ok ? "live" : "error",
        externalId: result.ok ? result.externalId : (existing?.externalId ?? ""),
        error: result.ok ? "" : result.error,
        lastSyncedAt: new Date(),
      },
      create: {
        productId: product.id,
        channel: adapter.id,
        status: result.ok ? "live" : "error",
        externalId: result.ok ? result.externalId : "",
        error: result.ok ? "" : result.error,
        lastSyncedAt: new Date(),
      },
    });

    outcomes.push({
      channel: adapter.id,
      label: adapter.label,
      configured: true,
      ok: result.ok,
      externalId: result.ok ? result.externalId : undefined,
      error: result.ok ? undefined : result.error,
    });
  }

  return outcomes;
}
