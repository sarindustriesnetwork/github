# SAR INDUSTRIES NETWORK

Official white-label full-stack SaaS starter project for **SAR INDUSTRIES NETWORK**.

Copyright 2026 SAR INDUSTRIES NETWORK. All rights reserved.

## Current build

Step 2.3 includes:

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
- GitHub Actions build verification
- Windows one-click local setup

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
/api/auth/me
```

## Build verification

GitHub Actions workflow:

```txt
.github/workflows/build.yml
```

It runs:

```bash
npm install --registry=https://registry.npmjs.org/
npm run typecheck
npm run build
```

## Render deployment

Use Render Web Service for the current full-stack Next.js app.

```txt
Build Command: npm install --registry=https://registry.npmjs.org/ && npm run build
Start Command: npm run start
```

Required Render environment variables:

```txt
NODE_VERSION=20.20.0
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=your-secure-render-secret
```

The repository includes `render.yaml` for Blueprint deployment.

## Cloudflare Pages plan

Cloudflare Pages should be used later after splitting the app into a frontend-only package. The current repository has API routes, so Render is the correct first deployment target.

## Security note

Do not commit `.env`, real admin secrets, tokens, database URLs, API keys, or production credentials.
