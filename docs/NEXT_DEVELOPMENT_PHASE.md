# Next Development Phase

## Current readiness

Step 2.5 Firebase Backend Integration is now prepared as the active backend direction.

Run these checks:

```bash
npm run preflight
npm run check
npm run verify:firebase -- your-firebase-app-url
```

## Completed phase

**Step 2.5 — Firebase Backend Integration**

Implemented:

- Firebase App Hosting configuration
- Firebase project configuration
- Cloud Firestore rules
- Cloud Firestore indexes
- Firebase Admin SDK server helper
- Firebase Web SDK client helper
- Firestore-backed store repository
- Firebase status API
- Store API backend integration
- Firebase live verification script
- Python Firebase platform manager

## Next phase recommendation

**Step 2.6 — Firebase Auth and RBAC Persistence**

Implement:

- Firebase Auth login flow
- Session cookie verification
- Admin custom claims
- Firestore user profile persistence
- Role persistence
- Store permission guards
- Store audit log persistence
- Emulator Suite testing flow

## Current deployment target

```txt
Full-stack app -> Firebase App Hosting
Backend data -> Cloud Firestore
Local test backend -> Firebase Emulator Suite
```

## Ready criteria

The project is ready for Step 2.6 when:

- GitHub Actions build completes.
- Firebase App Hosting rollout succeeds.
- `/api/health` returns `ok:true`.
- `/api/deployment/status` returns `ok:true`.
- `/api/firebase/status` returns `ok:true`.
- `/api/admin/stores` returns `ok:true`.
- `/admin/stores` loads.
