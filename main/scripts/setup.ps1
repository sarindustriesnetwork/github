Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " SAR INDUSTRIES NETWORK - One Click Project Setup" -ForegroundColor Cyan
Write-Host " Step 2.3 User CRUD + RBAC | Node 20 Compatible | Public NPM Registry" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

function Stop-WithMessage($message) {
  Write-Host $message -ForegroundColor Red
  exit 1
}

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
  Stop-WithMessage "Node.js is not installed. Please install Node.js LTS 20 or 22 first."
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
  Stop-WithMessage "npm is not installed. Reinstall Node.js LTS with npm included."
}

$nodeVersion = node -v
Write-Host "Detected Node.js $nodeVersion" -ForegroundColor Green
Write-Host "Using npm and public registry: https://registry.npmjs.org/" -ForegroundColor Yellow

# Force public npm registry for this project and current user session.
npm config set registry https://registry.npmjs.org/ | Out-Null

if (!(Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host ".env file created from .env.example" -ForegroundColor Green
}

# Remove pnpm artifacts from old builds if present.
if (Test-Path "pnpm-lock.yaml") {
  Remove-Item "pnpm-lock.yaml" -Force
  Write-Host "Removed old pnpm-lock.yaml to avoid private registry download URLs." -ForegroundColor Yellow
}
if (Test-Path "pnpm-workspace.yaml") {
  Remove-Item "pnpm-workspace.yaml" -Force
}

Write-Host "Installing dependencies with npm..." -ForegroundColor Cyan
npm install --registry=https://registry.npmjs.org/

Write-Host "Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "Checking Docker availability..." -ForegroundColor Cyan
$dockerAvailable = $false
try {
  docker --version | Out-Null
  $dockerAvailable = $true
} catch {
  $dockerAvailable = $false
}

if ($dockerAvailable) {
  Write-Host "Docker detected. You can run START_DATABASE_WINDOWS.bat for full database setup." -ForegroundColor Green
} else {
  Write-Host "Docker not detected. Localhost UI will still run without database mode." -ForegroundColor Yellow
  Write-Host "Install Docker Desktop later and run START_DATABASE_WINDOWS.bat for PostgreSQL + seed." -ForegroundColor Yellow
}

Write-Host "=====================================================" -ForegroundColor Green
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Admin: SAIFUL ALAM RAFI" -ForegroundColor Green
Write-Host "Email: admin@sarindustriesnetwork.com" -ForegroundColor Green
Write-Host "Password: Admin@2026" -ForegroundColor Green
Write-Host "Login: http://localhost:3000/login" -ForegroundColor Green
Write-Host "Localhost: http://localhost:3000" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

Write-Host "Starting localhost server..." -ForegroundColor Cyan
npm run dev
