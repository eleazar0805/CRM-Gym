import { PageHeader } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const reportSpecs = [
  ["Leads por fuente", "leads", "source"],
  ["Leads por sector", "companies", "sector"],
  ["Oportunidades por fase", "opportunities", "stage"],
  ["Presupuestos por estado", "quotes", "status"],
  ["Servicios más solicitados", "opportunities", "service"],
  ["Incidencias por prioridad", "support_tickets", "priority"],
  ["Incidencias por tipo", "support_tickets", "issue_type"],
  ["Proyectos por estado", "projects", "status"],
  ["Mantenimientos próximos", "maintenance_plans", "status"],
  ["Tiempo por técnico", "time_entries", "technician"],
  ["Tiempo por tipo de trabajo", "time_entries", "work_type"],
  ["Materiales por estado facturable", "materials", "billable_status"],
  ["Albaranes por estado", "delivery_notes", "status"],
  ["Revisiones de facturación", "billing_reviews", "status"],
  ["Supervisión diaria", "daily_supervision", "status"],
  ["Tareas atrasadas", "tasks", "status"],
  ["Clientes sin seguimiento", "companies", "status"]
] as const;

export default async function ReportsPage() {
  const supabase = createClient();
  const reports = await Promise.all(
    reportSpecs.map(async ([title, table, field]) => {
      const { data } = await supabase.from(table).select(field).limit(500);
      const counts = new Map<string, number>();
      (data ?? []).forEach((row) => {
        const value = String((row as Record<string, unknown>)[field] ?? "Sin dato");
        counts.set(value, (counts.get(value) ?? 0) + 1);
      });
      return { title, entries: Array.from(counts.entries()) };
    })
  );

  return (
    <div>
      <PageHeader title="Reportes" subtitle="Indicadores de ventas, operaciones, soporte y mantenimiento" />
      <div className="grid gap-4 xl:grid-cols-3">
        {reports.map((report) => (
          <section className="panel p-4" key={report.title}>
            <h2 className="mb-4 font-bold">{report.title}</h2>
            {report.entries.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-800 p-6 text-center text-sm text-zinc-500">Sin datos todavía</p>
            ) : (
              <Bars entries={report.entries} />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function Bars({ entries }: { entries: [string, number][] }) {
  const max = Math.max(1, ...entries.map(([, value]) => value));
  return (
    <div className="space-y-3">
      {entries.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[minmax(100px,1fr)_2fr_36px] items-center gap-3 text-sm">
          <span className="truncate text-zinc-300">{label}</span>
          <div className="h-2 overflow-hidden rounded-full border border-slate-800 bg-black/40">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-green-400" style={{ width: `${Math.max(8, (value / max) * 100)}%` }} />
          </div>
          <strong className="text-right">{value}</strong>
        </div>
      ))}
    </div>
  );
}
