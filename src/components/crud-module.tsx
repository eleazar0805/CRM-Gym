"use client";

import Link from "next/link";
import { Edit3, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DbRow, ModuleConfig } from "@/lib/types";
import { formatValue } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/client";

type FormState = Record<string, string>;

export function CrudModule({ config }: { config: ModuleConfig }) {
  const [rows, setRows] = useState<DbRow[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [editing, setEditing] = useState<DbRow | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase.from(config.table).select("*").order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    setRows((data ?? []) as DbRow[]);
    setLoading(false);
  }, [config.table, supabase]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const filterOptions = useMemo(() => {
    if (!config.filterKey) return ["Todos"];
    return ["Todos", ...Array.from(new Set(rows.map((row) => String(row[config.filterKey!] ?? "")).filter(Boolean)))];
  }, [config.filterKey, rows]);

  const visibleRows = rows.filter((row) => {
    const matchesQuery =
      query.trim().length === 0 ||
      config.searchColumns.some((key) => String(row[key] ?? "").toLowerCase().includes(query.toLowerCase()));
    const matchesFilter = filter === "Todos" || !config.filterKey || String(row[config.filterKey] ?? "") === filter;
    return matchesQuery && matchesFilter;
  });

  function openCreate() {
    setEditing(null);
    setForm(Object.fromEntries(config.fields.map((field) => [field.key, ""])));
    setOpen(true);
  }

  function openEdit(row: DbRow) {
    setEditing(row);
    setForm(Object.fromEntries(config.fields.map((field) => [field.key, row[field.key] == null ? "" : String(row[field.key])])));
    setOpen(true);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = Object.fromEntries(
      config.fields.map((field) => {
        const value = form[field.key];
        if (field.type === "number") return [field.key, value === "" ? null : Number(value)];
        return [field.key, value === "" ? null : value];
      })
    );

    const result = editing?.id
      ? await supabase.from(config.table).update(payload).eq("id", editing.id)
      : await supabase.from(config.table).insert(payload);

    if (result.error) {
      setError(result.error.message);
    } else {
      setOpen(false);
      await loadRows();
    }
    setSaving(false);
  }

  async function remove(row: DbRow) {
    if (!row.id) return;
    const label = String(row.name ?? row.title ?? row.company_name ?? row.quote_number ?? row.ticket_number ?? "este registro");
    if (!window.confirm(`¿Seguro que quieres eliminar ${label}? Esta acción no se puede deshacer.`)) return;

    setError(null);
    const { error: deleteError } = await supabase.from(config.table).delete().eq("id", row.id);
    if (deleteError) setError(deleteError.message);
    else await loadRows();
  }

  return (
    <div className="space-y-4">
      <div className="panel p-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex min-h-10 flex-1 items-center gap-2 rounded-lg border border-slate-700 bg-[#0b1119] px-3 text-sm text-zinc-400 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-400/15">
            <Search size={16} />
            <input className="w-full bg-transparent text-zinc-100 outline-none" placeholder="Buscar" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {config.filterKey ? (
              <select className="field" value={filter} onChange={(event) => setFilter(event.target.value)}>
                {filterOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : null}
            <button className="button button-primary" onClick={openCreate}>
              <Plus size={16} />
              {config.primaryAction}
            </button>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div> : null}

      <div className="panel overflow-hidden">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-2 text-zinc-400">
            <Loader2 className="animate-spin" size={18} />
            Cargando datos de Supabase...
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <div className="text-lg font-semibold">Sin registros</div>
            <p className="mt-2 max-w-md text-sm text-zinc-400">Crea el primer registro o ajusta la búsqueda para ver resultados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-[#0b1119] text-left text-xs uppercase text-zinc-400">
                  {config.columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 font-bold">{column.label}</th>
                  ))}
                  <th className="px-4 py-3 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={String(row.id)} className="border-b border-slate-800/70 hover:bg-sky-400/[.055]">
                    {config.columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-zinc-200">
                        {["status", "priority", "urgency", "stage"].includes(column.key) ? (
                          <StatusBadge value={row[column.key]} />
                        ) : ["name", "ticket_number", "title"].includes(column.key) && config.detailPath ? (
                          <Link className="font-semibold text-sky-200 hover:underline" href={`${config.detailPath}/${row.id}`}>{formatValue(row[column.key])}</Link>
                        ) : (
                          formatValue(row[column.key])
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="button px-3" onClick={() => openEdit(row)} aria-label="Editar">
                          <Edit3 size={15} />
                        </button>
                        <button className="button button-danger px-3" onClick={() => remove(row)} aria-label="Eliminar">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <form onSubmit={save} className="panel max-h-[90vh] w-full max-w-3xl overflow-y-auto p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{editing ? "Editar registro" : config.primaryAction}</h2>
                <p className="text-sm text-zinc-400">{config.title}</p>
              </div>
              <button className="button" type="button" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {config.fields.map((field) => (
                <label key={field.key} className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}>
                  <span className="text-sm font-semibold text-zinc-300">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea className="field min-h-28 w-full py-3" value={form[field.key] ?? ""} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} required={field.required} />
                  ) : field.type === "select" ? (
                    <select className="field w-full" value={form[field.key] ?? ""} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} required={field.required}>
                      <option value="">Seleccionar</option>
                      {field.options?.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input className="field w-full" type={field.type ?? "text"} value={form[field.key] ?? ""} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} required={field.required} placeholder={field.placeholder} />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button className="button" type="button" onClick={() => setOpen(false)}>Cancelar</button>
              <button className="button button-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
