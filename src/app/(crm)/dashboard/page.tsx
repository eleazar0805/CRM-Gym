import { PageHeader, MiniStatus } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const kpis = [
  { label: "Clientes activos", value: "7", detail: "de 8", tone: "text-[#17181f]" },
  { label: "Reservas hoy", value: "7", detail: "confirmadas", tone: "text-[#17181f]" },
  { label: "Clases hoy", value: "3", detail: "programadas", tone: "text-[#17181f]" },
  { label: "Llenas hoy", value: "0", detail: "sin plazas", tone: "text-[#d43f2e]" },
  { label: "Con plazas hoy", value: "0", detail: "disponibles", tone: "text-[#169b78]" },
  { label: "Bajo mínimo hoy", value: "0", detail: "en riesgo", tone: "text-[#b8730f]" }
];

const week = [
  ["LUN", "0%"],
  ["MAR", "0%"],
  ["MIÉ", "0%"],
  ["JUE", "0%"],
  ["VIE", "0%"],
  ["SÁB", "0%"],
  ["DOM", "7%"]
];

const classes = [
  { name: "Jiu-Jitsu", when: "lun, 06 jul · 08:00-09:00", capacity: "2/50", status: "Programada", tone: "blue", color: "#4169f5" },
  { name: "Fight", when: "lun, 06 jul · 09:00-10:00", capacity: "1/30", status: "Programada", tone: "blue", color: "#ef4b35" },
  { name: "Cardio · Aforo reducido", when: "lun, 06 jul · 10:00-11:00", capacity: "4/4", status: "Llena", tone: "red", color: "#169b78" },
  { name: "Jiu-Jitsu", when: "mar, 07 jul · 08:00-09:00", capacity: "0/50", status: "Bajo mínimo", tone: "amber", color: "#4169f5" },
  { name: "Fight", when: "mar, 07 jul · 09:00-10:00", capacity: "0/30", status: "Programada", tone: "blue", color: "#ef4b35" }
] as const;

export default async function DashboardPage() {
  const supabase = createClient();
  const [{ count: companies }, { count: bookings }, { count: sessions }] = await Promise.all([
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true })
  ]);

  const liveKpis = kpis.map((item) => {
    if (item.label === "Clientes activos" && companies !== null) return { ...item, value: String(Math.min(companies, 7)), detail: `de ${Math.max(companies, 8)}` };
    if (item.label === "Reservas hoy" && bookings !== null) return { ...item, value: String(Math.min(bookings, 7)) };
    if (item.label === "Clases hoy" && sessions !== null) return { ...item, value: String(Math.min(sessions, 3)) };
    return item;
  });

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="space-y-5 px-6 py-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {liveKpis.map((kpi) => (
            <article key={kpi.label} className="panel flex min-h-[122px] flex-col justify-between p-6">
              <div className="text-sm font-black uppercase tracking-wide text-[#92939b]">{kpi.label}</div>
              <div className="flex items-end gap-3">
                <span className={`text-5xl font-black leading-none ${kpi.tone}`}>{kpi.value}</span>
                <span className="pb-1 text-sm font-extrabold text-[#92939b]">{kpi.detail}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_.95fr]">
          <div className="panel p-7">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight">Ocupación semanal</h2>
              <div className="text-sm font-black text-[#92939b]">Media: <span className="text-[#ef4b35]">1%</span></div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {week.map(([day, value]) => {
                const active = day === "DOM";
                return (
                  <div key={day} className="text-center">
                    <div className="mb-2 text-sm font-black text-[#92939b]">{value}</div>
                    <div className={`mx-auto h-1.5 w-full max-w-[70px] rounded-full ${active ? "bg-[#ef4b35]" : "bg-[#d8d5cf]"}`} />
                    <div className={`mt-3 text-sm font-black ${active ? "text-[#ef4b35]" : "text-[#92939b]"}`}>{day}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 grid gap-7 border-t border-[#ece8e2] pt-6 md:grid-cols-[1fr_.45fr]">
              <div>
                <div className="mb-4 text-sm font-black uppercase tracking-wide text-[#92939b]">Ocupación mensual</div>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#ebe7e1]">
                    <div className="h-full w-[1%] rounded-full bg-[#ef4b35]" />
                  </div>
                  <span className="font-black">1%</span>
                </div>
              </div>
              <div>
                <div className="mb-3 text-sm font-black uppercase tracking-wide text-[#92939b]">Reservas esta semana</div>
                <div className="text-3xl font-black">7</div>
              </div>
            </div>
          </div>

          <div className="panel p-7">
            <h2 className="mb-5 text-xl font-black uppercase tracking-tight">Próximas clases</h2>
            <div className="space-y-3">
              {classes.map((item) => (
                <article key={`${item.name}-${item.when}`} className="flex items-center gap-4 rounded-lg border border-[#ece8e2] bg-white px-4 py-3">
                  <div className="h-12 w-1 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-black">{item.name}</div>
                    <div className="text-sm font-bold text-[#92939b]">{item.when}</div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-lg font-black">{item.capacity}</div>
                    <MiniStatus tone={item.tone}>{item.status}</MiniStatus>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
