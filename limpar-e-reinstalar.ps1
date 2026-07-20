# Script de Limpeza Completa e Reinstalação

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LIMPEZA COMPLETA E REINSTALAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Deletar node_modules
Write-Host "1. Deletando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "   ✓ node_modules deletado" -ForegroundColor Green
} else {
    Write-Host "   - node_modules já não existe" -ForegroundColor Gray
}

# 2. Deletar .tanstack
Write-Host "2. Deletando cache .tanstack..." -ForegroundColor Yellow
if (Test-Path ".tanstack") {
    Remove-Item -Recurse -Force .tanstack
    Write-Host "   ✓ .tanstack deletado" -ForegroundColor Green
} else {
    Write-Host "   - .tanstack já não existe" -ForegroundColor Gray
}

# 3. Deletar dist
Write-Host "3. Deletando build dist..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "   ✓ dist deletado" -ForegroundColor Green
} else {
    Write-Host "   - dist já não existe" -ForegroundColor Gray
}

# 4. Deletar lock files
Write-Host "4. Deletando lock files..." -ForegroundColor Yellow
if (Test-Path "bun.lock") {
    Remove-Item -Force bun.lock
    Write-Host "   ✓ bun.lock deletado" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
    Write-Host "   ✓ package-lock.json deletado" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   REINSTALANDO DEPENDÊNCIAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 5. Reinstalar com npm
Write-Host "5. Instalando com npm..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✓ LIMPEZA E REINSTALAÇÃO COMPLETAS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. npm run dev" -ForegroundColor White
Write-Host "2. Acesse http://localhost:3005/test" -ForegroundColor White
Write-Host ""
