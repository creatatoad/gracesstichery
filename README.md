# Grace's Stitchery

E-commerce site for Grace's Stitchery — custom machine-embroidered apparel, made to order.
Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma (SQLite), Stripe, and the
Anthropic API.

## What's included

**Storefront (built to convert)**
- Home page with hero, best-sellers, social proof, and a "we'll stitch anything" custom-order funnel
- `/shop` with category filters, `/products/[slug]` detail pages with buy-now + add-to-cart
- `/gallery` portfolio of finished work, `/custom` free-design-proof request form, `/about`
- Cart with persistent localStorage state and Stripe Checkout (falls back to an
  email-invoice flow when Stripe isn't configured yet, so the site sells from day one)
- SEO throughout: per-product titles/meta/keywords, Open Graph, Product JSON-LD
  structured data, `sitemap.xml`, `robots.txt`

**Admin (`/admin`, password-protected)**
- Dashboard: revenue, orders, custom requests, live channel listings
- Product manager: create/edit/delete, multi-image upload, drafts, featured flags
- **AI listing writer**: one click drafts the description, SEO title, meta description, and
  keyword tags with Claude — it even looks at the product photo. Works without an API key
  too (falls back to a built-in template).
- **Multi-channel publishing**: push a product to Etsy, TikTok Shop, and a generic webhook
  (Zapier/Make → Shopify, Square, Instagram, anything) simultaneously, with per-channel
  status tracking and one-click re-sync after edits.
- Orders + custom-request inbox

## Quick start

```bash
npm install
npm run setup     # creates the SQLite db and seeds 6 sample products
npm run dev       # http://localhost:3000
```

Then create `.env.local` (see `.env.example` for everything) and set at minimum:

```bash
ADMIN_PASSWORD="choose-a-long-password"   # unlocks /admin
```

Optional but recommended:

| Variable | Enables |
|---|---|
| `STRIPE_SECRET_KEY` | Real card checkout (otherwise orders are recorded for manual invoicing) |
| `ANTHROPIC_API_KEY` | AI-written descriptions & SEO in the admin |
| `ETSY_API_KEY` / `ETSY_ACCESS_TOKEN` / `ETSY_SHOP_ID` | One-click publish to Etsy |
| `TIKTOK_APP_KEY` / `TIKTOK_APP_SECRET` / `TIKTOK_ACCESS_TOKEN` / `TIKTOK_SHOP_CIPHER` | One-click publish to TikTok Shop |
| `WEBHOOK_SYNC_URL` | Fan out to any other shop via Zapier / Make / n8n |
| `NEXT_PUBLIC_SITE_URL` | Correct absolute URLs in sitemap, JSON-LD, and channel payloads |

## Replacing the placeholder logo

The committed logo is a placeholder. Drop your real files over:

- `public/logo.svg` — full horizontal logo (header + footer)
- `public/logo-mark.svg` — square mark
- `src/app/icon.svg` — favicon

PNG/JPG work too — just update the file extension in `src/components/Logo.tsx`.

## Adding a product (the daily workflow)

1. `/admin` → **Products** → **New product**
2. Type the name + price, upload photos
3. Hit **✨ Generate with AI** — review the description/SEO it writes, tweak if you like
4. **Create product** — it's instantly live on the site with full SEO
5. In the **Sell everywhere** panel, tick Etsy / TikTok / webhook and hit **Publish** —
   the same listing goes out to every connected shop at once. Edit later and hit it again
   to update them all.

## Architecture notes

- **Database**: SQLite via Prisma for zero-config dev. For production Postgres, change the
  `provider` in `prisma/schema.prisma` and `DATABASE_URL`, then `npx prisma db push`.
- **Images** are stored in `public/uploads/`. On serverless hosts (Vercel), swap
  `src/app/api/admin/upload/route.ts` to write to blob storage (Vercel Blob / S3) — it's
  the only file that touches disk.
- **Channel adapters** live in `src/lib/channels/`. Each implements a tiny
  `ChannelAdapter` interface (`isConfigured` / `publish` / `update`); add a new marketplace
  by dropping in one file and registering it in `index.ts`. Results are recorded per
  product in the `ChannelListing` table.
- **Payments**: order totals are always re-priced server-side from the database — client
  prices are never trusted. Paid status can be confirmed via the Stripe dashboard or by
  adding a webhook handler for `checkout.session.completed` (order ids are stored in
  session metadata).

## Deploying

Any Node host works (Railway, Render, Fly.io, a VPS):

```bash
npm run build   # runs prisma generate + next build
npm start
```

Run `npx prisma db push && npx tsx prisma/seed.ts` once on first deploy. For Vercel,
switch to Postgres + blob storage as noted above.
