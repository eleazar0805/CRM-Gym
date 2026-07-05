insert into public.companies(name, sector, status, services, last_contact, next_action, responsible, priority, technology_needs, notes)
values
('Empresa Demo Educación','Centros educativos','Cliente activo','Mantenimiento informático, gestión de redes, soporte remoto', current_date - 2, 'Revisión preventiva', 'Técnico Demo', 'Alta', 'Continuidad, red y soporte de aulas', 'Datos demo permitidos para presentación'),
('Empresa Demo Legal','Despachos de abogados','Cliente con proyecto activo','Ciberseguridad, cloud, soporte remoto', current_date, 'Validar propuesta técnica', 'Comercial Demo', 'Crítica', 'Protección de sistemas y copias', 'Datos demo permitidos para presentación'),
('Empresa Demo Hotel','Hoteles','Cliente en mantenimiento','Soporte presencial, redes WiFi profesionales, hardware', current_date - 5, 'Auditoría WiFi', 'Técnico Demo', 'Media', 'Cobertura WiFi y continuidad', 'Datos demo permitidos para presentación'),
('Empresa Demo Comercio','Comercios','Cliente potencial','Desarrollo web, TPV, soporte presencial', current_date - 1, 'Llamada diagnóstico', 'Comercial Demo', 'Alta', 'Digitalización y equipamiento', 'Datos demo permitidos para presentación'),
('Empresa Demo Servicios','Empresas de servicios','Recontactar','ERP online, APIs e integraciones', current_date - 12, 'Seguimiento futuro', 'Usuario Demo', 'Baja', 'Optimización de procesos digitales', 'Datos demo permitidos para presentación'),
('Centro Demo Formación','Escuelas','Lead','Consultoría informática, planificación IT', current_date - 3, 'Primer contacto', 'Comercial Demo', 'Media', 'Planificar mantenimiento y soporte', 'Datos demo permitidos para presentación'),
('Oficina Demo Madrid','Oficinas','Cliente activo','Gestión de servidores, protección de sistemas, comunicaciones seguras', current_date - 4, 'Renovar mantenimiento', 'Técnico Demo', 'Alta', 'Servidor, backups y seguridad perimetral', 'Datos demo permitidos para presentación'),
('Empresa Demo Industria','Pymes','Cliente potencial','Optimización de infraestructura tecnológica, conectividad empresarial', current_date - 6, 'Preparar diagnóstico tecnológico', 'Comercial Demo', 'Media', 'Red corporativa, equipos y conectividad', 'Datos demo permitidos para presentación')
on conflict do nothing;

insert into public.contacts(company_id, company_name, name, role, email, phone, last_contact, next_action, notes)
select c.id, c.name, seed.name, seed.role, seed.email, seed.phone, current_date - seed.days, seed.next_action, 'Contacto demo de presentación'
from (
  select 'Empresa Demo Educación' company_name, 'Contacto Demo Educación' name, 'Administración' role, 'educacion.demo@example.com' email, '600000001' phone, 2, 'Confirmar revisión preventiva' next_action
  union all select 'Empresa Demo Legal','Contacto Demo Legal','Dirección','legal.demo@example.com','600000002',0,'Validar alcance de seguridad'
  union all select 'Empresa Demo Hotel','Contacto Demo Hotel','Operaciones','hotel.demo@example.com','600000003',5,'Coordinar visita técnica'
  union all select 'Empresa Demo Comercio','Contacto Demo Comercio','Gerencia','comercio.demo@example.com','600000004',1,'Llamada de diagnóstico'
  union all select 'Empresa Demo Servicios','Contacto Demo Servicios','Administración','servicios.demo@example.com','600000005',12,'Seguimiento futuro'
  union all select 'Centro Demo Formación','Contacto Demo Formación','Coordinación','formacion.demo@example.com','600000006',3,'Primer contacto'
  union all select 'Oficina Demo Madrid','Contacto Demo Oficina','Responsable oficina','oficina.demo@example.com','600000007',4,'Renovar mantenimiento'
  union all select 'Empresa Demo Industria','Contacto Demo Industria','Operaciones','industria.demo@example.com','600000008',6,'Preparar diagnóstico'
) seed
join public.companies c on c.name = seed.company_name
where not exists (select 1 from public.contacts existing where existing.email = seed.email);

insert into public.leads(company_id, company_name, source, service_interest, urgency, status, responsible, next_follow_up, notes)
select c.id, c.name, seed.source, seed.service_interest, seed.urgency, seed.status, seed.responsible, current_date + seed.days, 'Lead demo de presentación'
from (
  select 'Centro Demo Formación' company_name, 'Web' source, 'Consultoría informática' service_interest, 'Media' urgency, 'Sin contactar' status, 'Comercial Demo' responsible, 1
  union all select 'Empresa Demo Industria','Referido','Optimización de infraestructura tecnológica','Alta','Necesidad identificada','Comercial Demo',2
  union all select 'Empresa Demo Comercio','Teléfono','Desarrollo web','Media','Contactado','Comercial Demo',3
  union all select 'Empresa Demo Servicios','Email','APIs e integraciones','Baja','Seguimiento futuro','Usuario Demo',10
) seed
join public.companies c on c.name = seed.company_name;

insert into public.opportunities(company_id, company_name, title, service, estimated_value, probability, stage, next_action, responsible, priority, last_contact)
select c.id, c.name, seed.title, seed.service, seed.amount, seed.probability, seed.stage, seed.next_action, seed.responsible, seed.priority, current_date - seed.days
from (
  select 'Empresa Demo Legal' company_name, 'Auditoría de ciberseguridad' title, 'Auditorías de seguridad' service, 8900 amount, 70 probability, 'Diagnóstico tecnológico' stage, 'Enviar alcance técnico' next_action, 'Comercial Demo' responsible, 'Crítica' priority, 0
  union all select 'Empresa Demo Servicios','Migración cloud documental','Migración a la nube',12400,45,'Reunión agendada','Reunión técnica','Técnico Demo','Alta',1
  union all select 'Empresa Demo Educación','Mantenimiento integral anual','Mantenimiento informático',18600,82,'Presupuesto enviado','Revisar contrato','Comercial Demo','Alta',2
  union all select 'Empresa Demo Hotel','Renovación red WiFi','Redes WiFi profesionales',6300,55,'Solución propuesta','Diagnóstico presencial','Técnico Demo','Media',5
  union all select 'Empresa Demo Comercio','Portal web corporativo','Desarrollo web',4800,35,'Primer contacto','Definir alcance web','Comercial Demo','Media',1
  union all select 'Centro Demo Formación','Plan IT anual','Planificación IT',7200,30,'Nuevo lead','Primer contacto','Comercial Demo','Media',3
  union all select 'Oficina Demo Madrid','Hardening servidor y backups','Protección de sistemas',9800,60,'Negociación','Validar calendario','Técnico Demo','Alta',4
  union all select 'Empresa Demo Industria','Red corporativa y conectividad','Conectividad empresarial',11200,40,'Necesidad identificada','Preparar diagnóstico','Comercial Demo','Media',6
) seed
join public.companies c on c.name = seed.company_name;

insert into public.diagnostics(company_id, company_name, diagnosis_date, responsible, status, urgency, current_situation, main_problem, infrastructure, network_notes, servers, security_notes, software_used, cloud_current, telecommunications, risks, needs, technical_recommendation, recommended_services, next_action)
select c.id, c.name, current_date - seed.days, seed.responsible, seed.status, seed.urgency, seed.current_situation, seed.main_problem, seed.infrastructure, seed.network_notes, seed.servers, seed.security_notes, seed.software_used, seed.cloud_current, seed.telecommunications, seed.risks, seed.needs, seed.recommendation, seed.services, seed.next_action
from (
  select 'Empresa Demo Legal' company_name, 0, 'Técnico Demo' responsible, 'En análisis' status, 'Crítica' urgency, 'Entorno híbrido con soporte reactivo' current_situation, 'Riesgo de continuidad ante incidente' main_problem, 'Servidor local y cloud documental' infrastructure, 'Segmentación pendiente' network_notes, 'Backups en revisión' servers, 'Endpoints sin política unificada' security_notes, 'Ofimática y software sectorial' software_used, 'Almacenamiento cloud activo' cloud_current, 'Telefonía IP básica' telecommunications, 'Acceso remoto y copias mejorables' risks, 'Plan de seguridad y mantenimiento' needs, 'Auditoría, hardening y monitorización' recommendation, 'Ciberseguridad, cloud, soporte continuo' services, 'Informe de riesgos' next_action
  union all select 'Empresa Demo Hotel',2,'Técnico Demo','Pendiente','Alta','Red WiFi con cobertura irregular','Caídas de conectividad en zonas comunes','Routers y repetidores WiFi','Mapa de cobertura pendiente','Sin servidor local crítico','Contraseñas WiFi por revisar','Software de gestión hotelera','Cloud básico','Telefonía IP','Cortes de servicio','Red WiFi profesional','Medición presencial y propuesta de red','Redes WiFi profesionales, electrónica de red','Visita técnica'
  union all select 'Empresa Demo Industria',1,'Comercial Demo','Pendiente','Media','Infraestructura distribuida por áreas','Necesidad de ordenar conectividad','Equipos y red corporativa','Electrónica de red a revisar','Servidor básico','Seguridad perimetral pendiente','Programas de gestión empresarial','Sin migración cloud definida','Conectividad empresarial','Paradas operativas','Diagnóstico de infraestructura','Plan de mejora por fases','Conectividad empresarial, optimización de infraestructura','Preparar diagnóstico'
) seed
join public.companies c on c.name = seed.company_name;

insert into public.quotes(company_id, quote_number, company_name, service, status, sent_date, expires_at, responsible, amount, notes)
select c.id, seed.quote_number, c.name, seed.service, seed.status, current_date - seed.sent_days, current_date + seed.expires_days, seed.responsible, seed.amount, 'Presupuesto demo de presentación'
from (
  select 'Empresa Demo Legal' company_name, 'PRE-2026-018' quote_number, 'Auditorías de seguridad' service, 'Pendiente de respuesta' status, 2 sent_days, 12 expires_days, 'Comercial Demo' responsible, 8900 amount
  union all select 'Empresa Demo Educación','PRE-2026-017','Mantenimiento informático','En negociación',4,10,'Comercial Demo',18600
  union all select 'Empresa Demo Hotel','PRE-2026-016','Redes WiFi profesionales','Enviado',1,14,'Técnico Demo',6300
  union all select 'Oficina Demo Madrid','PRE-2026-015','Protección de sistemas','Borrador',0,20,'Técnico Demo',9800
) seed
join public.companies c on c.name = seed.company_name
on conflict (quote_number) do nothing;

insert into public.projects(company_id, company_name, service, responsible, start_date, estimated_end_date, status, priority, progress, notes)
select c.id, c.name, seed.service, seed.responsible, current_date - seed.start_days, current_date + seed.end_days, seed.status, seed.priority, seed.progress, 'Proyecto demo de presentación'
from (
  select 'Empresa Demo Legal' company_name, 'Ciberseguridad' service, 'Técnico Demo' responsible, 5 start_days, 20 end_days, 'Ejecución' status, 'Crítica' priority, 44 progress
  union all select 'Empresa Demo Hotel','Redes WiFi profesionales','Técnico Demo',10,12,'Pruebas','Alta',72
  union all select 'Empresa Demo Comercio','Desarrollo web','Usuario Demo',2,25,'Planificación','Media',18
  union all select 'Oficina Demo Madrid','Gestión de servidores','Técnico Demo',12,8,'Revisión cliente','Alta',88
) seed
join public.companies c on c.name = seed.company_name;

insert into public.support_tickets(company_id, ticket_number, company_name, issue_type, priority, status, responsible, opened_at, quick_action, description)
select c.id, seed.ticket_number, c.name, seed.issue_type, seed.priority, seed.status, seed.responsible, current_date - seed.days, seed.quick_action, seed.description
from (
  select 'Empresa Demo Legal' company_name, 'TK-3218' ticket_number, 'Seguridad' issue_type, 'Crítica' priority, 'Escalada' status, 'Técnico Demo' responsible, 0, 'Aislar equipo' quick_action, 'Incidencia crítica demo'
  union all select 'Empresa Demo Hotel','TK-3211','Red','Alta','En proceso','Técnico Demo',1,'Revisar router','Conectividad inestable'
  union all select 'Empresa Demo Educación','TK-3198','Soporte remoto','Media','Esperando cliente','Usuario Demo',3,'Confirmar acceso','Soporte pendiente'
  union all select 'Oficina Demo Madrid','TK-3180','Servidor','Alta','En revisión','Técnico Demo',4,'Analizar logs','Revisión de servidor'
  union all select 'Empresa Demo Comercio','TK-3164','Software','Baja','Nueva','Comercial Demo',5,'Clasificar','Consulta de software'
) seed
join public.companies c on c.name = seed.company_name
on conflict (ticket_number) do nothing;

insert into public.maintenance_plans(company_id, company_name, maintenance_type, frequency, last_review, next_review, responsible, status, included_systems)
select c.id, c.name, seed.maintenance_type, seed.frequency, current_date - seed.last_days, current_date + seed.next_days, seed.responsible, seed.status, seed.included_systems
from (
  select 'Empresa Demo Educación' company_name, 'Mantenimiento preventivo' maintenance_type, 'Mensual' frequency, 30 last_days, 5 next_days, 'Técnico Demo' responsible, 'Programado' status, 'Aulas, red y equipos' included_systems
  union all select 'Empresa Demo Hotel','Gestión de redes','Trimestral',80,12,'Técnico Demo','Atención','WiFi, routers y antenas'
  union all select 'Empresa Demo Legal','Seguridad','Semestral',160,9,'Técnico Demo','Crítico','Firewall, endpoints y cloud'
  union all select 'Oficina Demo Madrid','Gestión de servidores','Mensual',25,7,'Usuario Demo','Activo','Servidor, copias y seguridad'
) seed
join public.companies c on c.name = seed.company_name;

insert into public.assets(company_id, asset_name, company_name, asset_type, brand, model, location, status, warranty_until, service_associated)
select c.id, seed.asset_name, c.name, seed.asset_type, seed.brand, seed.model, seed.location, seed.status, current_date + seed.warranty_days, seed.service
from (
  select 'Empresa Demo Legal' company_name, 'Servidor NAS principal' asset_name, 'Servidor' asset_type, 'Synology' brand, 'DS923+' model, 'Sala técnica' location, 'Operativo' status, 365 warranty_days, 'Soluciones cloud' service
  union all select 'Empresa Demo Hotel','Router perimetral','Router','Cisco','RV340','Recepción','Revisión',180,'Gestión de redes'
  union all select 'Empresa Demo Comercio','Portátil dirección','Ordenador portátil','HP','EliteBook','Oficina','Operativo',720,'Soporte remoto'
  union all select 'Oficina Demo Madrid','Firewall oficina','Equipo de red','Fortinet','FortiGate 60F','Rack','Operativo',540,'Protección de sistemas'
) seed
join public.companies c on c.name = seed.company_name;

insert into public.tasks(title, related_to, task_type, priority, due_date, responsible, status, description)
values
('Enviar propuesta revisada', 'Empresa Demo Legal', 'Comercial', 'Alta', current_date, 'Comercial Demo', 'Pendiente', 'Tarea demo de presentación'),
('Auditar firewall', 'Oficina Demo Madrid', 'Técnica', 'Crítica', current_date + 1, 'Técnico Demo', 'En revisión', 'Tarea demo de presentación'),
('Confirmar acceso remoto', 'Empresa Demo Educación', 'Soporte', 'Media', current_date + 3, 'Usuario Demo', 'Pendiente', 'Tarea demo de presentación'),
('Preparar informe mensual', 'Empresa Demo Hotel', 'Mantenimiento', 'Baja', current_date + 7, 'Técnico Demo', 'Borrador', 'Tarea demo de presentación');

insert into public.communications(company_id, company_name, channel, communication_date, responsible, summary, next_action, related_to)
select c.id, c.name, seed.channel, current_date - seed.days, seed.responsible, seed.summary, seed.next_action, seed.related_to
from (
  select 'Empresa Demo Educación' company_name, 'Teléfono' channel, 1, 'Técnico Demo' responsible, 'Confirmada revisión preventiva' summary, 'Programar intervención' next_action, 'Mantenimiento' related_to
  union all select 'Empresa Demo Legal','Email',0,'Comercial Demo','Enviado alcance técnico','Esperar validación','Oportunidad'
  union all select 'Empresa Demo Comercio','Reunión',1,'Usuario Demo','Requisitos de portal web','Preparar propuesta','Proyecto'
  union all select 'Empresa Demo Hotel','Soporte remoto',3,'Técnico Demo','Revisión de conectividad','Visita técnica','Incidencia'
  union all select 'Oficina Demo Madrid','WhatsApp',2,'Comercial Demo','Confirmado horario de intervención','Auditar firewall','Mantenimiento'
) seed
join public.companies c on c.name = seed.company_name;

insert into public.documents(company_id, company_name, title, document_type, status, storage_path, responsible, notes)
select c.id, c.name, seed.title, seed.document_type, seed.status, seed.storage_path, seed.responsible, 'Documento demo de presentación'
from (
  select 'Empresa Demo Legal' company_name, 'Informe diagnóstico seguridad' title, 'Informe técnico' document_type, 'En revisión' status, 'demo/informe-seguridad.pdf' storage_path, 'Técnico Demo' responsible
  union all select 'Empresa Demo Educación','Presupuesto mantenimiento anual','Presupuesto','Enviado','demo/presupuesto-mantenimiento.pdf','Comercial Demo'
  union all select 'Empresa Demo Hotel','Acta reunión técnica','Acta','Completado','demo/acta-redes.pdf','Usuario Demo'
) seed
join public.companies c on c.name = seed.company_name;

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
