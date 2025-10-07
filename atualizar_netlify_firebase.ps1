#!/usr/bin/env pwsh
# Script para atualizar variáveis Firebase no Netlify

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Atualizar Firebase no Netlify" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 PASSO A PASSO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse: https://app.netlify.com/sites/clickpassagens/configuration/env" -ForegroundColor White
Write-Host ""
Write-Host "2. Clique em 'Edit' nas seguintes variáveis e atualize os valores:" -ForegroundColor White
Write-Host ""
Write-Host "   VITE_FIREBASE_API_KEY" -ForegroundColor Green
Write-Host "   Valor: AIzaSyDAcLO47JOWxvEa-fpzDI02zd6C1ab6uGA" -ForegroundColor Gray
Write-Host ""
Write-Host "   VITE_FIREBASE_MESSAGING_SENDER_ID" -ForegroundColor Green
Write-Host "   Valor: 334285502963" -ForegroundColor Gray
Write-Host ""
Write-Host "   VITE_FIREBASE_APP_ID" -ForegroundColor Green
Write-Host "   Valor: 1:334285502963:web:189bd0ee0ad8ec8bac3a86" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Clique em 'Save' em cada variável" -ForegroundColor White
Write-Host ""
Write-Host "4. Aguarde o redeploy automático do Netlify (ou force um redeploy)" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan

# Abrir navegador automaticamente
Write-Host ""
$resposta = Read-Host "Deseja abrir o Netlify no navegador agora? (S/N)"

if ($resposta -eq "S" -or $resposta -eq "s") {
    Start-Process "https://app.netlify.com/sites/clickpassagens/configuration/env"
    Write-Host "✅ Navegador aberto!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
