#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "====================================================="
echo " SAR INDUSTRIES NETWORK - ZIP Update Manager"
echo "====================================================="

ZIP_PATH="${1:-}"
if [ -z "$ZIP_PATH" ]; then
  echo "Usage: ./scripts/update-from-zip.sh /path/to/updated-project.zip"
  exit 1
fi

if [ ! -f "$ZIP_PATH" ]; then
  echo "ZIP not found: $ZIP_PATH"
  exit 1
fi

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
UPDATES_DIR="$PROJECT_ROOT/_updates"
BACKUPS_DIR="$PROJECT_ROOT/_backups"
EXTRACT_DIR="$UPDATES_DIR/extract-$TIMESTAMP"
mkdir -p "$UPDATES_DIR" "$BACKUPS_DIR" "$EXTRACT_DIR"

echo "Extracting update package..."
unzip -q "$ZIP_PATH" -d "$EXTRACT_DIR"

PACKAGE_JSON="$(find "$EXTRACT_DIR" -path '*/node_modules' -prune -o -name package.json -type f -print | awk '{ print length, $0 }' | sort -n | cut -d' ' -f2- | head -n 1)"
if [ -z "$PACKAGE_JSON" ]; then
  echo "No package.json found inside ZIP. Invalid update package."
  exit 1
fi
UPDATE_ROOT="$(dirname "$PACKAGE_JSON")"
echo "Detected update root: $UPDATE_ROOT"

if [ -f ".env" ]; then
  cp .env "$UPDATES_DIR/.env.backup-$TIMESTAMP"
fi

echo "Creating safe backup..."
rsync -a --exclude node_modules --exclude .next --exclude .git --exclude .vercel --exclude _updates --exclude _backups --exclude _incoming_updates --exclude .turbo --exclude .env --exclude .env.local "$PROJECT_ROOT/" "$BACKUPS_DIR/backup-$TIMESTAMP/"

echo "Applying update files..."
rsync -a --exclude node_modules --exclude .next --exclude .git --exclude .vercel --exclude _updates --exclude _backups --exclude _incoming_updates --exclude .turbo --exclude .env --exclude .env.local "$UPDATE_ROOT/" "$PROJECT_ROOT/"

if [ -f "$UPDATES_DIR/.env.backup-$TIMESTAMP" ]; then
  cp "$UPDATES_DIR/.env.backup-$TIMESTAMP" .env
elif [ -f ".env.example" ] && [ ! -f ".env" ]; then
  cp .env.example .env
fi

echo "Forcing public npm registry..."
npm config set registry https://registry.npmjs.org/ || true

echo "Installing/updating dependencies..."
npm install

echo "Starting Docker services if available..."
if command -v docker >/dev/null 2>&1 && [ -f docker-compose.yml ]; then
  docker compose up -d || true
fi

echo "Generating Prisma client and running safe database setup..."
npm run db:generate --if-present || true
npm run db:migrate -- --name "auto_update_$TIMESTAMP" || true
npm run db:seed --if-present || true

echo "Running typecheck if available..."
npm run typecheck --if-present || true

echo "Update completed. Run: npm run dev"
