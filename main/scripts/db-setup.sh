#!/usr/bin/env bash
set -e
PNPM_VERSION="9.15.9"
run_pnpm() { npx --yes "pnpm@$PNPM_VERSION" "$@"; }

echo "====================================================="
echo " SAR INDUSTRIES NETWORK - Database Setup"
echo "====================================================="

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed. Install Docker Desktop first, open it, then run this again."
  exit 1
fi

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ".env file created from .env.example"
fi

docker compose up -d
export PRISMA_SKIP_POSTINSTALL_GENERATE=true
run_pnpm install
unset PRISMA_SKIP_POSTINSTALL_GENERATE
run_pnpm db:generate
run_pnpm db:migrate
run_pnpm db:seed

echo "Database setup and Super Admin seed completed."
echo "Admin email: admin@sarindustriesnetwork.com"
echo "Admin password: Admin@2026"
