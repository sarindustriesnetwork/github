# GitHub Desktop Push Guide

This ZIP is prepared for direct commit and push using GitHub Desktop.

## Repository

Target repository:

```txt
https://github.com/sarindustriesnetwork/main
```

## Method A — Recommended: GitHub Desktop

1. Unzip this package.
2. Open **GitHub Desktop**.
3. Sign in with the GitHub account that has permission to push to `sarindustriesnetwork/main`.
4. Go to **File → Add local repository**.
5. Select the unzipped project folder.
6. If GitHub Desktop says it is not a Git repository, choose **create a repository from this folder**.
7. Repository name: `main` or `sar-industries-network`.
8. Keep the local path as the unzipped folder.
9. Commit message:

```txt
Build production SAR Industries Network app
```

10. Click **Commit to main**.
11. Click **Publish repository** or **Push origin**.
12. When selecting remote, use:

```txt
sarindustriesnetwork/main
```

If it creates a new repository by mistake, cancel and choose **Repository → Repository settings → Remote** and set the remote URL to:

```txt
https://github.com/sarindustriesnetwork/main.git
```

Then push again.

## Method B — Terminal fallback

```powershell
git init
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/sarindustriesnetwork/main.git
git add .
git commit -m "Build production SAR Industries Network app"
git push -u origin main --force
```

## If push gives 403 permission error

That means GitHub Desktop or Git Credential Manager is logged in with the wrong GitHub account.

Fix:

1. Open GitHub Desktop.
2. Go to **File → Options → Accounts**.
3. Sign out.
4. Sign in with the account that owns or can push to `sarindustriesnetwork/main`.
5. Try **Push origin** again.

## Local setup after push

Create `.env` from `.env.example`:

```powershell
copy .env.example .env
```

Install and run:

```powershell
npm install
npm run db:generate
npm run dev
```

For full production check:

```powershell
npm run typecheck
npm run build
```

## Included production structure

- Next.js App Router
- Admin dashboard pages
- Auth routes: login/logout/me
- RBAC routes and permission layer
- User CRUD admin APIs
- Prisma schema and seed file
- API response/request helpers
- Middleware route protection
- GitHub Actions CI workflow
- Optional Vercel deployment workflow
- Docker Compose database setup
- Windows setup/update scripts
