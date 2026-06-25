@echo off
cls
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Localhost Setup
echo =====================================================
echo.
if not exist .env copy .env.example .env
echo Installing dependencies from public npm registry...
npm install --registry=https://registry.npmjs.org/
echo.
echo Starting localhost server...
npm run dev
pause
