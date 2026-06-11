"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  price: string; // dollars, as typed
  category: string;
  status: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  tags: string;
  images: { url: string; alt: string }[];
};

const empty: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  category: "apparel",
  status: "active",
  featured: false,
  seoTitle: "",
  seoDescription: "",
  tags: "",
  images: [],
};

export default function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial ?? empty);
  const [aiNotes, setAiNotes] = useState("");
  const [busy, setBusy] = useState<"" | "save" | "ai" | "upload">("");
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy("upload");
    setMessage(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        setValues((v) => ({ ...v, images: [...v.images, { url: data.url, alt: v.name }] }));
      }
    } catch (e) {
      setMessage({ kind: "err", text: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setBusy("");
    }
  }

  async function generateCopy() {
    setBusy("ai");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          category: values.category,
          notes: aiNotes,
          priceCents: Math.round(parseFloat(values.price || "0") * 100),
          imageUrl: values.images[0]?.url,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setValues((v) => ({
        ...v,
        description: data.copy.description,
        seoTitle: data.copy.seoTitle,
        seoDescription: data.copy.seoDescription,
        tags: data.copy.tags.join(", "),
      }));
      setMessage({
        kind: "ok",
        text: data.ai
          ? "Description and SEO written by AI — review and tweak before saving."
          : "Filled in from the built-in template (set ANTHROPIC_API_KEY for AI copy).",
      });
    } catch (e) {
      setMessage({ kind: "err", text: e instanceof Error ? e.message : "Generation failed" });
    } finally {
      setBusy("");
    }
  }

  async function save() {
    setBusy("save");
    setMessage(null);
    try {
      const priceCents = Math.round(parseFloat(values.price) * 100);
      const payload = {
        name: values.name,
        description: values.description,
        priceCents,
        category: values.category,
        status: values.status,
        featured: values.featured,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        tags: values.tags,
        images: values.images,
      };
      const res = await fetch(
        values.id ? `/api/admin/products/${values.id}` : "/api/admin/products",
        {
          method: values.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      if (!values.id) {
        router.push(`/admin/products/${data.product.id}`);
      } else {
        setMessage({ kind: "ok", text: "Saved." });
        router.refresh();
      }
    } catch (e) {
      setMessage({ kind: "err", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-5">
        {/* Basics */}
        <section className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="mb-4 font-semibold">Product</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Name</label>
              <input
                className="input"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Cottage Garden Sweatshirt"
              />
            </div>
            <div>
              <label className="label">Price (USD)</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={values.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="48.00"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <input
                className="input"
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="hoodies, hats, baby…"
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="mb-4 font-semibold">Photos</h2>
          <div className="flex flex-wrap gap-3">
            {values.images.map((img, i) => (
              <div key={img.url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} className="h-28 w-28 rounded-xl border border-ink/10 object-cover" />
                <button
                  type="button"
                  aria-label="Remove image"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-berry text-xs font-bold text-cream"
                  onClick={() =>
                    setValues((v) => ({ ...v, images: v.images.filter((_, j) => j !== i) }))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-ink/20 text-center text-xs text-ink-soft hover:border-berry hover:text-berry">
              {busy === "upload" ? "Uploading…" : "+ Add photos"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files)}
              />
            </label>
          </div>
        </section>

        {/* AI copy */}
        <section className="rounded-2xl border-2 border-berry/30 bg-white p-5">
          <h2 className="font-semibold">Description &amp; SEO</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Write it yourself, or let AI draft the description, SEO title, meta description,
            and tags from the name, category, photo, and any notes below.
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="min-w-60 flex-1">
              <label className="label">Notes for the AI (materials, sizes, story…)</label>
              <input
                className="input"
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                placeholder="e.g. 50/50 fleece, sizes S–3XL, chain-stitch lettering"
              />
            </div>
            <button
              type="button"
              onClick={generateCopy}
              disabled={busy === "ai" || !values.name}
              className="btn-secondary disabled:opacity-50"
            >
              {busy === "ai" ? "Writing…" : "✨ Generate with AI"}
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={7}
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">SEO title ({values.seoTitle.length}/60)</label>
                <input
                  className="input"
                  value={values.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                />
              </div>
              <div>
                <label className="label">
                  SEO meta description ({values.seoDescription.length}/160)
                </label>
                <input
                  className="input"
                  value={values.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">Tags / keywords (comma-separated, used on Etsy too)</label>
              <input
                className="input"
                value={values.tags}
                onChange={(e) => set("tags", e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Side rail */}
      <div className="space-y-5">
        <section className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="mb-3 font-semibold">Publish</h2>
          <label className="label">Status</label>
          <select
            className="input"
            value={values.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="active">Active (visible in shop)</option>
            <option value="draft">Draft (hidden)</option>
            <option value="archived">Archived</option>
          </select>
          <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Featured on home page
          </label>
          <button
            type="button"
            onClick={save}
            disabled={busy === "save" || !values.name || !values.price}
            className="btn-primary mt-5 w-full disabled:opacity-50"
          >
            {busy === "save" ? "Saving…" : values.id ? "Save changes" : "Create product"}
          </button>
          {message && (
            <p
              className={`mt-3 text-sm font-semibold ${message.kind === "ok" ? "text-sage" : "text-berry"}`}
            >
              {message.text}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
