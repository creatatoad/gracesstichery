import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import ChannelSync from "@/components/admin/ChannelSync";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, channels: true },
  });
  if (!product) notFound();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl italic">Edit product</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href={`/products/${product.slug}`}
            className="font-semibold text-berry hover:underline"
          >
            View live page ↗
          </Link>
          <DeleteProductButton id={product.id} />
        </div>
      </div>

      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: (product.priceCents / 100).toFixed(2),
          category: product.category,
          status: product.status,
          featured: product.featured,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          tags: product.tags,
          images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
        }}
      />

      <div className="mt-6 lg:max-w-md">
        <ChannelSync
          productId={product.id}
          listings={product.channels.map((c) => ({
            channel: c.channel,
            status: c.status,
            externalId: c.externalId,
            error: c.error,
          }))}
        />
      </div>
    </>
  );
}
