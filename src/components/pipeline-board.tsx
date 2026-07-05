"use client";

import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pipelineStages } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";
import type { DbRow } from "@/lib/types";
import { formatValue } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

export function PipelineBoard() {
  const [rows, setRows] = useState<DbRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    setRows((data ?? []) as DbRow[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDragEnd(event: DragEndEvent) {
    const id = String(event.active.id);
    const stage = String(event.over?.id ?? "");
    if (!stage || !pipelineStages.includes(stage)) return;

    const previous = rows;
    setRows((current) => current.map((row) => (String(row.id) === id ? { ...row, stage } : row)));
    const { error: updateError } = await supabase.from("opportunities").update({ stage }).eq("id", id);
    if (updateError) {
      setRows(previous);
      setError(updateError.message);
    }
  }

  if (loading) {
    return (
      <div className="panel flex min-h-80 items-center justify-center gap-2 text-zinc-400">
        <Loader2 className="animate-spin" size={18} />
        Cargando pipeline desde Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div> : null}
      <DndContext onDragEnd={onDragEnd}>
        <div className="grid auto-cols-[minmax(290px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-3">
          {pipelineStages.map((stage) => (
            <PipelineColumn key={stage} stage={stage} rows={rows.filter((row) => row.stage === stage)} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function PipelineColumn({ stage, rows }: { stage: string; rows: DbRow[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <section ref={setNodeRef} className={`min-h-[540px] rounded-lg border p-3 transition ${isOver ? "border-sky-300 bg-sky-400/10" : "border-slate-800 bg-black/25"}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-zinc-100">{stage}</h2>
        <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-xs font-bold text-sky-100">{rows.length}</span>
      </div>
      <div className="space-y-3">
        {rows.length === 0 ? <div className="rounded-lg border border-dashed border-slate-800 p-4 text-center text-xs text-zinc-500">Sin oportunidades</div> : null}
        {rows.map((row) => <OpportunityCard key={String(row.id)} row={row} />)}
      </div>
    </section>
  );
}

function OpportunityCard({ row }: { row: DbRow }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: String(row.id) });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-lg border border-slate-800 bg-ink-850 p-3 shadow-lg ${isDragging ? "opacity-70" : ""}`}
    >
      <h3 className="font-semibold text-white">{formatValue(row.title)}</h3>
      <div className="mt-2 space-y-2 text-xs text-zinc-400">
        <p>{formatValue(row.company_name)} · {formatValue(row.service)}</p>
        <p><span className="font-bold text-green-200">{formatValue(row.estimated_value)} €</span> · Probabilidad {formatValue(row.probability)}%</p>
        <p>Próxima acción: {formatValue(row.next_action)}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span>{formatValue(row.responsible)}</span>
          <StatusBadge value={row.priority} />
        </div>
      </div>
    </article>
  );
}
