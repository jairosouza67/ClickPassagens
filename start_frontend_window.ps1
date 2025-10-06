# Script para iniciar o Frontend do ClickPassagens
# Este script abre o frontend em uma nova janela do PowerShell

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 INICIANDO FRONTEND - ClickPassagens" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules não encontrado!" -ForegroundColor Yellow
    Write-Host "   Instalando dependências..." -ForegroundColor Yellow
    Write-Host ""
    npm install
    Write-Host ""
}

Write-Host "✅ Dependências encontradas" -ForegroundColor Green
Write-Host "✅ Iniciando Vite..." -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  📡 FRONTEND SERÁ INICIADO EM:" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  🌐 http://localhost:5173 (ou outra porta se estiver em uso)" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""
Write-Host "  • Mantenha esta janela ABERTA" -ForegroundColor White
Write-Host "  • Para parar o servidor: Pressione CTRL+C" -ForegroundColor White
Write-Host "  • O navegador abrirá automaticamente" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Iniciar o frontend
npm run dev

# Se o script terminar (erro ou CTRL+C)
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
Write-Host "  ⚠️  FRONTEND ENCERRADO" -ForegroundColor Red
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
Write-Host ""
Read-Host "Pressione Enter para fechar"
