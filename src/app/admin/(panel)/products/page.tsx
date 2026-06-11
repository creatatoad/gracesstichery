import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      channels: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl italic">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">+ New product</Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-left">
            <tr>
              <th className="p-3"> </th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Channels</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-cream">
                <td className="p-3">
                  {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt="" className="h-12 w-12 rounded-lg border border-ink/10 object-cover" />
                  )}
                </td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="font-semibold hover:text-berry">
                    {p.name}
                  </Link>
                  <p className="text-xs text-ink-soft">/{p.slug}</p>
                </td>
                <td className="p-3 font-semibold">{formatPrice(p.priceCents)}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "active" ? "bg-sage/20 text-sage" : "bg-parchment text-ink-soft"}`}
                  >
                    {p.status}
                  </span>
                  {p.featured && <span className="ml-1 text-xs text-gold">★</span>}
                </td>
                <td className="p-3 text-xs">
                  {p.channels.filter((c) => c.status === "live").map((c) => c.channel).join(", ") || (
                    <span className="text-ink-soft">·</span>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-soft">
                  No products yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
