@echo off
echo ========================================
echo    LIMPEZA COMPLETA
echo ========================================
echo.

echo 1. Deletando node_modules...
if exist node_modules rmdir /s /q node_modules
echo    Done

echo 2. Deletando cache .tanstack...
if exist .tanstack rmdir /s /q .tanstack
echo    Done

echo 3. Deletando build dist...
if exist dist rmdir /s /q dist
echo    Done

echo 4. Deletando lock files...
if exist bun.lock del /q bun.lock
if exist package-lock.json del /q package-lock.json
echo    Done

echo.
echo ========================================
echo    REINSTALANDO DEPENDENCIAS
echo ========================================
echo.

npm install

echo.
echo ========================================
echo    PRONTO!
echo ========================================
echo.
echo Agora execute: npm run dev
echo.
pause
