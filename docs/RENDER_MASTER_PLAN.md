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
Health Check Path: /api/health
```

## Required Render environment variables

```txt
NODE_VERSION=20.20.0
NODE_ENV=production
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=<secure secret in Render>
```

## Required GitHub Actions secrets

```txt
RENDER_DEPLOY_HOOK_URL=<Render deploy hook URL>
RENDER_URL=https://github-ufs3.onrender.com
RENDER_VERIFY_REQUIRED=true optional
```

## Build verification

Before deployment:

```bash
npm install --registry=https://registry.npmjs.org/
npm run preflight
npm run check
```

`npm run check` performs:

```txt
preflight audit -> TypeScript typecheck -> Next.js production build
```

## Automatic deployment flow

On push to `main`:

1. GitHub Actions installs dependencies.
2. GitHub Actions runs `npm run check`.
3. If validation succeeds, the Render deploy hook is triggered when `RENDER_DEPLOY_HOOK_URL` is configured.
4. The live Render URL is checked using `npm run verify:render`.
5. If `RENDER_VERIFY_REQUIRED=true`, failed live checks fail the workflow.
6. If `RENDER_VERIFY_REQUIRED` is not true, failed live checks are reported in soft mode.

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
/api/health               -> 200 JSON with ok:true
/api/deployment/status    -> 200 JSON with ok:true and secretsExposed:false
/login                    -> 200
/admin                    -> 200 or redirect depending auth behavior
/admin/users              -> 200 or redirect depending auth behavior
/admin/security           -> 200 or redirect depending auth behavior
/dashboard/store-builder  -> 200 or redirect depending auth behavior
```

## Windows helpers

```txt
START_HERE_WINDOWS.bat
DEPLOY_RENDER_WINDOWS.bat
VERIFY_RENDER_WINDOWS.bat
```

## If Render fails

1. Open Render service logs.
2. Confirm Node version is 20.20.0.
3. Confirm `DEFAULT_ADMIN_PASSWORD` is set.
4. Confirm build command matches the repository.
5. Click `Manual Deploy`.
6. Use `Clear build cache & deploy` if dependencies are stale.
7. Run `npm run verify:render -- https://github-ufs3.onrender.com` again.

## Cloudflare split later

Later architecture:

```txt
frontend -> Cloudflare Pages
backend/API/auth -> Render
storage -> Cloudflare R2
postgres -> Supabase or Neon
```

Do not move the current full-stack repo directly to Cloudflare Pages until API routes are separated.
