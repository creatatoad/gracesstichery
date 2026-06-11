"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./cart";
import { formatPrice } from "@/lib/money";

export type UpsellProduct = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
};

function UpsellCard({ p }: { p: UpsellProduct }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-3">
      {p.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image} alt="" className="h-16 w-16 rounded-xl border border-ink/10 object-cover" />
      ) : (
        <div className="h-16 w-16 rounded-xl bg-parchment" />
      )}
      <div className="min-w-0 flex-1">
        <Link href={`/products/${p.slug}`} className="block truncate text-sm font-semibold hover:text-berry">
          {p.name}
        </Link>
        <p className="text-sm text-ink-soft">{formatPrice(p.priceCents)}</p>
      </div>
      <button
        onClick={() => {
          add(p);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
          added ? "bg-sage text-cream" : "border-2 border-ink hover:bg-ink hover:text-cream"
        }`}
      >
        {added ? "Added ✓" : "+ Add"}
      </button>
    </div>
  );
}

/** Renders a given list of upsell products (for server pages). */
export function UpsellList({ title, products }: { title: string; products: UpsellProduct[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-1">
        {products.map((p) => (
          <UpsellCard key={p.productId} p={p} />
        ))}
      </div>
    </section>
  );
}

/** Fetches suggestions itself, excluding what's already in the cart. */
export default function CartUpsells({ title }: { title: string }) {
  const { items } = useCart();
  const [products, setProducts] = useState<UpsellProduct[]>([]);
  const inCart = items.map((i) => i.productId).sort().join(",");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/upsells?exclude=${encodeURIComponent(inCart)}`)
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => {
        if (!cancelled) setProducts(d.products ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [inCart]);

  return <UpsellList title={title} products={products} />;
}
