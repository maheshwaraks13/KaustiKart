"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const [p, setP] = useState<Product | null>(null);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);
  useEffect(() => { supabase.from("products").select("*, artisans(*)").eq("id", id).maybeSingle().then(({ data }) => setP(data as any)); }, [id]);
  if (!p) return <p>Loading…</p>;
  const a = p.artisans!;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${p.title} — handmade by ${a.name} of ${a.village}. ₹${p.price}\n${typeof window !== "undefined" ? window.location.href : ""}`)}`;
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <img src={p.images?.[img] || "https://picsum.photos/seed/craft/800/800"} alt={p.title} className="aspect-square w-full rounded-2xl object-cover" />
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {p.images?.map((u, i) => <img key={u} src={u} onClick={() => setImg(i)} className={`h-16 w-16 cursor-pointer rounded-lg object-cover ${i === img ? "ring-2 ring-clay" : ""}`} />)}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-clay">{p.craft_type}</p>
        <h1 className="font-serif text-3xl font-bold">{p.title}</h1>
        <p className="my-2 text-2xl font-bold">₹{p.price}</p>
        <p className="text-ink/80">{p.description}</p>
        <dl className="my-4 grid grid-cols-2 gap-3 text-sm">
          <div className="card"><dt className="font-semibold">Materials</dt><dd>{p.materials || "—"}</dd></div>
          <div className="card"><dt className="font-semibold">Time to make</dt><dd>{p.time_taken || "—"}</dd></div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary flex-1" onClick={() => { add({ id: p.id, title: p.title, price: p.price, image: p.images?.[0], artisan_id: p.artisan_id }); setAdded(true); }}>
            {added ? "Added ✓" : "Add to cart"}
          </button>
          <a className="btn btn-ghost" href={wa} target="_blank" rel="noreferrer">Share on WhatsApp</a>
        </div>
        {added && <Link href="/cart" className="mt-3 block text-center font-semibold text-clay underline">Go to cart →</Link>}
      </div>

      <section className="rounded-3xl bg-sand p-6 md:col-span-2">
        <h2 className="font-serif text-2xl font-bold">📜 The Craft Story</h2>
        <p className="mt-3 whitespace-pre-line text-lg leading-relaxed">{p.story || "The artisan hasn't added a story for this piece yet."}</p>
        {p.voice_url && <div className="mt-4"><p className="mb-1 text-sm font-semibold">🎙️ Hear it in the artisan's own voice</p><audio controls src={p.voice_url} className="w-full" /></div>}
      </section>

      <section className="card flex items-center gap-4 md:col-span-2">
        <img src={a.photo_url || `https://picsum.photos/seed/${a.id}/200/200`} className="h-20 w-20 rounded-full object-cover" alt={a.name} />
        <div><p className="text-xs font-semibold uppercase text-clay">Meet the artisan</p>
          <h3 className="font-serif text-xl font-bold">{a.name}</h3>
          <p className="text-sm text-ink/60">{a.village} · {a.craft}</p>
          <p className="mt-1 text-sm">{a.bio}</p></div>
      </section>
    </div>
  );
}
