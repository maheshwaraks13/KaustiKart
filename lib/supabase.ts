import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export async function upload(file: File, folder: string) {
  const path = `${folder}/${crypto.randomUUID()}-${file.name.replace(/[^\w.]/g, "_")}`;
  const { error } = await supabase.storage.from("images").upload(path, file);
  if (error) throw error;
  return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
}
