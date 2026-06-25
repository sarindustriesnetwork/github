# Cloud Deployment Guide

## Recommended Free-First Stack

- Vercel: app hosting
- Neon or Supabase: PostgreSQL database
- Upstash: Redis
- Cloudflare: DNS/CDN/R2 storage
- Resend: email
- Sentry: error tracking
- PostHog: analytics

## Deployment Steps

1. Push this project to GitHub.
2. Create a PostgreSQL database on Neon or Supabase.
3. Copy the cloud `DATABASE_URL`.
4. Create Redis on Upstash and copy `REDIS_URL`.
5. Create project in Vercel.
6. Add environment variables from `.env.example`.
7. Run production migrations:

```bash
pnpm db:deploy
```

8. Deploy:

```bash
vercel --prod
```

## Production Security

Before production:

- Change `AUTH_SECRET`.
- Change `JWT_SECRET`.
- Change default Super Admin password.
- Enable email provider.
- Enable Sentry.
- Add proper database backups.
- Enable HTTPS domain.
