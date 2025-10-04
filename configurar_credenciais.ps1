# Script para Configurar Credenciais de Forma Segura
# Execute este script LOCALMENTE após criar NOVAS credenciais

Write-Host "🔒 Configurador Seguro de Credenciais Amadeus" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Verificar se .env existe
if (Test-Path ".env") {
    Write-Host "✓ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠ Arquivo .env não encontrado. Criando..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Arquivo .env criado a partir do .env.example" -ForegroundColor Green
}

Write-Host ""
Write-Host "IMPORTANTE: NUNCA compartilhe suas credenciais!" -ForegroundColor Red
Write-Host ""

# Solicitar credenciais (digitação local)
Write-Host "Digite suas NOVAS credenciais da Amadeus:" -ForegroundColor Yellow
Write-Host "(Certifique-se de que revogou as credenciais antigas primeiro!)" -ForegroundColor Yellow
Write-Host ""

$apiKey = Read-Host "AMADEUS_API_KEY (cole aqui)"
$apiSecret = Read-Host "AMADEUS_API_SECRET (cole aqui)"

if ([string]::IsNullOrWhiteSpace($apiKey) -or [string]::IsNullOrWhiteSpace($apiSecret)) {
    Write-Host ""
    Write-Host "❌ ERRO: Credenciais não podem estar vazias!" -ForegroundColor Red
    Write-Host "Execute o script novamente." -ForegroundColor Red
    exit 1
}

# Ler arquivo .env atual
$envContent = Get-Content ".env" -Raw

# Substituir valores
$envContent = $envContent -replace 'AMADEUS_API_KEY=.*', "AMADEUS_API_KEY=$apiKey"
$envContent = $envContent -replace 'AMADEUS_API_SECRET=.*', "AMADEUS_API_SECRET=$apiSecret"

# Salvar arquivo
$envContent | Set-Content ".env" -NoNewline

Write-Host ""
Write-Host "=" * 60
Write-Host "✅ Credenciais configuradas com sucesso!" -ForegroundColor Green
Write-Host "=" * 60
Write-Host ""

# Verificar se .env está no .gitignore
$inGitignore = Select-String -Path ".gitignore" -Pattern "^\.env$" -Quiet

if ($inGitignore) {
    Write-Host "✓ .env está protegido no .gitignore" -ForegroundColor Green
} else {
    Write-Host "⚠ AVISO: .env pode não estar no .gitignore!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🧪 Testando conexão com Amadeus..." -ForegroundColor Cyan
Write-Host ""

# Testar conexão
python test_amadeus.py

Write-Host ""
Write-Host "=" * 60
Write-Host "📋 CHECKLIST DE SEGURANÇA:" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""
Write-Host "[ ] Revoquei as credenciais antigas" -ForegroundColor Yellow
Write-Host "[ ] Criei novas credenciais" -ForegroundColor Yellow
Write-Host "[✓] Configurei .env local" -ForegroundColor Green
Write-Host "[✓] Testei a conexão" -ForegroundColor Green
Write-Host "[ ] NÃO vou commitar o arquivo .env" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔒 Suas credenciais estão seguras e NÃO foram compartilhadas!" -ForegroundColor Green
