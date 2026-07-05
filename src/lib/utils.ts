import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Sin dato";
  if (typeof value === "number") return new Intl.NumberFormat("es-ES").format(value);
  return String(value);
}

export function statusTone(value: unknown) {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("crítica") || text.includes("crítico") || text.includes("escalada") || text.includes("rechazado") || text.includes("perdido")) {
    return "border-red-400/40 bg-red-500/10 text-red-100";
  }
  if (text.includes("alta") || text.includes("negociación") || text.includes("atrasada") || text.includes("vencido")) {
    return "border-orange-400/40 bg-orange-500/10 text-orange-100";
  }
  if (text.includes("media") || text.includes("pendiente") || text.includes("revisión") || text.includes("borrador") || text.includes("enviado")) {
    return "border-yellow-300/40 bg-yellow-300/10 text-yellow-100";
  }
  if (text.includes("activo") || text.includes("aceptado") || text.includes("ganado") || text.includes("completado") || text.includes("resuelta")) {
    return "border-green-400/40 bg-green-500/10 text-green-100";
  }
  return "border-sky-400/35 bg-sky-400/10 text-sky-100";
}
