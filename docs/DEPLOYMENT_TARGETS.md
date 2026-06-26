# Deployment Targets

## Recommended production path

Use Render for the current full-stack Next.js build because this repository includes API routes and cookie-based auth.

Render settings:

- Type: Web Service
- Runtime: Node
- Build Command: `npm install --registry=https://registry.npmjs.org/ && npm run build`
- Start Command: `npm run start`
- Environment variables:
  - `DEFAULT_ADMIN_EMAIL`
  - `DEFAULT_ADMIN_PASSWORD`

## Cloudflare Pages path

Use Cloudflare Pages for a frontend-only split later. The current repository is not static-only because it includes API routes under `app/api`.

For a future frontend-only package, remove server API routes or move them to Render, then use:

- Build Command: `npm install && npm run build`
- Output Directory: `out`

## Local start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
