# CRM-Gym

CRM privado para IronPulse Gym, preparado con Next.js 14, App Router, TypeScript, Tailwind CSS, Supabase Auth, Supabase PostgreSQL y despliegue en Vercel.

La aplicación cubre gestión comercial, operaciones técnicas y soporte: empresas, contactos, leads, oportunidades, pipeline Kanban, diagnósticos tecnológicos, presupuestos, proyectos, incidencias, mantenimiento, activos, control de tiempos, materiales utilizados, albaranes, revisión de facturación, supervisión diaria, tareas, comunicaciones, documentos, tecnologías, reportes y configuración.

## Stack técnico

- Next.js 14 con App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage preparado para documentos mediante `documents.storage_path`
- @dnd-kit/core para Pipeline Kanban
- ESLint
- Vercel

## Instalación local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

## Variables de entorno

Configura estas variables en `.env.local` y también en Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

No uses `SERVICE_ROLE_KEY` en frontend.

## Configuración de Supabase

1. Crea un proyecto en Supabase.
2. Copia `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. En Supabase SQL Editor, ejecuta el contenido de `supabase/schema.sql`.
4. Verifica que RLS queda activado en todas las tablas.
5. En Authentication, desactiva el registro público si el proyecto va a ser privado.
6. Crea usuarios desde Supabase Auth: Authentication, Users, Add user o Invite user.

El SQL incluye tablas, índices, claves foráneas, políticas RLS para usuarios autenticados, datos demo permitidos y automatizaciones básicas:

- Tarea automática al crear un lead.
- Tarea automática al enviar un presupuesto.
- Proyecto automático al mover una oportunidad a `Cerrado ganado`.
- Soporte para alertas visuales de incidencias críticas.
- Tareas vencidas visibles por estado y fecha.
- Mantenimientos próximos visibles en dashboard.
- Control técnico de tiempos, materiales, albaranes, revisión de facturación y supervisión diaria.

## Ejecución y verificación

```bash
npm run lint
npm run build
npm start
```

Estado verificado en esta entrega:

- `npm install`: ejecutado.
- `npm run lint`: sin errores.
- `npm run build`: sin errores.

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. En Vercel, crea un nuevo proyecto desde el repositorio.
3. Framework preset: Next.js.
4. Añade variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Ejecuta el primer deploy.
6. En Supabase Auth, añade las URLs de Vercel en Redirect URLs si usas confirmación o magic links.
7. Para dominio futuro, configura uno de estos DNS en Vercel:
   - `crm.ironpulse.com`
   - `app.ironpulse.com`

## Checklist final

- [x] Proyecto Next.js 14 creado.
- [x] App Router configurado.
- [x] TypeScript activo.
- [x] Tailwind CSS configurado.
- [x] Supabase Auth configurado.
- [x] Rutas privadas protegidas.
- [x] Registro público sustituido por acceso solo por invitación.
- [x] Layout privado con sidebar y topbar.
- [x] Dashboard conectado a Supabase.
- [x] CRUD básico en módulos principales.
- [x] CRUD técnico para tiempos, materiales, albaranes, revisión de facturación y supervisión diaria.
- [x] Pipeline Kanban con drag & drop y actualización de `stage`.
- [x] Ficha `/support/[id]` para revisar incidencia, tiempos, materiales, albaranes y comunicaciones.
- [x] Ruta `/technologies` para gestionar tecnologías.
- [x] SQL completo en `supabase/schema.sql`.
- [x] RLS básico para usuarios autenticados.
- [x] Datos demo sin clientes reales inventados.
- [x] `.env.example` incluido.
- [x] Preparado para Vercel.
- [x] `npm run lint` correcto.
- [x] `npm run build` correcto.

## Notas de seguridad

Este CRM es privado y depende de Supabase Auth. Antes de producción, revisa:

- Alta de usuarios solo desde Supabase Auth.
- Políticas RLS según roles reales internos.
- Confirmación de email y dominio permitido.
- Rotación de claves si se han compartido por error.
- Backups de Supabase.
- Reglas de Storage si se habilitan documentos adjuntos.
