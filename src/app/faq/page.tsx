import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ: Custom Embroidery Questions, Answered",
  description:
    "Turnaround times, custom designs, sizing, bulk orders, returns and care. Everything you want to know before ordering custom embroidery from Grace's Stitchery.",
  alternates: { canonical: "/faq" },
};

const sections: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Ordering & turnaround",
    items: [
      {
        q: "How long does my order take?",
        a: "Every piece is stitched after you order. Shop items ship in 3 to 5 business days. Custom designs add a day or two for the proof process. Standard shipping takes 2 to 5 days on top of that.",
      },
      {
        q: "I need it by a specific date. Can you rush it?",
        a: "Often, yes. Put the date in your order note or custom request and we'll tell you honestly whether we can hit it before you pay anything.",
      },
      {
        q: "Can I order in bulk for a team, wedding, or event?",
        a: "Absolutely, matching sets are one of our favorite things to make. Pricing drops automatically at 10+ pieces and we keep the stitching identical across the whole run. Start a custom request with your quantity and date.",
      },
      {
        q: "What payment methods do you accept?",
        a: "All major credit and debit cards through our secure checkout. For large team or corporate orders we can also invoice you directly.",
      },
    ],
  },
  {
    title: "Custom designs",
    items: [
      {
        q: "Can you embroider my own design, logo, or artwork?",
        a: "Yes, that's most of what we do. Send a photo, sketch, logo file, or even a napkin doodle and we'll digitize it into stitches by hand. You approve a free proof before we sew anything.",
      },
      {
        q: "Can you stitch handwriting?",
        a: "Yes, and it's our most sentimental bestseller. Send a clear photo of the handwriting and we preserve every loop and wobble exactly as written.",
      },
      {
        q: "Can you do pet portraits?",
        a: "We can. Send one or two clear photos of your pet's face. We hand-digitize the likeness and send a stitched proof for approval, so the crooked ear and the judgmental eyebrows make it in.",
      },
      {
        q: "What does a design proof cost?",
        a: "Nothing. Every custom order includes a free digital proof showing exactly how your design will stitch, with free revisions until you love it. You only pay once you approve.",
      },
    ],
  },
  {
    title: "Quality & care",
    items: [
      {
        q: "How is embroidery better than printing?",
        a: "Thread becomes part of the fabric, so it never cracks, fades, or peels the way vinyl and screen prints do. It also looks and feels noticeably more premium. Vintage embroidery from 50 years ago still holds up, and ours is stitched denser than most.",
      },
      {
        q: "How do I wash embroidered items?",
        a: "Machine wash cold, inside out, and skip the bleach. Tumble dry low or hang dry. That's it. Our full care guide has the details for delicate pieces.",
      },
      {
        q: "What is the lifetime stitching guarantee?",
        a: "If embroidery we made ever cracks, frays, or comes loose, we repair or replace the piece free, forever. Normal garment wear isn't covered, but the stitching is, for life.",
      },
    ],
  },
  {
    title: "Shipping & returns",
    items: [
      {
        q: "Where do you ship?",
        a: "Anywhere in the United States, with tracking on every order. Reach out before ordering if you're international and we'll quote shipping for you.",
      },
      {
        q: "What's your return policy?",
        a: "If something arrives damaged or we made an error, we replace it free, no questions. Because every piece is personalized and made to order, we can't accept returns for change of mind, which is exactly why we proof custom work before stitching.",
      },
      {
        q: "Do you gift wrap?",
        a: "Yes. Leave a note at checkout and we'll wrap the piece and include a handwritten card with your message, free.",
      },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections.flatMap((s) =>
      s.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    ),
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <h1 className="text-4xl italic">Frequently asked questions</h1>
        <p className="mt-3 text-ink-soft">
          Everything you might want to know before ordering. Not covered here?{" "}
          <Link href="/contact" className="font-semibold text-berry hover:underline">
            Ask us directly
          </Link>{" "}
          and we&rsquo;ll reply within a business day.
        </p>

        {sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-2xl italic">{s.title}</h2>
            <div className="mt-4 space-y-4">
              {s.items.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-ink/10 bg-white p-5">
                  <summary className="cursor-pointer list-none font-semibold">
                    {f.q}
                    <span className="float-right text-berry transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-14 rounded-2xl bg-parchment p-8 text-center">
          <h2 className="text-2xl italic">Ready when you are</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            Browse the collection or send us your idea. Either way, you&rsquo;ll have something
            stitched just for you within the week.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn-primary">Shop now</Link>
            <Link href="/custom" className="btn-secondary">Start a custom order</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
