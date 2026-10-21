"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
export default function Header() {
  const { items } = useCart();
  const n = items.reduce((s, i) => s + i.qty, 0);
  return (
    <header className="sticky top-0 z-10 border-b border-sand bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-2xl font-bold text-clay">KaustiKart</Link>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/dashboard">For Artisans</Link>
          <Link href="/cart" className="rounded-full bg-clay px-4 py-2 text-white">Cart ({n})</Link>
        </nav>
      </div>
    </header>
  );
}
