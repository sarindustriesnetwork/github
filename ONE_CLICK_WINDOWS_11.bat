@echo off
setlocal EnableExtensions EnableDelayedExpansion
cls
title SAR INDUSTRIES NETWORK - Windows 11 One Click Localhost
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Windows 11 One Click Setup
echo =====================================================
echo.
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found.
  echo.
  where winget >nul 2>nul
  if errorlevel 1 (
    echo Please install Node.js 20 LTS from https://nodejs.org and run this file again.
    pause
    exit /b 1
  )
  echo Installing Node.js LTS using Windows Package Manager...
  winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
  echo.
  echo If Node was installed just now, close this window and run this file again.
  pause
  exit /b 0
)

node -v
npm -v

if not exist .env (
  copy .env.example .env >nul
  echo .env created from .env.example
)

findstr /C:"DEFAULT_ADMIN_PASSWORD=" .env >nul 2>nul
if errorlevel 1 (
  echo DEFAULT_ADMIN_PASSWORD=LocalAdmin@2026>>.env
  echo Local admin password added to private .env file.
)

echo.
echo Installing dependencies from public npm registry...
npm install --registry=https://registry.npmjs.org/
if errorlevel 1 (
  echo npm install failed.
  pause
  exit /b 1
)

echo.
echo Running preflight and production build check...
npm run check
if errorlevel 1 (
  echo Build check failed. Please review the error above.
  pause
  exit /b 1
)

echo.
echo Starting localhost app...
start "SAR Localhost Server" cmd /k "cd /d %~dp0 && npm run dev"

echo Waiting for Next.js server...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 8"

echo Opening Chrome browser...
set APP_URL=http://localhost:3000
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
  start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" %APP_URL%
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
  start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" %APP_URL%
) else (
  start "" %APP_URL%
)

echo.
echo Local app started: %APP_URL%
echo Login email: admin@sarindustriesnetwork.com
echo Login password: stored in your local .env file
echo.
pause
