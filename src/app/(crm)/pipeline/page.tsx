import { PageHeader } from "@/components/app-shell";
import { PipelineBoard } from "@/components/pipeline-board";

export default function PipelinePage() {
  return (
    <div>
      <PageHeader title="Pipeline" subtitle="Kanban premium de oportunidades y servicios IT. Al mover una tarjeta, se actualiza la fase en Supabase." />
      <PipelineBoard />
    </div>
  );
}
