"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "./cart";

export default function AddToCart({ item }: { item: Omit<CartItem, "qty"> }) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="btn-primary"
        onClick={() => {
          add(item);
          router.push("/cart");
        }}
      >
        Buy now
      </button>
      <button
        className="btn-secondary"
        onClick={() => {
          add(item);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}
