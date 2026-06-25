@echo off
setlocal
cd /d "%~dp0"
echo =====================================================
echo  SAR INDUSTRIES NETWORK - ZIP Update Manager
echo =====================================================
echo.
echo Tip: Drag and drop an updated project ZIP onto this file,
echo or double-click it and select the ZIP manually.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\update-from-zip.ps1" %*
echo.
echo Update manager finished.
pause
