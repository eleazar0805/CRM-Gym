import Link from "next/link";
import { ExternalLink, LockKeyhole, Server, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { companyProfile, pipelineStages, serviceCategories } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: technologies } = await supabase.from("technologies").select("name,relationship_type,status").order("name");

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Empresa, seguridad, usuarios, pipeline y preferencias" />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <section className="panel p-4">
          <h2 className="mb-4 font-bold">Perfil de empresa</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Nombre" value={companyProfile.name} />
            <Info label="Razón social" value={companyProfile.legalName} />
            <Info label="CIF/NIF" value={companyProfile.taxId} />
            <Info label="Dirección" value={companyProfile.address} />
            <Info label="Email" value={companyProfile.email} />
            <Info label="Teléfono" value={companyProfile.phone} />
            <Info label="WhatsApp / móvil" value={companyProfile.mobile} />
            <Info label="Web" value={companyProfile.web} />
          </div>
        </section>
        <section className="panel p-4">
          <h2 className="mb-4 font-bold">Acceso y publicación</h2>
          <div className="space-y-3">
            <InfoCard
              icon={LockKeyhole}
              title="Registro público cerrado"
              text="La pantalla de registro no crea usuarios. El acceso se concede manualmente desde Supabase Auth."
            />
            <InfoCard
              icon={UserPlus}
              title="Alta de usuarios"
              text="En Supabase abre crm ironpulse, entra en Authentication y usa Add user o Invite user."
            />
            <InfoCard
              icon={Server}
              title="Producción"
              text="La versión publicada está en Vercel y usa la base de datos Supabase crm ironpulse."
            />
            <Link href="https://files-mentioned-by-the-user-quiero.vercel.app" className="button w-full" target="_blank">
              <ExternalLink size={16} />
              Abrir producción
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <section className="panel p-4">
          <h2 className="mb-4 font-bold">Servicios</h2>
          <div className="space-y-2">{serviceCategories.map((category) => <StatusBadge key={category} value={category} />)}</div>
        </section>
        <section className="panel p-4">
          <h2 className="mb-4 font-bold">Pipeline</h2>
          <div className="space-y-2 text-sm text-zinc-300">{pipelineStages.map((stage, index) => <div key={stage}>{index + 1}. {stage}</div>)}</div>
        </section>
        <section className="panel p-4">
          <h2 className="mb-4 font-bold">Tecnologías</h2>
          <div className="space-y-3">
            {(technologies ?? []).map((tech) => (
              <div key={tech.name} className="rounded-lg border border-slate-800 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3"><strong>{tech.name}</strong><StatusBadge value={tech.relationship_type} /></div>
                <div className="mt-1 text-xs text-zinc-500">{tech.status}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof LockKeyhole; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
        <Icon size={16} className="text-sky-300" />
        {title}
      </div>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{text}</p>
    </div>
  );
}
