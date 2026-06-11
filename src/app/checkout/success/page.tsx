import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "Order received" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;
  const favorites = await db.product.findMany({
    where: { status: "active", featured: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { priceCents: "asc" },
    take: 3,
  });
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-4xl italic">Thank you! 🧵</h1>
        {invoice ? (
          <p className="mt-4 text-ink-soft">
            Your order is recorded. We&rsquo;ll email you an invoice shortly. Once it&rsquo;s
            paid, we start stitching and ship within 3 to 5 days.
          </p>
        ) : (
          <p className="mt-4 text-ink-soft">
            Your payment went through and your order is in the queue. We start stitching
            today and ship within 3 to 5 days. A receipt is on its way to your inbox.
          </p>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop" className="btn-secondary">Keep browsing</Link>
          <Link href="/custom" className="btn-primary">Start a custom order</Link>
        </div>

        {favorites.length > 0 && (
          <section className="mt-16 text-left">
            <h2 className="text-center text-2xl italic">
              Know someone who&rsquo;d love one of these?
            </h2>
            <p className="mt-1 text-center text-sm text-ink-soft">
              Most of our orders started as a gift someone saw and remembered.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {favorites.map((p) => (
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
