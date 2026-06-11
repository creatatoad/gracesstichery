import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type GeneratedCopy = {
  description: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
};

export type GenerateInput = {
  name: string;
  category?: string;
  notes?: string;
  priceCents?: number;
  /** Site-relative image URL (e.g. /uploads/abc.jpg) — used for vision when raster. */
  imageUrl?: string;
};

const COPY_SCHEMA = {
  type: "object",
  properties: {
    description: {
      type: "string",
      description:
        "Product description, 2-3 short paragraphs, warm handmade voice, ends with a reason to buy now",
    },
    seoTitle: {
      type: "string",
      description: "SEO page title, under 60 characters, includes the brand 'Grace's Stitchery'",
    },
    seoDescription: {
      type: "string",
      description: "Meta description, 140-160 characters, with a call to action",
    },
    tags: {
      type: "array",
      items: { type: "string" },
      description: "8-13 SEO keywords/tags suitable for Etsy and search",
    },
  },
  required: ["description", "seoTitle", "seoDescription", "tags"],
  additionalProperties: false,
} as const;

const RASTER_TYPES: Record<string, "image/jpeg" | "image/png" | "image/gif" | "image/webp"> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

async function imageBlock(imageUrl: string) {
  const ext = path.extname(imageUrl).toLowerCase();
  const mediaType = RASTER_TYPES[ext];
  if (!mediaType || !imageUrl.startsWith("/uploads/")) return null;
  try {
    // Uploaded images live under public/; basename guards against traversal.
    const file = path.join(process.cwd(), "public", "uploads", path.basename(imageUrl));
    const data = await readFile(file);
    return {
      type: "image" as const,
      source: { type: "base64" as const, media_type: mediaType, data: data.toString("base64") },
    };
  } catch {
    return null;
  }
}

/**
 * Generate product copy + SEO with Claude. Falls back to a sturdy template
 * when ANTHROPIC_API_KEY isn't configured so the admin always works.
 */
export async function generateProductCopy(input: GenerateInput): Promise<GeneratedCopy> {
  if (!process.env.ANTHROPIC_API_KEY) return templateCopy(input);

  const client = new Anthropic();

  const facts = [
    `Product name: ${input.name}`,
    input.category && `Category: ${input.category}`,
    input.priceCents != null && `Price: $${(input.priceCents / 100).toFixed(2)}`,
    input.notes && `Maker's notes: ${input.notes}`,
  ]
    .filter(Boolean)
    .join("\n");

  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  if (input.imageUrl) {
    const img = await imageBlock(input.imageUrl);
    if (img) content.push(img);
  }
  content.push({
    type: "text",
    text: `Write the product listing copy described by the schema.\n\n${facts}`,
  });

  const response = await client.beta.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    betas: ["structured-outputs-2025-11-13"],
    system:
      "You write product copy for Grace's Stitchery, a small business making custom machine-embroidered apparel (hoodies, tees, hats, totes, baby items, jackets, whatever a customer wants). Voice: warm, confident, handmade-but-professional. Emphasize durability of real embroidery vs. vinyl prints, made-to-order personalization, and gifting. Never invent specific materials, sizes, or turnaround times unless they appear in the maker's notes. If a product photo is provided, describe what is actually visible in it. Style rule: never use em dashes or en dashes anywhere in the copy; use commas, colons, or periods instead.",
    output_format: {
      type: "json_schema",
      schema: COPY_SCHEMA as unknown as Record<string, unknown>,
    },
    messages: [{ role: "user", content }],
  });

  if (response.stop_reason === "refusal") return templateCopy(input);

  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) return templateCopy(input);
  const parsed = JSON.parse(text) as GeneratedCopy;
  // Belt and suspenders: strip any em/en dashes the model slips in.
  const clean = (s: string) => s.replace(/\s*—\s*|\s*–\s*/g, ", ").replace(/, ,/g, ",");
  return {
    description: clean(parsed.description),
    seoTitle: clean(parsed.seoTitle),
    seoDescription: clean(parsed.seoDescription),
    tags: parsed.tags.map((t) => clean(t).trim().toLowerCase()),
  };
}

function templateCopy(input: GenerateInput): GeneratedCopy {
  const name = input.name.trim() || "Custom Embroidered Piece";
  const category = input.category?.trim() || "apparel";
  const notes = input.notes?.trim();
  return {
    description: [
      `Meet the ${name}, made to order in our studio with dense, hand-finished machine embroidery that outlasts any printed design. ${
        notes ? notes + " " : ""
      }Every piece is stitched one at a time, so you choose the thread colors, placement, and personalization.`,
      `Real embroidery means raised, tactile stitching that won't crack, fade, or peel in the wash. Whether it's a gift or a treat for yourself, this one's made just for you.`,
      `Made to order. Secure yours today and we'll start stitching.`,
    ].join("\n\n"),
    seoTitle: `${name}, Custom Embroidery | Grace's Stitchery`.slice(0, 60),
    seoDescription:
      `Custom embroidered ${name.toLowerCase()} made to order by Grace's Stitchery. Choose your colors & personalization. Durable stitching, perfect for gifts.`.slice(
        0,
        160,
      ),
    tags: [
      `embroidered ${category}`,
      `custom ${category}`,
      name.toLowerCase(),
      "custom embroidery",
      "personalized gift",
      "handmade apparel",
      "made to order",
      "embroidery gift",
    ],
  };
}
