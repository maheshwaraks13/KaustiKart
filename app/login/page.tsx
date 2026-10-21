"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [msg, setMsg] = useState("");
  async function go(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const { data, error } = mode === "in" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);
    if (!data.session) return setMsg("Check your email to confirm, then sign in.");
    router.push("/dashboard");
  }
  return (
    <form onSubmit={go} className="card mx-auto max-w-sm space-y-3">
      <h1 className="font-serif text-2xl font-bold">{mode === "in" ? "Artisan sign in" : "Join as an artisan"}</h1>
      <div><label className="label">Email</label><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><label className="label">Password</label><input required minLength={6} type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <button className="btn btn-primary w-full">{mode === "in" ? "Sign in" : "Create account"}</button>
      <button type="button" className="w-full text-sm text-clay underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "New here? Create an account" : "Already registered? Sign in"}
      </button>
    </form>
  );
}
