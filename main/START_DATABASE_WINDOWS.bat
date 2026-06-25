@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File scripts\db-setup.ps1
pause
