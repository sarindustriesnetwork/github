# Render Master Plan

## Goal

Deploy the current SAR Industries Network full-stack Next.js app to Render first, verify all important routes, and later split frontend-only parts to Cloudflare Pages.

## Why Render first

The current app includes API routes and server-side auth behavior. Therefore it should run as a Render Web Service, not as a static-only Cloudflare Pages app.

## Render service configuration

```txt
Service Type: Web Service
Runtime: Node
Plan: Free for MVP testing
Build Command: npm install --registry=https://registry.npmjs.org/ && npm run build
Start Command: npm run start
```

## Required environment variables

```txt
NODE_VERSION=20.20.0
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=<secure secret in Render>
```

## Build verification

Before deployment:

```bash
npm install --registry=https://registry.npmjs.org/
npm run check
```

## Live Render verification

After Render deploys:

```bash
npm run verify:render -- https://github-ufs3.onrender.com
```

This verifies:

- `/`
- `/api/health`
- `/api/deployment/status`
- `/login`
- `/admin`
- `/admin/users`
- `/admin/security`
- `/dashboard/store-builder`

## Expected live results

```txt
/                         -> 200
/api/health               -> 200 JSON
/api/deployment/status    -> 200 JSON
/login                    -> 200
/admin                    -> 200 or redirect depending auth behavior
/admin/users              -> 200 or redirect depending auth behavior
/admin/security           -> 200 or redirect depending auth behavior
/dashboard/store-builder  -> 200 or redirect depending auth behavior
```

## If Render fails

1. Open Render service logs.
2. Confirm Node version is 20.20.0.
3. Confirm `DEFAULT_ADMIN_PASSWORD` is set.
4. Confirm build command matches the repository.
5. Click `Manual Deploy`.
6. Use `Clear build cache & deploy` if dependencies are stale.

## Cloudflare split later

Later architecture:

```txt
frontend -> Cloudflare Pages
backend/API/auth -> Render
storage -> Cloudflare R2
postgres -> Supabase or Neon
```

Do not move the current full-stack repo directly to Cloudflare Pages until API routes are separated.
