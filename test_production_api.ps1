# Teste da API em Produção
$body = @{
    origem = "GRU"
    destino = "GIG"
    data_ida = "2025-11-15"
    passageiros = 1
    classe = "economica"
} | ConvertTo-Json

Write-Host "🔍 Testando API em produção..."
Write-Host "URL: https://clickpassagens.onrender.com/api/busca/buscar"

try {
    $response = Invoke-WebRequest `
        -Uri "https://clickpassagens.onrender.com/api/busca/buscar" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec 60
    
    Write-Host "`n✅ Status: $($response.StatusCode)"
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "`n📊 Resultados: $($data.resultados.Count) voos encontrados"
    
    if ($data.resultados.Count -gt 0) {
        $first = $data.resultados[0]
        Write-Host "`nPrimeiro voo:"
        Write-Host "  Companhia: $($first.companhia.nome)"
        Write-Host "  Voo: $($first.voo_numero)"
        Write-Host "  Milhas: $($first.milhas_necessarias)"
        Write-Host "  Preço: R$ $($first.preco_dinheiro)"
        
        # Verificar novos campos
        if ($first.PSObject.Properties.Name -contains 'programa_fidelidade') {
            Write-Host "`n✅ NOVOS CAMPOS PRESENTES:"
            Write-Host "  Programa: $($first.programa_fidelidade)"
            Write-Host "  Nível Confiança: $($first.nivel_confianca)"
            Write-Host "  Preço Real: $($first.preco_real_milhas)"
            Write-Host "  Taxas: R$ $($first.taxas_milhas)"
        } else {
            Write-Host "`n❌ NOVOS CAMPOS AUSENTES - Deploy não atualizou!"
        }
    }
    
} catch {
    Write-Host "`n❌ Erro: $_"
    Write-Host $_.Exception.Message
}
