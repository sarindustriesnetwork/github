#!/usr/bin/env bash
set -e

echo "Running production checks..."
pnpm check

echo "Building app..."
pnpm build

echo "Deploying database migrations..."
pnpm db:deploy

echo "Deploying to Vercel..."
vercel --prod
