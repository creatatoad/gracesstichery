import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/categories";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const testimonials = [
  {
    quote:
      "I sent Grace a sketch of my grandmother's handwriting and she stitched it onto a hoodie. I cried when I opened the box.",
    name: "Maya R.",
    detail: "Handwriting keepsake",
  },
  {
    quote:
      "Ordered 14 custom hats for our bachelorette weekend. Fast, gorgeous, and everyone asked where we got them.",
    name: "Kelsey T.",
    detail: "Matching hat set",
  },
  {
    quote:
      "The denim jacket is a literal piece of art. The proof process made it exactly what I imagined.",
    name: "Jordan A.",
    detail: "Statement denim jacket",
  },
  {
    quote:
      "Our cafe's logo looks sharper on these polos than it does on our sign. Reordering was literally one text.",
    name: "Sam W.",
    detail: "Team polos, 12 pieces",
  },
  {
    quote:
      "The pet portrait of our corgi is so accurate it's absurd. Best gift I have ever given my husband, full stop.",
    name: "Priya N.",
    detail: "Pet portrait crewneck",
  },
  {
    quote:
      "Baby blanket arrived two days before the shower. The name stitching is perfect and so soft. Already ordered another.",
    name: "Dana E.",
    detail: "Heirloom baby blanket",
  },
];

const occasions = [
  {
    title: "Gifts that get kept",
    body: "Handwriting keepsakes, pet portraits, baby names in script. Embroidery turns a present into an heirloom, and we gift-wrap on request.",
    href: "/shop",
    cta: "Find the gift",
  },
  {
    title: "Weddings & parties",
    body: "Matching hats for the bachelorette trip, robes for the bridal suite, totes for the welcome bags. Identical stitching across every piece.",
    href: "/custom",
    cta: "Plan your set",
  },
  {
    title: "Your business, stitched",
    body: "Logo polos, branded aprons, team caps. Free logo digitizing, volume pricing on 10+, and reorders in one message.",
    href: "/shop/workwear",
    cta: "Outfit the team",
  },
];

const faqs = [
  {
    q: "How fast will I get my order?",
    a: "We stitch every piece after you order and ship in 3 to 5 business days. Need it sooner for an event? Mention the date in a custom order request and we'll tell you honestly if we can hit it.",
  },
  {
    q: "Can you embroider my own design, logo, or handwriting?",
    a: "Yes, that's most of what we do. Send a photo, sketch, logo file, or even a napkin doodle and we'll digitize it by hand. You approve a free stitched proof before we sew anything.",
  },
  {
    q: "What if I don't love it?",
    a: "Custom work always starts with a free proof so there are no surprises. And the stitching itself is guaranteed for life: if embroidery we made ever cracks, frays, or comes loose, we repair or replace it free.",
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
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:grid-cols-2 sm:py-20">
          <div>
            <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-berry">
              Made to order · Real raised embroidery
            </p>
            <h1 className="text-4xl italic leading-tight sm:text-5xl">
              Embroidery that outlives the trend, on anything you can wear.
            </h1>
            <p className="mt-5 max-w-prose text-lg text-ink-soft">
              Hoodies, hats, totes, baby onesies, denim jackets: if it holds a stitch,
              we&rsquo;ll make it yours. Real thread that never cracks or peels,
              stitched one piece at a time and guaranteed for life.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">Shop the collection</Link>
              <Link href="/custom" className="btn-secondary">Get a free design proof</Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
              <li>✶ Ships in 3 to 5 days</li>
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

        {/* Category grid */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8 text-center">
            <h2 className="text-3xl italic">What can we stitch for you?</h2>
            <p className="mt-2 text-ink-soft">Every category, made to order and fully personalizable.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.slice(0, 8).map((c) => (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} className="aspect-square w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-berry">{c.short}</h3>
                  <p className="mt-1 text-xs leading-snug text-ink-soft">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="bg-parchment">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl italic">Customer favorites</h2>
                <p className="mt-1 text-ink-soft">The pieces people reorder, gift, and post about.</p>
              </div>
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
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl italic">From idea to heirloom in three steps</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Pick or imagine it",
                d: "Choose a piece from the shop, or tell us your idea: a sketch, a photo, a logo, handwriting. Two minutes, no commitment.",
              },
              {
                n: "2",
                t: "Approve your free proof",
                d: "We digitize the design by hand and send a proof showing exactly how it will stitch. We revise until you love it, free.",
              },
              {
                n: "3",
                t: "We stitch and ship",
                d: "Your piece is embroidered one at a time on a single-needle machine and ships in 3 to 5 days, guaranteed for life.",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-ink/10 bg-white p-7 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-berry font-display text-xl italic text-cream">
                  {s.n}
                </div>
                <h3 className="mt-4 text-xl italic">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/custom" className="btn-primary">Start with a free proof</Link>
          </div>
        </section>

        {/* Why embroidery */}
        <section className="bg-parchment">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:grid-cols-2">
            <div>
              <h2 className="text-3xl italic">Why real embroidery beats any print</h2>
              <ul className="mt-6 space-y-4 text-ink-soft">
                <li>
                  <strong className="text-ink">It never cracks, fades, or peels.</strong>{" "}
                  Vinyl and screen prints break down wash after wash. Thread is part of the
                  fabric itself, which is why vintage embroidery still looks good 50 years on.
                </li>
                <li>
                  <strong className="text-ink">You can feel the difference.</strong>{" "}
                  Raised, dense stitching reads as quality from across the room. People touch
                  it. People ask about it.
                </li>
                <li>
                  <strong className="text-ink">It's guaranteed for life.</strong>{" "}
                  If any stitching we made ever fails, we repair or replace it free. We can
                  offer that because it almost never happens.
                </li>
              </ul>
              <Link href="/care" className="mt-6 inline-block font-semibold text-berry hover:underline">
                How to care for embroidery →
              </Link>
            </div>
            <blockquote className="rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
              <p className="font-display text-xl italic leading-relaxed">
                &ldquo;{testimonials[0].quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm">
                <span className="font-semibold text-berry">{testimonials[0].name}</span>
                <span className="text-ink-soft"> · {testimonials[0].detail}</span>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* Occasions */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl italic">Whatever the occasion, we stitch for it</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {occasions.map((o) => (
              <div key={o.title} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-7 shadow-sm">
                <h3 className="text-xl italic">{o.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{o.body}</p>
                <Link href={o.href} className="mt-4 font-semibold text-berry hover:underline">
                  {o.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="bg-parchment">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-8 text-center text-3xl italic">Loved by gift-givers everywhere</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <blockquote key={t.name} className="rounded-2xl border border-ink/10 bg-white p-6">
                  <p className="text-sm leading-relaxed text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-3 text-sm">
                    <span className="font-semibold text-berry">{t.name}</span>
                    <span className="text-ink-soft"> · {t.detail}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ teaser */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-center text-3xl italic">Questions, answered</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-ink/10 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  {f.q}
                  <span className="float-right text-berry transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Link href="/faq" className="font-semibold text-berry hover:underline">
              Read all FAQs →
            </Link>
          </p>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-4">
          <div className="rounded-3xl bg-ink px-8 py-14 text-center text-cream">
            <h2 className="text-3xl italic sm:text-4xl">Don&rsquo;t see it? We&rsquo;ll stitch it.</h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/80">
              Most of what we make never appears in the shop. It starts as a photo, a sketch,
              or a half-formed idea. Tell us yours and get a free design proof before you pay
              a cent for the stitching.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/custom" className="btn-primary">Get my free proof</Link>
              <Link
                href="/shop"
                className="inline-block rounded-full border-2 border-cream px-7 py-3 font-semibold text-cream transition hover:bg-cream hover:text-ink"
              >
                Browse the shop
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
