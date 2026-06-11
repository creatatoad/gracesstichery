import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import { categoryLabel, getCategory } from "@/lib/categories";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  return db.product.findFirst({
    where: { slug, status: "active" },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description.slice(0, 160),
    keywords: product.tags.split(",").map((t) => t.trim()).filter(Boolean),
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description.slice(0, 160),
      images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  // Prefer pieces from the same category, then best sellers.
  const candidates = await db.product.findMany({
    where: { status: "active", id: { not: product.id } },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: { featured: "desc" },
    take: 12,
  });
  const related = [...candidates]
    .sort(
      (a, b) =>
        Number(b.category === product.category) - Number(a.category === product.category),
    )
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${siteUrl}/shop` },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel(product.category),
        item: `${siteUrl}/shop/${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seoDescription || product.description,
    image: product.images.map((i) => `${siteUrl}${i.url}`),
    brand: { "@type": "Brand", name: "Grace's Stitchery" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <nav className="mb-6 text-sm text-ink-soft">
          <Link href="/shop" className="hover:text-berry">Shop</Link> /{" "}
          {getCategory(product.category) ? (
            <Link href={`/shop/${product.category}`} className="hover:text-berry">
              {categoryLabel(product.category)}
            </Link>
          ) : (
            <span className="capitalize">{product.category}</span>
          )}{" "}
          / {product.name}
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            {product.images.length > 0 ? (
              product.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt || product.name}
                  className="w-full rounded-2xl border border-ink/10 bg-parchment object-cover"
                />
              ))
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-parchment text-ink-soft">
                Photos coming soon
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <h1 className="text-3xl italic sm:text-4xl">{product.name}</h1>
            <p className="mt-3 font-display text-3xl italic text-berry">
              {formatPrice(product.priceCents)}
            </p>
            <div className="mt-6 space-y-4 whitespace-pre-line leading-relaxed text-ink-soft">
              {product.description}
            </div>

            <div className="mt-8">
              <AddToCart
                item={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceCents: product.priceCents,
                  image: product.images[0]?.url ?? "",
                }}
              />
            </div>

            <ul className="mt-8 space-y-2 rounded-2xl bg-parchment p-5 text-sm">
              <li>✶ <strong>Made to order:</strong> stitched after you purchase, ships in 3 to 5 days</li>
              <li>✶ <strong>Real embroidery:</strong> raised thread that never cracks or peels</li>
              <li>✶ <strong>Guaranteed for life:</strong> if stitching ever fails, we fix it free</li>
              <li>✶ <strong>Tracked shipping</strong> on every order · <Link href="/shipping" className="font-semibold text-berry hover:underline">details</Link></li>
              <li>✶ <strong>Easy care:</strong> machine washable · <Link href="/care" className="font-semibold text-berry hover:underline">care guide</Link></li>
              <li>
                ✶ Want changes (colors, names, placement)?{" "}
                <Link href="/custom" className="font-semibold text-berry hover:underline">
                  Request them here
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 text-2xl italic">You might also love</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  priceCents={p.priceCents}
                  image={p.images[0]}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
