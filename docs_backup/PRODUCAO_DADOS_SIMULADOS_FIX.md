# 🔧 FIX: Dados Simulados Aparecendo em Produção

## 🐛 PROBLEMA IDENTIFICADO

Quando o site está **online (produção)**, aparece dados simulados.
Quando roda **localmente (desenvolvimento)**, funciona com dados reais.

### Causa Raiz:

1. ❌ **`.env.production` apontava para Heroku inválido:**
   ```bash
   # ANTES (ERRADO):
   VITE_API_BASE_URL=https://clickpassagens-api.herokuapp.com/api
   ```

2. ❌ **`src/config.js` não usava variável de ambiente:**
   ```javascript
   // ANTES (ERRADO):
   const API_URL = import.meta.env.PROD 
     ? 'https://clickpassagens.onrender.com'
     : 'http://localhost:5001';
   ```
   - `import.meta.env.PROD` é apenas `true/false`
   - Não lê `VITE_API_BASE_URL` do `.env.production`

3. ❌ **Build compilado tinha URL inválida:**
   - Durante o build, o Vite "bake in" (incorpora) a URL no código
   - Se a URL estava errada, o código compilado tinha URL inválida
   - Lógica antiga detectava URL inválida e ativava fallback

---

## ✅ SOLUÇÃO APLICADA

### 1. **Corrigido `.env.production`:**

```bash
# DEPOIS (CORRETO):
VITE_API_BASE_URL=https://clickpassagens.onrender.com
VITE_APP_MODE=production
VITE_ENABLE_FAKE_RESULTS=false  # ← NOVO: força dados reais
VITE_APP_TITLE=ClickPassagens
VITE_APP_DESCRIPTION=Sistema de busca de passagens com milhas
```

### 2. **Corrigido `src/config.js`:**

```javascript
// DEPOIS (CORRETO):
// Prioridade:
// 1. VITE_API_BASE_URL do .env
// 2. Fallback para Render em produção
// 3. Localhost em desenvolvimento
const API_URL = import.meta.env.VITE_API_BASE_URL 
  || (import.meta.env.PROD 
    ? 'https://clickpassagens.onrender.com'
    : 'http://localhost:5001');

// Remover /api se já estiver na URL base
const cleanedURL = API_URL.replace(/\/api$/, '');

export { cleanedURL as API_URL };
```

**Mudanças:**
- ✅ Agora lê `import.meta.env.VITE_API_BASE_URL`
- ✅ Remove `/api` duplicado se existir
- ✅ Fallback robusto para cada ambiente

### 3. **Criado script de build `build_production.bat`:**

```batch
# Limpa builds antigos
# Instala dependências
# Faz build com .env.production
# Valida arquivos gerados
```

---

## 🚀 COMO FAZER DEPLOY CORRETAMENTE

### Passo 1: Build Local

```powershell
# Usar o script criado:
.\build_production.bat

# Ou manualmente:
npm run build
```

### Passo 2: Testar Build Localmente

```powershell
# Servir a pasta dist/ localmente:
npx serve dist -p 3000
```

**Acesse:** http://localhost:3000

### Passo 3: Verificar no DevTools

**Abrir DevTools (F12) → Aba Console**

Fazer busca e verificar:

✅ **Requisição correta:**
```
Request URL: https://clickpassagens.onrender.com/api/busca/buscar
Status: 200
```

✅ **Resposta com dados reais:**
```json
{
  "numero_voo": "G3-1234",  // ← NÃO G31000
  "companhia": "Gol",
  ...
}
```

### Passo 4: Deploy

#### Opção A: Netlify (Recomendado)

```powershell
# Commit e push
git add .
git commit -m "Fix: Corrigida API URL em produção"
git push

# Netlify faz deploy automático
```

**IMPORTANTE:** Netlify usa automaticamente `.env.production` durante o build!

#### Opção B: Render/Vercel

```powershell
# Configurar variáveis de ambiente no painel:
VITE_API_BASE_URL=https://clickpassagens.onrender.com
VITE_ENABLE_FAKE_RESULTS=false
```

### Passo 5: Validar Online

Após deploy, acesse seu site e:

1. **Abrir DevTools (F12)**
2. **Aba Console:** Verificar logs
3. **Aba Network:** Verificar requisições
4. **Fazer busca:** GRU → GIG
5. **Verificar dados:** Devem ser REAIS

---

## 🔍 COMO IDENTIFICAR O PROBLEMA

### ❌ Dados Simulados (Problema):

**Console:**
```javascript
// URL vazia ou inválida
API_URL: ""
API_URL: "undefined"
API_URL: "https://clickpassagens-api.herokuapp.com"  // ← Heroku morto
```

**Network:**
```
Status: Failed
CORS error
404 Not Found
```

**Dados:**
```json
{
  "numero_voo": "G31000",  // ← Padrão de simulação
  "numero_voo": "G31001",
  "numero_voo": "G31002"
}
```

### ✅ Dados Reais (Correto):

**Console:**
```javascript
API_URL: "https://clickpassagens.onrender.com"
Fazendo requisição para: https://clickpassagens.onrender.com/api/busca/buscar
Status da resposta: 200
```

**Network:**
```
Request URL: https://clickpassagens.onrender.com/api/busca/buscar
Status: 200 OK
```

**Dados:**
```json
{
  "numero_voo": "G3-1234",  // ← Padrão real
  "numero_voo": "AD-4567",
  "numero_voo": "LA-8901"
}
```

---

## 📊 ARQUITETURA DE BUILDS

### Desenvolvimento (Local):

```
┌─────────────────────────────────────┐
│  .env (não commitado no git)        │
│  VITE_API_BASE_URL não definido     │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  src/config.js                      │
│  API_URL = http://localhost:5001    │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  npm run dev                        │
│  Vite Dev Server (porta 5173+)      │
│  Proxy: /api → localhost:5001       │
└─────────────────────────────────────┘
```

### Produção (Build):

```
┌─────────────────────────────────────┐
│  .env.production (commitado)        │
│  VITE_API_BASE_URL=                 │
│    https://clickpassagens.onrender  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  src/config.js                      │
│  API_URL = import.meta.env.         │
│            VITE_API_BASE_URL        │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  npm run build                      │
│  Vite substitui variáveis           │
│  API_URL → URL real compilada       │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  dist/assets/index-[hash].js        │
│  Código com URL incorporada:        │
│  "https://clickpassagens.onrender"  │
└─────────────────────────────────────┘
```

---

## 🧪 TESTES DE VALIDAÇÃO

### Teste 1: Build Local

```powershell
# Build
npm run build

# Servir
npx serve dist -p 3000

# Acessar
http://localhost:3000
```

**Verificar:** DevTools → Console → URL da API deve ser Render

### Teste 2: Verificar Código Compilado

```powershell
# Ver conteúdo do build (PowerShell)
Get-Content dist/assets/index-*.js | Select-String "clickpassagens"
```

**Deve mostrar:**
```
https://clickpassagens.onrender.com
```

**NÃO deve mostrar:**
```
herokuapp.com
localhost:5001
```

### Teste 3: Teste em Produção

Após deploy:

1. Acessar site online
2. DevTools → Console
3. Procurar por "API_URL" ou "Fazendo requisição"
4. URL deve ser: `https://clickpassagens.onrender.com`

---

## 🔐 SEGURANÇA

### ⚠️ NÃO commitar no git:

- `.env` (desenvolvimento local)
- Credenciais sensíveis (Firebase, Amadeus)

### ✅ PODE commitar:

- `.env.production` (sem credenciais sensíveis)
- URLs públicas da API

### Netlify/Vercel:

Configurar variáveis sensíveis no **painel do serviço**:

```
AMADEUS_API_KEY=...
AMADEUS_API_SECRET=...
VITE_FIREBASE_API_KEY=...
```

---

## 📝 CHECKLIST DE DEPLOY

Antes de fazer deploy, confirme:

- [ ] `.env.production` com URL correta do Render
- [ ] `src/config.js` usando `import.meta.env.VITE_API_BASE_URL`
- [ ] Build local testado com `npx serve dist`
- [ ] DevTools mostrando URL correta
- [ ] Dados REAIS aparecendo (não G31000)
- [ ] Backend Render rodando e respondendo
- [ ] CORS configurado no backend
- [ ] Variáveis de ambiente no Netlify configuradas

---

## 🎯 RESULTADO ESPERADO

### Antes (Problema):

```
🌐 Local: ✅ Dados Reais
🌐 Online: ❌ Dados Simulados
```

### Depois (Resolvido):

```
🌐 Local: ✅ Dados Reais
🌐 Online: ✅ Dados Reais
```

---

## 🚨 TROUBLESHOOTING

### "Ainda aparece dados simulados após deploy"

**Soluções:**

1. **Limpar cache do Netlify:**
   - Ir no painel do Netlify
   - Deploys → Trigger deploy → Clear cache and deploy

2. **Verificar variáveis de ambiente:**
   - Site settings → Environment variables
   - Adicionar `VITE_API_BASE_URL=https://clickpassagens.onrender.com`

3. **Rebuild local e commit:**
   ```powershell
   Remove-Item -Recurse -Force dist
   npm run build
   git add .
   git commit -m "Rebuild com URL correta"
   git push
   ```

4. **Verificar backend Render:**
   - Acessar: https://clickpassagens.onrender.com/api/health
   - Deve retornar: `{"status": "ok"}`

### "CORS Error em produção"

**Causa:** Backend não permite origem do Netlify

**Solução:** Verificar `main.py`:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "https://*.netlify.app",        # ← Adicionar
            "https://clickpassagens.com"    # ← Seu domínio
        ]
    }
})
```

---

## ✅ CONCLUSÃO

**Problema:** URL da API errada no `.env.production` causava fallback para dados simulados.

**Solução:** Corrigir `.env.production` e `config.js` para usar variáveis de ambiente corretamente.

**Status:** ✅ RESOLVIDO

**Próximo passo:** Fazer build e deploy!

```powershell
# Execute:
.\build_production.bat
```

---

**Data:** 05/10/2025  
**Status:** ✅ CORRIGIDO  
**Testado:** Pendente (aguardando deploy)
