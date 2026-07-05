"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "register") {
      setMessage("Usuario creado. Revisa la configuración de confirmación de email en Supabase si no puedes entrar aún.");
    }

    router.replace(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="panel w-full max-w-md space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">{mode === "login" ? "Acceso privado" : "Crear usuario"}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {mode === "login" ? "Entra al CRM interno de IronPulse." : "Alta de usuario autorizada para IronPulse CRM."}
        </p>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-zinc-300">Email</span>
        <input className="field w-full" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-zinc-300">Contraseña</span>
        <input className="field w-full" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
      </label>
      {message ? <p className="rounded-lg border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm text-yellow-100">{message}</p> : null}
      <button className="button button-primary w-full" disabled={loading}>
        {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
      </button>
    </form>
  );
}
