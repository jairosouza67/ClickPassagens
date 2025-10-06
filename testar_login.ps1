# =========================================
# Script de Teste Rápido - Firebase Login
# =========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE RAPIDO - FIREBASE LOGIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se o servidor está rodando
Write-Host "1. Verificando servidor..." -ForegroundColor Yellow

$nodeProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
    $connections = Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue
    $connections.LocalPort -contains 5173 -or $connections.LocalPort -contains 5174 -or $connections.LocalPort -contains 5175
}

if ($nodeProcess) {
    Write-Host "   OK Servidor Vite esta rodando!" -ForegroundColor Green
    
    # Descobrir a porta exata
    $vitePorts = @(5173, 5174, 5175)
    $activePort = $null
    
    foreach ($port in $vitePorts) {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            $activePort = $port
            break
        }
    }
    
    if ($activePort) {
        Write-Host "   Porta: $activePort" -ForegroundColor Cyan
        $url = "http://localhost:$activePort"
    } else {
        $url = "http://localhost:5173"
    }
} else {
    Write-Host "   AVISO Servidor NAO esta rodando!" -ForegroundColor Red
    Write-Host "   Execute: npm run dev" -ForegroundColor Yellow
    $url = "http://localhost:5173"
}

# 2. Verificar .env
Write-Host ""
Write-Host "2. Verificando credenciais..." -ForegroundColor Yellow

if (Test-Path .env) {
    $envContent = Get-Content .env -Raw
    
    if ($envContent -match "VITE_FIREBASE_API_KEY=([^\s]+)") {
        $apiKey = $matches[1]
        if ($apiKey -and $apiKey -ne "your_api_key" -and $apiKey.Length -gt 20) {
            Write-Host "   OK API_KEY configurado (${apiKey.Substring(0,10)}...)" -ForegroundColor Green
        } else {
            Write-Host "   ERRO API_KEY invalido!" -ForegroundColor Red
        }
    }
    
    if ($envContent -match "VITE_FIREBASE_APP_ID=([^\s]+)") {
        $appId = $matches[1]
        if ($appId -match "^1:\d+:web:[a-f0-9]+$") {
            Write-Host "   OK APP_ID formato correto" -ForegroundColor Green
        } else {
            Write-Host "   ERRO APP_ID formato incorreto: $appId" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ERRO Arquivo .env nao encontrado!" -ForegroundColor Red
}

# 3. Instruções de teste
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMO TESTAR:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 1: Abra o navegador" -ForegroundColor Yellow
Write-Host "   URL: $url" -ForegroundColor White
Write-Host ""

Write-Host "PASSO 2: Abra o Console (F12)" -ForegroundColor Yellow
Write-Host "   - Clique na aba 'Console'" -ForegroundColor White
Write-Host ""

Write-Host "PASSO 3: Procure por estas mensagens:" -ForegroundColor Yellow
Write-Host "   OK 'Firebase inicializado com sucesso!'" -ForegroundColor Green
Write-Host "   OK 'AuthContext: Registrando listener...'" -ForegroundColor Green
Write-Host ""
Write-Host "   Se aparecer erros em vermelho, copie e me envie!" -ForegroundColor Red
Write-Host ""

Write-Host "PASSO 4: Teste o login" -ForegroundColor Yellow
Write-Host "   a) Clique em 'Entrar' ou 'Login'" -ForegroundColor White
Write-Host "   b) Escolha uma opcao:" -ForegroundColor White
Write-Host "      - Criar conta com Email" -ForegroundColor Cyan
Write-Host "      - Login com Google" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 5: Verifique o resultado" -ForegroundColor Yellow
Write-Host "   SUCESSO: 'Login realizado com sucesso!'" -ForegroundColor Green
Write-Host "   ERRO: Mensagem em vermelho no console" -ForegroundColor Red
Write-Host ""

# 4. Erros comuns
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ERROS COMUNS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. 'auth/popup-blocked'" -ForegroundColor Red
Write-Host "   Solucao: Permita popups para localhost" -ForegroundColor Yellow
Write-Host ""

Write-Host "2. 'auth/unauthorized-domain'" -ForegroundColor Red
Write-Host "   Solucao: Adicione 'localhost' no Firebase Console" -ForegroundColor Yellow
Write-Host "   Firebase Console > Authentication > Settings > Authorized domains" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. 'auth/user-not-found'" -ForegroundColor Red
Write-Host "   Solucao: Crie uma conta primeiro (Sign Up)" -ForegroundColor Yellow
Write-Host ""

Write-Host "4. 'Firebase nao configurado'" -ForegroundColor Red
Write-Host "   Solucao: Reinicie o servidor (npm run dev)" -ForegroundColor Yellow
Write-Host ""

# 5. Links úteis
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LINKS UTEIS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Aplicacao principal:" -ForegroundColor Yellow
Write-Host "   $url" -ForegroundColor White
Write-Host ""

Write-Host "Pagina de teste segura:" -ForegroundColor Yellow
Write-Host "   $url/test_firebase_seguro.html" -ForegroundColor White
Write-Host ""

Write-Host "Firebase Console:" -ForegroundColor Yellow
Write-Host "   https://console.firebase.google.com/project/clickpassagens-dee10" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Tentar abrir automaticamente
$openBrowser = Read-Host "Deseja abrir o navegador automaticamente? (S/N)"

if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Write-Host ""
    Write-Host "Abrindo navegador..." -ForegroundColor Green
    Start-Process $url
    Write-Host "OK Navegador aberto!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Agora pressione F12 no navegador e siga as instrucoes acima!" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
