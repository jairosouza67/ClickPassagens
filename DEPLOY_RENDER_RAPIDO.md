# 🚀 Deploy Rápido - Render + Netlify

## ✅ O Que Foi Modificado

Atualizamos o sistema de cálculo de milhas no backend. Estas mudanças precisam ser enviadas para o Render.

### Arquivos Modificados:
- ✅ `src/services/flight_api.py` - Cálculo inteligente de milhas
- ✅ `src/components/ResultsPage.jsx` - Badges de confiabilidade  
- ✅ `src/components/FlightDetailsModal.jsx` - Modal detalhado
- ✅ `src/components/ResultsPageModern.css` - Estilos
- ✅ `src/components/FlightDetailsModalModern.css` - Estilos modal

## 📋 Passo a Passo para Deploy

### 1️⃣ Commitar e Enviar ao GitHub

```powershell
# No terminal do VS Code
git status
git add .
git commit -m "feat: Implementa sistema de preços reais de milhas com badges de confiabilidade"
git push origin master
```

### 2️⃣ Render (Backend) - Deploy Automático ⚡

O Render está configurado com `autoDeploy: true` no `render.yaml`, então após o push:

1. **Aguarde 2-3 minutos**
2. Acesse: https://dashboard.render.com
3. Vá em `clickpassagens-api`
4. Veja o status do deploy na aba "Events"
5. Aguarde aparecer "Live" (verde)

**🔗 URL do Backend**: `https://clickpassagens.onrender.com`

**✅ Teste se está funcionando:**
```
https://clickpassagens.onrender.com/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "service": "ClickPassagens API",
  "timestamp": "...",
  "version": "1.0.0"
}
```

### 3️⃣ Netlify (Frontend) - Deploy Automático ⚡

O Netlify também detecta o push automaticamente:

1. **Aguarde 1-2 minutos**
2. Acesse: https://app.netlify.com
3. Vá em seu site `clickpassagens`
4. Veja o status na aba "Deploys"
5. Aguarde aparecer "Published" (verde)

**🔗 URL do Frontend**: Seu domínio customizado ou `https://clickpassagens.netlify.app`

## 🔍 Verificação Pós-Deploy

### Teste Backend (Render)

```powershell
# Teste 1: Health Check
curl https://clickpassagens.onrender.com/api/health

# Teste 2: Busca de Voos
$body = @{
    origem = "GRU"
    destino = "GIG"  
    data_ida = "2025-11-15"
    passageiros = 1
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://clickpassagens.onrender.com/api/busca/buscar" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Teste Frontend (Netlify)

1. Abra seu site em produção
2. Faça uma busca: GRU → GIG
3. Verifique se aparecem:
   - ✅ Preços em milhas
   - 🟡 Badge "Estimado"
   - 📋 Nome do programa (Smiles, LATAM Pass, etc.)
   - 💰 Taxas estimadas
   - 📊 Economia em R$

### Debug no Console (F12)

Abra o DevTools e verifique:

```javascript
// Console deve mostrar:
API_URL: "https://clickpassagens.onrender.com"
Fazendo requisição para: https://clickpassagens.onrender.com/api/busca/buscar

// Resposta deve ter os novos campos:
{
  "resultados": [{
    "milhas_necessarias": 25000,
    "preco_real_milhas": false,
    "nivel_confianca": "medium",
    "programa_fidelidade": "Smiles",
    "taxas_milhas": 54.00,
    ...
  }]
}
```

## ⚠️ Problemas Comuns

### Problema 1: Render ainda mostra código antigo

**Solução:**
1. Acesse Render Dashboard
2. Vá em `clickpassagens-api` → "Manual Deploy"
3. Clique em "Clear build cache & deploy"

### Problema 2: Netlify mostra "Nenhuma busca realizada"

**Causas possíveis:**
- Backend Render ainda não atualizou (aguarde 2-3 min)
- CORS bloqueando (improvável, já está configurado)
- Frontend pegou cache antigo

**Solução:**
```powershell
# Limpar cache do Netlify
netlify deploy --prod --clear-cache
```

### Problema 3: Erro 500 no backend

**Debug:**
1. Acesse Render Dashboard
2. `clickpassagens-api` → "Logs"
3. Procure por erros Python
4. Geralmente é import faltando ou erro de sintaxe

**Solução comum:**
```bash
# Se faltar alguma biblioteca
pip freeze > requirements.txt
git add requirements.txt
git commit -m "fix: Atualiza requirements.txt"
git push
```

### Problema 4: Badge não aparece

**Causa:** Frontend não foi atualizado ou está em cache

**Solução:**
1. Force refresh: `Ctrl + Shift + R` (ou `Cmd + Shift + R`)
2. Limpe cache do navegador
3. Teste em aba anônima

## 🎯 Checklist de Deploy

- [ ] `git push` executado com sucesso
- [ ] Render mostrando "Live" (verde) no dashboard
- [ ] Netlify mostrando "Published" (verde) no dashboard
- [ ] Health check retorna 200: `https://clickpassagens.onrender.com/api/health`
- [ ] Site em produção abre normalmente
- [ ] Busca de voos funciona
- [ ] Badges aparecem nos resultados
- [ ] Modal de detalhes mostra informações completas
- [ ] Console do navegador sem erros

## 📊 Monitoramento

### Logs do Render
```
https://dashboard.render.com → clickpassagens-api → Logs
```

### Logs do Netlify
```
https://app.netlify.com → clickpassagens → Deploys → Build log
```

## 🚨 Rollback (se algo der errado)

### Render
1. Dashboard → `clickpassagens-api`
2. Aba "Events"
3. Encontre deploy anterior funcionando
4. Clique nos 3 pontinhos → "Redeploy"

### Netlify
1. Dashboard → `clickpassagens`
2. Aba "Deploys"
3. Encontre deploy anterior
4. Clique em "Publish deploy"

## ✅ Conclusão

Após seguir estes passos, seu site em produção estará atualizado com:
- ✅ Sistema inteligente de cálculo de milhas
- ✅ Badges de confiabilidade
- ✅ Informações de programas de fidelidade
- ✅ Cálculo de taxas e economia
- ✅ Modal detalhado melhorado

**Tempo estimado total**: 5-10 minutos (dependendo da velocidade do deploy)

---

**Criado em**: 05/Out/2025
**Status**: ✅ Pronto para deploy
