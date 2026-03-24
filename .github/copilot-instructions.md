# Copilot instructions for this codebase

## Arquitectura (Next.js App Router + Prisma)
- Proyecto en Next.js 14 con App Router; rutas UI en `app/*` y endpoints en `app/api/*/route.ts`.
- `app/layout.tsx` monta `Navbar`, `Footer`, `Chatbot` y `SessionProvider` global (`components/providers.tsx`), por eso la sesión está disponible en toda la app.
- Se usa `export const dynamic = "force-dynamic"` en layout y APIs para evitar caché estático en flujos sensibles (auth/chat/leads).
- BD PostgreSQL vía Prisma (`lib/db.ts` singleton para evitar múltiples clientes en dev).

## Flujo de autenticación y registro (patrón clave)
- NextAuth Credentials centralizado en `lib/auth-options.ts`; validación real de login pasa por `authorize()` + `bcrypt.compare` + `emailVerified`.
- Ruta NextAuth oficial: `app/api/auth/[...nextauth]/route.ts`.
- El formulario de login usa `signIn("credentials")` desde cliente (`app/login/page.tsx`), no llama un endpoint custom.
- Registro: `app/api/signup/route.ts` crea `User` + `Lead`, genera `verificationToken` (24h), y envía email por Abacus.
- Verificación: `app/api/verify-email/route.ts` marca `emailVerified` y limpia token; UI en `app/verify-email/page.tsx`.

## Convenciones de API en este repo
- Endpoints devuelven `NextResponse.json({ success|error|... }, { status })` con mensajes en español.
- Validaciones mínimas inline dentro de la ruta (sin capa service separada).
- Normalización repetida: emails en minúsculas y WhatsApp limpiando espacios/guiones.
- `app/api/chatbot/route.ts` proxya a Abacus con streaming SSE (`text/event-stream`); el cliente parsea líneas `data:` en `components/chatbot.tsx`.

## Convenciones de UI
- Mezcla de utilidades Tailwind + clases globales reutilizables (`btn-primary`, `card`, `input-field`) en `app/globals.css`.
- Componentes de páginas de marketing en `components/home/*`; estilos con `framer-motion` y `lucide-react`.
- Existe librería `components/ui/*` (shadcn/radix), pero varias páginas usan HTML + clases personalizadas directamente.

## Datos y límites actuales
- Modelos activos en `prisma/schema.prisma`: `User`, `Lead`, `ContactSubmission`.
- No hay carpeta de migraciones en repo; al cambiar schema, priorizar flujo Prisma explícito (generar cliente y sincronizar DB) antes de tocar rutas.
- No hay augmentación tipada de sesión NextAuth; el proyecto usa casts `(session.user as any).role/id`.

## Integraciones externas y variables de entorno
- Variables críticas detectadas: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ABACUSAI_API_KEY`, `WEB_APP_ID`, `NOTIF_ID_VERIFICACIN_DE_EMAIL`.
- `next.config.js` permite `NEXT_DIST_DIR` y `NEXT_OUTPUT_MODE`; imágenes sin optimización (`images.unoptimized = true`).

## Workflows de desarrollo
- Scripts npm disponibles (`package.json`): `dev`, `build`, `start`, `lint`.
- Seed Prisma disponible con `tsx --require dotenv/config scripts/seed.ts` (configurado en `package.json > prisma.seed`).
- En cambios de auth/API, validar flujo completo: registro -> email de verificación -> login -> acceso a `app/dashboard/page.tsx`.
