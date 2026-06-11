import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How to Care for Embroidered Clothing",
  description:
    "Wash, dry and store embroidered apparel so the stitching looks new for decades. Simple care guide from the makers at Grace's Stitchery.",
  alternates: { canonical: "/care" },
};

export default function CarePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl italic">Caring for your embroidery</h1>
        <p className="mt-3 text-ink-soft">
          Real embroidery is tougher than any print, and a little care keeps it looking
          freshly stitched for decades. Here&rsquo;s everything we tell our own families.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl italic">Washing</h2>
          <ul className="mt-3 space-y-2 leading-relaxed text-ink-soft">
            <li>✶ Turn the garment inside out. This is the single biggest thing you can do.</li>
            <li>✶ Machine wash cold on a gentle cycle with a mild detergent.</li>
            <li>✶ Skip bleach and fabric softener; both are hard on thread over time.</li>
            <li>✶ Hand wash delicate pieces like linens and baby blankets when you can.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl italic">Drying</h2>
          <ul className="mt-3 space-y-2 leading-relaxed text-ink-soft">
            <li>✶ Hang dry or lay flat for the longest life.</li>
            <li>✶ Tumble dry low is fine for everyday pieces like tees and hoodies.</li>
            <li>✶ Avoid high heat; it&rsquo;s the fabric that suffers before the thread does.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl italic">Ironing &amp; storage</h2>
          <ul className="mt-3 space-y-2 leading-relaxed text-ink-soft">
            <li>✶ Iron inside out, or place a thin cloth between the iron and the stitching.</li>
            <li>✶ Never iron directly on the embroidery; pressing flattens the raised texture.</li>
            <li>✶ Store folded or hung as usual. Thread doesn&rsquo;t need special treatment.</li>
            <li>✶ If a loose thread ever appears, don&rsquo;t pull it. Snip it, or send it to us and we&rsquo;ll fix it free under the lifetime guarantee.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl italic">Hats &amp; structured pieces</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Spot clean caps with a damp cloth and mild soap rather than machine washing,
            which can warp the brim. The embroidery itself can handle anything; it&rsquo;s
            the hat we&rsquo;re protecting.
          </p>
        </section>

        <div className="mt-14 rounded-2xl bg-parchment p-8 text-center">
          <h2 className="text-2xl italic">Stitching guaranteed for life</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            If embroidery we made ever cracks, frays, or comes loose, we repair or replace it
            free. That&rsquo;s the whole policy.
          </p>
          <Link href="/shop" className="btn-primary mt-6">Shop the collection</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
