import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Grace",
  description:
    "The story behind Grace's Stitchery — a one-woman custom embroidery studio making apparel that lasts.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl italic">Hi, I&rsquo;m Grace.</h1>
        <div className="mt-6 space-y-5 leading-relaxed text-ink-soft">
          <p>
            Grace&rsquo;s Stitchery started the way most good things do — with a gift. A
            monogrammed hoodie for my sister turned into requests from her friends, which
            turned into a waiting list, which turned into this shop.
          </p>
          <p>
            Everything here is made to order in my studio. I digitize every design myself,
            stitch by stitch, which is why I can put embroidery on basically anything:
            hoodies, hats, totes, baby clothes, denim jackets, and plenty of things people
            haven&rsquo;t thought to ask for yet.
          </p>
          <p>
            Real embroidery is different from a printed design. It&rsquo;s raised. It catches
            the light. It survives a hundred washes and still looks intentional. That&rsquo;s
            why I guarantee my stitching for the life of the garment — if it ever fails,
            I&rsquo;ll fix it for free.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/shop" className="btn-primary">Shop the collection</Link>
          <Link href="/custom" className="btn-secondary">Bring me your idea</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
