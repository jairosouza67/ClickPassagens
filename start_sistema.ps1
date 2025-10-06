# Script Master - Inicia Backend e Frontend em janelas separadas
# Execute este script para iniciar todo o sistema ClickPassagens

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  🚀 INICIANDO CLICKPASSAGENS - Sistema Completo" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

Write-Host "  📋 Este script irá:" -ForegroundColor Cyan
Write-Host "     1. Abrir o BACKEND em uma nova janela" -ForegroundColor White
Write-Host "     2. Abrir o FRONTEND em outra nova janela" -ForegroundColor White
Write-Host "     3. Manter ambos rodando simultaneamente" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  ⚠️  VERIFICAÇÕES PRÉ-INICIALIZAÇÃO" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

$erros = 0

# Verificar ambiente virtual Python
if (Test-Path ".venv\Scripts\python.exe") {
    Write-Host "  ✅ Ambiente virtual Python: OK" -ForegroundColor Green
} else {
    Write-Host "  ❌ Ambiente virtual Python: NÃO ENCONTRADO" -ForegroundColor Red
    $erros++
}

# Verificar node_modules
if (Test-Path "node_modules") {
    Write-Host "  ✅ Node modules: OK" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Node modules: NÃO ENCONTRADO (será instalado)" -ForegroundColor Yellow
}

# Verificar .env
if (Test-Path ".env") {
    Write-Host "  ✅ Arquivo .env: OK" -ForegroundColor Green
} else {
    Write-Host "  ❌ Arquivo .env: NÃO ENCONTRADO" -ForegroundColor Red
    $erros++
}

# Verificar main.py
if (Test-Path "main.py") {
    Write-Host "  ✅ Backend (main.py): OK" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend (main.py): NÃO ENCONTRADO" -ForegroundColor Red
    $erros++
}

# Verificar package.json
if (Test-Path "package.json") {
    Write-Host "  ✅ Frontend (package.json): OK" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend (package.json): NÃO ENCONTRADO" -ForegroundColor Red
    $erros++
}

Write-Host ""

if ($erros -gt 0) {
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ❌ ERROS ENCONTRADOS - Não é possível iniciar" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Por favor, corrija os erros acima antes de continuar." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ TODAS AS VERIFICAÇÕES PASSARAM!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "  🚀 Iniciando servidores em 3 segundos..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
Write-Host "  🚀 2..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
Write-Host "  🚀 1..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
Write-Host ""

# Iniciar Backend em nova janela
Write-Host "  📡 Abrindo BACKEND..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "start_backend_window.ps1"
Start-Sleep -Seconds 2

# Iniciar Frontend em nova janela
Write-Host "  🌐 Abrindo FRONTEND..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "start_frontend_window.ps1"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🎉 SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  📡 Backend rodando em: http://localhost:5001" -ForegroundColor Cyan
Write-Host "  🌐 Frontend rodando em: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "  💡 DICA: Aguarde alguns segundos para os servidores iniciarem" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ⚠️  Para encerrar: Feche as janelas do Backend e Frontend" -ForegroundColor Yellow
Write-Host "     ou pressione CTRL+C em cada uma delas" -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  ✨ Bom trabalho! Sistema pronto para uso!" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

Read-Host "Pressione Enter para fechar este script (servidores continuarão rodando)"
