# CI/CD Automation

## Goal

Keep SAR Industries Network ready for continuous development by validating code, triggering Render deployment, and verifying the live Render app after deployment.

## Workflow file

```txt
.github/workflows/build.yml
```

## What the workflow does

On push to `main`, pull request, or manual run:

1. Checks out the repository.
2. Installs Node.js 20.20.0.
3. Installs dependencies from the public npm registry.
4. Runs the platform preflight audit.
5. Runs TypeScript typecheck.
6. Builds the Next.js app.
7. Uploads deployment metadata as a workflow artifact.

On push to `main` only:

1. Triggers Render deployment if `RENDER_DEPLOY_HOOK_URL` is configured.
2. Verifies the live Render routes after deployment.

## Required GitHub repository secrets

Open GitHub repository settings:

```txt
Settings -> Secrets and variables -> Actions -> New repository secret
```

Add:

```txt
RENDER_DEPLOY_HOOK_URL=<Render deploy hook URL>
RENDER_URL=https://github-ufs3.onrender.com
```

Optional:

```txt
RENDER_VERIFY_REQUIRED=true
```

If `RENDER_VERIFY_REQUIRED` is not set to `true`, live verification runs in soft mode so temporary Render free-tier wake-up issues do not block the full CI build.

## Required Render environment variables

Open Render service settings and add:

```txt
NODE_VERSION=20.20.0
NODE_ENV=production
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=<secure secret>
```

## Local verification commands

```bash
npm install --registry=https://registry.npmjs.org/
npm run preflight
npm run check
npm run verify:render -- https://github-ufs3.onrender.com
```

## Manual deploy command

```bash
npm run deploy:render -- <Render deploy hook URL> --required
```

## Windows helpers

```txt
START_HERE_WINDOWS.bat
DEPLOY_RENDER_WINDOWS.bat
VERIFY_RENDER_WINDOWS.bat
```

## Result

After secrets are configured, every push to `main` can build, trigger Render deployment, and verify the live app automatically.
