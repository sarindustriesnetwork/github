Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " SAR INDUSTRIES NETWORK - Database Setup" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "Docker is not installed. Install Docker Desktop first." -ForegroundColor Red
  exit 1
}

if (!(Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

npm config set registry https://registry.npmjs.org/ | Out-Null

if (!(Test-Path "node_modules")) {
  Write-Host "Installing dependencies first..." -ForegroundColor Cyan
  npm install --registry=https://registry.npmjs.org/
}

Write-Host "Starting PostgreSQL and Redis with Docker..." -ForegroundColor Cyan
docker compose up -d

Write-Host "Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "Running database migration..." -ForegroundColor Cyan
npx prisma migrate dev --name init

Write-Host "Seeding official Super Admin..." -ForegroundColor Cyan
npm run db:seed

Write-Host "Database setup complete." -ForegroundColor Green
Write-Host "Admin email: admin@sarindustriesnetwork.com" -ForegroundColor Green
Write-Host "Admin password: Admin@2026" -ForegroundColor Green
