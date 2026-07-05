import { PageHeader } from "@/components/app-shell";
import { CrudModule } from "@/components/crud-module";
import { moduleConfigs } from "@/lib/modules";

export function ModulePage({ slug }: { slug: keyof typeof moduleConfigs }) {
  const config = moduleConfigs[slug];
  return (
    <div>
      <PageHeader title={config.title} subtitle={config.subtitle} />
      <CrudModule config={config} />
    </div>
  );
}
