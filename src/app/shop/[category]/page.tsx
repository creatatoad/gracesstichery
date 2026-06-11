import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: cat.seoTitle,
    description: cat.seoDescription,
    alternates: { canonical: `/shop/${cat.slug}` },
    openGraph: { title: cat.seoTitle, description: cat.seoDescription, images: [cat.image] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const products = await db.product.findMany({
    where: { status: "active", category: cat.slug },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${siteUrl}/shop` },
      { "@type": "ListItem", position: 2, name: cat.name, item: `${siteUrl}/shop/${cat.slug}` },
    ],
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
        />
        <nav className="mb-4 text-sm text-ink-soft">
          <Link href="/shop" className="hover:text-berry">Shop</Link> / {cat.short}
        </nav>
        <h1 className="text-4xl italic">{cat.name}</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">{cat.intro}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className="rounded-full border border-ink/20 px-4 py-1.5 text-sm font-semibold hover:border-berry"
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${c.slug === cat.slug ? "bg-ink text-cream" : "border border-ink/20 hover:border-berry"}`}
            >
              {c.short}
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
            New pieces are on the way. In the meantime,{" "}
            <Link href="/custom" className="font-semibold text-berry hover:underline">
              request a custom piece
            </Link>{" "}
            and we&rsquo;ll make exactly what you want.
          </p>
        )}

        <div className="mt-16 rounded-2xl bg-parchment p-8 text-center">
          <h2 className="text-2xl italic">Want a different design on this?</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            Everything here can be customized: colors, names, placement, or a completely new
            design. Send your idea and get a free proof. No payment until you love it.
          </p>
          <Link href="/custom" className="btn-primary mt-6">Start a custom order</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
