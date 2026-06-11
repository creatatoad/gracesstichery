"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ChannelInfo = { id: string; label: string; configured: boolean };
type ListingInfo = { channel: string; status: string; externalId: string; error: string };
type SyncResult = {
  channel: string;
  label: string;
  configured: boolean;
  ok: boolean;
  externalId?: string;
  error?: string;
};

export default function ChannelSync({
  productId,
  listings,
}: {
  productId: string;
  listings: ListingInfo[];
}) {
  const router = useRouter();
  const [channels, setChannels] = useState<ChannelInfo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<SyncResult[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/sync")
      .then((r) => r.json())
      .then((data) => {
        const list: ChannelInfo[] = data.channels ?? [];
        setChannels(list);
        setSelected(new Set(list.filter((c) => c.configured).map((c) => c.id)));
      })
      .catch(() => {});
  }, []);

  async function sync() {
    setBusy(true);
    setResults(null);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, channels: Array.from(selected) }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const listingFor = (id: string) => listings.find((l) => l.channel === id);

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <h2 className="font-semibold">Sell everywhere</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Push this product to your other shops in one click. Channels without credentials are
        listed so you know what&rsquo;s available. Add keys in <code>.env.local</code> to
        enable them.
      </p>

      <ul className="mt-4 space-y-2">
        {channels.map((c) => {
          const listing = listingFor(c.id);
          return (
            <li
              key={c.id}
              className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${c.configured ? "border-ink/15" : "border-dashed border-ink/15 opacity-60"}`}
            >
              <input
                type="checkbox"
                disabled={!c.configured}
                checked={selected.has(c.id)}
                onChange={(e) => {
                  const next = new Set(selected);
                  if (e.target.checked) next.add(c.id);
                  else next.delete(c.id);
                  setSelected(next);
                }}
              />
              <div className="flex-1">
                <p className="font-semibold">{c.label}</p>
                {listing ? (
                  <p className={listing.status === "live" ? "text-sage" : "text-berry"}>
                    {listing.status === "live"
                      ? `Live${listing.externalId ? ` · #${listing.externalId}` : ""}`
                      : listing.error || listing.status}
                  </p>
                ) : (
                  <p className="text-ink-soft">{c.configured ? "Not published yet" : "Needs API keys"}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={sync}
        disabled={busy || selected.size === 0}
        className="btn-primary mt-4 w-full disabled:opacity-50"
      >
        {busy ? "Syncing…" : `Publish / update ${selected.size} channel${selected.size === 1 ? "" : "s"}`}
      </button>

      {results && (
        <ul className="mt-3 space-y-1 text-sm">
          {results.map((r) => (
            <li key={r.channel} className={r.ok ? "text-sage" : "text-berry"}>
              {r.ok ? "✓" : "✕"} {r.label}
              {r.ok ? (r.externalId ? ` · listing #${r.externalId}` : "") : ` · ${r.error}`}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
