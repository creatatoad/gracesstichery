import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Grace's Stitchery | Custom Embroidered Apparel, Made to Order",
    template: "%s | Grace's Stitchery",
  },
  description:
    "Custom machine embroidery on hoodies, tees, hats, totes, baby gifts and more. Real stitching that never cracks or peels, made to order and guaranteed for life.",
  keywords: [
    "custom embroidery",
    "embroidered apparel",
    "personalized gifts",
    "monogram hoodie",
    "embroidered hat",
    "pet portrait embroidery",
    "logo embroidery",
    "made to order",
  ],
  openGraph: {
    siteName: "Grace's Stitchery",
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "Grace's Stitchery",
  url: siteUrl,
  logo: `${siteUrl}/logo.svg`,
  description:
    "Custom machine embroidery on apparel, bags, baby gifts and home goods. Made to order, guaranteed for life.",
  slogan: "Embroidery that outlives the trend.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
