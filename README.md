# SAR INDUSTRIES NETWORK

Official white-label SaaS localhost starter for **SAR INDUSTRIES NETWORK**.

Copyright 2026 SAR INDUSTRIES NETWORK. All rights reserved.

## Current build

Step 2.6 Windows 11 localhost build includes:

- Next.js App Router foundation
- Auth login API
- Session check API
- Logout API
- RBAC/security page
- User management page
- Store Management Core
- Store Builder starter
- Demo storefront and live preview routes
- Local seed/runtime store API
- Local deployment status API
- Local health API
- Windows 11 one-click installer and launcher
- Chrome auto-open support
- Localhost verification script
- Cloud hosting configuration removed

## Repository

```txt
https://github.com/sarindustriesnetwork/github
```

## One-click Windows 11 setup

Double-click:

```txt
ONE_CLICK_WINDOWS_11.bat
```

It will:

1. Check Node.js.
2. Install Node.js LTS through Windows Package Manager when available and Node is missing.
3. Create `.env` from `.env.example`.
4. Ask for a private local admin password.
5. Install npm packages from the public npm registry.
6. Run preflight, typecheck, and production build.
7. Start the localhost app.
8. Open Chrome at `http://localhost:3000`.

`START_HERE_WINDOWS.bat` also launches the same one-click setup.

## Manual local setup

```bash
git clone https://github.com/sarindustriesnetwork/github.git
cd github
copy .env.example .env
npm install --registry=https://registry.npmjs.org/
npm run preflight
npm run check
npm run dev
```

Add this to your private `.env` file before login testing:

```env
DEFAULT_ADMIN_PASSWORD=your-local-admin-password
```

## Local verification

After the dev server is running:

```bash
npm run verify:local
```

## Main local routes

```txt
http://localhost:3000
http://localhost:3000/login
http://localhost:3000/admin
http://localhost:3000/admin/users
http://localhost:3000/admin/stores
http://localhost:3000/admin/security
http://localhost:3000/dashboard/store-builder
http://localhost:3000/store/demo-store
http://localhost:3000/preview/demo-store
http://localhost:3000/api/health
http://localhost:3000/api/deployment/status
http://localhost:3000/api/admin/stores
http://localhost:3000/api/auth/me
```

## Build verification

```bash
npm run preflight
npm run check
```

`npm run check` runs:

```txt
Windows localhost preflight audit -> TypeScript typecheck -> Next.js production build
```

## GitHub Actions

Workflow:

```txt
.github/workflows/build.yml
```

On push or pull request it runs:

```bash
npm install --registry=https://registry.npmjs.org/
npm run check
```

## Local-only policy

This repository is now cleaned for Windows 11 localhost development. Cloud hosting configuration files and external cloud backend helpers are not required for this build.

## Security note

Do not commit `.env`, real admin passwords, tokens, private keys, or production credentials.
