import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatValue } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SupportDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: ticket } = await supabase.from("support_tickets").select("*").eq("id", params.id).single();

  if (!ticket) notFound();

  const [{ data: timeEntries }, { data: materials }, { data: deliveryNotes }, { data: communications }] = await Promise.all([
    supabase.from("time_entries").select("*").eq("company_id", ticket.company_id).order("entry_date", { ascending: false }).limit(8),
    supabase.from("materials").select("*").eq("company_id", ticket.company_id).order("used_at", { ascending: false }).limit(8),
    supabase.from("delivery_notes").select("*").eq("company_id", ticket.company_id).order("issued_at", { ascending: false }).limit(8),
    supabase.from("communications").select("*").eq("company_id", ticket.company_id).order("communication_date", { ascending: false }).limit(8)
  ]);

  return (
    <div>
      <PageHeader title={ticket.ticket_number ?? "Incidencia"} subtitle="Ficha técnica de soporte, tiempos, materiales y albaranes asociados">
        <Link className="button" href="/support">Volver a soporte</Link>
        <Link className="button button-primary" href="/time-entries">Registrar tiempo</Link>
        <Link className="button" href="/materials">Añadir material</Link>
      </PageHeader>

      <section className="panel mb-4 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge value={ticket.priority} />
          <StatusBadge value={ticket.status} />
          <StatusBadge value={ticket.issue_type} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Empresa" value={ticket.company_name} />
          <Info label="Responsable" value={ticket.responsible} />
          <Info label="Apertura" value={ticket.opened_at} />
          <Info label="Acción rápida" value={ticket.quick_action} />
          <Info label="Descripción" value={ticket.description} />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Related title="Tiempos registrados" rows={timeEntries ?? []} keys={["entry_date", "technician", "hours", "billable_status"]} />
        <Related title="Materiales utilizados" rows={materials ?? []} keys={["used_at", "material_name", "quantity", "billable_status"]} />
        <Related title="Albaranes" rows={deliveryNotes ?? []} keys={["note_number", "issued_at", "status", "billable_status"]} />
        <Related title="Comunicaciones" rows={communications ?? []} keys={["channel", "communication_date", "summary", "next_action"]} />
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
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">Sin registros relacionados</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={String(row.id)} className="rounded-lg border border-slate-800 bg-black/20 p-3 text-sm">
              {keys.map((key) => (
                <div key={key} className="text-zinc-300">
                  <span className="text-zinc-500">{key}: </span>
                  {formatValue(row[key])}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
