import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "How fast your custom embroidery ships, what it costs, and our replacement guarantee. Made to order in 3 to 5 days, tracked shipping on every package.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl italic">Shipping &amp; returns</h1>
        <p className="mt-3 text-ink-soft">
          The short version: we stitch fast, ship tracked, and make it right if anything
          goes wrong.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl italic">Production time</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Every piece is embroidered after you order it, one at a time. Shop items go on
            the machine within 1 to 2 business days and ship within 3 to 5. Custom designs
            add a short proof step first: we send your free design proof within one business
            day, and stitching starts the moment you approve it.
          </p>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Working against a deadline? Tell us the date in your order note and we&rsquo;ll
            confirm whether we can hit it before you pay.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl italic">Shipping</h2>
          <ul className="mt-3 space-y-2 leading-relaxed text-ink-soft">
            <li>✶ Tracked shipping on every order, no exceptions.</li>
            <li>✶ Standard delivery takes 2 to 5 business days within the US.</li>
            <li>✶ You&rsquo;ll get the tracking number by email the moment the label prints.</li>
            <li>✶ Shipping internationally? <Link href="/contact" className="font-semibold text-berry hover:underline">Contact us</Link> first and we&rsquo;ll quote it.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl italic">Returns &amp; replacements</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            If your order arrives damaged, or we got something wrong, we&rsquo;ll remake or
            refund it free. Just send a photo within 14 days of delivery and we&rsquo;ll take
            care of the rest, no return postage needed.
          </p>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Because each piece is personalized and made to order, we can&rsquo;t accept
            returns for change of mind. That&rsquo;s exactly why custom work always starts
            with a free proof: you see precisely what will be stitched before paying.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl italic">The lifetime stitching guarantee</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Embroidery we make is guaranteed for the life of the garment. If the stitching
            ever cracks, frays, or comes loose, we repair or replace the piece free. We can
            offer that because real, dense embroidery almost never fails.
          </p>
        </section>

        <div className="mt-14 rounded-2xl bg-parchment p-8 text-center">
          <h2 className="text-2xl italic">Questions about an order?</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            We answer every message within one business day.
          </p>
          <Link href="/contact" className="btn-primary mt-6">Contact us</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
