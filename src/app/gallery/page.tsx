import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Work — Embroidery Gallery",
  description:
    "A look at custom embroidery stitched by Grace's Stitchery — monograms, florals, portraits, and one-of-a-kind pieces.",
};

export default async function GalleryPage() {
  const images = await db.productImage.findMany({
    where: { product: { status: "active" } },
    include: { product: { select: { slug: true, name: true } } },
    orderBy: { product: { createdAt: "desc" } },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl italic">Our Work</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Every piece below was stitched in our studio. Click anything to shop it — or use it
          as inspiration for your own custom order.
        </p>

        <div className="mt-8 columns-2 gap-4 sm:columns-3 [&>a]:mb-4 [&>a]:block">
          {images.map((img) => (
            <Link key={img.id} href={`/products/${img.product.slug}`} className="group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || img.product.name}
                className="w-full rounded-2xl border border-ink/10 transition group-hover:opacity-90"
              />
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-parchment p-8 text-center">
          <h2 className="text-2xl italic">Picture your idea here</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            Send us a sketch, a photo, or just a sentence. We&rsquo;ll turn it into a free
            stitch-ready proof.
          </p>
          <Link href="/custom" className="btn-primary mt-6">Start a custom order</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
