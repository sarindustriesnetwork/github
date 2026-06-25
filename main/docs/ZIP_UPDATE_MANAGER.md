# SAR INDUSTRIES NETWORK — ZIP Update Manager

This tool updates the existing project directly from a newly generated updated ZIP file.

## Windows: easiest method

1. Copy the newest updated ZIP file into `_incoming_updates`.
2. Double-click `AUTO_UPDATE_FROM_UPLOAD_WINDOWS.bat`.
3. The updater will pick the newest ZIP automatically.
4. It will backup the current codebase, extract the new ZIP, update files, install dependencies, run Prisma setup if possible, and optionally start localhost.

## Windows: drag-and-drop method

Drag the updated ZIP file onto:

```txt
UPDATE_FROM_ZIP_WINDOWS.bat
```

## Windows: manual file picker method

Double-click:

```txt
UPDATE_FROM_ZIP_WINDOWS.bat
```

Then select the updated ZIP file.

## macOS/Linux

```bash
./scripts/update-from-zip.sh /path/to/updated-project.zip
```

## What it preserves

The updater does not overwrite:

```txt
.env
.env.local
node_modules
.next
.git
.vercel
_updates
_backups
_incoming_updates
```

Your local environment configuration stays safe.

## What it updates

The updater overwrites and adds normal codebase files, including:

```txt
app/
components/
lib/
prisma/
scripts/
docs/
package.json
next.config.mjs
tailwind.config.ts
tsconfig.json
```

## Backup system

Before updating, the tool creates a backup in:

```txt
_backups/backup-YYYYMMDD-HHMMSS
```

## Update logs

Each update creates a transcript log in:

```txt
_updates/update-log-YYYYMMDD-HHMMSS.txt
```

## If npm download fails

Run:

```bat
CLEAN_INSTALL_WINDOWS.bat
```

Then run the updater again.

## If database setup fails

The app can still run in localhost fallback mode. Install Docker Desktop later and run:

```bat
START_DATABASE_WINDOWS.bat
```

## Admin login

```txt
Email: admin@sarindustriesnetwork.com
Password: Admin@2026
```

Change the password before production use.
