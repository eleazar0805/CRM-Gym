import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatValue } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [
    { data: company },
    { data: contacts },
    { data: opportunities },
    { data: quotes },
    { data: projects },
    { data: tickets },
    { data: maintenance },
    { data: assets },
    { data: timeEntries },
    { data: materials },
    { data: deliveryNotes },
    { data: communications },
    { data: documents }
  ] = await Promise.all([
    supabase.from("companies").select("*").eq("id", params.id).single(),
    supabase.from("contacts").select("*").eq("company_id", params.id).limit(8),
    supabase.from("opportunities").select("*").eq("company_id", params.id).limit(8),
    supabase.from("quotes").select("*").eq("company_id", params.id).limit(8),
    supabase.from("projects").select("*").eq("company_id", params.id).limit(8),
    supabase.from("support_tickets").select("*").eq("company_id", params.id).limit(8),
    supabase.from("maintenance_plans").select("*").eq("company_id", params.id).limit(8),
    supabase.from("assets").select("*").eq("company_id", params.id).limit(8),
    supabase.from("time_entries").select("*").eq("company_id", params.id).limit(8),
    supabase.from("materials").select("*").eq("company_id", params.id).limit(8),
    supabase.from("delivery_notes").select("*").eq("company_id", params.id).limit(8),
    supabase.from("communications").select("*").eq("company_id", params.id).limit(8),
    supabase.from("documents").select("*").eq("company_id", params.id).limit(8)
  ]);

  if (!company) notFound();

  return (
    <div>
      <PageHeader title={company.name} subtitle="Vista 360º comercial, técnica y operativa">
        <Link className="button" href="/companies">Volver a empresas</Link>
        <Link className="button button-primary" href="/opportunities">Nueva oportunidad</Link>
        <Link className="button button-danger" href="/support">Nueva incidencia</Link>
      </PageHeader>

      <section className="panel mb-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={company.status} />
          <StatusBadge value={company.priority} />
          <StatusBadge value={company.sector} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Servicios contratados" value={company.services} />
          <Info label="Último contacto" value={company.last_contact} />
          <Info label="Próxima acción" value={company.next_action} />
          <Info label="Responsable" value={company.responsible} />
          <Info label="Necesidades tecnológicas" value={company.technology_needs} />
          <Info label="Notas internas" value={company.notes} />
        </div>
      </section>

      <div className="mb-4 flex flex-wrap gap-2">
        {["Resumen", "Contactos", "Oportunidades", "Presupuestos", "Proyectos", "Incidencias", "Mantenimiento", "Activos", "Tiempos", "Materiales", "Albaranes", "Comunicaciones", "Documentos"].map((tab) => (
          <span key={tab} className="rounded-lg border border-slate-800 bg-black/20 px-3 py-2 text-sm text-zinc-300">{tab}</span>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Related title="Contactos" rows={contacts ?? []} keys={["name", "role", "email", "next_action"]} />
        <Related title="Oportunidades" rows={opportunities ?? []} keys={["title", "service", "stage", "priority"]} />
        <Related title="Presupuestos" rows={quotes ?? []} keys={["quote_number", "service", "status", "amount"]} />
        <Related title="Proyectos" rows={projects ?? []} keys={["service", "status", "responsible", "progress"]} />
        <Related title="Incidencias" rows={tickets ?? []} keys={["ticket_number", "issue_type", "priority", "status"]} />
        <Related title="Mantenimiento" rows={maintenance ?? []} keys={["maintenance_type", "frequency", "next_review", "status"]} />
        <Related title="Activos" rows={assets ?? []} keys={["asset_name", "asset_type", "status", "warranty_until"]} />
        <Related title="Tiempos" rows={timeEntries ?? []} keys={["entry_date", "technician", "hours", "billable_status"]} />
        <Related title="Materiales" rows={materials ?? []} keys={["used_at", "material_name", "quantity", "billable_status"]} />
        <Related title="Albaranes" rows={deliveryNotes ?? []} keys={["note_number", "issued_at", "status", "billable_status"]} />
        <Related title="Timeline de comunicaciones" rows={communications ?? []} keys={["channel", "communication_date", "summary", "next_action"]} />
        <Related title="Documentos" rows={documents ?? []} keys={["title", "document_type", "status", "storage_path"]} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-100">{formatValue(value)}</div>
    </div>
  );
}

function Related({ title, rows, keys }: { title: string; rows: Record<string, unknown>[]; keys: string[] }) {
  return (
    <section className="panel p-4">
      <h2 className="mb-4 font-bold">{title}</h2>
      {rows.length === 0 ? <p className="text-sm text-zinc-500">Sin registros relacionados</p> : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={String(row.id)} className="rounded-lg border border-slate-800 bg-black/20 p-3 text-sm">
              {keys.map((key) => <div key={key} className="text-zinc-300"><span className="text-zinc-500">{key}: </span>{formatValue(row[key])}</div>)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
