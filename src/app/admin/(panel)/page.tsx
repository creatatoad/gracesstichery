import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, liveListings, orders, customRequests] = await Promise.all([
    db.product.count({ where: { status: "active" } }),
    db.channelListing.count({ where: { status: "live" } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.customOrderRequest.findMany({
      where: { status: "new" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);
  const revenueCents = await db.order.aggregate({
    where: { status: { in: ["paid", "fulfilled"] } },
    _sum: { totalCents: true },
  });

  const stats = [
    { label: "Active products", value: String(productCount) },
    { label: "Live channel listings", value: String(liveListings) },
    { label: "New custom requests", value: String(customRequests.length) },
    { label: "Revenue (paid)", value: formatPrice(revenueCents._sum.totalCents ?? 0) },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl italic">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-primary">+ New product</Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-sm text-ink-soft">{s.label}</p>
            <p className="mt-1 font-display text-2xl italic">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">Recent orders</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">No orders yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-ink/10 text-sm">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2">
                  <span>
                    {o.email || "Stripe checkout"}{" "}
                    <span className="rounded-full bg-parchment px-2 py-0.5 text-xs">{o.status}</span>
                  </span>
                  <span className="font-semibold">{formatPrice(o.totalCents)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/orders" className="mt-3 inline-block text-sm font-semibold text-berry hover:underline">
            All orders →
          </Link>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-semibold">New custom order requests</h2>
          {customRequests.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">No new requests.</p>
          ) : (
            <ul className="mt-3 divide-y divide-ink/10 text-sm">
              {customRequests.map((r) => (
                <li key={r.id} className="py-2">
                  <p className="font-semibold">
                    {r.name} <span className="font-normal text-ink-soft">· {r.email}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-ink-soft">{r.description}</p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/orders" className="mt-3 inline-block text-sm font-semibold text-berry hover:underline">
            All requests →
          </Link>
        </section>
      </div>
    </>
  );
}
