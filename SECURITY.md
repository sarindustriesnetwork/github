# Security Policy

## Secret handling

Never commit real credentials, admin passwords, database URLs, access tokens, API keys, private keys, or production environment files.

Use environment variables for secrets:

```txt
DEFAULT_ADMIN_PASSWORD
DATABASE_URL
API_KEYS
SERVICE_TOKENS
```

## Reporting security issues

Open a private communication channel with the project owner before sharing sensitive security details publicly.

## Production requirements

Before production launch:

- Replace all local test secrets.
- Use a strong admin password.
- Add database-backed sessions.
- Add rate limiting for auth routes.
- Add audit logging for admin actions.
- Enable Render environment secrets.
- Enable domain HTTPS.
