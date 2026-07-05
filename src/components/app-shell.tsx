"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CheckSquare, Clock, Dumbbell, LayoutGrid, LogOut, Menu, Search, SlidersHorizontal, Tags, Users, X, Zap } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Panel", items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutGrid }] },
  {
    label: "Gestión",
    items: [
      { href: "/companies", label: "Clientes", icon: Users },
      { href: "/projects", label: "Clases", icon: Dumbbell },
      { href: "/communications", label: "Calendario", icon: Clock },
      { href: "/quotes", label: "Reservas", icon: CheckSquare },
      { href: "/leads", label: "Lista de espera", icon: Clock }
    ]
  },
  {
    label: "Configuración",
    items: [
      { href: "/assets", label: "Tipos de clase", icon: Tags },
      { href: "/maintenance", label: "Generador anual", icon: Zap },
      { href: "/settings", label: "Ajustes", icon: SlidersHorizontal }
    ]
  }
];

export function AppShell({ children, userEmail }: { children: React.ReactNode; userEmail?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-[#17181f] lg:grid lg:grid-cols-[308px_minmax(0,1fr)]">
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[308px] flex-col overflow-y-auto border-r border-black/10 bg-[#111218] px-4 py-7 text-white transition lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="mb-12 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#ef4b35] text-white shadow-[0_14px_28px_rgba(239,75,53,.24)]">
              <Zap size={26} />
            </div>
            <div className="font-black uppercase tracking-tight">
              <span className="text-white">IronPulse </span>
              <span className="text-[#ef4b35]">CRM</span>
            </div>
          </Link>
          <button className="grid size-9 place-items-center rounded-lg border border-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <X size={17} />
          </button>
        </div>

        <nav className="flex-1 space-y-8">
          {navigation.map((group) => (
            <div key={group.label}>
              <div className="mb-3 px-3 text-[11px] font-black uppercase tracking-[.18em] text-white/35">{group.label}</div>
              <div className="space-y-2">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("flex h-12 items-center gap-3 rounded-lg border border-transparent px-3 text-[15px] font-extrabold text-white/55 transition hover:bg-white/[.04] hover:text-white", active && "border-[#ef4b35]/50 bg-[#321b17] text-[#ff714f] shadow-[inset_3px_0_0_#ef4b35]")}>
                      <Icon size={20} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-8 border-t border-white/10 pt-5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-full bg-white/10 text-sm font-black">AI</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black">{userEmail ?? "Admin IronPulse"}</div>
              <div className="text-xs font-semibold text-white/45">Admin</div>
            </div>
            <button onClick={signOut} className="grid size-9 place-items-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white" aria-label="Salir">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <div className="flex min-h-16 items-center justify-between border-b border-[#e4e0da] bg-white px-5 lg:hidden">
          <button className="inline-flex items-center gap-2 rounded-lg border border-[#ded9d2] px-3 py-2 text-sm font-black" onClick={() => setOpen(true)}>
            <Menu size={18} />
            Menú
          </button>
          <div className="font-black uppercase">IronPulse <span className="text-[#ef4b35]">CRM</span></div>
        </div>
        {children}
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <header className="flex min-h-20 flex-col justify-center gap-4 border-b border-[#e4e0da] bg-white px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-[#17181f]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm font-semibold text-[#8d8d96]">{subtitle}</p> : null}
      </div>
      {children ?? (
        <label className="flex h-11 w-full items-center gap-3 rounded-lg border border-[#ded9d2] bg-[#fbfaf8] px-4 text-sm font-semibold text-[#8d8d96] lg:max-w-[430px]">
          <Search size={18} />
          <input className="w-full bg-transparent outline-none placeholder:text-[#8d8d96]" placeholder="Buscar clientes o clases..." type="search" />
        </label>
      )}
    </header>
  );
}

export function MiniStatus({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "red" | "amber" | "green" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700"
  };
  return <span className={cn("rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide", tones[tone])}>{children}</span>;
}
