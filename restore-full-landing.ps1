# Script para restaurar landing page completa

if (Test-Path "src\routes\index.full.tsx.bak") {
    Write-Host "Restaurando landing page completa..." -ForegroundColor Yellow
    Copy-Item "src\routes\index.full.tsx.bak" "src\routes\index.tsx" -Force
    Write-Host "✅ Landing page completa restaurada!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Reinicie o servidor: Ctrl+C e npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "❌ Backup não encontrado!" -ForegroundColor Red
}
