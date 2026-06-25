Write-Host "Running production checks..." -ForegroundColor Cyan
pnpm check

Write-Host "Building app..." -ForegroundColor Cyan
pnpm build

Write-Host "Deploying database migrations..." -ForegroundColor Cyan
pnpm db:deploy

Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod
