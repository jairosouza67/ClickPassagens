# Aguardar 3 minutos para o deploy
Write-Host "⏱️ Aguardando 3 minutos para deploy no Render..." -ForegroundColor Yellow
timeout /t 180 /nobreak

Write-Host "`n🔍 Testando API em produção..." -ForegroundColor Cyan

$body = '{"origem":"GRU","destino":"GIG","data_ida":"2025-10-20","passageiros":1}'

try {
    $r = Invoke-WebRequest `
        -Uri "https://clickpassagens.onrender.com/api/busca/buscar" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 60
    
    $json = $r.Content | ConvertFrom-Json
    
    Write-Host "`n✅ Status: $($r.StatusCode)" -ForegroundColor Green
    Write-Host "📊 Voos encontrados: $($json.data.resultados.Count)" -ForegroundColor Cyan
    
    if ($json.data.resultados.Count -gt 0) {
        $v = $json.data.resultados[0]
        
        Write-Host "`n🎯 PRIMEIRO VOO:" -ForegroundColor Green
        Write-Host "  Companhia: $($v.companhia.nome)"
        Write-Host "  Voo: $($v.voo_numero)"
        Write-Host "  Horário: $($v.horario_saida) → $($v.horario_chegada)"
        Write-Host "  Milhas: $($v.milhas_necessarias)"
        
        Write-Host "`n✨ NOVOS CAMPOS IMPLEMENTADOS:" -ForegroundColor Magenta
        Write-Host "  🏆 Programa: $($v.programa_fidelidade)"
        Write-Host "  📊 Confiança: $($v.nivel_confianca)"
        Write-Host "  ✅ Preço Real: $($v.preco_real_milhas)"
        Write-Host "  💰 Taxas: R$ $($v.taxas_milhas)"
        Write-Host "  💵 Custo Total (milhas+taxas): R$ $($v.custo_total_milhas)"
        Write-Host "  📈 Economia: R$ $([math]::Round($v.economia_calculada, 2))"
        
        Write-Host "`n🎉 DEPLOY BEM-SUCEDIDO!" -ForegroundColor Green
        Write-Host "Seu site está funcionando com o novo sistema de milhas!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ Nenhum voo encontrado" -ForegroundColor Yellow
        Write-Host "Isso pode ser normal - a API Amadeus pode não ter voos para esta data" -ForegroundColor Yellow
        Write-Host "`nTentando outra data..." -ForegroundColor Cyan
        
        $body2 = '{"origem":"GRU","destino":"GIG","data_ida":"2025-11-01","passageiros":1}'
        $r2 = Invoke-WebRequest -Uri "https://clickpassagens.onrender.com/api/busca/buscar" -Method POST -Body $body2 -ContentType "application/json" -TimeoutSec 60
        $json2 = $r2.Content | ConvertFrom-Json
        Write-Host "Voos em 01/11: $($json2.data.resultados.Count)"
    }
    
} catch {
    Write-Host "`n❌ Erro ao testar API" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n" -NoNewline
Read-Host "Pressione ENTER para fechar"
