@echo off
setlocal
cd /d "%~dp0"
echo Cleaning node_modules, package-lock.json and Next cache...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .next rmdir /s /q .next
echo Clean complete. Starting setup again...
powershell -ExecutionPolicy Bypass -File scripts\setup.ps1
pause
