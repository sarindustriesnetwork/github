@echo off
cls
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Local Windows 11 Manager
echo =====================================================
echo.
echo Choose action:
echo 1. One-click setup and run
echo 2. Install dependencies
echo 3. Run preflight and build check
echo 4. Start localhost server
echo 5. Verify localhost routes
echo.
set /p ACTION=Enter number: 
if "%ACTION%"=="1" call ONE_CLICK_WINDOWS_11.bat
if "%ACTION%"=="2" npm install --registry=https://registry.npmjs.org/
if "%ACTION%"=="3" npm run check
if "%ACTION%"=="4" npm run dev
if "%ACTION%"=="5" npm run verify:local
pause
