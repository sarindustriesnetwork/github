# SAR INDUSTRIES NETWORK

Official white-label full-stack SaaS starter project for **SAR INDUSTRIES NETWORK**.

Copyright 2026 SAR INDUSTRIES NETWORK. All rights reserved.

## Current build

Step 2.3.4 includes:

- Next.js App Router foundation
- Auth login API
- Session check API
- Logout API
- RBAC/security page
- User management page
- Super Admin dashboard
- Store Builder starter
- Demo storefront and live preview routes
- Render full-stack deployment configuration
- GitHub Actions CI/CD automation
- Render deploy hook CLI
- Live Render verification CLI
- Platform preflight audit
- All-in-one Python platform manager
- Windows one-click local setup, deploy, verification, and platform manager helpers

## Repository

```txt
https://github.com/sarindustriesnetwork/github
```

## Local setup on Windows

Double-click:

```txt
START_HERE_WINDOWS.bat
```

The script will:

1. Check Node.js.
2. Create `.env` from `.env.example`.
3. Ask for a local admin secret if missing.
4. Install packages from the public npm registry.
5. Start the localhost server.

Open:

```txt
http://localhost:3000
```

## All-in-one Python platform manager

Main file:

```txt
scripts/sar_nuclear_manager.py
```

Windows launcher:

```txt
PLATFORM_MANAGER_WINDOWS.bat
```

Useful commands:

```bash
python scripts/sar_nuclear_manager.py audit
python scripts/sar_nuclear_manager.py configure
python scripts/sar_nuclear_manager.py install
python scripts/sar_nuclear_manager.py build
python scripts/sar_nuclear_manager.py verify --url https://github-ufs3.onrender.com
python scripts/sar_nuclear_manager.py all --url https://github-ufs3.onrender.com --soft-verify
```

NPM shortcuts:

```bash
npm run nuclear -- audit
npm run nuclear -- configure
npm run nuclear -- build
npm run nuclear -- verify --url https://github-ufs3.onrender.com
npm run nuclear:all
```

## Manual local setup

```bash
git clone https://github.com/sarindustriesnetwork/github.git
cd github
cp .env.example .env
npm install --registry=https://registry.npmjs.org/
npm run dev
```

Add this to `.env` before login testing:

```env
DEFAULT_ADMIN_PASSWORD=your-local-admin-secret
```

## Main test routes

```txt
/
/login
/admin
/admin/users
/admin/security
/dashboard/store-builder
/store/demo-store
/preview/demo-store
/api/health
/api/deployment/status
/api/auth/me
```

## Build verification

Run:

```bash
npm run preflight
npm run check
```

`npm run check` runs:

```txt
preflight audit -> TypeScript typecheck -> Next.js production build
```

## CI/CD automation

Workflow:

```txt
.github/workflows/build.yml
```

On push or pull request it runs:

```bash
npm install --registry=https://registry.npmjs.org/
npm run check
```

On push to `main`, it can also trigger Render deployment and live verification when these GitHub Actions secrets are configured:

```txt
RENDER_DEPLOY_HOOK_URL=<Render deploy hook URL>
RENDER_URL=https://github-ufs3.onrender.com
RENDER_VERIFY_REQUIRED=true optional
```

## Render deployment

Use Render Web Service for the current full-stack Next.js app.

```txt
Build Command: npm install --registry=https://registry.npmjs.org/ && npm run build
Start Command: npm run start
Health Check Path: /api/health
```

Required Render environment variables:

```txt
NODE_VERSION=20.20.0
NODE_ENV=production
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=your-secure-render-secret
```

The repository includes `render.yaml` for Blueprint deployment.

## Render CLI helpers

Trigger deploy manually:

```bash
npm run deploy:render -- <Render deploy hook URL> --required
```

Verify live app:

```bash
npm run verify:render -- https://github-ufs3.onrender.com
```

Windows helpers:

```txt
DEPLOY_RENDER_WINDOWS.bat
VERIFY_RENDER_WINDOWS.bat
PLATFORM_MANAGER_WINDOWS.bat
```

## Cloudflare Pages plan

Cloudflare Pages should be used later after splitting the app into a frontend-only package. The current repository has API routes, so Render is the correct first deployment target.

Future split:

```txt
frontend -> Cloudflare Pages
backend/API/auth -> Render
storage -> Cloudflare R2
postgres -> Supabase or Neon
```

## Security note

Do not commit `.env`, real admin secrets, tokens, database URLs, API keys, deploy hook URLs, or production credentials.
