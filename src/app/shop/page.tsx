import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Custom Embroidered Apparel",
  description:
    "Browse made-to-order embroidered hoodies, tees, hats, totes, baby clothes and more from Grace's Stitchery.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await db.product.findMany({
    where: { status: "active", ...(category ? { category } : {}) },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const categories = await db.product.findMany({
    where: { status: "active" },
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl italic">The Collection</h1>
        <p className="mt-2 text-ink-soft">
          Everything is made to order — pick a piece, then tell us how to personalize it.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${!category ? "bg-ink text-cream" : "border border-ink/20 hover:border-berry"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.category}
              href={`/shop?category=${encodeURIComponent(c.category)}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${category === c.category ? "bg-ink text-cream" : "border border-ink/20 hover:border-berry"}`}
            >
              {c.category}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              priceCents={p.priceCents}
              image={p.images[0]}
              badge={p.featured ? "Best seller" : undefined}
            />
          ))}
        </div>

        {products.length === 0 && (
          <p className="mt-12 text-center text-ink-soft">
            Nothing here yet — check back soon, or{" "}
            <Link href="/custom" className="font-semibold text-berry hover:underline">
              request a custom piece
            </Link>
            .
          </p>
        )}

        <div className="mt-16 rounded-2xl bg-parchment p-8 text-center">
          <h2 className="text-2xl italic">Want something that isn&rsquo;t listed?</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            We embroider on whatever apparel you can think of. Send your idea and get a free
            design proof — no payment until you love it.
          </p>
          <Link href="/custom" className="btn-primary mt-6">Start a custom order</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
