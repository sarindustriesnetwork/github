@echo off
cls
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Trigger Render Deploy Hook
echo =====================================================
echo.
echo Paste your Render deploy hook URL. It will not be saved to the repository.
set /p RENDER_DEPLOY_HOOK_URL=Render Deploy Hook URL: 
if "%RENDER_DEPLOY_HOOK_URL%"=="" (
  echo Missing deploy hook URL.
  pause
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 20 LTS or newer, then run again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies from public npm registry...
  npm install --registry=https://registry.npmjs.org/
)
echo Triggering Render deployment...
npm run deploy:render -- %RENDER_DEPLOY_HOOK_URL% --required
pause
