"use client";
import { createContext, useContext, useEffect, useState } from "react";
export type CartItem = { id: string; title: string; price: number; image?: string; artisan_id: string; qty: number };
const Ctx = createContext<{ items: CartItem[]; add: (i: Omit<CartItem, "qty">) => void; remove: (id: string) => void; clear: () => void }>(null!);
export const useCart = () => useContext(Ctx);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {} }, []);
  const save = (n: CartItem[]) => { setItems(n); localStorage.setItem("cart", JSON.stringify(n)); };
  const add = (i: Omit<CartItem, "qty">) =>
    save(items.some((x) => x.id === i.id) ? items.map((x) => (x.id === i.id ? { ...x, qty: x.qty + 1 } : x)) : [...items, { ...i, qty: 1 }]);
  return <Ctx.Provider value={{ items, add, remove: (id) => save(items.filter((x) => x.id !== id)), clear: () => save([]) }}>{children}</Ctx.Provider>;
}
