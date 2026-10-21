// npm run seed  — creates 2 demo artisans (with login) and 5 products
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const img = (s) => `https://picsum.photos/seed/${s}/800/800`;
const artisans = [
  { email: "lakshmi@kaustikart.demo", name: "Lakshmi Hegde", village: "Kumta", craft: "Kasuti Embroidery", phone: "9800000001",
    bio: "I learnt Kasuti from my grandmother at age ten. Every stitch is counted thread by thread, with no drawn lines.",
    products: [
      { title: "Kasuti Embroidered Cotton Dupatta", price: 1850, craft_type: "Kasuti Embroidery", materials: "Handloom cotton, silk thread", time_taken: "14 days",
        description: "Soft handloom dupatta with traditional gopura and palanquin motifs.",
        story: "Kasuti means 'cotton thread' in Kannada. In my family every bride once carried a Kasuti-worked saree.\n\nThe gopura motif represents the temple towers of our land. Each motif is stitched by counting woven threads, which is why a single dupatta takes two weeks." },
      { title: "Kasuti Table Runner", price: 950, craft_type: "Kasuti Embroidery", materials: "Cotton, cotton thread", time_taken: "6 days",
        description: "A table runner with a repeating lotus and chariot border.",
        story: "My grandmother stitched these on festival eve for the whole house. I stitch them now, using the very same border pattern she taught me." },
    ] },
  { email: "ramesh@kaustikart.demo", name: "Ramesh Naik", village: "Bhatkal", craft: "Beedu Craft", phone: "9800000002",
    bio: "Beedu craft (Bidri-style metal inlay) runs in our family for four generations. I work in a small shed behind our home.",
    products: [
      { title: "Beedu Inlay Trinket Box", price: 2400, craft_type: "Beedu Craft", materials: "Zinc-copper alloy, pure silver inlay", time_taken: "9 days",
        description: "Hand-engraved round box with silver floral inlay on a black patina.",
        story: "The black colour is not paint. It comes from a special soil that darkens the metal while the silver stays bright.\n\nMy father taught me to engrave without a sketch. This box carries a creeper pattern he used on his first order." },
      { title: "Beedu Silver-Inlay Coaster Set (4)", price: 1600, craft_type: "Beedu Craft", materials: "Alloy, silver wire", time_taken: "7 days",
        description: "Set of four coasters with matching geometric inlay.", story: "Four coasters, four evenings of engraving each. Small pieces, same patience as the big ones." },
      { title: "Coconut Shell Serving Bowl", price: 450, craft_type: "Coconut Shell Craft", materials: "Coconut shell, natural oil polish", time_taken: "2 days",
        description: "Smooth, food-safe bowl polished by hand.", story: "Coconuts are everywhere on our coast. After the water and kernel are used, we give the shell a second life." },
    ] },
];
for (const a of artisans) {
  const { data, error } = await sb.auth.admin.createUser({ email: a.email, password: "demo1234", email_confirm: true });
  let id = data?.user?.id;
  if (error) { const l = await sb.auth.admin.listUsers(); id = l.data.users.find((u) => u.email === a.email)?.id; }
  await sb.from("artisans").upsert({ id, name: a.name, village: a.village, craft: a.craft, phone: a.phone, bio: a.bio, photo_url: img(a.name.split(" ")[0]) });
  await sb.from("products").delete().eq("artisan_id", id);
  for (const p of a.products) await sb.from("products").insert({ ...p, artisan_id: id, images: [img(p.title + 1), img(p.title + 2)] });
  console.log("Seeded", a.name, a.email);
}
console.log("Done. Sign in with lakshmi@kaustikart.demo / demo1234");
