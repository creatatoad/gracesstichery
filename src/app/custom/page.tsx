"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
          Tell us what you&rsquo;re imagining — a name, a drawing, a pet, your grandmother&rsquo;s
          handwriting. We&rsquo;ll reply within one business day with a{" "}
          <strong className="text-ink">free design proof</strong>. You pay nothing until you
          approve it.
        </p>

        {status === "done" ? (
          <div className="mt-10 rounded-2xl border-2 border-sage bg-white p-8 text-center">
            <h2 className="text-2xl italic">Got it! 🧵</h2>
            <p className="mt-2 text-ink-soft">
              Your idea is in the queue. Watch your inbox — your free proof is on its way
              within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Your name</label>
                <input id="name" name="name" required className="input" autoComplete="name" />
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required className="input" autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="description">
                What would you like us to make?
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
            <div>
              <label className="label" htmlFor="budget">Rough budget (optional)</label>
              <input id="budget" name="budget" className="input" placeholder="e.g. $50–100" />
            </div>
            <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
              {status === "sending" ? "Sending…" : "Get my free proof"}
            </button>
            {status === "error" && (
              <p className="text-sm font-semibold text-berry">
                Something went wrong — please try again.
              </p>
            )}
            <p className="text-xs text-ink-soft">
              No spam, no commitment. We only email you about this order.
            </p>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
