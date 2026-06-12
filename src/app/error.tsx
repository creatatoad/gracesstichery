"use client";

import Link from "next/link";

// Friendly catch-all so customers never see a raw stack trace. The most
// common cause in production is the database being unreachable (for the shop
// owner: check DATABASE_URL on your host and redeploy).
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Grace's Stitchery" className="h-14" />
      <h1 className="mt-8 font-display text-3xl italic text-ink">
        We dropped a stitch.
      </h1>
      <p className="mt-3 max-w-md text-ink-soft">
        Something went wrong loading this page. It&rsquo;s on our side, not yours —
        please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-secondary">
          Back to the shop
        </Link>
      </div>
      <p className="mt-10 text-xs text-ink-soft/70">
        Shop owner? If this keeps happening, make sure DATABASE_URL is set on your
        host (Vercel: Storage → Neon) and redeploy.
      </p>
    </main>
  );
}
