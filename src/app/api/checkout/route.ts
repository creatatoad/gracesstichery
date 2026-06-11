import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

type CheckoutItem = { productId: string; qty: number };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const items: CheckoutItem[] = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Always price from the database — never trust client-side prices.
  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, status: "active" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  const lines = items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return [];
    const qty = Math.max(1, Math.min(99, Math.floor(item.qty)));
    return [{ product, qty }];
  });
  if (lines.length === 0) {
    return NextResponse.json({ error: "Those items are no longer available" }, { status: 400 });
  }

  const totalCents = lines.reduce((n, l) => n + l.product.priceCents * l.qty, 0);
  const itemsJson = JSON.stringify(
    lines.map((l) => ({
      productId: l.product.id,
      name: l.product.name,
      qty: l.qty,
      priceCents: l.product.priceCents,
    })),
  );

  const site = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const stripe = getStripe();

  if (stripe) {
    const order = await db.order.create({
      data: { status: "pending", totalCents, itemsJson },
    });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: "usd",
          unit_amount: l.product.priceCents,
          product_data: {
            name: l.product.name,
            ...(l.product.images[0]
              ? { images: [`${site}${l.product.images[0].url}`] }
              : {}),
          },
        },
      })),
      success_url: `${site}/checkout/success`,
      cancel_url: `${site}/cart`,
      metadata: { orderId: order.id },
    });
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });
    return NextResponse.json({ url: session.url, clearCart: true });
  }

  // No Stripe configured: record the order and invoice by email instead.
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!email) {
    return NextResponse.json({ needsContact: true });
  }
  await db.order.create({
    data: { status: "invoice_requested", totalCents, itemsJson, email, name },
  });
  return NextResponse.json({ url: "/checkout/success?invoice=1", clearCart: true });
}
