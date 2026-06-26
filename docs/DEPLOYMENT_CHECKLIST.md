# Deployment Checklist

## Phase 1: GitHub verification

- [ ] Repository opens correctly.
- [ ] `README.md` explains setup and deployment.
- [ ] `.npmrc` points to the public npm registry.
- [ ] `.env.example` contains safe placeholders only.
- [ ] `.env` is not committed.
- [ ] GitHub Actions workflow exists.
- [ ] Build workflow passes.

## Phase 2: Localhost verification

Run:

```bash
npm install --registry=https://registry.npmjs.org/
npm run typecheck
npm run build
npm run dev
```

Check:

- [ ] `/` loads.
- [ ] `/api/health` returns JSON.
- [ ] `/login` loads.
- [ ] Login works after `DEFAULT_ADMIN_PASSWORD` is configured.
- [ ] `/admin` loads.
- [ ] `/admin/users` loads.
- [ ] `/admin/security` loads.
- [ ] `/dashboard/store-builder` loads.

## Phase 3: Render deployment

Create Render Web Service:

```txt
Repository: sarindustriesnetwork/github
Environment: Node
Build Command: npm install --registry=https://registry.npmjs.org/ && npm run build
Start Command: npm run start
```

Add environment variables:

```txt
NODE_VERSION=20.20.0
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=<secure secret>
```

Check after deployment:

- [ ] Live home page opens.
- [ ] `/api/health` returns JSON.
- [ ] `/login` opens.
- [ ] Login works.
- [ ] `/admin` opens.

## Phase 4: Cloudflare Pages split later

Move frontend-only pages to a separate frontend package later:

```txt
frontend -> Cloudflare Pages
backend/API -> Render
```

Do not deploy the current full-stack app to Cloudflare Pages as a static-only build because it includes API routes.
