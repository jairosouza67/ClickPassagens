# Script para Reiniciar Servidor Limpo

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "REINICIANDO SERVIDOR LIMPO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Parar todos os processos Node/Vite
Write-Host "1. Parando processos antigos..." -ForegroundColor Yellow

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   Encontrados $($nodeProcesses.Count) processos Node" -ForegroundColor Cyan
    
    foreach ($proc in $nodeProcesses) {
        try {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            Write-Host "   Parado processo: $($proc.Id)" -ForegroundColor Green
        } catch {
            Write-Host "   Falha ao parar: $($proc.Id)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds 2
    Write-Host "   OK Processos parados!" -ForegroundColor Green
} else {
    Write-Host "   Nenhum processo Node rodando" -ForegroundColor Cyan
}

# 2. Verificar se as portas estão livres
Write-Host ""
Write-Host "2. Verificando portas..." -ForegroundColor Yellow

$ports = @(5173, 5174, 5175)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "   AVISO Porta $port ainda em uso!" -ForegroundColor Red
        
        # Tentar matar o processo
        $processId = $connection.OwningProcess
        try {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Write-Host "   OK Processo $processId terminado" -ForegroundColor Green
        } catch {}
    } else {
        Write-Host "   OK Porta $port livre" -ForegroundColor Green
    }
}

Start-Sleep -Seconds 1

# 3. Iniciar servidor limpo
Write-Host ""
Write-Host "3. Iniciando servidor limpo..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Executar npm run dev
npm run dev
