@echo off
cls
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Render Live Verification
echo =====================================================
echo.
set /p RENDER_TARGET=Enter Render URL [https://github-ufs3.onrender.com]: 
if "%RENDER_TARGET%"=="" set RENDER_TARGET=https://github-ufs3.onrender.com
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
echo.
echo Running Render verification for %RENDER_TARGET%
npm run verify:render -- %RENDER_TARGET%
pause
