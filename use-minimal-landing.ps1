# Script para usar landing page minimal (sem SSR issues)

Write-Host "Fazendo backup da landing page atual..." -ForegroundColor Yellow
Copy-Item "src\routes\index.tsx" "src\routes\index.full.tsx.bak" -Force

Write-Host "Substituindo por versão minimal..." -ForegroundColor Yellow
Copy-Item "src\routes\index.minimal.tsx" "src\routes\index.tsx" -Force

Write-Host "" 
Write-Host "✅ Landing page minimal ativada!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora:" -ForegroundColor Cyan
Write-Host "1. Reinicie o servidor (Ctrl+C e npm run dev)" -ForegroundColor White
Write-Host "2. Acesse http://localhost:3005" -ForegroundColor White
Write-Host ""
Write-Host "Para reverter:" -ForegroundColor Yellow
Write-Host ".\restore-full-landing.ps1" -ForegroundColor White
