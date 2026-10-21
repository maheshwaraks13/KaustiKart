export const CRAFTS = ["Kasuti Embroidery", "Beedu Craft", "Terracotta", "Coconut Shell Craft", "Cane & Bamboo", "Other"];
export type Artisan = { id: string; name: string; phone?: string; village?: string; craft?: string; bio?: string; photo_url?: string };
export type Product = {
  id: string; artisan_id: string; title: string; price: number; craft_type?: string; description?: string;
  materials?: string; time_taken?: string; story?: string; voice_url?: string; images: string[];
  artisans?: Artisan;
};
