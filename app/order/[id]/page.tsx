"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const [o, setO] = useState<any>(null); const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("orders").select("*").eq("id", id).maybeSingle().then(({ data }) => setO(data));
    supabase.from("order_items").select("*").eq("order_id", id).then(({ data }) => setItems(data ?? []));
  }, [id]);
  if (!o) return <p>Loading…</p>;
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="text-5xl">🎉</div>
      <h1 className="font-serif text-3xl font-bold">Thank you, {o.buyer_name}!</h1>
      <p className="mt-2 text-ink/70">Your order has been sent directly to the artisan(s). They will accept it soon.</p>
      <div className="card mt-6 space-y-2 text-left">
        <p className="text-xs text-ink/50">Order #{o.id.slice(0, 8)}</p>
        {items.map((i) => <div key={i.id} className="flex justify-between"><span>{i.title} × {i.qty}</span><span className="rounded-full bg-sand px-2 text-sm">{i.status}</span></div>)}
        <p className="border-t border-sand pt-2 text-right font-bold">Total ₹{o.total}</p>
        <p className="text-sm">Delivering to: {o.address}</p>
      </div>
      <Link href="/" className="btn btn-primary mt-6">Keep browsing</Link>
    </div>
  );
}
