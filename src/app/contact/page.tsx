"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form) as Record<string, string>;
    const res = await fetch("/api/custom-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        description: `[Contact message] ${data.message}`,
      }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl italic">Get in touch</h1>
        <p className="mt-3 text-ink-soft">
          Questions about an order, a deadline, a bulk run, or whether we can stitch
          something unusual? (We probably can.) Send a note and we&rsquo;ll reply within one
          business day.
        </p>

        {status === "done" ? (
          <div className="mt-10 rounded-2xl border-2 border-sage bg-white p-8 text-center">
            <h2 className="text-2xl italic">Message received! 🧵</h2>
            <p className="mt-2 text-ink-soft">
              Thanks for reaching out. Watch your inbox; we reply within one business day.
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
              <label className="label" htmlFor="message">How can we help?</label>
              <textarea id="message" name="message" required rows={6} className="input" />
            </div>
            <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "error" && (
              <p className="text-sm font-semibold text-berry">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        <div className="mt-14 rounded-2xl bg-parchment p-8 text-center">
          <h2 className="text-2xl italic">Have a design in mind already?</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            Skip the small talk and go straight to a free design proof.
          </p>
          <Link href="/custom" className="btn-primary mt-6">Start a custom order</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
