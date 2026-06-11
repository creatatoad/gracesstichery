import Link from "next/link";
import { formatPrice } from "@/lib/money";

type Props = {
  slug: string;
  name: string;
  priceCents: number;
  image?: { url: string; alt: string };
  badge?: string;
};

export default function ProductCard({ slug, name, priceCents, image, badge }: Props) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square bg-parchment">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt || name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">No photo yet</div>
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-berry px-3 py-1 text-xs font-bold uppercase tracking-wide text-cream">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 p-4">
        <h3 className="font-semibold leading-snug group-hover:text-berry">{name}</h3>
        <span className="shrink-0 font-display text-lg italic">{formatPrice(priceCents)}</span>
      </div>
    </Link>
  );
}
