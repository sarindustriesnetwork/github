# Next Development Phase

## Current readiness

Step 2.4 Store Management Core is now implemented as a deployment-safe MVP module.

Run these checks:

```bash
npm run preflight
npm run check
npm run verify:render -- https://github-ufs3.onrender.com
```

## Completed phase

**Step 2.4 — Store Management Core**

Implemented:

- Store registry data model
- Store management admin page
- Store create draft UI
- Store owner assignment interaction
- Store status control
- Store profile inspection
- Store audit trail display
- Store metrics
- Store API route
- Deployment status integration
- Live verification route coverage
- Preflight audit coverage

## Next phase recommendation

**Step 2.5 — Database Persistence Layer**

Implement:

- Prisma schema for stores
- PostgreSQL database connection
- Database-backed store CRUD
- Owner relationship persistence
- Store audit log persistence
- Store permission guards
- Server-side protected actions
- Render database environment setup
- Database migration automation

## Development rules

Before each new phase:

1. Run `npm run check` locally.
2. Confirm GitHub Actions passes.
3. Confirm Render deploy succeeds.
4. Confirm live Render verification passes.
5. Update audit and deployment docs if infrastructure changes.

## Current deployment target

```txt
Full-stack app -> Render
Future frontend-only split -> Cloudflare Pages
```

## Ready criteria

The project is ready for Step 2.5 when:

- GitHub Actions CI/CD completes.
- Render deployment is successful.
- `/api/health` returns `ok:true`.
- `/api/deployment/status` returns `ok:true` and `secretsExposed:false`.
- `/api/admin/stores` returns `ok:true`.
- `/admin/stores` loads.
- Login page loads.
- Admin pages load or redirect as expected.
