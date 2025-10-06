# 🔧 CONFIGURAR BUSCA NO RENDER

## ❌ Problema Atual
A busca está retornando **0 resultados** porque:
- ✅ Login funcionando perfeitamente
- ✅ API respondendo (status 200)
- ❌ Backend tentando usar APIs reais (Amadeus) sem credenciais
- ❌ Não há fallback para dados simulados em produção

---

## 🎯 Solução: Ativar Modo Simulado

Para ter **resultados imediatos** enquanto não configura APIs reais:

### 1️⃣ Acessar Variáveis de Ambiente do Render

👉 **https://dashboard.render.com/web/clickpassagens-api** (ou seu serviço)

### 2️⃣ Clicar em "Environment"

### 3️⃣ Adicionar Variável:

```
Key:   FLIGHT_API_MODE
Value: simulated
```

**OU** se preferir dados reais com fallback:

```
Key:   FLIGHT_API_MODE
Value: development
```

### 4️⃣ Salvar e Aguardar Redeploy

O Render vai fazer redeploy automático (1-2 minutos)

---

## 📊 Diferença dos Modos

### 🧪 **simulated** (RECOMENDADO para testes)
- ✅ Retorna dados simulados sempre
- ✅ Resposta instantânea
- ✅ Não precisa de API keys
- ✅ Ideal para demonstrações

### 🔧 **development** (melhor dos dois mundos)
- 🔄 Tenta APIs reais primeiro
- ✅ Se falhar, usa dados simulados
- ⚠️ Precisa de credenciais configuradas

### 🚀 **production** (atual - sem dados)
- ❌ Só usa APIs reais
- ❌ Se não tiver credenciais = 0 resultados
- ❌ Não tem fallback

---

## 🔑 Se Quiser Usar APIs Reais (Amadeus)

Adicione também estas variáveis no Render:

```
AMADEUS_API_KEY=seu_api_key_aqui
AMADEUS_API_SECRET=seu_api_secret_aqui
AMADEUS_BASE_URL=https://test.api.amadeus.com
FLIGHT_API_MODE=production
```

Para obter credenciais Amadeus:
1. Acesse: https://developers.amadeus.com/register
2. Crie conta gratuita
3. Crie um app
4. Copie API Key e API Secret

---

## ✅ Resultado Esperado

Após configurar `FLIGHT_API_MODE=simulated`:

```json
{
  "success": true,
  "data": {
    "resultados": [
      {
        "companhia": "LATAM",
        "origem": "SAO",
        "destino": "RIO",
        "preco": 450.00,
        "duracao": "1h 15m"
      },
      // ... mais voos
    ],
    "mensagem": "15 voos encontrados"
  }
}
```

---

## 🎯 Próximos Passos

1. **Configure a variável no Render**
2. **Aguarde 2 minutos** (redeploy automático)
3. **Teste novamente** em https://clickpassagens.me
4. **Veja os resultados aparecerem!** 🎉
