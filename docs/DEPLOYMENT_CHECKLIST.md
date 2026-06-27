# Deployment Checklist

## Phase 1: GitHub verification

- [ ] Repository opens correctly.
- [ ] `README.md` explains setup and deployment.
- [ ] `.npmrc` points to the public npm registry.
- [ ] `.env.example` contains safe placeholders only.
- [ ] `.env` is not committed.
- [ ] GitHub Actions workflow exists.
- [ ] `npm run preflight` passes.
- [ ] `npm run check` passes.
- [ ] Build workflow passes.

## Phase 2: GitHub Actions secrets

Open:

```txt
Settings -> Secrets and variables -> Actions -> New repository secret
```

Add:

```txt
RENDER_DEPLOY_HOOK_URL=<Render deploy hook URL>
RENDER_URL=https://github-ufs3.onrender.com
```

Optional hard-fail live verification:

```txt
RENDER_VERIFY_REQUIRED=true
```

If `RENDER_VERIFY_REQUIRED` is not `true`, live Render verification runs in soft mode and reports warnings without blocking CI.

## Phase 3: Localhost verification

Run:

```bash
npm install --registry=https://registry.npmjs.org/
npm run preflight
npm run check
npm run dev
```

Check:

- [ ] `/` loads.
- [ ] `/api/health` returns JSON.
- [ ] `/api/deployment/status` returns JSON.
- [ ] `/login` loads.
- [ ] Login works after `DEFAULT_ADMIN_PASSWORD` is configured.
- [ ] `/admin` loads.
- [ ] `/admin/users` loads.
- [ ] `/admin/security` loads.
- [ ] `/dashboard/store-builder` loads.

## Phase 4: Render deployment

Create Render Web Service:

```txt
Repository: sarindustriesnetwork/github
Environment: Node
Build Command: npm install --registry=https://registry.npmjs.org/ && npm run build
Start Command: npm run start
Health Check Path: /api/health
```

Add Render environment variables:

```txt
NODE_VERSION=20.20.0
NODE_ENV=production
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=<secure secret>
```

Check after deployment:

- [ ] Live home page opens.
- [ ] `/api/health` returns JSON.
- [ ] `/api/deployment/status` returns JSON.
- [ ] `/login` opens.
- [ ] Login works.
- [ ] `/admin` opens.

## Phase 5: Render CLI verification

Run:

```bash
npm run verify:render -- https://github-ufs3.onrender.com
```

Windows:

```txt
VERIFY_RENDER_WINDOWS.bat
```

## Phase 6: Automatic deployment

After GitHub Actions secrets are configured:

- [ ] Push to `main`.
- [ ] GitHub Actions validates build.
- [ ] Render deploy hook is triggered.
- [ ] Live route verification runs.
- [ ] Render dashboard shows successful deployment.

## Phase 7: Cloudflare Pages split later

Move frontend-only pages to a separate frontend package later:

```txt
frontend -> Cloudflare Pages
backend/API -> Render
```

Do not deploy the current full-stack app to Cloudflare Pages as a static-only build because it includes API routes.
