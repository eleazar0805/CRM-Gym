import { statusTone, cn } from "@/lib/utils";

export function StatusBadge({ value }: { value: unknown }) {
  return (
    <span className={cn("inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-semibold", statusTone(value))}>
      {String(value ?? "Sin dato")}
    </span>
  );
}
