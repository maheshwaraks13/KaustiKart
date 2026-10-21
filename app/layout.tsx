import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
export const metadata: Metadata = { title: "KaustiKart — Handmade from Coastal Karnataka", description: "Buy directly from the artisans of Kasuti, Beedu and more." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <CartProvider><Header /><main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      <footer className="py-8 text-center text-sm text-ink/60">KaustiKart · Direct from the hands that made it</footer></CartProvider>
    </body></html>
  );
}
