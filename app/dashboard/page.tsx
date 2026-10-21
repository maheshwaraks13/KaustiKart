"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, upload } from "@/lib/supabase";
import { CRAFTS, type Artisan, type Product } from "@/lib/types";

function ProfileForm({ uid, a, done }: { uid: string; a: Artisan | null; done: () => void }) {
  const [f, setF] = useState<any>(a ?? { name: "", phone: "", village: "", craft: CRAFTS[0], bio: "", photo_url: "" });
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("artisans").upsert({ id: uid, name: f.name, phone: f.phone, village: f.village, craft: f.craft, bio: f.bio, photo_url: f.photo_url });
    if (error) alert(error.message); else done();
  }
  return (
    <form onSubmit={save} className="card space-y-3">
      <h2 className="font-serif text-xl font-bold">Your profile</h2>
      <div className="flex items-center gap-3">
        <img src={f.photo_url || "https://picsum.photos/seed/new/200/200"} className="h-20 w-20 rounded-full object-cover" />
        <label className="btn btn-ghost cursor-pointer">📷 Add photo
          <input type="file" accept="image/*" hidden onChange={async (e) => e.target.files?.[0] && setF({ ...f, photo_url: await upload(e.target.files[0], "artisans") })} /></label>
      </div>
      <div><label className="label">Your name</label><input required className="input" value={f.name} onChange={set("name")} /></div>
      <div><label className="label">Phone / WhatsApp</label><input className="input" type="tel" value={f.phone ?? ""} onChange={set("phone")} /></div>
      <div><label className="label">Village / town</label><input required className="input" value={f.village ?? ""} onChange={set("village")} /></div>
      <div><label className="label">Your craft</label><select className="input" value={f.craft} onChange={set("craft")}>{CRAFTS.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div><label className="label">About you (a few lines)</label><textarea rows={3} className="input" value={f.bio ?? ""} onChange={set("bio")} /></div>
      <button className="btn btn-primary w-full">Save profile</button>
    </form>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [uid, setUid] = useState(""); const [a, setA] = useState<Artisan | null>(null); const [editing, setEditing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); const [items, setItems] = useState<any[]>([]); const [ready, setReady] = useState(false);
  async function load() {
    const { data } = await supabase.auth.getSession();
    const id = data.session?.user.id;
    if (!id) return router.replace("/login");
    setUid(id);
    const { data: ar } = await supabase.from("artisans").select("*").eq("id", id).maybeSingle();
    setA(ar); setEditing(!ar);
    const { data: p } = await supabase.from("products").select("*").eq("artisan_id", id).order("created_at", { ascending: false });
    setProducts((p as any) ?? []);
    const { data: o } = await supabase.from("order_items").select("*, orders(buyer_name,buyer_phone,address)").eq("artisan_id", id).order("created_at", { ascending: false });
    setItems(o ?? []); setReady(true);
  }
  useEffect(() => { load(); }, []);
  async function del(id: string) { if (confirm("Delete this product?")) { await supabase.from("products").delete().eq("id", id); load(); } }
  async function setStatus(id: string, status: string) { await supabase.from("order_items").update({ status }).eq("id", id); load(); }
  if (!ready) return <p>Loading…</p>;
  if (editing) return <div className="mx-auto max-w-md"><ProfileForm uid={uid} a={a} done={load} /></div>;
  return (
    <div className="space-y-8">
      <div className="card flex items-center gap-4">
        <img src={a!.photo_url || "https://picsum.photos/seed/new/200/200"} className="h-16 w-16 rounded-full object-cover" />
        <div className="flex-1"><h1 className="font-serif text-2xl font-bold">Namaste, {a!.name}</h1><p className="text-sm text-ink/60">{a!.village} · {a!.craft}</p></div>
        <button className="text-sm underline" onClick={() => setEditing(true)}>Edit</button>
        <button className="text-sm underline" onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>Sign out</button>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-serif text-xl font-bold">My products</h2>
          <Link href="/dashboard/product/new" className="btn btn-primary">＋ Add product</Link></div>
        {products.length === 0 && <p className="text-ink/60">No products yet. Tap “Add product” to start.</p>}
        <div className="space-y-2">{products.map((p) => (
          <div key={p.id} className="card flex items-center gap-3">
            <img src={p.images?.[0] || "https://picsum.photos/seed/craft/100/100"} className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1"><p className="font-semibold">{p.title}</p><p className="text-sm">₹{p.price}</p></div>
            <Link href={`/dashboard/product/${p.id}`} className="text-sm font-semibold text-clay underline">Edit</Link>
            <button onClick={() => del(p.id)} className="text-sm text-red-600 underline">Delete</button>
          </div>))}</div>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-xl font-bold">Orders received</h2>
        {items.length === 0 && <p className="text-ink/60">No orders yet.</p>}
        <div className="space-y-2">{items.map((i) => (
          <div key={i.id} className="card">
            <div className="flex justify-between"><p className="font-semibold">{i.title} × {i.qty}</p><span className="rounded-full bg-sand px-3 text-sm">{i.status}</span></div>
            <p className="text-sm text-ink/70">{i.orders?.buyer_name} · {i.orders?.buyer_phone}<br />{i.orders?.address}</p>
            <div className="mt-2 flex gap-2">
              {i.status === "Placed" && <button className="btn btn-primary !min-h-[40px] !py-1" onClick={() => setStatus(i.id, "Accepted")}>Accept</button>}
              {i.status === "Accepted" && <button className="btn btn-primary !min-h-[40px] !py-1" onClick={() => setStatus(i.id, "Completed")}>Mark completed</button>}
            </div>
          </div>))}</div>
      </section>
    </div>
  );
}
