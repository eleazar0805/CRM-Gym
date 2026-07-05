import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <Suspense fallback={<div className="panel p-6 text-sm text-zinc-400">Cargando acceso...</div>}>
        <AuthForm mode="login" />
      </Suspense>
      <p className="mt-4 text-center text-sm text-zinc-400">
        Acceso privado. Las cuentas las crea un administrador desde Supabase Auth.
      </p>
    </div>
  );
}
