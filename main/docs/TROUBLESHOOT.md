# Troubleshooting - SAR INDUSTRIES NETWORK Starter v3

## Problem: pnpm tries to download from private registry and times out

Cause: an older generated ZIP included a `pnpm-lock.yaml` file created inside ChatGPT's sandbox registry environment. On your PC, that internal registry is not accessible.

Fix in v3:
- `pnpm-lock.yaml` removed
- setup uses `npm install --registry=https://registry.npmjs.org/`
- `.npmrc` forces the public npm registry

If you still see the old registry, delete the old extracted folder and extract the v3 ZIP fresh.

## Problem: Node version warning from pnpm

Use v3 setup. It does not use global pnpm. It uses npm and works with Node.js 20.

## Problem: Docker is not installed

The UI can run without Docker. For database mode:
1. Install Docker Desktop
2. Open Docker Desktop
3. Run `START_DATABASE_WINDOWS.bat`

## Clean reinstall

Run:

```txt
CLEAN_INSTALL_WINDOWS.bat
```

This removes `node_modules`, `package-lock.json`, and `.next`, then installs again from the public npm registry.
