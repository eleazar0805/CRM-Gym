export type Priority = "Baja" | "Media" | "Alta" | "Crítica";

export type FieldType = "text" | "textarea" | "number" | "date" | "select";

export type ModuleField = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type ModuleConfig = {
  slug: string;
  title: string;
  subtitle: string;
  table: string;
  icon: string;
  primaryAction: string;
  searchColumns: string[];
  filterKey?: string;
  columns: ModuleField[];
  fields: ModuleField[];
  detailPath?: string;
};

export type DbRow = Record<string, string | number | boolean | null | undefined>;
