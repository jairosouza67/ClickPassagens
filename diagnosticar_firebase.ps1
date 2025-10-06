# =========================================
# Script de Diagnóstico Firebase
# =========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTICO FIREBASE - ClickPassagens" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar arquivo .env
Write-Host "Verificando arquivo .env..." -ForegroundColor Yellow

if (Test-Path .env) {
    Write-Host "OK Arquivo .env encontrado" -ForegroundColor Green
    
    # Ler variáveis do Firebase
    $envContent = Get-Content .env
    $firebaseVars = $envContent | Where-Object { $_ -match "VITE_FIREBASE" }
    
    Write-Host ""
    Write-Host "Variaveis Firebase:" -ForegroundColor Cyan
    foreach ($var in $firebaseVars) {
        if ($var -match "VITE_FIREBASE_API_KEY=(.+)") {
            $value = $matches[1]
            if ($value -and $value -ne "your_api_key" -and $value -ne "DEMO_KEY") {
                Write-Host "  OK API_KEY: Configurado" -ForegroundColor Green
            } else {
                Write-Host "  ERRO API_KEY: NAO configurado!" -ForegroundColor Red
            }
        }
        elseif ($var -match "VITE_FIREBASE_PROJECT_ID=(.+)") {
            $value = $matches[1]
            if ($value -and $value -ne "your_project_id") {
                Write-Host "  OK PROJECT_ID: $value" -ForegroundColor Green
            } else {
                Write-Host "  ERRO PROJECT_ID: NAO configurado!" -ForegroundColor Red
            }
        }
        elseif ($var -match "VITE_FIREBASE_APP_ID=(.+)") {
            $value = $matches[1]
            if ($value -match "^1:\d+:web:[a-f0-9]+$") {
                Write-Host "  OK APP_ID: Formato correto" -ForegroundColor Green
            } elseif ($value -match "seu_app_id") {
                Write-Host "  ERRO APP_ID: Contem placeholder 'seu_app_id'!" -ForegroundColor Red
                Write-Host "     Valor atual: $value" -ForegroundColor Yellow
            } else {
                Write-Host "  AVISO APP_ID: Formato pode estar incorreto" -ForegroundColor Yellow
                Write-Host "     Valor: $value" -ForegroundColor Yellow
                Write-Host "     Esperado: 1:XXXXX:web:XXXXX" -ForegroundColor Cyan
            }
        }
    }
} else {
    Write-Host "ERRO Arquivo .env NAO encontrado!" -ForegroundColor Red
}

# 2. Verificar node_modules
Write-Host ""
Write-Host "Verificando dependencias..." -ForegroundColor Yellow

if (Test-Path "node_modules/firebase") {
    Write-Host "OK Firebase instalado" -ForegroundColor Green
} else {
    Write-Host "ERRO Firebase NAO instalado!" -ForegroundColor Red
    Write-Host "   Execute: npm install" -ForegroundColor Cyan
}

# 3. Verificar arquivos de configuração
Write-Host ""
Write-Host "Verificando arquivos de configuracao..." -ForegroundColor Yellow

if (Test-Path "src/config/firebase.js") {
    Write-Host "OK src/config/firebase.js existe" -ForegroundColor Green
} else {
    Write-Host "ERRO src/config/firebase.js NAO encontrado!" -ForegroundColor Red
}

if (Test-Path "src/contexts/AuthContext.jsx") {
    Write-Host "OK src/contexts/AuthContext.jsx existe" -ForegroundColor Green
} else {
    Write-Host "ERRO src/contexts/AuthContext.jsx NAO encontrado!" -ForegroundColor Red
}

# 4. Resumo e recomendações
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMO E RECOMENDACOES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Para testar a configuracao do Firebase:" -ForegroundColor Yellow
Write-Host "1. Abra o arquivo: test_firebase_config.html no navegador" -ForegroundColor White
Write-Host "2. Ou execute: npm run dev" -ForegroundColor White
Write-Host "3. Depois abra: http://localhost:5173/test_firebase_config.html" -ForegroundColor White

Write-Host ""
Write-Host "PROBLEMAS COMUNS:" -ForegroundColor Yellow
Write-Host "1. APP_ID incorreto - deve comecar com '1:'" -ForegroundColor White
Write-Host "2. Dominio nao autorizado no Firebase Console" -ForegroundColor White
Write-Host "3. Metodos de autenticacao nao ativados" -ForegroundColor White
Write-Host "4. Popup bloqueado pelo navegador" -ForegroundColor White

Write-Host ""
Write-Host "PASSOS PARA CORRIGIR:" -ForegroundColor Yellow
Write-Host "1. Acesse: https://console.firebase.google.com/" -ForegroundColor White
Write-Host "2. Selecione o projeto: clickpassagens-dee10" -ForegroundColor White
Write-Host "3. Va em Configuracoes > Seus aplicativos" -ForegroundColor White
Write-Host "4. Copie as credenciais corretas" -ForegroundColor White
Write-Host "5. Em Authentication > Sign-in method:" -ForegroundColor White
Write-Host "   - Ative Email/Password" -ForegroundColor White
Write-Host "   - Ative Google" -ForegroundColor White
Write-Host "6. Em Authentication > Settings > Authorized domains:" -ForegroundColor White
Write-Host "   - Adicione: localhost" -ForegroundColor White
Write-Host "   - Adicione seu dominio de producao" -ForegroundColor White

Write-Host ""
Write-Host "Apos corrigir, reinicie o servidor com:" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor Cyan

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

