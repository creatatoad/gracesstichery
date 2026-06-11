import Link from "next/link";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-parchment">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="h-20 w-auto" />
          <p className="mt-2 text-sm text-ink-soft">
            Custom machine embroidery on whatever you can wear, and a few things you
            can&rsquo;t. Every piece made to order, one at a time.
          </p>
        </div>
        <div className="text-sm">
          <h4 className="mb-2 font-semibold uppercase tracking-wide text-ink-soft">Shop</h4>
          <ul className="space-y-1.5">
            <li><Link href="/shop" className="hover:text-berry">All products</Link></li>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="hover:text-berry">{c.short}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="mb-2 font-semibold uppercase tracking-wide text-ink-soft">Help</h4>
          <ul className="space-y-1.5">
            <li><Link href="/custom" className="hover:text-berry">Request a custom order</Link></li>
            <li><Link href="/faq" className="hover:text-berry">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-berry">Shipping &amp; returns</Link></li>
            <li><Link href="/care" className="hover:text-berry">Embroidery care guide</Link></li>
            <li><Link href="/contact" className="hover:text-berry">Contact us</Link></li>
            <li><Link href="/gallery" className="hover:text-berry">Gallery of our work</Link></li>
            <li><Link href="/about" className="hover:text-berry">About Grace</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="mb-2 font-semibold uppercase tracking-wide text-ink-soft">Promise</h4>
          <ul className="space-y-1.5 text-ink-soft">
            <li>✶ Free design proof on custom work</li>
            <li>✶ Embroidery guaranteed for life</li>
            <li>✶ Made to order in 3 to 5 days</li>
            <li>✶ Questions? We reply within a day</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} Grace&rsquo;s Stitchery ·{" "}
        <Link href="/admin" className="hover:text-berry">Shop admin</Link>
      </div>
    </footer>
  );
}
