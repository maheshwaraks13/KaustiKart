# KaustiKart

A simple marketplace where coastal-Karnataka artisans (Kasuti, Beedu, coconut shell…) list products with a **Craft Story** and sell directly to buyers.
Stack: Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Auth, Postgres, Storage).

## Setup
1. Create a free project at supabase.com.
2. SQL Editor → paste and run `supabase/schema.sql` (tables, security rules, `images` storage bucket).
3. Authentication → Providers → Email → turn **off** "Confirm email" (easier for demos).
4. `cp .env.example .env.local` and fill the three keys (Project Settings → API).
5. `npm install && npm run seed && npm run dev` → http://localhost:3000

## Demo flow
1. Sign in at **For Artisans** with `lakshmi@kaustikart.demo` / `demo1234` (or `ramesh@kaustikart.demo`).
2. **＋ Add product**: photos, price, materials, time, Craft Story, optional voice note → Save.
3. In a private window open the home page, search/filter, open your product, **Add to cart → Pay (demo)**.
4. Back in the artisan dashboard → **Orders received** → Accept → Mark completed.

## Structure
```
app/            pages: / (catalogue) · product/[id] · cart · order/[id] · login · dashboard (+ product/new, product/[id])
components/     Header, ProductCard, ProductForm
lib/            supabase client + upload, cart context, types
supabase/       schema.sql (tables + RLS + storage)
scripts/        seed.mjs (demo artisans & products)
```

## Prototype notes
- Payment is mocked (`app/cart/page.tsx`). Replace with Razorpay when ready.
- Checkout is guest-only; order pages are readable by anyone holding the random order link.
- Artisan sign-up uses email + password; phone OTP can be enabled via a Supabase SMS provider.
- Voice story = uploaded audio (phones offer to record directly).
- Ideas next: Kannada UI, admin view, image compression, order notifications via WhatsApp.
