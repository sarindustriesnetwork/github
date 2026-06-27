# Local Windows 11 Setup

## Goal

Run SAR INDUSTRIES NETWORK fully on localhost without cloud hosting configuration files.

## One-click launcher

Double-click:

```txt
ONE_CLICK_WINDOWS_11.bat
```

The launcher will:

1. Check Node.js.
2. Install Node.js LTS with Windows Package Manager if available and Node is missing.
3. Create `.env` from `.env.example`.
4. Ask for a private local admin password if missing.
5. Install npm dependencies from the public npm registry.
6. Run preflight, typecheck, and production build.
7. Start the Next.js dev server.
8. Open `http://localhost:3000` in Chrome when Chrome is installed.

## Manual commands

```bash
npm install --registry=https://registry.npmjs.org/
npm run preflight
npm run check
npm run dev
```

## Local verification

After the dev server starts, run:

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
http://localhost:3000/api/health
http://localhost:3000/api/deployment/status
http://localhost:3000/api/admin/stores
```

## Local-only status

The codebase is configured for Windows 11 localhost development using local seed/runtime data. Cloud hosting config files are not required for this setup.

## Security note

Do not commit `.env`. The one-click launcher stores the local admin password only in your private `.env` file.
