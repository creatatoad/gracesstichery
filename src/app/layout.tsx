import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Grace's Stitchery — Custom Embroidered Apparel, Made to Order",
    template: "%s | Grace's Stitchery",
  },
  description:
    "Custom machine embroidery on hoodies, tees, hats, totes, baby clothes and more. Real stitching that lasts — made to order by Grace's Stitchery.",
  openGraph: {
    siteName: "Grace's Stitchery",
    type: "website",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
