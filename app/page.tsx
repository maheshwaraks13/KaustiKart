"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CRAFTS, type Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(""); const [craft, setCraft] = useState(""); const [max, setMax] = useState(""); const [loc, setLoc] = useState("");
  useEffect(() => {
    supabase.from("products").select("*, artisans(id,name,village,photo_url)").order("created_at", { ascending: false })
      .then(({ data }) => { setAll((data as any) ?? []); setLoading(false); });
  }, []);
  const list = useMemo(() => all.filter((p) =>
    (!q || (p.title + p.description).toLowerCase().includes(q.toLowerCase())) &&
    (!craft || p.craft_type === craft) && (!max || p.price <= +max) &&
    (!loc || (p.artisans?.village ?? "").toLowerCase().includes(loc.toLowerCase()))), [all, q, craft, max, loc]);
  return (
    <>
      <section className="mb-6 rounded-3xl bg-sand p-6 text-center">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">Handmade by the artisans of coastal Karnataka</h1>
        <p className="mx-auto mt-2 max-w-xl text-ink/70">Kasuti embroidery, Beedu craft and more — every piece comes with the story of the hands that made it.</p>
      </section>
      <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">
        <input className="input col-span-2 md:col-span-1" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={craft} onChange={(e) => setCraft(e.target.value)}>
          <option value="">All crafts</option>{CRAFTS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input className="input" type="number" placeholder="Max price ₹" value={max} onChange={(e) => setMax(e.target.value)} />
        <input className="input" placeholder="Village / town" value={loc} onChange={(e) => setLoc(e.target.value)} />
      </div>
      {loading ? <p>Loading…</p> : list.length === 0 ? <p className="text-center text-ink/60">No products found.</p> : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </>
  );
}
