#!/usr/bin/env bash
set -e

echo "====================================================="
echo " SAR INDUSTRIES NETWORK - One Click Project Setup | Step 2.3 User CRUD + RBAC"
echo " Node 20 Compatible | Public NPM Registry | Step 2.3"
echo "====================================================="

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install Node.js LTS 20 or 22 first."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Reinstall Node.js LTS with npm included."
  exit 1
fi

echo "Detected Node.js $(node -v)"
echo "Using npm and public registry: https://registry.npmjs.org/"
npm config set registry https://registry.npmjs.org/ >/dev/null

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ".env file created from .env.example"
fi

rm -f pnpm-lock.yaml pnpm-workspace.yaml

echo "Installing dependencies with npm..."
npm install --registry=https://registry.npmjs.org/

echo "Generating Prisma client..."
npx prisma generate

echo "Setup complete. Localhost: http://localhost:3000"
echo "Admin email: admin@sarindustriesnetwork.com"
echo "Admin password: Admin@2026"

echo "Starting localhost server..."
npm run dev
