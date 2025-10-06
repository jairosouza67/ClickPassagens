# Script de Verificação - ClickPassagens
# Este script verifica se todas as configurações necessárias estão presentes

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  VERIFICAÇÃO DE CONFIGURAÇÃO - ClickPassagens" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$erros = 0
$avisos = 0

# Verificar se arquivo .env existe
Write-Host "1. Verificando arquivo .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ Arquivo .env encontrado" -ForegroundColor Green
    
    # Ler arquivo .env
    $envContent = Get-Content ".env" -Raw
    
    # Verificar Amadeus
    Write-Host ""
    Write-Host "2. Verificando Amadeus API..." -ForegroundColor Yellow
    
    if ($envContent -match "AMADEUS_API_KEY=(.+)") {
        $key = $matches[1].Trim()
        if ($key -eq "" -or $key -eq "sua_chave_api_amadeus_aqui" -or $key -eq "SUA_NOVA_API_KEY_AQUI") {
            Write-Host "   ❌ AMADEUS_API_KEY não configurada!" -ForegroundColor Red
            Write-Host "      Configure em: https://developers.amadeus.com/" -ForegroundColor Yellow
            $erros++
        } elseif ($key -eq "cppo2FiXfoOVQ7jyggpCKl0fG8NYH1Pu") {
            Write-Host "   ❌ AMADEUS_API_KEY usando chave REVOGADA!" -ForegroundColor Red
            Write-Host "      Esta chave foi revogada pela Amadeus!" -ForegroundColor Yellow
            Write-Host "      Gere uma nova em: https://developers.amadeus.com/" -ForegroundColor Yellow
            $erros++
        } else {
            Write-Host "   ✅ AMADEUS_API_KEY configurada" -ForegroundColor Green
        }
    } else {
        Write-Host "   ❌ AMADEUS_API_KEY não encontrada no .env" -ForegroundColor Red
        $erros++
    }
    
    if ($envContent -match "AMADEUS_API_SECRET=(.+)") {
        $secret = $matches[1].Trim()
        if ($secret -eq "" -or $secret -eq "seu_secret_amadeus_aqui" -or $secret -eq "SEU_NOVO_API_SECRET_AQUI") {
            Write-Host "   ❌ AMADEUS_API_SECRET não configurado!" -ForegroundColor Red
            $erros++
        } elseif ($secret -eq "AQlRGZdG1Qm3y74f") {
            Write-Host "   ❌ AMADEUS_API_SECRET usando secret REVOGADO!" -ForegroundColor Red
            $erros++
        } else {
            Write-Host "   ✅ AMADEUS_API_SECRET configurado" -ForegroundColor Green
        }
    } else {
        Write-Host "   ❌ AMADEUS_API_SECRET não encontrado no .env" -ForegroundColor Red
        $erros++
    }
    
    # Verificar Firebase
    Write-Host ""
    Write-Host "3. Verificando Firebase..." -ForegroundColor Yellow
    
    $firebaseVars = @(
        "VITE_FIREBASE_API_KEY",
        "VITE_FIREBASE_AUTH_DOMAIN",
        "VITE_FIREBASE_PROJECT_ID",
        "VITE_FIREBASE_STORAGE_BUCKET",
        "VITE_FIREBASE_MESSAGING_SENDER_ID",
        "VITE_FIREBASE_APP_ID"
    )
    
    $firebaseOk = $true
    foreach ($var in $firebaseVars) {
        if ($envContent -match "$var=(.+)") {
            $value = $matches[1].Trim()
            if ($value -eq "" -or $value -match "sua_|seu-projeto") {
                Write-Host "   ❌ $var não configurado!" -ForegroundColor Red
                $firebaseOk = $false
                $erros++
            } else {
                Write-Host "   ✅ $var configurado" -ForegroundColor Green
            }
        } else {
            Write-Host "   ❌ $var não encontrado no .env" -ForegroundColor Red
            $firebaseOk = $false
            $erros++
        }
    }
    
    if ($firebaseOk) {
        Write-Host ""
        Write-Host "   🎉 Firebase completamente configurado!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "   ⚠️  Configure Firebase em: https://console.firebase.google.com/" -ForegroundColor Yellow
    }
    
    # Verificar Backend URL
    Write-Host ""
    Write-Host "4. Verificando URLs..." -ForegroundColor Yellow
    
    if ($envContent -match "VITE_API_BASE_URL=(.+)") {
        $url = $matches[1].Trim()
        Write-Host "   ✅ Backend URL: $url" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  VITE_API_BASE_URL não configurado (usando padrão)" -ForegroundColor Yellow
        $avisos++
    }
    
} else {
    Write-Host "   ❌ Arquivo .env NÃO ENCONTRADO!" -ForegroundColor Red
    Write-Host "      Copie .env.example para .env e configure" -ForegroundColor Yellow
    $erros++
}

# Verificar se há chaves antigas no código
Write-Host ""
Write-Host "5. Verificando segurança do código..." -ForegroundColor Yellow

$chavesAntigas = @(
    "cppo2FiXfoOVQ7jyggpCKl0fG8NYH1Pu",
    "AQlRGZdG1Qm3y74f"
)

$arquivosProblematicos = @()
Get-ChildItem -Path "src" -Recurse -Include "*.py","*.js","*.jsx" | ForEach-Object {
    $conteudo = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    foreach ($chave in $chavesAntigas) {
        if ($conteudo -match $chave) {
            $arquivosProblematicos += $_.FullName
            break
        }
    }
}

if ($arquivosProblematicos.Count -gt 0) {
    Write-Host "   ⚠️  Chaves antigas encontradas em:" -ForegroundColor Yellow
    foreach ($arquivo in $arquivosProblematicos) {
        Write-Host "      - $arquivo" -ForegroundColor Yellow
    }
    $avisos++
} else {
    Write-Host "   ✅ Nenhuma chave antiga encontrada no código" -ForegroundColor Green
}

# Verificar .gitignore
Write-Host ""
Write-Host "6. Verificando .gitignore..." -ForegroundColor Yellow

if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env") {
        Write-Host "   ✅ .env protegido no .gitignore" -ForegroundColor Green
    } else {
        Write-Host "   ❌ .env NÃO está no .gitignore!" -ForegroundColor Red
        Write-Host "      Adicione '.env' ao .gitignore URGENTE!" -ForegroundColor Yellow
        $erros++
    }
} else {
    Write-Host "   ⚠️  .gitignore não encontrado" -ForegroundColor Yellow
    $avisos++
}

# Verificar dependências Node
Write-Host ""
Write-Host "7. Verificando dependências Node..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules instalado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules não encontrado" -ForegroundColor Yellow
    Write-Host "      Execute: npm install" -ForegroundColor Yellow
    $avisos++
}

# Verificar dependências Python
Write-Host ""
Write-Host "8. Verificando ambiente Python..." -ForegroundColor Yellow

if (Test-Path ".venv") {
    Write-Host "   ✅ Ambiente virtual Python encontrado" -ForegroundColor Green
    Write-Host "      Ative com: .venv\Scripts\Activate.ps1" -ForegroundColor Cyan
} elseif (Test-Path "venv") {
    Write-Host "   ✅ Ambiente virtual Python encontrado (venv)" -ForegroundColor Green
    Write-Host "      Ative com: venv\Scripts\Activate.ps1" -ForegroundColor Cyan
} else {
    Write-Host "   ⚠️  Ambiente virtual Python não encontrado" -ForegroundColor Yellow
    Write-Host "      Crie com: python -m venv .venv" -ForegroundColor Yellow
    $avisos++
}

# Resumo final
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  RESUMO DA VERIFICAÇÃO" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($erros -eq 0 -and $avisos -eq 0) {
    Write-Host "  🎉 TUDO CERTO! Sistema configurado corretamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Inicie o backend: python main.py" -ForegroundColor White
    Write-Host "  2. Inicie o frontend: npm run dev" -ForegroundColor White
    Write-Host "  3. Acesse: http://localhost:5173" -ForegroundColor White
} elseif ($erros -eq 0) {
    Write-Host "  ⚠️  $avisos aviso(s) encontrado(s)" -ForegroundColor Yellow
    Write-Host "  O sistema deve funcionar, mas revise os avisos acima" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ $erros erro(s) crítico(s) encontrado(s)!" -ForegroundColor Red
    Write-Host "  ⚠️  $avisos aviso(s) encontrado(s)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  ⚡ AÇÃO NECESSÁRIA:" -ForegroundColor Red
    Write-Host "  1. Leia o arquivo: CONFIGURACAO_URGENTE.md" -ForegroundColor White
    Write-Host "  2. Configure as credenciais no arquivo .env" -ForegroundColor White
    Write-Host "  3. Execute este script novamente para verificar" -ForegroundColor White
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
