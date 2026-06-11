"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ITEM_TYPES = [
  "Hoodie",
  "Sweatshirt / crewneck",
  "T-shirt",
  "Hat / beanie",
  "Denim jacket / outerwear",
  "Tote / bag",
  "Baby item",
  "Apron / home goods",
  "Polos / team or business wear",
  "Something else (tell us below)",
  "Not sure yet, I just have the idea",
];

const PLACEMENTS = [
  "Left chest (classic)",
  "Full back (statement)",
  "Front center",
  "Sleeve or cuff",
  "Hat front",
  "Corner / edge (totes, blankets, towels)",
  "Not sure, recommend something",
];

const BUDGETS = ["Under $50", "$50 to $100", "$100 to $250", "$250+", "Not sure yet"];

export default function CustomOrderPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/custom-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl italic">Start a custom order</h1>
        <p className="mt-3 text-ink-soft">
          Tell us what you&rsquo;re imagining: a name, a drawing, a pet, your grandmother&rsquo;s
          handwriting. We&rsquo;ll reply within one business day with a{" "}
          <strong className="text-ink">free design proof</strong>. You pay nothing until you
          approve it. The more you fill in, the better your first proof will be, but only the
          starred fields are required.
        </p>

        {status === "done" ? (
          <div className="mt-10 rounded-2xl border-2 border-sage bg-white p-8 text-center">
            <h2 className="text-2xl italic">Got it! 🧵</h2>
            <p className="mt-2 text-ink-soft">
              Your idea is in the queue. Watch your inbox. Your free proof is on its way
              within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-8">
            {/* About you */}
            <fieldset className="space-y-5 rounded-2xl border border-ink/10 bg-white p-6">
              <legend className="px-2 font-display text-xl italic">About you</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="name">Your name *</label>
                  <input id="name" name="name" required className="input" autoComplete="name" />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" required className="input" autoComplete="email" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone (optional, for quick questions)</label>
                <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" />
              </div>
            </fieldset>

            {/* The piece */}
            <fieldset className="space-y-5 rounded-2xl border border-ink/10 bg-white p-6">
              <legend className="px-2 font-display text-xl italic">The piece</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="itemType">What should we stitch on? *</label>
                  <select id="itemType" name="itemType" required className="input" defaultValue="">
                    <option value="" disabled>Choose one…</option>
                    {ITEM_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="quantity">How many pieces?</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    max={500}
                    defaultValue={1}
                    className="input"
                  />
                  <p className="mt-1 text-xs text-ink-soft">Volume pricing kicks in at 10+.</p>
                </div>
              </div>
              <div>
                <label className="label" htmlFor="sizesColors">
                  Sizes &amp; garment colors (if you know them)
                </label>
                <input
                  id="sizesColors"
                  name="sizesColors"
                  className="input"
                  placeholder="e.g. 2x Medium in sage, 1x Large in cream"
                />
              </div>
            </fieldset>

            {/* The design */}
            <fieldset className="space-y-5 rounded-2xl border border-ink/10 bg-white p-6">
              <legend className="px-2 font-display text-xl italic">The design</legend>
              <div>
                <label className="label" htmlFor="description">
                  Describe what you&rsquo;d like us to make *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  className="input"
                  placeholder="e.g. A denim jacket with a big floral wreath on the back, with the words 'Wild at Heart' inside it. Mostly blues and creams."
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="placement">Where on the piece?</label>
                  <select id="placement" name="placement" className="input" defaultValue="">
                    <option value="">Choose one…</option>
                    {PLACEMENTS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="threadColors">Thread color preferences</label>
                  <input
                    id="threadColors"
                    name="threadColors"
                    className="input"
                    placeholder="e.g. dusty rose, sage, gold"
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="inspiration">
                  Link to a photo, logo, or inspiration (optional)
                </label>
                <input
                  id="inspiration"
                  name="inspiration"
                  className="input"
                  placeholder="Paste a link (Google Drive, Pinterest, Instagram…). Files also accepted by email reply."
                />
              </div>
            </fieldset>

            {/* Timing & budget */}
            <fieldset className="space-y-5 rounded-2xl border border-ink/10 bg-white p-6">
              <legend className="px-2 font-display text-xl italic">Timing &amp; budget</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="deadline">Need it by a date?</label>
                  <input id="deadline" name="deadline" type="date" className="input" />
                  <p className="mt-1 text-xs text-ink-soft">
                    We&rsquo;ll confirm honestly whether we can hit it.
                  </p>
                </div>
                <div>
                  <label className="label" htmlFor="budget">Rough budget</label>
                  <select id="budget" name="budget" className="input" defaultValue="">
                    <option value="">Choose one…</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
              {status === "sending" ? "Sending…" : "Get my free proof"}
            </button>
            {status === "error" && (
              <p className="text-sm font-semibold text-berry">
                Something went wrong. Please try again.
              </p>
            )}
            <p className="text-center text-xs text-ink-soft">
              No spam, no commitment. We only email you about this order.
            </p>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
