import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Order received" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-4xl italic">Thank you! 🧵</h1>
        {invoice ? (
          <p className="mt-4 text-ink-soft">
            Your order is recorded. We&rsquo;ll email you an invoice shortly — once it&rsquo;s
            paid, we start stitching and ship within 3–5 days.
          </p>
        ) : (
          <p className="mt-4 text-ink-soft">
            Your payment went through and your order is in the queue. We start stitching
            today and ship within 3–5 days. A receipt is on its way to your inbox.
          </p>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop" className="btn-secondary">Keep browsing</Link>
          <Link href="/custom" className="btn-primary">Start a custom order</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
