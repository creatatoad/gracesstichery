"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      className="rounded-full border border-berry/40 px-3 py-1 text-berry hover:bg-berry hover:text-cream"
      onClick={async () => {
        if (!confirm("Delete this product? This can't be undone.")) return;
        await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        router.push("/admin/products");
        router.refresh();
      }}
    >
      Delete
    </button>
  );
}
