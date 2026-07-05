import Link from "next/link";
import { LockKeyhole, UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <section className="panel space-y-5 p-6">
        <div className="grid h-12 w-12 place-items-center rounded-lg border border-sky-400/40 bg-sky-400/10 text-sky-200">
          <LockKeyhole size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Acceso solo por invitación</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            IronPulse CRM es una herramienta privada. Las cuentas se crean desde Supabase Auth por un administrador; el registro público está desactivado.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-black/20 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <UserPlus size={16} className="text-sky-300" />
            Cómo dar acceso
          </div>
          <p className="text-sm leading-6 text-zinc-400">
            En Supabase abre el proyecto crm ironpulse, entra en Authentication, Users y usa Add user o Invite user. Después la persona accede desde la pantalla de login.
          </p>
        </div>
        <Link href="/login" className="button button-primary w-full">
          Ir al login
        </Link>
      </section>
      <p className="mt-4 text-center text-sm text-zinc-400">
        ¿Ya tienes acceso? <Link href="/login" className="text-sky-200 hover:underline">Entrar</Link>
      </p>
    </div>
  );
}
