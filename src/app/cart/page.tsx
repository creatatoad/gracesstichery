"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/money";

export default function CartPage() {
  const { items, setQty, remove, totalCents, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [needsContact, setNeedsContact] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          ...contact,
        }),
      });
      const data = await res.json();
      if (data.needsContact) {
        setNeedsContact(true);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Checkout failed — please try again.");
        return;
      }
      if (data.clearCart) clear();
      if (data.url.startsWith("http")) {
        window.location.href = data.url;
      } else {
        router.push(data.url);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl italic">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-ink-soft">Nothing here yet.</p>
            <Link href="/shop" className="btn-primary mt-6">Browse the shop</Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-ink/10">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 py-4">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-20 w-20 rounded-xl border border-ink/10 object-cover" />
                  ) : (
                    <div className="h-20 w-20 rounded-xl bg-parchment" />
                  )}
                  <div className="flex-1">
                    <Link href={`/products/${item.slug}`} className="font-semibold hover:text-berry">
                      {item.name}
                    </Link>
                    <p className="text-sm text-ink-soft">{formatPrice(item.priceCents)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Decrease quantity"
                      className="h-8 w-8 rounded-full border border-ink/20 font-bold hover:border-berry"
                      onClick={() => setQty(item.productId, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{item.qty}</span>
                    <button
                      aria-label="Increase quantity"
                      className="h-8 w-8 rounded-full border border-ink/20 font-bold hover:border-berry"
                      onClick={() => setQty(item.productId, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="w-20 text-right font-display italic">
                    {formatPrice(item.qty * item.priceCents)}
                  </span>
                  <button
                    aria-label={`Remove ${item.name}`}
                    onClick={() => remove(item.productId)}
                    className="text-ink-soft hover:text-berry"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between border-t-2 border-ink pt-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="font-display text-2xl italic">{formatPrice(totalCents)}</span>
            </div>

            {needsContact && (
              <div className="mt-6 rounded-2xl bg-parchment p-5">
                <p className="text-sm text-ink-soft">
                  Card payments aren&rsquo;t set up yet — leave your details and we&rsquo;ll
                  email you an invoice to complete your order.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    className="input"
                    placeholder="Your name"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  />
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>
              </div>
            )}

            {error && <p className="mt-4 text-sm font-semibold text-berry">{error}</p>}

            <button
              onClick={checkout}
              disabled={busy || (needsContact && !contact.email)}
              className="btn-primary mt-6 w-full text-center disabled:opacity-60"
            >
              {busy ? "One moment…" : needsContact ? "Place order" : "Checkout securely"}
            </button>
            <p className="mt-3 text-center text-xs text-ink-soft">
              Made to order · Ships in 3–5 days · Stitching guaranteed for life
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
