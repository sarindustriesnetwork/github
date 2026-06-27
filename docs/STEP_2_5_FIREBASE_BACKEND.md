# Step 2.5 — Firebase Backend Integration

## Status

Implemented as a build-safe Firebase backend integration phase.

## Added backend integration

```txt
lib/firebase/admin.ts
lib/firebase/client.ts
lib/firebase/stores.ts
app/api/firebase/status/route.ts
```

## Store API backend behavior

`/api/admin/stores` now uses the Firebase store repository.

When Firebase environment variables are configured, it reads/writes Cloud Firestore.
When Firebase is not configured, it safely falls back to local seed data so CI/builds still pass.

## Firestore collections

```txt
stores
storeAuditLogs
users
```

## API routes

```txt
/api/firebase/status
/api/admin/stores
/api/deployment/status
/api/health
```

## Verification routes

```txt
/
/api/health
/api/deployment/status
/api/firebase/status
/api/admin/stores
/login
/admin
/admin/users
/admin/stores
/admin/security
```

## Commands

```bash
npm run preflight
npm run check
npm run verify:firebase -- <your Firebase App Hosting URL>
```

## Firebase manager

```bash
python scripts/sar_firebase_manager.py all --url <your Firebase App Hosting URL> --soft-verify
```

## Next phase

**Step 2.6 — Firebase Auth and RBAC Persistence**

Recommended tasks:

- Replace placeholder admin login with Firebase Auth session flow
- Add Firebase Admin custom claims for role-based access
- Persist users and roles in Firestore
- Add server-side permission checks for store APIs
- Add audit log persistence for all admin mutations
- Add Emulator Suite test workflow
