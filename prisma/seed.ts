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
      "A heavyweight cotton-blend hoodie finished with a hand-digitized monogram, stitched on a single-needle machine for crisp, raised lettering that won't crack or peel like vinyl. Choose any initial, thread color, and placement — chest, sleeve, or hood. Pre-washed so your embroidery stays put through every laundry day.",
    seoTitle: "Custom Monogram Hoodie — Hand-Embroidered | Grace's Stitchery",
    seoDescription:
      "Personalized monogram hoodie with premium machine embroidery. Pick your initial, thread color & placement. Made to order, ships in 3–5 days.",
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
      "Our best-selling soft-washed tee with a delicate wildflower bouquet stitched over the left chest. Each stem is embroidered in satin and stem stitch with subtle color shading — no two runs look exactly alike. A wardrobe staple that reads handmade, because it is.",
    seoTitle: "Embroidered Wildflower T-Shirt | Grace's Stitchery",
    seoDescription:
      "Soft cotton tee with a hand-finished embroidered wildflower bouquet. A best-seller — made to order in your size and color.",
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
      "A relaxed, unstructured 6-panel cap with your word, name, or small design stitched front and center. Tight 4,000+ stitch density means the design stays sharp for years. Adjustable brass closure, one size fits most. The fastest way to make a gift feel custom.",
    seoTitle: "Custom Embroidered Dad Hat — Any Text or Design | Grace's Stitchery",
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
      "A 12 oz natural canvas tote with reinforced handles and your custom embroidery — florals, names, or a tiny portrait of your pet. Roomy enough for groceries or a laptop, sturdy enough for both at once. Machine washable; embroidery guaranteed for the life of the bag.",
    seoTitle: "Custom Embroidered Canvas Tote Bag | Grace's Stitchery",
    seoDescription:
      "Heavy-duty canvas tote personalized with your embroidery design — names, florals, or pet portraits. Reinforced handles, made to order.",
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
      "A buttery-soft 100% cotton onesie with baby's name stitched in our signature script. We use a soft mesh backing so nothing scratchy ever touches skin. The most-gifted item in the shop — perfect for showers, announcements, and first photos.",
    seoTitle: "Personalized Baby Name Onesie — Embroidered | Grace's Stitchery",
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
      "The showpiece: a classic denim jacket with a large-format back embroidery designed just for you. Florals, lettering, portraits — bring an idea and we'll digitize it stitch by stitch. Includes a free design proof before we ever thread a needle. Heirloom quality, meant to be noticed.",
    seoTitle: "Custom Embroidered Denim Jacket — Back Design | Grace's Stitchery",
    seoDescription:
      "One-of-a-kind denim jacket with large custom back embroidery. Free design proof included. Florals, lettering, portraits & more.",
    tags: "custom denim jacket, embroidered jean jacket, back embroidery, statement jacket",
    image: "/uploads/seed/denim.svg",
    alt: "Indigo denim jacket with cream embroidered design across the back",
  },
];

async function main() {
  for (const p of products) {
    const { image, alt, ...data } = p;
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...data,
        status: "active",
        images: { create: [{ url: image, alt, position: 0 }] },
      },
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
