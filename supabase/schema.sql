create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'Usuario',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text,
  status text not null default 'Lead',
  services text,
  last_contact date,
  next_action text,
  responsible text,
  priority text default 'Media' check (priority in ('Baja','Media','Alta','Crítica')),
  technology_needs text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  name text not null,
  role text,
  email text,
  phone text,
  last_contact date,
  next_action text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text not null,
  source text,
  service_interest text,
  urgency text default 'Media' check (urgency in ('Baja','Media','Alta','Crítica')),
  status text not null default 'Nuevo',
  responsible text,
  next_follow_up date,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text not null,
  title text not null,
  service text,
  estimated_value numeric(12,2),
  probability integer default 25 check (probability >= 0 and probability <= 100),
  stage text not null default 'Nuevo lead',
  next_action text,
  responsible text,
  priority text default 'Media' check (priority in ('Baja','Media','Alta','Crítica')),
  last_contact date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text not null,
  diagnosis_date date,
  responsible text,
  status text not null default 'Pendiente',
  urgency text default 'Media' check (urgency in ('Baja','Media','Alta','Crítica')),
  current_situation text,
  main_problem text,
  infrastructure text,
  network_notes text,
  servers text,
  security_notes text,
  software_used text,
  cloud_current text,
  telecommunications text,
  risks text,
  needs text,
  technical_recommendation text,
  recommended_services text,
  next_action text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  quote_number text not null unique,
  company_name text not null,
  service text,
  status text not null default 'Borrador',
  sent_date date,
  expires_at date,
  responsible text,
  amount numeric(12,2),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  company_name text not null,
  service text,
  responsible text,
  start_date date,
  estimated_end_date date,
  status text not null default 'Pendiente de inicio',
  priority text default 'Media' check (priority in ('Baja','Media','Alta','Crítica')),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  ticket_number text not null unique,
  company_name text not null,
  issue_type text,
  priority text default 'Media' check (priority in ('Baja','Media','Alta','Crítica')),
  status text not null default 'Nueva',
  responsible text,
  opened_at date default current_date,
  quick_action text,
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.maintenance_plans (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text not null,
  maintenance_type text,
  frequency text,
  last_review date,
  next_review date,
  responsible text,
  status text default 'Activo',
  included_systems text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  asset_name text not null,
  company_name text,
  asset_type text,
  brand text,
  model text,
  location text,
  status text default 'Operativo',
  warranty_until date,
  service_associated text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  support_ticket_id uuid references public.support_tickets(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  company_name text not null,
  entry_date date not null default current_date,
  technician text not null,
  work_type text,
  hours numeric(8,2) default 0 check (hours >= 0),
  related_to text,
  billable_status text not null default 'Pendiente',
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  support_ticket_id uuid references public.support_tickets(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  company_name text not null,
  used_at date not null default current_date,
  material_name text not null,
  quantity numeric(10,2) default 1 check (quantity >= 0),
  unit_cost numeric(12,2),
  unit_price numeric(12,2),
  supplier text,
  related_to text,
  billable_status text not null default 'Pendiente',
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_notes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  support_ticket_id uuid references public.support_tickets(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  note_number text not null unique,
  company_name text not null,
  issued_at date default current_date,
  status text not null default 'Borrador',
  signed_by text,
  related_to text,
  billable_status text not null default 'Pendiente',
  storage_path text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text not null,
  period text not null,
  status text not null default 'Pendiente',
  reviewer text,
  time_amount numeric(12,2) default 0,
  materials_amount numeric(12,2) default 0,
  total_amount numeric(12,2) default 0,
  next_action text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_supervision (
  id uuid primary key default gen_random_uuid(),
  supervision_date date not null default current_date,
  responsible text not null,
  open_tickets integer default 0 check (open_tickets >= 0),
  critical_tickets integer default 0 check (critical_tickets >= 0),
  pending_maintenance integer default 0 check (pending_maintenance >= 0),
  pending_billing integer default 0 check (pending_billing >= 0),
  status text not null default 'Sin revisar',
  summary text,
  next_action text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  related_to text,
  task_type text,
  priority text default 'Media' check (priority in ('Baja','Media','Alta','Crítica')),
  due_date date,
  responsible text,
  status text not null default 'Pendiente',
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.communications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text not null,
  channel text,
  communication_date date default current_date,
  responsible text,
  summary text,
  next_action text,
  related_to text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  title text not null,
  document_type text,
  status text default 'Borrador',
  storage_path text,
  responsible text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  relationship_type text not null default 'Tecnología utilizada',
  usage_notes text,
  status text default 'Confirmado internamente',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  title text not null,
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists companies_status_idx on public.companies(status);
create index if not exists companies_priority_idx on public.companies(priority);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists opportunities_stage_idx on public.opportunities(stage);
create index if not exists support_priority_idx on public.support_tickets(priority);
create index if not exists tasks_due_date_idx on public.tasks(due_date);
create index if not exists maintenance_next_review_idx on public.maintenance_plans(next_review);
create index if not exists time_entries_entry_date_idx on public.time_entries(entry_date);
create index if not exists time_entries_company_idx on public.time_entries(company_id);
create index if not exists materials_used_at_idx on public.materials(used_at);
create index if not exists materials_company_idx on public.materials(company_id);
create index if not exists delivery_notes_status_idx on public.delivery_notes(status);
create index if not exists billing_reviews_status_idx on public.billing_reviews(status);
create index if not exists daily_supervision_date_idx on public.daily_supervision(supervision_date);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles','companies','contacts','leads','opportunities','diagnostics','quotes','projects',
    'support_tickets','maintenance_plans','assets','time_entries','materials','delivery_notes',
    'billing_reviews','daily_supervision','tasks','communications','documents','technologies','activities'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists "Authenticated users can read %I" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Authenticated users can insert %I" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Authenticated users can update %I" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Authenticated users can delete %I" on public.%I', table_name, table_name);
    execute format('create policy "Authenticated users can read %I" on public.%I for select to authenticated using (true)', table_name, table_name);
    execute format('create policy "Authenticated users can insert %I" on public.%I for insert to authenticated with check (true)', table_name, table_name);
    execute format('create policy "Authenticated users can update %I" on public.%I for update to authenticated using (true) with check (true)', table_name, table_name);
    execute format('create policy "Authenticated users can delete %I" on public.%I for delete to authenticated using (true)', table_name, table_name);
  end loop;
end $$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles','companies','contacts','leads','opportunities','diagnostics','quotes','projects',
    'support_tickets','maintenance_plans','assets','time_entries','materials','delivery_notes',
    'billing_reviews','daily_supervision','tasks','communications','documents','technologies'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create or replace function public.create_task_for_new_lead()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.tasks(title, related_to, task_type, priority, due_date, responsible, status, description, created_by)
  values ('Primer contacto lead', new.company_name, 'Comercial', coalesce(new.urgency, 'Media'), current_date + interval '1 day', new.responsible, 'Pendiente', 'Tarea automática creada al registrar lead.', new.created_by);
  return new;
end;
$$;

drop trigger if exists lead_first_contact_task on public.leads;
create trigger lead_first_contact_task after insert on public.leads for each row execute function public.create_task_for_new_lead();

create or replace function public.create_task_for_sent_quote()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status in ('Enviado','Pendiente de respuesta') and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    insert into public.tasks(title, related_to, task_type, priority, due_date, responsible, status, description, created_by)
    values ('Seguimiento de presupuesto', new.company_name, 'Comercial', 'Media', coalesce(new.sent_date, current_date) + interval '3 days', new.responsible, 'Pendiente', 'Tarea automática creada al enviar presupuesto.', new.created_by);
  end if;
  return new;
end;
$$;

drop trigger if exists quote_followup_task on public.quotes;
create trigger quote_followup_task after insert or update of status on public.quotes for each row execute function public.create_task_for_sent_quote();

create or replace function public.create_project_for_won_opportunity()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.stage = 'Cerrado ganado' and (tg_op = 'INSERT' or old.stage is distinct from new.stage) then
    insert into public.projects(company_id, opportunity_id, company_name, service, responsible, start_date, status, priority, progress, notes, created_by)
    values (new.company_id, new.id, new.company_name, new.service, new.responsible, current_date, 'Pendiente de inicio', new.priority, 0, 'Proyecto creado automáticamente desde oportunidad ganada.', new.created_by);
  end if;
  return new;
end;
$$;

drop trigger if exists won_opportunity_project on public.opportunities;
create trigger won_opportunity_project after insert or update of stage on public.opportunities for each row execute function public.create_project_for_won_opportunity();

insert into public.companies(name, sector, status, services, last_contact, next_action, responsible, priority, technology_needs, notes)
values
('Empresa Demo Educación','Centros educativos','Cliente activo','Mantenimiento informático, gestión de redes, soporte remoto', current_date - 2, 'Revisión preventiva', 'Técnico Demo', 'Alta', 'Continuidad, red y soporte de aulas', 'Datos demo permitidos'),
('Empresa Demo Legal','Despachos de abogados','Cliente con proyecto activo','Ciberseguridad, cloud, soporte remoto', current_date, 'Validar propuesta técnica', 'Comercial Demo', 'Crítica', 'Protección de sistemas y copias', 'Datos demo permitidos'),
('Empresa Demo Hotel','Hoteles','Cliente en mantenimiento','Soporte presencial, redes WiFi profesionales, hardware', current_date - 5, 'Auditoría WiFi', 'Técnico Demo', 'Media', 'Cobertura WiFi y continuidad', 'Datos demo permitidos'),
('Empresa Demo Comercio','Comercios','Cliente potencial','Desarrollo web, TPV, soporte presencial', current_date - 1, 'Llamada diagnóstico', 'Comercial Demo', 'Alta', 'Digitalización y equipamiento', 'Datos demo permitidos'),
('Empresa Demo Servicios','Empresas de servicios','Recontactar','ERP online, APIs e integraciones', current_date - 12, 'Seguimiento futuro', 'Usuario Demo', 'Baja', 'Optimización de procesos digitales', 'Datos demo permitidos')
on conflict do nothing;

insert into public.opportunities(company_id, company_name, title, service, estimated_value, probability, stage, next_action, responsible, priority, last_contact)
select id, name, title, service, amount, probability, stage, next_action, responsible, priority, current_date
from (
  select 'Empresa Demo Legal' company_name, 'Auditoría de ciberseguridad' title, 'Auditorías de seguridad' service, 8900 amount, 70 probability, 'Diagnóstico tecnológico' stage, 'Enviar alcance técnico' next_action, 'Comercial Demo' responsible, 'Crítica' priority
  union all select 'Empresa Demo Servicios','Migración cloud documental','Migración a la nube',12400,45,'Reunión agendada','Reunión técnica','Técnico Demo','Alta'
  union all select 'Empresa Demo Educación','Mantenimiento integral anual','Mantenimiento informático',18600,82,'Presupuesto enviado','Revisar contrato','Comercial Demo','Alta'
  union all select 'Empresa Demo Hotel','Renovación red WiFi','Redes WiFi profesionales',6300,55,'Solución propuesta','Diagnóstico presencial','Técnico Demo','Media'
) seed
join public.companies c on c.name = seed.company_name
on conflict do nothing;

insert into public.support_tickets(company_id, ticket_number, company_name, issue_type, priority, status, responsible, opened_at, quick_action, description)
select c.id, seed.ticket_number, c.name, seed.issue_type, seed.priority, seed.status, seed.responsible, current_date, seed.quick_action, seed.description
from (
  select 'Empresa Demo Legal' company_name, 'TK-3218' ticket_number, 'Seguridad' issue_type, 'Crítica' priority, 'Escalada' status, 'Técnico Demo' responsible, 'Aislar equipo' quick_action, 'Incidencia crítica demo'
  union all select 'Empresa Demo Hotel','TK-3211','Red','Alta','En proceso','Técnico Demo','Revisar router','Conectividad inestable'
  union all select 'Empresa Demo Educación','TK-3198','Soporte remoto','Media','Esperando cliente','Usuario Demo','Confirmar acceso','Soporte pendiente'
) seed
join public.companies c on c.name = seed.company_name
on conflict (ticket_number) do nothing;

insert into public.maintenance_plans(company_id, company_name, maintenance_type, frequency, last_review, next_review, responsible, status, included_systems)
select c.id, c.name, seed.maintenance_type, seed.frequency, current_date - 30, current_date + seed.days, seed.responsible, seed.status, seed.included_systems
from (
  select 'Empresa Demo Educación' company_name, 'Mantenimiento preventivo' maintenance_type, 'Mensual' frequency, 5, 'Técnico Demo' responsible, 'Programado' status, 'Aulas, red y equipos' included_systems
  union all select 'Empresa Demo Hotel','Gestión de redes','Trimestral',12,'Técnico Demo','Atención','WiFi, routers y antenas'
  union all select 'Empresa Demo Legal','Seguridad','Semestral',9,'Técnico Demo','Crítico','Firewall, endpoints y cloud'
) seed
join public.companies c on c.name = seed.company_name;

insert into public.time_entries(company_id, company_name, entry_date, technician, work_type, hours, related_to, billable_status, description)
select c.id, c.name, current_date - seed.days, seed.technician, seed.work_type, seed.hours, seed.related_to, seed.billable_status, seed.description
from (
  select 'Empresa Demo Legal' company_name, 0 days, 'Técnico Demo' technician, 'Soporte remoto' work_type, 2.50 hours, 'TK-3218' related_to, 'Facturable' billable_status, 'Contención y revisión inicial de incidencia crítica.' description
  union all select 'Empresa Demo Hotel', 1, 'Técnico Demo', 'Soporte presencial', 3.00, 'TK-3211', 'Pendiente', 'Revisión de conectividad y puntos WiFi.'
  union all select 'Empresa Demo Educación', 2, 'Usuario Demo', 'Mantenimiento', 1.75, 'Mantenimiento preventivo', 'Revisar', 'Comprobación de equipos de aula y red.'
) seed
join public.companies c on c.name = seed.company_name
where not exists (
  select 1 from public.time_entries t where t.company_name = seed.company_name and t.related_to = seed.related_to and t.entry_date = current_date - seed.days
);

insert into public.materials(company_id, company_name, used_at, material_name, quantity, unit_cost, unit_price, supplier, related_to, billable_status, notes)
select c.id, c.name, current_date - seed.days, seed.material_name, seed.quantity, seed.unit_cost, seed.unit_price, seed.supplier, seed.related_to, seed.billable_status, seed.notes
from (
  select 'Empresa Demo Hotel' company_name, 1 days, 'Repetidor WiFi profesional' material_name, 2::numeric quantity, 68::numeric unit_cost, 95::numeric unit_price, 'Proveedor pendiente de confirmar' supplier, 'TK-3211' related_to, 'Facturable' billable_status, 'Material demo para cobertura WiFi.' notes
  union all select 'Empresa Demo Educación', 2, 'Latiguillo de red Cat6', 12, 2.40, 5.50, 'Proveedor pendiente de confirmar', 'Mantenimiento preventivo', 'Pendiente', 'Reposición en aula demo.'
  union all select 'Empresa Demo Legal', 0, 'Licencia endpoint seguridad', 4, 18, 29, 'Proveedor pendiente de confirmar', 'TK-3218', 'Revisar', 'Licencias demo pendientes de validación.'
) seed
join public.companies c on c.name = seed.company_name
where not exists (
  select 1 from public.materials m where m.company_name = seed.company_name and m.material_name = seed.material_name and m.related_to = seed.related_to
);

insert into public.delivery_notes(company_id, note_number, company_name, issued_at, status, signed_by, related_to, billable_status, notes)
select c.id, seed.note_number, c.name, current_date - seed.days, seed.status, seed.signed_by, seed.related_to, seed.billable_status, seed.notes
from (
  select 'Empresa Demo Hotel' company_name, 'ALB-2026-0001' note_number, 1 days, 'Pendiente de firma' status, null::text signed_by, 'TK-3211' related_to, 'Facturable' billable_status, 'Albarán demo de intervención presencial.' notes
  union all select 'Empresa Demo Educación', 'ALB-2026-0002', 2, 'Firmado', 'Contacto Demo', 'Mantenimiento preventivo', 'Revisar', 'Albarán demo firmado por contacto ficticio.'
) seed
join public.companies c on c.name = seed.company_name
on conflict (note_number) do nothing;

insert into public.billing_reviews(company_id, company_name, period, status, reviewer, time_amount, materials_amount, total_amount, next_action, notes)
select c.id, c.name, seed.period, seed.status, seed.reviewer, seed.time_amount, seed.materials_amount, seed.total_amount, seed.next_action, seed.notes
from (
  select 'Empresa Demo Hotel' company_name, to_char(current_date, 'YYYY-MM') period, 'Revisar' status, 'Usuario Demo' reviewer, 180::numeric time_amount, 190::numeric materials_amount, 370::numeric total_amount, 'Validar albarán firmado' next_action, 'Revisión demo pendiente.' notes
  union all select 'Empresa Demo Legal', to_char(current_date, 'YYYY-MM'), 'Facturable', 'Usuario Demo', 150, 116, 266, 'Preparar factura', 'Revisión demo lista para facturar.'
) seed
join public.companies c on c.name = seed.company_name
where not exists (
  select 1 from public.billing_reviews b where b.company_name = seed.company_name and b.period = seed.period
);

insert into public.daily_supervision(supervision_date, responsible, open_tickets, critical_tickets, pending_maintenance, pending_billing, status, summary, next_action)
select current_date, 'Usuario Demo', 3, 1, 3, 4, 'Requiere acción', 'Supervisión demo: revisar incidencia crítica, albaranes pendientes y materiales facturables.', 'Priorizar TK-3218 y cerrar revisión de facturación'
where not exists (select 1 from public.daily_supervision where supervision_date = current_date);

insert into public.technologies(name, relationship_type, usage_notes, status)
values
('Dell','Fabricante habitual','Equipamiento y estaciones','Confirmado internamente'),
('Cisco','Tecnología utilizada','Redes y conectividad','Confirmado internamente'),
('HP','Fabricante habitual','Equipos y periféricos','Confirmado internamente'),
('Microsoft','Tecnología utilizada','Cloud, productividad y sistemas','Confirmado internamente'),
('Fortinet','Tecnología utilizada','Seguridad perimetral','Confirmado internamente'),
('VMware','Tecnología utilizada','Virtualización','Confirmado internamente'),
('Synology','Fabricante habitual','NAS y copias','Confirmado internamente')
on conflict (name) do nothing;
