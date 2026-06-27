@echo off
cls
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Platform Manager
echo =====================================================
echo.
where python >nul 2>nul
if errorlevel 1 (
  echo Python is not installed or not added to PATH.
  echo Install Python 3.10 or newer and run again.
  pause
  exit /b 1
)
echo Choose action:
echo 1. Audit only
echo 2. Configure files
echo 3. Install dependencies
echo 4. Build and check
echo 5. Verify live Render
echo 6. Full all-in-one flow
echo.
set /p ACTION=Enter number: 
if "%ACTION%"=="1" python scripts\sar_nuclear_manager.py audit
if "%ACTION%"=="2" python scripts\sar_nuclear_manager.py configure
if "%ACTION%"=="3" python scripts\sar_nuclear_manager.py install
if "%ACTION%"=="4" python scripts\sar_nuclear_manager.py build
if "%ACTION%"=="5" (
  set /p RENDER_TARGET=Render URL [https://github-ufs3.onrender.com]: 
  if "%RENDER_TARGET%"=="" set RENDER_TARGET=https://github-ufs3.onrender.com
  python scripts\sar_nuclear_manager.py verify --url %RENDER_TARGET%
)
if "%ACTION%"=="6" (
  set /p RENDER_TARGET=Render URL [https://github-ufs3.onrender.com]: 
  if "%RENDER_TARGET%"=="" set RENDER_TARGET=https://github-ufs3.onrender.com
  python scripts\sar_nuclear_manager.py all --url %RENDER_TARGET% --soft-verify
)
pause
