# SAR Nuclear Platform Manager

## Purpose

`scripts/sar_nuclear_manager.py` is a single self-contained Python control file for the SAR Industries Network platform.

It can audit, repair configuration files, install dependencies, build the app, trigger Render deployment, and verify the live Render app.

It uses only the Python standard library and does not require extra Python packages.

## Main file

```txt
scripts/sar_nuclear_manager.py
```

## Windows launcher

```txt
PLATFORM_MANAGER_WINDOWS.bat
```

## Commands

Audit repository and configuration:

```bash
python scripts/sar_nuclear_manager.py audit
```

Repair safe configuration files:

```bash
python scripts/sar_nuclear_manager.py configure
```

Install dependencies:

```bash
python scripts/sar_nuclear_manager.py install
```

Run full build check:

```bash
python scripts/sar_nuclear_manager.py build
```

Trigger Render deploy:

```bash
python scripts/sar_nuclear_manager.py deploy --hook-url <Render deploy hook URL>
```

Verify live Render app:

```bash
python scripts/sar_nuclear_manager.py verify --url https://github-ufs3.onrender.com
```

Run all setup, build, deploy, and verification steps:

```bash
python scripts/sar_nuclear_manager.py all --url https://github-ufs3.onrender.com --soft-verify
```

## NPM shortcuts

```bash
npm run nuclear -- audit
npm run nuclear -- configure
npm run nuclear -- install
npm run nuclear -- build
npm run nuclear -- verify --url https://github-ufs3.onrender.com
npm run nuclear:all
```

## What it verifies

- Python version
- Node.js availability
- npm availability
- Required project files
- Required package scripts
- Public npm registry
- Render Web Service blueprint
- Render secret handling
- Deployment status API
- Health API
- Forbidden private registry patterns
- Forbidden obvious secret patterns

## Live Render routes checked

```txt
/
/api/health
/api/deployment/status
/login
/admin
/admin/users
/admin/security
/dashboard/store-builder
```

## Secret policy

This manager never writes real passwords or service tokens to repository files.

Private values must stay in:

```txt
Render environment variables
GitHub Actions repository secrets
Local .env file
```

Do not commit `.env`, deploy hook URLs, admin passwords, database URLs, tokens, or private keys.
