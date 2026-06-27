# Firebase Migration

## Status

The project has been refactored from the previous hosting setup to Firebase App Hosting plus Firebase backend services.

## Target platform

```txt
Full-stack Next.js app -> Firebase App Hosting
Backend data -> Cloud Firestore
Auth-ready backend -> Firebase Admin SDK
Local testing -> Firebase Emulator Suite
```

## Removed legacy hosting files

The previous hosting blueprint, deployment helper, verification helper, and related deployment documentation were removed from the repository.

## Added Firebase files

```txt
apphosting.yaml
firebase.json
.firebaserc.example
firestore.rules
firestore.indexes.json
lib/firebase/admin.ts
lib/firebase/client.ts
lib/firebase/stores.ts
app/api/firebase/status/route.ts
scripts/verify-firebase.mjs
scripts/sar_firebase_manager.py
```

## Required Firebase setup

Create a Firebase project, then enable:

```txt
Firebase App Hosting
Cloud Firestore
Authentication when ready for real login accounts
```

## Required App Hosting variables

Configure these in Firebase App Hosting environment settings:

```txt
DEFAULT_ADMIN_EMAIL=admin@sarindustriesnetwork.com
DEFAULT_ADMIN_PASSWORD=<secure secret>
FIREBASE_PROJECT_ID=<your Firebase project id>
NEXT_PUBLIC_FIREBASE_ENABLED=true
NEXT_PUBLIC_FIREBASE_API_KEY=<public web api key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your Firebase project id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<project>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender id>
NEXT_PUBLIC_FIREBASE_APP_ID=<web app id>
```

## Build commands

```bash
npm install --registry=https://registry.npmjs.org/
npm run check
```

## Live verification command

```bash
npm run verify:firebase -- <your Firebase App Hosting URL>
```

## Firebase manager

```bash
python scripts/sar_firebase_manager.py audit
python scripts/sar_firebase_manager.py configure
python scripts/sar_firebase_manager.py install
python scripts/sar_firebase_manager.py build
python scripts/sar_firebase_manager.py verify --url <your Firebase App Hosting URL>
python scripts/sar_firebase_manager.py all --url <your Firebase App Hosting URL> --soft-verify
```

## Deployment behavior

Firebase App Hosting should be connected directly to the GitHub repository and live branch. After connection, a push to the configured branch can automatically create a rollout.

## Safety note

Do not commit `.env`, service credentials, private keys, deploy tokens, database URLs, or admin passwords.
