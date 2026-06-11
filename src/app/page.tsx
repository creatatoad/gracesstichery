import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const testimonials = [
  {
    quote:
      "I sent Grace a sketch of my grandmother's handwriting and she stitched it onto a hoodie. I cried when I opened the box.",
    name: "Maya R.",
  },
  {
    quote:
      "Ordered 14 custom hats for our bachelorette weekend. Fast, gorgeous, and everyone asked where we got them.",
    name: "Kelsey T.",
  },
  {
    quote:
      "The denim jacket is a literal piece of art. The proof process made it exactly what I imagined.",
    name: "Jordan A.",
  },
];

export default async function HomePage() {
  const featured = await db.product.findMany({
    where: { status: "active", featured: true },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:grid-cols-2 sm:py-24">
          <div>
            <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-berry">
              Made to order · Stitched by hand-guided machine
            </p>
            <h1 className="text-4xl italic leading-tight sm:text-5xl">
              Embroidery that outlives the trend — on anything you can wear.
            </h1>
            <p className="mt-5 max-w-prose text-lg text-ink-soft">
              Hoodies, hats, totes, baby onesies, denim jackets — if it holds a stitch,
              we&rsquo;ll make it yours. Real raised embroidery that never cracks or peels,
              made one piece at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">Shop the collection</Link>
              <Link href="/custom" className="btn-secondary">Start a custom order</Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
              <li>✶ Ships in 3–5 days</li>
              <li>✶ Free design proof</li>
              <li>✶ Stitching guaranteed for life</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 4).map((p, i) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className={`overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:shadow-lg ${i % 2 ? "translate-y-6" : ""}`}
              >
                {p.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0].url} alt={p.images[0].alt || p.name} className="aspect-square w-full object-cover" />
                )}
              </Link>
            ))}
          </div>
        </section>

        <div className="stitch-divider mx-auto max-w-6xl" />

        {/* Featured products */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl italic">Customer favorites</h2>
            <Link href="/shop" className="font-semibold text-berry hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                priceCents={p.priceCents}
                image={p.images[0]}
                badge="Best seller"
              />
            ))}
          </div>
        </section>

        {/* Custom order CTA */}
        <section className="bg-parchment">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:grid-cols-2">
            <div>
              <h2 className="text-3xl italic">Don&rsquo;t see it? We&rsquo;ll stitch it.</h2>
              <p className="mt-4 text-ink-soft">
                Most of what we make never appears in the shop — it starts as a photo, a
                sketch, or a half-formed idea in someone&rsquo;s head. Tell us what you&rsquo;re
                imagining and we&rsquo;ll send a free design proof before you pay a cent for
                the stitching.
              </p>
              <ol className="mt-6 space-y-3 text-sm">
                <li><strong>1. Tell us your idea</strong> — two minutes, no commitment.</li>
                <li><strong>2. Approve your free proof</strong> — we digitize and show you exactly how it will stitch.</li>
                <li><strong>3. We make it</strong> — and it ships in 3–5 days.</li>
              </ol>
              <Link href="/custom" className="btn-primary mt-8">Get my free proof</Link>
            </div>
            <blockquote className="rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
              <p className="font-display text-xl italic leading-relaxed">
                &ldquo;{testimonials[0].quote}&rdquo;
              </p>
              <footer className="mt-4 font-semibold text-berry">— {testimonials[0].name}</footer>
            </blockquote>
          </div>
        </section>

        {/* Social proof */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-center text-3xl italic">Loved by gift-givers everywhere</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="rounded-2xl border border-ink/10 bg-white p-6">
                <p className="text-sm leading-relaxed text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-3 text-sm font-semibold text-berry">— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
