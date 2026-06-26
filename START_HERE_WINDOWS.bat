@echo off
cls
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Localhost Setup
echo =====================================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 20 LTS or newer, then run again.
  pause
  exit /b 1
)
node -v
if not exist .env (
  copy .env.example .env
  echo .env file created from .env.example
)
findstr /C:"DEFAULT_ADMIN_PASSWORD=" .env >nul 2>nul
if errorlevel 1 (
  echo.
  echo Configure a local admin secret for login testing.
  set /p SAR_LOCAL_SECRET=Enter local admin secret: 
  echo DEFAULT_ADMIN_PASSWORD=%SAR_LOCAL_SECRET%>>.env
  echo Local admin secret saved to .env. Do not commit this file.
)
echo.
echo Installing dependencies from public npm registry...
npm install --registry=https://registry.npmjs.org/
if errorlevel 1 (
  echo Dependency installation failed.
  pause
  exit /b 1
)
echo.
echo Starting localhost server...
npm run dev
pause
