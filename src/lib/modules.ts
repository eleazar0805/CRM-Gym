import type { ModuleConfig } from "@/lib/types";
import { pipelineStages, priorities, serviceCategories, services } from "@/lib/catalog";

const sectors = [
  "Centros educativos",
  "Escuelas",
  "Despachos de abogados",
  "Agencias",
  "Restaurantes",
  "Hoteles",
  "Comercios",
  "Oficinas",
  "Empresas de servicios",
  "Pymes",
  "Otro"
];

const companyStates = [
  "Lead",
  "Cliente potencial",
  "Cliente activo",
  "Cliente en mantenimiento",
  "Cliente con proyecto activo",
  "Cliente antiguo",
  "Cliente perdido",
  "Recontactar"
];

const leadStates = [
  "Nuevo",
  "Sin contactar",
  "Contactado",
  "Interesado",
  "Necesidad identificada",
  "Reunión agendada",
  "Diagnóstico pendiente",
  "Convertido en oportunidad",
  "No interesado",
  "Descartado",
  "Seguimiento futuro"
];

const quoteStates = ["Borrador", "En revisión", "Enviado", "Pendiente de respuesta", "En negociación", "Aceptado", "Rechazado", "Expirado", "Cancelado"];
const projectStates = ["Pendiente de inicio", "Recopilando información", "Planificación", "Ejecución", "Pruebas", "Revisión cliente", "Cambios pendientes", "Entregado", "Finalizado", "Pausado", "Cancelado"];
const ticketStates = ["Nueva", "En revisión", "En proceso", "Esperando cliente", "Escalada", "Resuelta", "Cerrada", "Cancelada"];
const maintenanceTypes = ["Mantenimiento preventivo", "Mantenimiento correctivo", "Soporte continuo", "Gestión de redes", "Gestión de servidores", "Seguridad", "Otro"];
const frequencies = ["Mensual", "Trimestral", "Semestral", "Anual", "Bajo demanda"];
const assetTypes = ["Ordenador portátil", "Ordenador de sobremesa", "Servidor", "TPV", "Pantalla", "Router", "Repetidor WiFi", "Antena", "Equipo de red", "Dispositivo tecnológico", "Software", "Otro"];
const channels = ["Teléfono", "Email", "Reunión", "Soporte remoto", "Soporte presencial", "Web", "WhatsApp", "Otro"];
const billingStatuses = ["Pendiente", "Revisar", "Facturable", "No facturable", "Facturado", "Bloqueado"];
const supervisionStatuses = ["Sin revisar", "Revisado", "Requiere acción", "Escalado"];

export const moduleConfigs: Record<string, ModuleConfig> = {
  companies: {
    slug: "companies",
    title: "Empresas",
    subtitle: "Cartera comercial, clientes activos y cuentas en mantenimiento",
    table: "companies",
    icon: "Building2",
    primaryAction: "Nueva empresa",
    searchColumns: ["name", "sector", "status", "responsible"],
    filterKey: "status",
    detailPath: "/companies",
    columns: [
      { key: "name", label: "Empresa" },
      { key: "sector", label: "Sector" },
      { key: "status", label: "Estado" },
      { key: "services", label: "Servicios contratados" },
      { key: "last_contact", label: "Último contacto" },
      { key: "next_action", label: "Próxima acción" },
      { key: "responsible", label: "Responsable" },
      { key: "priority", label: "Prioridad" }
    ],
    fields: [
      { key: "name", label: "Empresa", required: true },
      { key: "sector", label: "Sector", type: "select", options: sectors },
      { key: "status", label: "Estado", type: "select", options: companyStates },
      { key: "services", label: "Servicios contratados", type: "textarea" },
      { key: "last_contact", label: "Último contacto", type: "date" },
      { key: "next_action", label: "Próxima acción" },
      { key: "responsible", label: "Responsable" },
      { key: "priority", label: "Prioridad", type: "select", options: priorities },
      { key: "notes", label: "Notas internas", type: "textarea" }
    ]
  },
  contacts: {
    slug: "contacts",
    title: "Contactos",
    subtitle: "Personas clave por empresa, rol y próxima comunicación",
    table: "contacts",
    icon: "Users",
    primaryAction: "Nuevo contacto",
    searchColumns: ["name", "company_name", "role", "email"],
    filterKey: "role",
    columns: [
      { key: "name", label: "Contacto" },
      { key: "company_name", label: "Empresa" },
      { key: "role", label: "Rol" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Teléfono" },
      { key: "last_contact", label: "Último contacto" },
      { key: "next_action", label: "Próxima acción" }
    ],
    fields: [
      { key: "name", label: "Contacto", required: true },
      { key: "company_name", label: "Empresa" },
      { key: "role", label: "Rol" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Teléfono" },
      { key: "last_contact", label: "Último contacto", type: "date" },
      { key: "next_action", label: "Próxima acción" },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  leads: {
    slug: "leads",
    title: "Leads",
    subtitle: "Entradas comerciales, fuente, urgencia y seguimiento",
    table: "leads",
    icon: "BadgeEuro",
    primaryAction: "Nuevo lead",
    searchColumns: ["company_name", "source", "service_interest", "responsible"],
    filterKey: "status",
    columns: [
      { key: "company_name", label: "Empresa" },
      { key: "source", label: "Fuente" },
      { key: "service_interest", label: "Servicio de interés" },
      { key: "urgency", label: "Urgencia" },
      { key: "status", label: "Estado" },
      { key: "responsible", label: "Responsable" },
      { key: "next_follow_up", label: "Próximo seguimiento" }
    ],
    fields: [
      { key: "company_name", label: "Empresa", required: true },
      { key: "source", label: "Fuente", type: "select", options: ["Web", "Email", "Teléfono", "Referido", "Cliente existente", "Contacto directo", "Directorio", "Campaña", "Otro"] },
      { key: "service_interest", label: "Servicio de interés", type: "select", options: services },
      { key: "urgency", label: "Urgencia", type: "select", options: priorities },
      { key: "status", label: "Estado", type: "select", options: leadStates },
      { key: "responsible", label: "Responsable" },
      { key: "next_follow_up", label: "Próximo seguimiento", type: "date" },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  opportunities: {
    slug: "opportunities",
    title: "Oportunidades",
    subtitle: "Negocio abierto por servicio, prioridad y probabilidad",
    table: "opportunities",
    icon: "TrendingUp",
    primaryAction: "Nueva oportunidad",
    searchColumns: ["title", "company_name", "service"],
    filterKey: "stage",
    columns: [
      { key: "title", label: "Oportunidad" },
      { key: "company_name", label: "Empresa" },
      { key: "service", label: "Servicio" },
      { key: "estimated_value", label: "Valor estimado" },
      { key: "probability", label: "Probabilidad" },
      { key: "stage", label: "Fase" },
      { key: "next_action", label: "Próxima acción" },
      { key: "priority", label: "Prioridad" }
    ],
    fields: [
      { key: "title", label: "Oportunidad", required: true },
      { key: "company_name", label: "Empresa", required: true },
      { key: "service", label: "Servicio", type: "select", options: services },
      { key: "estimated_value", label: "Valor estimado", type: "number" },
      { key: "probability", label: "Probabilidad", type: "number" },
      { key: "stage", label: "Fase", type: "select", options: pipelineStages },
      { key: "next_action", label: "Próxima acción" },
      { key: "responsible", label: "Responsable" },
      { key: "priority", label: "Prioridad", type: "select", options: priorities }
    ]
  },
  diagnostics: {
    slug: "diagnostics",
    title: "Diagnósticos tecnológicos",
    subtitle: "Consultoría IT, riesgos detectados y recomendaciones",
    table: "diagnostics",
    icon: "ClipboardCheck",
    primaryAction: "Nuevo diagnóstico",
    searchColumns: ["company_name", "responsible", "recommended_services"],
    filterKey: "status",
    columns: [
      { key: "company_name", label: "Empresa" },
      { key: "diagnosis_date", label: "Fecha" },
      { key: "responsible", label: "Responsable" },
      { key: "status", label: "Estado" },
      { key: "urgency", label: "Urgencia" },
      { key: "recommended_services", label: "Servicios recomendados" },
      { key: "next_action", label: "Próxima acción" }
    ],
    fields: [
      { key: "company_name", label: "Empresa", required: true },
      { key: "diagnosis_date", label: "Fecha", type: "date" },
      { key: "responsible", label: "Responsable" },
      { key: "status", label: "Estado", type: "select", options: ["Pendiente", "En análisis", "Completado", "Propuesta preparada", "Cerrado"] },
      { key: "urgency", label: "Urgencia", type: "select", options: priorities },
      { key: "recommended_services", label: "Servicios recomendados", type: "textarea" },
      { key: "risks", label: "Riesgos detectados", type: "textarea" },
      { key: "technical_recommendation", label: "Recomendación técnica", type: "textarea" },
      { key: "next_action", label: "Próxima acción" }
    ]
  },
  quotes: {
    slug: "quotes",
    title: "Presupuestos",
    subtitle: "Propuestas enviadas, vencimientos y estados",
    table: "quotes",
    icon: "FileText",
    primaryAction: "Nuevo presupuesto",
    searchColumns: ["quote_number", "company_name", "service"],
    filterKey: "status",
    columns: [
      { key: "quote_number", label: "Número" },
      { key: "company_name", label: "Empresa" },
      { key: "service", label: "Servicio" },
      { key: "status", label: "Estado" },
      { key: "sent_date", label: "Envío" },
      { key: "expires_at", label: "Vencimiento" },
      { key: "responsible", label: "Responsable" },
      { key: "amount", label: "Importe" }
    ],
    fields: [
      { key: "quote_number", label: "Número", required: true },
      { key: "company_name", label: "Empresa", required: true },
      { key: "service", label: "Servicio", type: "select", options: services },
      { key: "status", label: "Estado", type: "select", options: quoteStates },
      { key: "sent_date", label: "Fecha de envío", type: "date" },
      { key: "expires_at", label: "Vencimiento", type: "date" },
      { key: "responsible", label: "Responsable" },
      { key: "amount", label: "Importe", type: "number" },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  projects: {
    slug: "projects",
    title: "Proyectos",
    subtitle: "Implantaciones, desarrollos, infraestructura y entregas",
    table: "projects",
    icon: "PanelsTopLeft",
    primaryAction: "Nuevo proyecto",
    searchColumns: ["company_name", "service", "responsible"],
    filterKey: "status",
    columns: [
      { key: "company_name", label: "Empresa" },
      { key: "service", label: "Servicio contratado" },
      { key: "responsible", label: "Responsable" },
      { key: "start_date", label: "Inicio" },
      { key: "estimated_end_date", label: "Fecha estimada" },
      { key: "status", label: "Estado" },
      { key: "priority", label: "Prioridad" },
      { key: "progress", label: "Progreso" }
    ],
    fields: [
      { key: "company_name", label: "Empresa", required: true },
      { key: "service", label: "Servicio contratado", type: "select", options: services },
      { key: "responsible", label: "Responsable" },
      { key: "start_date", label: "Fecha inicio", type: "date" },
      { key: "estimated_end_date", label: "Fecha estimada", type: "date" },
      { key: "status", label: "Estado", type: "select", options: projectStates },
      { key: "priority", label: "Prioridad", type: "select", options: priorities },
      { key: "progress", label: "Progreso", type: "number" }
    ]
  },
  support: {
    slug: "support",
    title: "Soporte e incidencias",
    subtitle: "Tickets técnicos, prioridades y tiempos abiertos",
    table: "support_tickets",
    icon: "Wrench",
    primaryAction: "Nueva incidencia",
    detailPath: "/support",
    searchColumns: ["ticket_number", "company_name", "issue_type"],
    filterKey: "priority",
    columns: [
      { key: "ticket_number", label: "Ticket" },
      { key: "company_name", label: "Empresa" },
      { key: "issue_type", label: "Tipo" },
      { key: "priority", label: "Prioridad" },
      { key: "status", label: "Estado" },
      { key: "responsible", label: "Responsable" },
      { key: "opened_at", label: "Apertura" },
      { key: "quick_action", label: "Acción rápida" }
    ],
    fields: [
      { key: "ticket_number", label: "Ticket", required: true },
      { key: "company_name", label: "Empresa", required: true },
      { key: "issue_type", label: "Tipo", type: "select", options: ["Soporte remoto", "Soporte presencial", "Red", "Servidor", "Equipo informático", "Seguridad", "Software", "Cloud", "Telefonía IP", "Hardware", "Otro"] },
      { key: "priority", label: "Prioridad", type: "select", options: priorities },
      { key: "status", label: "Estado", type: "select", options: ticketStates },
      { key: "responsible", label: "Responsable" },
      { key: "opened_at", label: "Fecha apertura", type: "date" },
      { key: "quick_action", label: "Acción rápida" },
      { key: "description", label: "Descripción", type: "textarea" }
    ]
  },
  maintenance: {
    slug: "maintenance",
    title: "Mantenimiento",
    subtitle: "Revisiones preventivas, correctivas y soporte continuo",
    table: "maintenance_plans",
    icon: "ShieldCheck",
    primaryAction: "Programar revisión",
    searchColumns: ["company_name", "maintenance_type", "responsible"],
    filterKey: "status",
    columns: [
      { key: "company_name", label: "Empresa" },
      { key: "maintenance_type", label: "Tipo" },
      { key: "frequency", label: "Frecuencia" },
      { key: "last_review", label: "Última revisión" },
      { key: "next_review", label: "Próxima revisión" },
      { key: "responsible", label: "Responsable" },
      { key: "status", label: "Estado" },
      { key: "included_systems", label: "Sistemas incluidos" }
    ],
    fields: [
      { key: "company_name", label: "Empresa", required: true },
      { key: "maintenance_type", label: "Tipo", type: "select", options: maintenanceTypes },
      { key: "frequency", label: "Frecuencia", type: "select", options: frequencies },
      { key: "last_review", label: "Última revisión", type: "date" },
      { key: "next_review", label: "Próxima revisión", type: "date" },
      { key: "responsible", label: "Responsable" },
      { key: "status", label: "Estado" },
      { key: "included_systems", label: "Sistemas incluidos", type: "textarea" }
    ]
  },
  assets: {
    slug: "assets",
    title: "Tipos de clase",
    subtitle: "Configuración de disciplinas, aforos y sesiones del gimnasio",
    table: "assets",
    icon: "Monitor",
    primaryAction: "Nuevo activo",
    searchColumns: ["asset_name", "company_name", "brand", "model"],
    filterKey: "asset_type",
    columns: [
      { key: "asset_name", label: "Activo" },
      { key: "company_name", label: "Empresa" },
      { key: "asset_type", label: "Tipo" },
      { key: "brand", label: "Marca" },
      { key: "model", label: "Modelo" },
      { key: "location", label: "Ubicación" },
      { key: "status", label: "Estado" },
      { key: "warranty_until", label: "Garantía" }
    ],
    fields: [
      { key: "asset_name", label: "Activo", required: true },
      { key: "company_name", label: "Empresa" },
      { key: "asset_type", label: "Tipo", type: "select", options: assetTypes },
      { key: "brand", label: "Marca" },
      { key: "model", label: "Modelo" },
      { key: "location", label: "Ubicación" },
      { key: "status", label: "Estado" },
      { key: "warranty_until", label: "Garantía", type: "date" },
      { key: "service_associated", label: "Servicio asociado", type: "select", options: services }
    ]
  },
  "time-entries": {
    slug: "time-entries",
    title: "Tiempos",
    subtitle: "Horas de técnicos por cliente, incidencia, proyecto y facturación",
    table: "time_entries",
    icon: "Clock3",
    primaryAction: "Registrar tiempo",
    searchColumns: ["company_name", "technician", "work_type", "related_to", "description"],
    filterKey: "billable_status",
    columns: [
      { key: "entry_date", label: "Fecha" },
      { key: "company_name", label: "Empresa" },
      { key: "technician", label: "Técnico" },
      { key: "work_type", label: "Tipo" },
      { key: "hours", label: "Horas" },
      { key: "related_to", label: "Relacionado con" },
      { key: "billable_status", label: "Facturación" },
      { key: "description", label: "Descripción" }
    ],
    fields: [
      { key: "entry_date", label: "Fecha", type: "date", required: true },
      { key: "company_name", label: "Empresa", required: true },
      { key: "technician", label: "Técnico", required: true },
      { key: "work_type", label: "Tipo de trabajo", type: "select", options: ["Soporte remoto", "Soporte presencial", "Mantenimiento", "Proyecto", "Diagnóstico", "Gestión interna", "Otro"] },
      { key: "hours", label: "Horas", type: "number" },
      { key: "related_to", label: "Relacionado con" },
      { key: "billable_status", label: "Estado facturación", type: "select", options: billingStatuses },
      { key: "description", label: "Descripción", type: "textarea" }
    ]
  },
  materials: {
    slug: "materials",
    title: "Materiales",
    subtitle: "Material utilizado por técnicos, coste, venta y estado facturable",
    table: "materials",
    icon: "Package",
    primaryAction: "Añadir material",
    searchColumns: ["company_name", "material_name", "supplier", "related_to"],
    filterKey: "billable_status",
    columns: [
      { key: "used_at", label: "Fecha" },
      { key: "company_name", label: "Empresa" },
      { key: "material_name", label: "Material" },
      { key: "quantity", label: "Cantidad" },
      { key: "unit_cost", label: "Coste unitario" },
      { key: "unit_price", label: "Venta unitaria" },
      { key: "billable_status", label: "Facturación" },
      { key: "related_to", label: "Relacionado con" }
    ],
    fields: [
      { key: "used_at", label: "Fecha", type: "date", required: true },
      { key: "company_name", label: "Empresa", required: true },
      { key: "material_name", label: "Material", required: true },
      { key: "quantity", label: "Cantidad", type: "number" },
      { key: "unit_cost", label: "Coste unitario", type: "number" },
      { key: "unit_price", label: "Venta unitaria", type: "number" },
      { key: "supplier", label: "Proveedor" },
      { key: "related_to", label: "Relacionado con" },
      { key: "billable_status", label: "Estado facturación", type: "select", options: billingStatuses },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  "delivery-notes": {
    slug: "delivery-notes",
    title: "Albaranes",
    subtitle: "Entregas, trabajos aceptados y documentación pendiente de firma",
    table: "delivery_notes",
    icon: "FileCheck2",
    primaryAction: "Nuevo albarán",
    searchColumns: ["note_number", "company_name", "status", "related_to"],
    filterKey: "status",
    columns: [
      { key: "note_number", label: "Albarán" },
      { key: "company_name", label: "Empresa" },
      { key: "issued_at", label: "Fecha" },
      { key: "status", label: "Estado" },
      { key: "signed_by", label: "Firmado por" },
      { key: "related_to", label: "Relacionado con" },
      { key: "billable_status", label: "Facturación" }
    ],
    fields: [
      { key: "note_number", label: "Número", required: true },
      { key: "company_name", label: "Empresa", required: true },
      { key: "issued_at", label: "Fecha", type: "date" },
      { key: "status", label: "Estado", type: "select", options: ["Borrador", "Enviado", "Pendiente de firma", "Firmado", "Rechazado", "Archivado"] },
      { key: "signed_by", label: "Firmado por" },
      { key: "related_to", label: "Relacionado con" },
      { key: "billable_status", label: "Estado facturación", type: "select", options: billingStatuses },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  "billing-reviews": {
    slug: "billing-reviews",
    title: "Revisión facturación",
    subtitle: "Control previo de horas, materiales, albaranes e incidencias facturables",
    table: "billing_reviews",
    icon: "ClipboardList",
    primaryAction: "Nueva revisión",
    searchColumns: ["company_name", "period", "status", "reviewer"],
    filterKey: "status",
    columns: [
      { key: "period", label: "Periodo" },
      { key: "company_name", label: "Empresa" },
      { key: "status", label: "Estado" },
      { key: "reviewer", label: "Revisor" },
      { key: "time_amount", label: "Horas €" },
      { key: "materials_amount", label: "Materiales €" },
      { key: "total_amount", label: "Total €" },
      { key: "next_action", label: "Próxima acción" }
    ],
    fields: [
      { key: "period", label: "Periodo", required: true, placeholder: "2026-07" },
      { key: "company_name", label: "Empresa", required: true },
      { key: "status", label: "Estado", type: "select", options: billingStatuses },
      { key: "reviewer", label: "Revisor" },
      { key: "time_amount", label: "Importe horas", type: "number" },
      { key: "materials_amount", label: "Importe materiales", type: "number" },
      { key: "total_amount", label: "Total", type: "number" },
      { key: "next_action", label: "Próxima acción" },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  supervision: {
    slug: "supervision",
    title: "Supervisión diaria",
    subtitle: "Vista de control para incidencias, mantenimientos, técnicos y facturación pendiente",
    table: "daily_supervision",
    icon: "Radar",
    primaryAction: "Nueva supervisión",
    searchColumns: ["supervision_date", "responsible", "summary", "status"],
    filterKey: "status",
    columns: [
      { key: "supervision_date", label: "Fecha" },
      { key: "responsible", label: "Responsable" },
      { key: "open_tickets", label: "Incidencias abiertas" },
      { key: "critical_tickets", label: "Críticas" },
      { key: "pending_maintenance", label: "Mantenimientos" },
      { key: "pending_billing", label: "Facturación pendiente" },
      { key: "status", label: "Estado" },
      { key: "next_action", label: "Próxima acción" }
    ],
    fields: [
      { key: "supervision_date", label: "Fecha", type: "date", required: true },
      { key: "responsible", label: "Responsable", required: true },
      { key: "open_tickets", label: "Incidencias abiertas", type: "number" },
      { key: "critical_tickets", label: "Incidencias críticas", type: "number" },
      { key: "pending_maintenance", label: "Mantenimientos pendientes", type: "number" },
      { key: "pending_billing", label: "Elementos pendientes de facturar", type: "number" },
      { key: "status", label: "Estado", type: "select", options: supervisionStatuses },
      { key: "summary", label: "Resumen", type: "textarea" },
      { key: "next_action", label: "Próxima acción" }
    ]
  },
  tasks: {
    slug: "tasks",
    title: "Tareas",
    subtitle: "Acciones comerciales, técnicas y administrativas pendientes",
    table: "tasks",
    icon: "CheckSquare",
    primaryAction: "Nueva tarea",
    searchColumns: ["title", "related_to", "responsible"],
    filterKey: "status",
    columns: [
      { key: "title", label: "Tarea" },
      { key: "related_to", label: "Relación" },
      { key: "task_type", label: "Tipo" },
      { key: "priority", label: "Prioridad" },
      { key: "due_date", label: "Vencimiento" },
      { key: "responsible", label: "Responsable" },
      { key: "status", label: "Estado" }
    ],
    fields: [
      { key: "title", label: "Tarea", required: true },
      { key: "related_to", label: "Relación" },
      { key: "task_type", label: "Tipo" },
      { key: "priority", label: "Prioridad", type: "select", options: priorities },
      { key: "due_date", label: "Vencimiento", type: "date" },
      { key: "responsible", label: "Responsable" },
      { key: "status", label: "Estado", type: "select", options: ["Pendiente", "En revisión", "Completada", "Atrasada", "Cancelada"] },
      { key: "description", label: "Descripción", type: "textarea" }
    ]
  },
  communications: {
    slug: "communications",
    title: "Comunicaciones",
    subtitle: "Timeline multicanal por cliente y relación operativa",
    table: "communications",
    icon: "MessageSquare",
    primaryAction: "Nueva comunicación",
    searchColumns: ["company_name", "channel", "summary"],
    filterKey: "channel",
    columns: [
      { key: "company_name", label: "Empresa" },
      { key: "channel", label: "Canal" },
      { key: "communication_date", label: "Fecha" },
      { key: "responsible", label: "Responsable" },
      { key: "summary", label: "Resumen" },
      { key: "next_action", label: "Próxima acción" },
      { key: "related_to", label: "Relación" }
    ],
    fields: [
      { key: "company_name", label: "Empresa", required: true },
      { key: "channel", label: "Canal", type: "select", options: channels },
      { key: "communication_date", label: "Fecha", type: "date" },
      { key: "responsible", label: "Responsable" },
      { key: "summary", label: "Resumen", type: "textarea" },
      { key: "next_action", label: "Próxima acción" },
      { key: "related_to", label: "Relación" }
    ]
  },
  documents: {
    slug: "documents",
    title: "Documentos",
    subtitle: "Presupuestos, informes, contratos y entregables técnicos",
    table: "documents",
    icon: "FolderOpen",
    primaryAction: "Nuevo documento",
    searchColumns: ["title", "company_name", "document_type"],
    filterKey: "status",
    columns: [
      { key: "title", label: "Documento" },
      { key: "company_name", label: "Empresa" },
      { key: "document_type", label: "Tipo" },
      { key: "status", label: "Estado" },
      { key: "storage_path", label: "Archivo" },
      { key: "responsible", label: "Responsable" }
    ],
    fields: [
      { key: "title", label: "Documento", required: true },
      { key: "company_name", label: "Empresa" },
      { key: "document_type", label: "Tipo" },
      { key: "status", label: "Estado" },
      { key: "storage_path", label: "Ruta en Storage" },
      { key: "responsible", label: "Responsable" },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  technologies: {
    slug: "technologies",
    title: "Tecnologías",
    subtitle: "Tecnologías con las que trabajamos",
    table: "technologies",
    icon: "Cpu",
    primaryAction: "Nueva tecnología",
    searchColumns: ["name", "relationship_type", "usage_notes"],
    filterKey: "relationship_type",
    columns: [
      { key: "name", label: "Tecnología" },
      { key: "relationship_type", label: "Tipo de relación" },
      { key: "usage_notes", label: "Uso habitual" },
      { key: "status", label: "Estado interno" }
    ],
    fields: [
      { key: "name", label: "Tecnología", required: true },
      { key: "relationship_type", label: "Tipo de relación", type: "select", options: ["Tecnología utilizada", "Fabricante habitual", "Partner confirmado", "Pendiente de confirmar"] },
      { key: "usage_notes", label: "Uso habitual", type: "textarea" },
      { key: "status", label: "Estado interno" }
    ]
  }
};
