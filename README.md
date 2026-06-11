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
cp .env.example .env   # then fill in DATABASE_URL and ADMIN_PASSWORD
npm run dev            # http://localhost:3000
```

Two variables are required:

```bash
DATABASE_URL="postgresql://…"             # any Postgres — free one at https://neon.tech
ADMIN_PASSWORD="choose-a-long-password"   # this IS the /admin login (no username)
```

`npm run dev` and `npm run build` automatically create the database tables and
seed six starter products if the store is empty — no separate setup step.

Optional but recommended:

| Variable | Enables |
|---|---|
| `STRIPE_SECRET_KEY` | Real card checkout (otherwise orders are recorded for manual invoicing) |
| `ANTHROPIC_API_KEY` | AI-written descriptions & SEO in the admin |
| `ETSY_API_KEY` / `ETSY_ACCESS_TOKEN` / `ETSY_SHOP_ID` | One-click publish to Etsy |
| `TIKTOK_APP_KEY` / `TIKTOK_APP_SECRET` / `TIKTOK_ACCESS_TOKEN` / `TIKTOK_SHOP_CIPHER` | One-click publish to TikTok Shop |
| `WEBHOOK_SYNC_URL` | Fan out to any other shop via Zapier / Make / n8n |
| `NEXT_PUBLIC_SITE_URL` | Correct absolute URLs in sitemap, JSON-LD, and channel payloads |

## Logo files

The real brand artwork lives in `public/` under URL-safe names:

- `public/logo.svg` — full-color mark (header + footer, light backgrounds)
- `public/logo-dark.svg` — single-color ink version
- `public/logo-white.svg` — white version for dark backgrounds
- `public/logo-mark.svg` — small square mark, `src/app/icon.svg` — favicon

`src/components/Logo.tsx` takes a `variant` prop (`color` | `dark` | `white`).

## Adding a product (the daily workflow)

1. `/admin` → **Products** → **New product**
2. Type the name + price, upload photos
3. Hit **✨ Generate with AI** — review the description/SEO it writes, tweak if you like
4. **Create product** — it's instantly live on the site with full SEO
5. In the **Sell everywhere** panel, tick Etsy / TikTok / webhook and hit **Publish** —
   the same listing goes out to every connected shop at once. Edit later and hit it again
   to update them all.

## Architecture notes

- **Database**: Postgres via Prisma. `scripts/db.mjs` (run automatically before
  dev/build) pushes the schema and seeds starter products when the store is empty.
- **Images**: uploads go to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (Vercel
  sets it when you connect a Blob store), otherwise to `public/uploads/` on disk.
- **Channel adapters** live in `src/lib/channels/`. Each implements a tiny
  `ChannelAdapter` interface (`isConfigured` / `publish` / `update`); add a new marketplace
  by dropping in one file and registering it in `index.ts`. Results are recorded per
  product in the `ChannelListing` table.
- **Payments**: order totals are always re-priced server-side from the database — client
  prices are never trusted. Paid status can be confirmed via the Stripe dashboard or by
  adding a webhook handler for `checkout.session.completed` (order ids are stored in
  session metadata).

## Deploying to Vercel

1. **Database** — in your Vercel project: **Storage → Create Database → Neon**
   (free tier). Connect it to the project; this sets `DATABASE_URL` for you.
2. **Images** — **Storage → Create Database → Blob** and connect it; this sets
   `BLOB_READ_WRITE_TOKEN` so product photo uploads work.
3. **Admin login** — **Settings → Environment Variables**: add `ADMIN_PASSWORD`
   (this is the password for `/admin` — there is no username) and optionally the
   Stripe / Anthropic / Etsy / TikTok keys from the table above.
4. **Redeploy** (Deployments → ⋯ → Redeploy). The build pushes the schema to the
   database and seeds starter products automatically.

Any other Node host (Railway, Render, Fly.io, a VPS) works the same way:
set the env vars, then `npm run build && npm start`.
