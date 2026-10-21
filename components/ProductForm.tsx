"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, upload } from "@/lib/supabase";
import { CRAFTS } from "@/lib/types";

const empty = { title: "", price: "", craft_type: CRAFTS[0], description: "", materials: "", time_taken: "", story: "", voice_url: "", images: [] as string[] };

export default function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const [f, setF] = useState<any>(empty); const [busy, setBusy] = useState(false);
  useEffect(() => { if (id) supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => data && setF(data)); }, [id]);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id; if (!uid) return router.replace("/login");
    const row = { title: f.title, price: +f.price, craft_type: f.craft_type, description: f.description, materials: f.materials, time_taken: f.time_taken, story: f.story, voice_url: f.voice_url || null, images: f.images };
    const { error } = id ? await supabase.from("products").update(row).eq("id", id) : await supabase.from("products").insert({ ...row, artisan_id: uid });
    if (error) { alert(error.message); setBusy(false); } else router.push("/dashboard");
  }
  return (
    <form onSubmit={save} className="card mx-auto max-w-xl space-y-4">
      <h1 className="font-serif text-2xl font-bold">{id ? "Edit product" : "Add a product"}</h1>
      <div>
        <label className="label">Photos</label>
        <div className="flex flex-wrap gap-2">
          {f.images.map((u: string) => <img key={u} src={u} className="h-20 w-20 rounded-lg object-cover" />)}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-clay text-3xl text-clay">＋
            <input type="file" accept="image/*" multiple hidden onChange={async (e) => {
              const urls = await Promise.all(Array.from(e.target.files ?? []).map((x) => upload(x, "products")));
              setF((s: any) => ({ ...s, images: [...s.images, ...urls] }));
            }} /></label>
        </div>
      </div>
      <div><label className="label">Product name</label><input required className="input" value={f.title} onChange={set("title")} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">Price (₹)</label><input required type="number" min={1} className="input" value={f.price} onChange={set("price")} /></div>
        <div><label className="label">Craft</label><select className="input" value={f.craft_type} onChange={set("craft_type")}>{CRAFTS.map((c) => <option key={c}>{c}</option>)}</select></div>
      </div>
      <div><label className="label">What is it?</label><textarea rows={2} className="input" value={f.description} onChange={set("description")} /></div>
      <div><label className="label">Materials used</label><input className="input" placeholder="e.g. Cotton, silk thread" value={f.materials} onChange={set("materials")} /></div>
      <div><label className="label">Time taken to make</label><input className="input" placeholder="e.g. 12 days" value={f.time_taken} onChange={set("time_taken")} /></div>
      <div className="rounded-xl bg-sand p-3">
        <label className="label">📜 Craft Story</label>
        <p className="mb-2 text-sm text-ink/70">Who made it? Who taught you? What does the design mean? Why did it take this long?</p>
        <textarea rows={5} className="input" value={f.story} onChange={set("story")} />
        <label className="label mt-3">🎙️ Voice note (optional)</label>
        {f.voice_url && <audio controls src={f.voice_url} className="mb-2 w-full" />}
        <input type="file" accept="audio/*" capture onChange={async (e) => e.target.files?.[0] && setF({ ...f, voice_url: await upload(e.target.files[0], "voice") })} />
      </div>
      <button disabled={busy} className="btn btn-primary w-full">{busy ? "Saving…" : "Save product"}</button>
    </form>
  );
}
