"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "./cart";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Our Work" },
  { href: "/custom", label: "Custom Orders" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <Link href="/" aria-label="Grace's Stitchery home">
          <Logo className="h-14 w-auto sm:h-16" />
        </Link>
        <nav className="hidden items-center gap-6 font-medium sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-berry">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative rounded-full border-2 border-ink px-4 py-1.5 font-semibold transition hover:bg-ink hover:text-cream"
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-berry text-xs font-bold text-cream">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
      <nav className="flex justify-center gap-5 border-t border-ink/10 px-4 py-2 text-sm font-medium sm:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-berry">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
