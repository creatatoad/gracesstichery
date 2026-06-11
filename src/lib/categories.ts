// Category registry: powers the shop filters, the SEO landing pages at
// /shop/[category], the homepage category grid, and the sitemap.
// Products can use any category string; ones listed here get rich pages.

export type Category = {
  slug: string;
  name: string;
  /** Short label for grids and chips. */
  short: string;
  /** One-liner used on cards and under headings. */
  tagline: string;
  /** Intro paragraph for the category landing page (SEO copy). */
  intro: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "hoodies",
    name: "Embroidered Hoodies",
    short: "Hoodies",
    tagline: "Heavyweight comfort with stitching that lasts a lifetime.",
    intro:
      "Our hoodies are the pieces customers wear until the cuffs fray, and the embroidery still looks brand new. Every design is stitched in dense, raised thread, never printed, so it won't crack or peel no matter how many times it goes through the wash. Pick a design from the collection or send us your own idea for a free proof.",
    seoTitle: "Custom Embroidered Hoodies, Made to Order",
    seoDescription:
      "Personalized embroidered hoodies with monograms, names, florals, or your own design. Real stitching that never peels. Made to order, ships in 3 to 5 days.",
    image: "/uploads/seed/hoodie.svg",
  },
  {
    slug: "sweatshirts",
    name: "Embroidered Sweatshirts & Crewnecks",
    short: "Sweatshirts",
    tagline: "Crewnecks made personal: pets, handwriting, names, anything.",
    intro:
      "From pet portraits to a loved one's handwriting stitched in thread, our crewneck sweatshirts are the most-gifted pieces we make. Each one is digitized by hand and embroidered one at a time, so the details that matter to you come through stitch by stitch.",
    seoTitle: "Custom Embroidered Sweatshirts & Crewnecks",
    seoDescription:
      "Custom crewneck sweatshirts with embroidered pet portraits, handwriting, names and more. Hand-digitized, made to order. The gift people cry over.",
    image: "/uploads/seed/crewneck.svg",
  },
  {
    slug: "tees",
    name: "Embroidered T-Shirts",
    short: "Tees",
    tagline: "Soft-washed tees with hand-finished stitched designs.",
    intro:
      "A printed tee fades. An embroidered one gets compliments for years. Our soft-washed cotton tees carry real raised stitching, from delicate florals to bold custom text, and every one is made to order in your size and color.",
    seoTitle: "Custom Embroidered T-Shirts & Tees",
    seoDescription:
      "Embroidered t-shirts made to order: florals, names, custom designs. Real stitching on soft cotton, never a print. Ships in 3 to 5 days.",
    image: "/uploads/seed/tee.svg",
  },
  {
    slug: "hats",
    name: "Embroidered Hats & Beanies",
    short: "Hats",
    tagline: "Dad hats and beanies, stitched with anything you want.",
    intro:
      "The fastest way to make a gift feel custom. Our dad hats and beanies are embroidered at 4,000+ stitch density so the design stays sharp for years. Names, words, small logos, inside jokes: if it fits on a hat, we'll stitch it. Great one at a time, even better as a matching set for trips, teams, and parties.",
    seoTitle: "Custom Embroidered Hats, Dad Caps & Beanies",
    seoDescription:
      "Personalized embroidered hats and beanies with any text or design. Dense, durable stitching. Perfect for gifts, bachelorette trips, and teams.",
    image: "/uploads/seed/hat.svg",
  },
  {
    slug: "outerwear",
    name: "Embroidered Jackets & Outerwear",
    short: "Jackets",
    tagline: "Statement denim and jackets with large-format back designs.",
    intro:
      "These are the showpieces. Large-format back embroidery on denim jackets and outerwear, designed with you from a photo, a sketch, or an idea. Every jacket includes a free digital proof before we thread a single needle, so what gets stitched is exactly what you imagined.",
    seoTitle: "Custom Embroidered Denim Jackets & Outerwear",
    seoDescription:
      "One-of-a-kind embroidered denim jackets with large custom back designs. Free design proof included. Heirloom-quality stitching, made to order.",
    image: "/uploads/seed/denim.svg",
  },
  {
    slug: "bags",
    name: "Embroidered Totes & Bags",
    short: "Bags",
    tagline: "Heavy canvas totes that carry your design everywhere.",
    intro:
      "A tote gets seen everywhere it goes, which makes it the best canvas we stitch on. Names, florals, pet portraits, business logos: embroidered into heavy 12 oz canvas with reinforced handles, machine washable, and guaranteed for the life of the bag.",
    seoTitle: "Custom Embroidered Tote Bags & Canvas Bags",
    seoDescription:
      "Personalized canvas totes with durable custom embroidery. Names, florals, logos, pet portraits. Reinforced handles, made to order.",
    image: "/uploads/seed/tote.svg",
  },
  {
    slug: "baby",
    name: "Embroidered Baby Gifts",
    short: "Baby",
    tagline: "Onesies and blankets that become keepsakes.",
    intro:
      "The most-gifted category in the shop. Soft cotton onesies and heirloom blankets with baby's name in our signature script, always finished with a soft mesh backing so nothing scratchy ever touches skin. Perfect for showers, announcements, and first photos, and made to be kept long after they're outgrown.",
    seoTitle: "Personalized Embroidered Baby Gifts & Onesies",
    seoDescription:
      "Custom embroidered baby onesies, blankets and name gifts with skin-safe soft backing. The baby shower gift they'll keep forever. Made to order.",
    image: "/uploads/seed/onesie.svg",
  },
  {
    slug: "home",
    name: "Embroidered Home & Kitchen",
    short: "Home",
    tagline: "Aprons, towels and linens with a stitched personal touch.",
    intro:
      "Embroidery isn't just for wearing. Linen aprons, tea towels, and home goods with stitched names, recipes-in-handwriting, and family kitchen titles make the kind of housewarming and holiday gifts that never get re-gifted.",
    seoTitle: "Custom Embroidered Aprons, Towels & Home Goods",
    seoDescription:
      "Personalized embroidered aprons, tea towels and home linens. Stitched names, handwriting and custom designs. Housewarming gifts they'll actually use.",
    image: "/uploads/seed/apron.svg",
  },
  {
    slug: "workwear",
    name: "Business & Team Embroidery",
    short: "Business",
    tagline: "Polos, workwear and team gear with your logo, stitched right.",
    intro:
      "Outfit your crew in embroidery that survives the job site and the wash cycle. We digitize your logo once, free, then stitch it onto polos, work shirts, hats, and aprons in any quantity. Volume pricing on 10+ pieces, and reorders are one message away because we keep your logo on file.",
    seoTitle: "Custom Logo Embroidery for Business & Teams",
    seoDescription:
      "Embroidered polos, workwear and team apparel with your logo. Free logo digitizing, volume pricing on 10+, fast reorders. Get a free quote.",
    image: "/uploads/seed/polo.svg",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Display name for any category string, even ones not in the registry. */
export function categoryLabel(slug: string): string {
  return getCategory(slug)?.short ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}
