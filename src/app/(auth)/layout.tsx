import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-lg border border-sky-400/50 bg-sky-400/10 text-sky-200">
          <ShieldCheck size={30} />
        </div>
        <Link href="/login" className="text-xl font-bold">IronPulse CRM</Link>
        <p className="mt-1 text-sm text-zinc-400">Acceso privado para gestión comercial, técnica y operativa</p>
      </div>
      {children}
    </main>
  );
}
