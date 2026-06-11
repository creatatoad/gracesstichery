import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

type OrderItem = { name: string; qty: number; priceCents: number };

export default async function AdminOrdersPage() {
  const [orders, requests] = await Promise.all([
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.customOrderRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  return (
    <>
      <h1 className="text-3xl italic">Orders</h1>

      <section className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders.map((o) => {
              let items: OrderItem[] = [];
              try {
                items = JSON.parse(o.itemsJson);
              } catch {
                /* legacy/corrupt rows render without item detail */
              }
              return (
                <tr key={o.id}>
                  <td className="p-3 text-ink-soft">{o.createdAt.toLocaleDateString()}</td>
                  <td className="p-3">
                    {o.name || "·"}
                    {o.email && <p className="text-xs text-ink-soft">{o.email}</p>}
                  </td>
                  <td className="p-3 text-ink-soft">
                    {items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </td>
                  <td className="p-3 font-semibold">{formatPrice(o.totalCents)}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-parchment px-2 py-0.5 text-xs font-semibold">
                      {o.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-soft">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <h2 className="mt-10 text-2xl italic">Custom order requests</h2>
      <section className="mt-4 space-y-3">
        {requests.map((r) => (
          <article key={r.id} className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">
                {r.name} <span className="font-normal text-ink-soft">· {r.email}</span>
              </p>
              <p className="text-xs text-ink-soft">
                {r.createdAt.toLocaleDateString()}
                {r.budget && ` · budget ${r.budget}`} ·{" "}
                <span className="rounded-full bg-parchment px-2 py-0.5 font-semibold">{r.status}</span>
              </p>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{r.description}</p>
          </article>
        ))}
        {requests.length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-ink-soft">
            No custom requests yet.
          </p>
        )}
      </section>
    </>
  );
}
