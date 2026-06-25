# SAR INDUSTRIES NETWORK

Production-ready starter codebase prepared for direct GitHub Desktop commit/push.

## Quick push with GitHub Desktop

1. Unzip this project.
2. Open GitHub Desktop.
3. File → Add local repository → select this folder.
4. Commit to `main` with: `Build production SAR Industries Network app`.
5. Push to: `https://github.com/sarindustriesnetwork/main.git`.

For detailed steps, open [`GITHUB_DESKTOP_PUSH_GUIDE.md`](./GITHUB_DESKTOP_PUSH_GUIDE.md).

---

# SAR INDUSTRIES NETWORK — Official White-Label SaaS Starter


## Production GitHub setup

This repository is structured for a production Next.js SaaS control center:

- CI quality gate: `.github/workflows/ci.yml`
- Optional Vercel deployment: `.github/workflows/deploy.yml`
- Auth/session layer: `lib/auth/`
- RBAC permissions: `lib/permissions/permissions.ts`
- API helpers: `lib/api/`
- Prisma schema and seed: `prisma/`

Before production deployment, configure real values for `DATABASE_URL`, `AUTH_SECRET`, `JWT_SECRET`, default admin credentials, email, storage, AI, and payment secrets.

Official white-label project setup for **SAR INDUSTRIES NETWORK™**.

**Admin:** SAIFUL ALAM RAFI  
**Email:** admin@sarindustriesnetwork.com  
**Default password:** Admin@2026  
**White-label rights:** © 𝟮𝟬𝟮𝟲 𝗔𝗹𝗹 𝗥𝗶𝗴𝗵𝘁𝘀 𝗥𝗲𝘀𝗲𝗿𝘃𝗲𝗱 | 𝗦𝗔𝗥 𝗜𝗡𝗗𝗨𝗦𝗧𝗥𝗜𝗘𝗦 𝗡𝗘𝗧𝗪𝗢𝗥𝗞™.  
**Developer credit:** Built & developed by **SAR INDUSTRIES NETWORK**.

> Security note: change the default admin password before real production use.

---

## Current Build

**Step 2.3 — User CRUD + RBAC Role Assignment + White-Label Branding Update** has been implemented.

Included now:

- Official `/login` page
- Secure signed HTTP-only auth session cookie
- Logout system
- Current session API: `/api/auth/me`
- Role-based access control matrix
- Protected admin pages
- Protected admin APIs
- Database login with bcrypt password verification
- Localhost fallback Super Admin login if PostgreSQL/Docker is not running
- User create API: `POST /api/admin/users`
- User update API: `PATCH /api/admin/users/:id`
- User safe-ban API: `DELETE /api/admin/users/:id`
- Create user form inside `/admin/users`
- Manage selected user panel with status, role assignment, and optional password update
- Default Super Admin protection rules
- Audit logs for create/update/safe-ban actions
- Prisma auth models: sessions, login events, password reset tokens
- RBAC page: `/admin/security`
- Updated official white-label copyright footer across core UI
- ZIP Auto Update Manager included

---

## One-Click Windows Start

Extract the ZIP, then double-click:

```txt
START_HERE_WINDOWS.bat
```

Open:

```txt
http://localhost:3000/login
```

Default login:

```txt
Email: admin@sarindustriesnetwork.com
Password: Admin@2026
```

---

## Full Database Setup

For full PostgreSQL + Redis local development, install and open Docker Desktop, then run:

```txt
START_DATABASE_WINDOWS.bat
```

or PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\db-setup.ps1
```

---

## macOS / Linux

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Database setup after installing Docker:

```bash
chmod +x scripts/db-setup.sh
./scripts/db-setup.sh
```

---

## Manual Commands

```bash
npm install --registry=https://registry.npmjs.org/
npx prisma generate
npm run dev
```

Database mode:

```bash
docker compose up -d
npx prisma migrate dev --name init
npm run db:seed
```

---

## Main Routes

```txt
/                         Public landing page
/login                    Official admin login
/admin                    Super Admin Command Center
/admin/users              Users CRUD + Role Assignment
/admin/security           Security & RBAC Matrix
/admin/plugins            Plugin Manager scaffold
/admin/ai                 AI Copilot scaffold
/admin/reliability        Reliability Center scaffold
/dashboard                Seller dashboard scaffold
/dashboard/store-builder  Store Builder scaffold
/api/health               Health API
/api/auth/me              Current auth session
/api/admin/rbac           Protected RBAC API
/api/admin/users          Protected users API
```

---

## Official White-Label Notice

© 𝟮𝟬𝟮𝟲 𝗔𝗹𝗹 𝗥𝗶𝗴𝗵𝘁𝘀 𝗥𝗲𝘀𝗲𝗿𝘃𝗲𝗱 | 𝗦𝗔𝗥 𝗜𝗡𝗗𝗨𝗦𝗧𝗥𝗜𝗘𝗦 𝗡𝗘𝗧𝗪𝗢𝗥𝗞™.  
Built & developed by **SAR INDUSTRIES NETWORK**.

---

## ZIP Update Manager

This project includes an official ZIP update manager so future generated ZIP updates can be applied directly without manually copying files.

### Recommended Windows update flow

1. Put the newest updated ZIP file inside `_incoming_updates`.
2. Double-click `AUTO_UPDATE_FROM_UPLOAD_WINDOWS.bat`.
3. Let it backup, extract, update, install, configure, and optionally start localhost.

Alternative: drag the updated ZIP file onto `UPDATE_FROM_ZIP_WINDOWS.bat`.

Full guide: `docs/ZIP_UPDATE_MANAGER.md`
