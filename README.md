# SAR INDUSTRIES NETWORK

Official white-label full-stack SaaS starter project for **SAR INDUSTRIES NETWORK**.

Copyright 2026 SAR INDUSTRIES NETWORK. All rights reserved.

## Current build

Step 2.5 Firebase backend integration includes:

- Next.js App Router foundation
- Auth login API
- Session check API
- Logout API
- RBAC/security page
- User management page
- Store Management Core
- Store Builder starter
- Demo storefront and live preview routes
- Firebase App Hosting configuration
- Cloud Firestore security rules and indexes
- Firebase Admin SDK backend helper
- Firebase Web SDK client helper
- Firestore-backed store API with safe seed fallback
- GitHub Actions Firebase build audit
- Firebase live verification CLI
- Python Firebase platform manager
- Windows platform manager helper

## Repository

```txt
https://github.com/sarindustriesnetwork/github
```

## Local setup on Windows

Double-click:

```txt
START_HERE_WINDOWS.bat
```

Open:

```txt
http://localhost:3000
```

## Firebase platform manager

Main file:

```txt
scripts/sar_firebase_manager.py
```

Windows launcher:

```txt
PLATFORM_MANAGER_WINDOWS.bat
```

Useful commands:

```bash
python scripts/sar_firebase_manager.py audit
python scripts/sar_firebase_manager.py configure
python scripts/sar_firebase_manager.py install
python scripts/sar_firebase_manager.py build
python scripts/sar_firebase_manager.py verify --url <your Firebase App Hosting URL>
python scripts/sar_firebase_manager.py all --url <your Firebase App Hosting URL> --soft-verify
```

NPM shortcuts:

```bash
npm run platform -- audit
npm run platform -- configure
npm run platform -- build
npm run platform -- verify --url <your Firebase App Hosting URL>
npm run platform:all
```

## Manual local setup

```bash
git clone https://github.com/sarindustriesnetwork/github.git
cd github
cp .env.example .env
npm install --registry=https://registry.npmjs.org/
npm run dev
```

Add a local admin password in `.env` before login testing:

```env
DEFAULT_ADMIN_PASSWORD=your-local-admin-secret
```

## Main test routes

```txt
/
/login
/admin
/admin/users
/admin/stores
/admin/security
/dashboard/store-builder
/store/demo-store
/preview/demo-store
/api/health
/api/deployment/status
/api/firebase/status
/api/admin/stores
/api/auth/me
```

## Build verification

Run:

```bash
npm run preflight
npm run check
```

`npm run check` runs:

```txt
Firebase preflight audit -> TypeScript typecheck -> Next.js production build
```

## Firebase App Hosting deployment

Use Firebase App Hosting for this full-stack Next.js app.

Repository files:

```txt
apphosting.yaml
firebase.json
firestore.rules
firestore.indexes.json
```

Required Firebase App Hosting variables:

```txt
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=your-secure-admin-secret
FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_ENABLED=true
NEXT_PUBLIC_FIREBASE_API_KEY=your-public-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id
```

## Firebase verification

Verify the live app after Firebase App Hosting rollout:

```bash
npm run verify:firebase -- <your Firebase App Hosting URL>
```

## GitHub Actions

Workflow:

```txt
.github/workflows/build.yml
```

On push or pull request it runs:

```bash
python scripts/sar_firebase_manager.py audit
npm install --registry=https://registry.npmjs.org/
npm run check
```

Firebase App Hosting should be connected directly to the GitHub repository and live branch. After that connection is complete, commits to the configured branch can create new Firebase rollouts automatically.

## Security note

Do not commit `.env`, service credentials, admin passwords, API keys that are not meant to be public, database credentials, or private deployment tokens.
