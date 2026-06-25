# Production Structure

SAR INDUSTRIES NETWORK is organized as a Next.js App Router SaaS control center.

## Main layers

- `app/` — public pages, dashboard pages, admin pages, and API routes.
- `components/` — reusable UI, auth UI, admin shell, and brand elements.
- `lib/auth/` — session token creation, cookie constants, current-user lookup, and route guards.
- `lib/permissions/` — role definitions and permission checks.
- `lib/api/` — standard API response and request validation helpers.
- `lib/db/` — Prisma client singleton.
- `lib/audit/` — audit log helper for security-sensitive actions.
- `prisma/` — PostgreSQL schema and seed script.
- `.github/workflows/` — CI quality gate and optional production deploy pipeline.

## Security baseline

- Admin/dashboard pages are protected by middleware cookie checks.
- Server pages enforce real permission checks with `requirePermission`.
- API routes enforce RBAC with `requireApiPermission`.
- Session cookies are HTTP-only, same-site, and secure in production.
- Default secrets in `.env.example` must be replaced before production deployment.

## RBAC baseline

Built-in roles are defined in `lib/permissions/permissions.ts`:

- `SUPER_ADMIN`
- `ADMIN`
- `FINANCE_MANAGER`
- `SUPPORT_AGENT`
- `STORE_OWNER`
- `VIEWER`

Every new admin API route should call `requireApiPermission()` before accessing data.
Every new admin page should call `requirePermission()` before rendering sensitive UI.
