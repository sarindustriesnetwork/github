@echo off
cls
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Firebase Platform Manager
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
echo 2. Configure Firebase files
echo 3. Install dependencies
echo 4. Build and check
echo 5. Verify live Firebase app
echo 6. Full all-in-one Firebase flow
echo.
set /p ACTION=Enter number: 
if "%ACTION%"=="1" python scripts\sar_firebase_manager.py audit
if "%ACTION%"=="2" python scripts\sar_firebase_manager.py configure
if "%ACTION%"=="3" python scripts\sar_firebase_manager.py install
if "%ACTION%"=="4" python scripts\sar_firebase_manager.py build
if "%ACTION%"=="5" (
  set /p FIREBASE_TARGET=Firebase App URL: 
  python scripts\sar_firebase_manager.py verify --url %FIREBASE_TARGET%
)
if "%ACTION%"=="6" (
  set /p FIREBASE_TARGET=Firebase App URL optional: 
  if "%FIREBASE_TARGET%"=="" (
    python scripts\sar_firebase_manager.py all --soft-verify
  ) else (
    python scripts\sar_firebase_manager.py all --url %FIREBASE_TARGET% --soft-verify
  )
)
pause
