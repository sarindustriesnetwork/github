# Pull Request Checklist

## Summary

Describe what changed and why.

## Verification

- [ ] `npm install --registry=https://registry.npmjs.org/` works.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] No secrets or real credentials are committed.
- [ ] UI pages still load correctly.
- [ ] API routes still return expected responses.

## Deployment impact

- [ ] Render configuration unchanged or updated correctly.
- [ ] Environment variables documented if new ones are required.
- [ ] Cloudflare/frontend split notes updated if relevant.
