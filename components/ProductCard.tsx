import Link from "next/link";
import type { Product } from "@/lib/types";
export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.id}`} className="card block overflow-hidden !p-0 transition hover:shadow-md">
      <img src={p.images?.[0] || "https://picsum.photos/seed/craft/600/600"} alt={p.title} className="aspect-square w-full object-cover" />
      <div className="p-3">
        <p className="text-xs font-semibold uppercase text-clay">{p.craft_type}</p>
        <h3 className="font-serif text-lg leading-tight">{p.title}</h3>
        <p className="mt-1 font-bold">₹{p.price}</p>
        <p className="text-sm text-ink/60">by {p.artisans?.name} · {p.artisans?.village}</p>
      </div>
    </Link>
  );
}
