# Script para iniciar o Backend do ClickPassagens
# Este script abre o backend em uma nova janela do PowerShell

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 INICIANDO BACKEND - ClickPassagens" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar se o ambiente virtual existe
if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Write-Host "❌ Ambiente virtual não encontrado!" -ForegroundColor Red
    Write-Host "   Execute: python -m venv .venv" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host "   O backend pode não funcionar corretamente." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "✅ Ambiente virtual encontrado" -ForegroundColor Green
Write-Host "✅ Iniciando servidor Flask..." -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  📡 BACKEND SERÁ INICIADO EM:" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  🌐 http://localhost:5001" -ForegroundColor Cyan
Write-Host "  🌐 http://127.0.0.1:5001" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""
Write-Host "  • Mantenha esta janela ABERTA" -ForegroundColor White
Write-Host "  • Para parar o servidor: Pressione CTRL+C" -ForegroundColor White
Write-Host "  • Logs aparecerão abaixo" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Iniciar o backend
& ".venv\Scripts\python.exe" main.py

# Se o script terminar (erro ou CTRL+C)
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
Write-Host "  ⚠️  BACKEND ENCERRADO" -ForegroundColor Red
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
Write-Host ""
Read-Host "Pressione Enter para fechar"
