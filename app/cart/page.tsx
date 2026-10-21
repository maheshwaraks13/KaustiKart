"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cart";

export default function Cart() {
  const { items, remove, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState({ name: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  async function pay(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    await new Promise((r) => setTimeout(r, 900)); // mocked payment gateway
    const id = crypto.randomUUID();
    const o = await supabase.from("orders").insert({ id, buyer_name: f.name, buyer_phone: f.phone, address: f.address, total });
    const it = await supabase.from("order_items").insert(items.map((i) => ({ order_id: id, product_id: i.id, artisan_id: i.artisan_id, title: i.title, price: i.price, qty: i.qty })));
    if (o.error || it.error) { setErr((o.error || it.error)!.message); setBusy(false); return; }
    clear(); router.push(`/order/${id}`);
  }
  if (!items.length) return <p className="py-10 text-center">Your cart is empty.</p>;
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 font-serif text-3xl font-bold">Your cart</h1>
      <div className="space-y-3">{items.map((i) => (
        <div key={i.id} className="card flex items-center gap-3">
          <img src={i.image || "https://picsum.photos/seed/craft/100/100"} className="h-16 w-16 rounded-lg object-cover" />
          <div className="flex-1"><p className="font-semibold">{i.title}</p><p className="text-sm">₹{i.price} × {i.qty}</p></div>
          <button onClick={() => remove(i.id)} className="text-sm text-clay underline">Remove</button>
        </div>))}</div>
      <p className="my-4 text-right text-xl font-bold">Total: ₹{total}</p>
      <form onSubmit={pay} className="card space-y-3">
        <h2 className="font-serif text-xl font-bold">Delivery details</h2>
        <div><label className="label">Your name</label><input required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div><label className="label">Phone / WhatsApp</label><input required type="tel" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        <div><label className="label">Address</label><textarea required rows={3} className="input" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? "Processing demo payment…" : `Pay ₹${total} (demo)`}</button>
        <p className="text-center text-xs text-ink/60">Payment is mocked — no money is charged.</p>
      </form>
    </div>
  );
}
