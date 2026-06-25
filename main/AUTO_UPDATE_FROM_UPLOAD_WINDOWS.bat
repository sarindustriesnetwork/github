@echo off
setlocal
cd /d "%~dp0"
echo =====================================================
echo  SAR INDUSTRIES NETWORK - Auto Update From Uploaded ZIP
echo =====================================================
echo.
echo Put your new updated ZIP file inside:
echo   _incoming_updates
echo.
echo This tool will pick the newest ZIP from that folder.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\update-from-zip.ps1" -AutoPickIncoming
echo.
echo Auto update finished.
pause
