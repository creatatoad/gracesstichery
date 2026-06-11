import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const products = [
  {
    slug: "monogram-hoodie",
    name: "Classic Monogram Hoodie",
    priceCents: 5800,
    category: "hoodies",
    featured: true,
    description:
      "A heavyweight cotton-blend hoodie finished with a hand-digitized monogram, stitched on a single-needle machine for crisp, raised lettering that won't crack or peel like vinyl. Choose any initial, thread color, and placement: chest, sleeve, or hood.\n\nPre-washed so your embroidery stays put through every laundry day, and roomy enough to live in. This is the piece customers come back to buy in a second color.",
    seoTitle: "Custom Monogram Hoodie, Hand-Embroidered | Grace's Stitchery",
    seoDescription:
      "Personalized monogram hoodie with premium machine embroidery. Pick your initial, thread color & placement. Made to order, ships in 3 to 5 days.",
    tags: "monogram hoodie, custom embroidered hoodie, personalized hoodie, embroidery gift",
    image: "/uploads/seed/hoodie.svg",
    alt: "Berry-red hoodie with embroidered circular monogram G on the chest",
  },
  {
    slug: "wildflower-tee",
    name: "Wildflower Bouquet Tee",
    priceCents: 3400,
    category: "tees",
    featured: true,
    description:
      "Our best-selling soft-washed tee with a delicate wildflower bouquet stitched over the left chest. Each stem is embroidered in satin and stem stitch with subtle color shading, so no two runs look exactly alike.\n\nA wardrobe staple that reads handmade, because it is. Pick your shirt color and we'll match a thread palette that makes the bouquet sing.",
    seoTitle: "Embroidered Wildflower T-Shirt | Grace's Stitchery",
    seoDescription:
      "Soft cotton tee with a hand-finished embroidered wildflower bouquet. A best-seller, made to order in your size and color.",
    tags: "embroidered tee, wildflower shirt, floral embroidery, botanical t-shirt",
    image: "/uploads/seed/tee.svg",
    alt: "Sage green t-shirt with embroidered wildflower bouquet on the chest",
  },
  {
    slug: "embroidered-dad-hat",
    name: "Embroidered Dad Hat",
    priceCents: 2800,
    category: "hats",
    featured: true,
    description:
      "A relaxed, unstructured 6-panel cap with your word, name, or small design stitched front and center. Tight 4,000+ stitch density means the design stays sharp for years. Adjustable brass closure, one size fits most.\n\nThe fastest way to make a gift feel custom, and a favorite for bachelorette trips, team outings, and matching family sets. Order several and we'll keep the stitching identical across every hat.",
    seoTitle: "Custom Embroidered Dad Hat, Any Text | Grace's Stitchery",
    seoDescription:
      "Personalized dad hat with dense, durable embroidery. Any word, name, or small logo. Adjustable fit, made to order.",
    tags: "custom dad hat, embroidered cap, personalized hat, custom baseball cap",
    image: "/uploads/seed/hat.svg",
    alt: "Mustard-gold dad hat with embroidered smile design on the front",
  },
  {
    slug: "canvas-tote",
    name: "Everyday Canvas Tote",
    priceCents: 3200,
    category: "bags",
    featured: false,
    description:
      "A 12 oz natural canvas tote with reinforced handles and your custom embroidery: florals, names, or a tiny portrait of your pet. Roomy enough for groceries or a laptop, sturdy enough for both at once.\n\nMachine washable, and the embroidery is guaranteed for the life of the bag. The gift that gets carried everywhere and asked about constantly.",
    seoTitle: "Custom Embroidered Canvas Tote Bag | Grace's Stitchery",
    seoDescription:
      "Heavy-duty canvas tote personalized with your embroidery design: names, florals, or pet portraits. Reinforced handles, made to order.",
    tags: "embroidered tote bag, custom canvas tote, personalized bag, embroidery gift",
    image: "/uploads/seed/tote.svg",
    alt: "Natural canvas tote bag with berry-red embroidered botanical sprigs",
  },
  {
    slug: "baby-name-onesie",
    name: "Baby Name Onesie",
    priceCents: 2600,
    category: "baby",
    featured: false,
    description:
      "A buttery-soft 100% cotton onesie with baby's name stitched in our signature script. We use a soft mesh backing so nothing scratchy ever touches skin.\n\nThe most-gifted item in the shop. Perfect for showers, announcements, and first photos, and made to be kept long after it's outgrown.",
    seoTitle: "Personalized Baby Name Onesie | Grace's Stitchery",
    seoDescription:
      "Custom embroidered baby onesie with soft, skin-safe backing. Baby's name in elegant script. The perfect baby shower gift.",
    tags: "personalized onesie, baby name embroidery, baby shower gift, custom baby clothes",
    image: "/uploads/seed/onesie.svg",
    alt: "Cream baby onesie with the name emmy embroidered in sage script",
  },
  {
    slug: "custom-denim-jacket",
    name: "Statement Denim Jacket",
    priceCents: 9800,
    category: "outerwear",
    featured: true,
    description:
      "The showpiece: a classic denim jacket with a large-format back embroidery designed just for you. Florals, lettering, portraits. Bring an idea and we'll digitize it stitch by stitch.\n\nIncludes a free design proof before we ever thread a needle, so what gets stitched is exactly what you pictured. Heirloom quality, meant to be noticed.",
    seoTitle: "Custom Embroidered Denim Jacket | Grace's Stitchery",
    seoDescription:
      "One-of-a-kind denim jacket with large custom back embroidery. Free design proof included. Florals, lettering, portraits & more.",
    tags: "custom denim jacket, embroidered jean jacket, back embroidery, statement jacket",
    image: "/uploads/seed/denim.svg",
    alt: "Indigo denim jacket with cream embroidered design across the back",
  },
  {
    slug: "pet-portrait-crewneck",
    name: "Pet Portrait Crewneck",
    priceCents: 6200,
    category: "sweatshirts",
    featured: true,
    description:
      "Send us a photo of your pet and we'll hand-digitize their little face into thread: ears, whiskers, that one crooked eyebrow. Stitched over the heart of a heavyweight crewneck sweatshirt you'll never want to take off.\n\nYou approve a free stitched proof of the portrait before we sew, so the likeness is right. The single most tear-inducing gift we make, according to the thank-you messages.",
    seoTitle: "Custom Pet Portrait Crewneck Sweatshirt | Grace's Stitchery",
    seoDescription:
      "Your pet's face, hand-digitized and embroidered on a cozy crewneck. Free portrait proof before stitching. The gift dog and cat people cry over.",
    tags: "pet portrait sweatshirt, custom dog embroidery, cat portrait crewneck, pet memorial gift, dog mom gift",
    image: "/uploads/seed/crewneck.svg",
    alt: "Lavender crewneck sweatshirt with an embroidered pet portrait over the chest",
  },
  {
    slug: "handwriting-keepsake-sweatshirt",
    name: "Handwriting Keepsake Sweatshirt",
    priceCents: 5800,
    category: "sweatshirts",
    featured: false,
    description:
      "A note from grandma, a recipe card, a signature from someone you miss: send a photo of the handwriting and we stitch it exactly as written, every loop and wobble preserved in thread.\n\nWorn like a hug. This is the piece people order after seeing a friend's, usually with a story attached. We treat every submission with care and send a free proof before stitching.",
    seoTitle: "Handwriting Embroidered Sweatshirt | Grace's Stitchery",
    seoDescription:
      "Real handwriting stitched in thread on a cozy sweatshirt. A keepsake gift made from notes, recipes, or signatures. Free proof before we sew.",
    tags: "handwriting embroidery, memorial gift, keepsake sweatshirt, signature embroidery, sentimental gift",
    image: "/uploads/seed/handwriting.svg",
    alt: "Sage crewneck sweatshirt with handwriting embroidered in cream thread",
  },
  {
    slug: "cozy-custom-beanie",
    name: "Cozy Custom Beanie",
    priceCents: 2400,
    category: "hats",
    featured: false,
    description:
      "A chunky ribbed-knit beanie with your name, word, or tiny design stitched on the fold-over cuff. Warm enough for real winters, cute enough to wear indoors anyway.\n\nAt this price it's the easiest stocking stuffer and party favor we make. Order a matching set and we'll stitch every one identically.",
    seoTitle: "Custom Embroidered Beanie | Grace's Stitchery",
    seoDescription:
      "Chunky knit beanie with custom embroidery on the cuff. Names, words, tiny designs. A perfect personalized stocking stuffer, made to order.",
    tags: "custom beanie, embroidered beanie, personalized winter hat, stocking stuffer, knit hat",
    image: "/uploads/seed/beanie.svg",
    alt: "Berry-red knit beanie with embroidered detail on the cuff",
  },
  {
    slug: "custom-linen-apron",
    name: "Custom Linen Apron",
    priceCents: 4200,
    category: "home",
    featured: false,
    description:
      "A washed-linen apron with adjustable neck strap and deep front pockets, embroidered with a name, a kitchen title (Chief Snack Officer is a recurring favorite), or a floral spray across the bib.\n\nThe housewarming and holiday gift that actually gets used. Add a matching tea towel to the order and we'll stitch them as a set.",
    seoTitle: "Personalized Embroidered Linen Apron | Grace's Stitchery",
    seoDescription:
      "Washed-linen apron with custom embroidery: names, kitchen titles, florals. Adjustable fit, deep pockets. A housewarming gift they'll use daily.",
    tags: "personalized apron, embroidered apron, custom kitchen gift, housewarming gift, linen apron",
    image: "/uploads/seed/apron.svg",
    alt: "Natural linen apron with embroidered florals on the bib",
  },
  {
    slug: "heirloom-baby-blanket",
    name: "Heirloom Baby Blanket",
    priceCents: 5400,
    category: "baby",
    featured: false,
    description:
      "A plush, double-layered blanket edged in satin, embroidered with baby's name, birth date, and weight in our keepsake script. The piece that gets photographed on day one and saved for decades.\n\nEvery blanket is stitched with soft backing and pre-washed in fragrance-free detergent, ready for the nursery the moment it arrives.",
    seoTitle: "Personalized Baby Blanket, Embroidered | Grace's Stitchery",
    seoDescription:
      "Heirloom baby blanket embroidered with name, birth date & weight. Plush, satin-edged, skin-safe stitching. A baby gift they'll keep forever.",
    tags: "personalized baby blanket, birth announcement blanket, embroidered baby gift, heirloom blanket, new baby gift",
    image: "/uploads/seed/blanket.svg",
    alt: "Cream baby blanket with embroidered name and floral details",
  },
  {
    slug: "business-logo-polo",
    name: "Business Logo Polo",
    priceCents: 3800,
    category: "workwear",
    featured: false,
    description:
      "A breathable pique polo with your company logo stitched over the chest. We digitize your logo by hand, free, then keep it on file so reorders take one message instead of a whole project.\n\nPricing drops automatically at 10+ pieces, and we can mix sizes and colors in a single run. Ask about adding names or titles on the opposite chest. This is how small teams look like big brands.",
    seoTitle: "Custom Logo Embroidered Polos for Teams | Grace's Stitchery",
    seoDescription:
      "Embroidered polos with your business logo. Free logo digitizing, volume pricing on 10+, mixed sizes welcome. Outfit your team, get a free quote.",
    tags: "logo embroidery, custom polos, business apparel, team uniforms, embroidered workwear, company shirts",
    image: "/uploads/seed/polo.svg",
    alt: "Navy polo shirt with an embroidered logo on the chest",
  },
];

async function main() {
  const count = await db.product.count();

  if (count === 0) {
    for (const p of products) {
      const { image, alt, ...data } = p;
      await db.product.create({
        data: {
          ...data,
          status: "active",
          images: { create: [{ url: image, alt, position: 0 }] },
        },
      });
    }
    console.log(`Seeded ${products.length} products.`);
    return;
  }

  // The store already has products. Refresh starter products the owner hasn't
  // edited (updatedAt still equals createdAt) so copy fixes reach them, and add
  // any brand-new starter products. Never touch edited or owner-created items.
  let refreshed = 0;
  let added = 0;
  for (const p of products) {
    const { image, alt, ...data } = p;
    const existing = await db.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await db.product.create({
        data: {
          ...data,
          status: "active",
          images: { create: [{ url: image, alt, position: 0 }] },
        },
      });
      added++;
    } else if (existing.updatedAt.getTime() - existing.createdAt.getTime() < 5000) {
      await db.product.update({ where: { slug: p.slug }, data });
      refreshed++;
    }
  }
  console.log(`Store has ${count} products: added ${added} starter products, refreshed ${refreshed} unedited ones.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
