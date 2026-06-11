import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Logo from "@/components/Logo";
import LogoutButton from "./LogoutButton";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <>
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin">
            <Logo className="h-9" />
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/admin" className="hover:text-berry">Dashboard</Link>
            <Link href="/admin/products" className="hover:text-berry">Products</Link>
            <Link href="/admin/orders" className="hover:text-berry">Orders</Link>
            <Link href="/" className="text-ink-soft hover:text-berry">View site ↗</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
