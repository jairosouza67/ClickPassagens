# 🔍 ANÁLISE COMPLETA - Por que o Site Está Usando Dados Simulados

**Data da Análise:** 03/10/2025  
**Status:** ✅ **PROBLEMA IDENTIFICADO E SOLUÇÕES PROPOSTAS**

---

## 📊 RESUMO EXECUTIVO

### ✅ O QUE ESTÁ FUNCIONANDO:

1. **Backend Flask (API)** → ✅ **100% FUNCIONAL**
   - Porta 5001 ativa e respondendo
   - API Amadeus integrada corretamente
   - Credenciais válidas e autenticação funcionando
   - Teste manual retorna dados REAIS (Voo G3-2044, preço R$ 103,39)

2. **Configurações** → ✅ **CORRETAS**
   - `.env`: `FLIGHT_API_MODE=production`
   - `.env`: `FLIGHT_API_ALLOW_FALLBACK=false`
   - Amadeus API Key e Secret configurados

### ❌ O QUE NÃO ESTÁ FUNCIONANDO:

1. **Frontend (Vite/React)** → ⚠️ **PROBLEMA IDENTIFICADO**
   - O frontend compilado (`static/assets/index-583a99bf.js`) contém lógica de dados simulados hardcoded
   - A aplicação está usando dados estáticos gerados no próprio JavaScript do navegador
   - O frontend NÃO está chamando o backend corretamente

---

## 🔬 DIAGNÓSTICO DETALHADO

### 1️⃣ Backend: Funcionando Perfeitamente

```bash
# Teste executado:
python test_amadeus.py

# Resultado:
✓ Token Amadeus obtido: lEAs0ruMewOYc9mGfG3B...
✓ Busca retornou 20 resultados REAIS
✓ Primeiro voo: G3-2044 (Gol) - R$ 103,39 - 5,169 milhas
```

**Conclusão:** O backend está 100% funcional e retornando dados reais da Amadeus.

---

### 2️⃣ Frontend: Código Compilado com Dados Simulados

**Arquivo analisado:** `static/assets/index-583a99bf.js` (linha 80)

#### Problema encontrado:

```javascript
// Código dentro do bundle compilado:
const VS = "production";  // ← Modo production definido

if (VS === "production" && !ts.includes("http")) {
    // ⚠️ AQUI ESTÁ O PROBLEMA:
    // Se estiver em production E a URL não tiver "http", 
    // usa dados simulados (função y())
    const $ = y(t);
    l($);
    f(!0);
    e && e($);
    return;
}

// Função y() gera dados falsos:
const y = p => {
    const g = [
        {codigo: 'G3', nome: 'Gol', valor_milheiro: 18},
        {codigo: 'AD', nome: 'Azul', valor_milheiro: 20},
        // ... mais companhias
    ];
    
    // Gera voos com números como G31000, G31100 (simulados)
    $.push({
        voo_numero: `${N.codigo}${1e3+b*100+T}`,  // ← G31000, G31100, etc.
        preco_dinheiro: Math.round(I*100)/100,     // ← Preços calculados
        // ...
    });
};
```

**Por que isso está acontecendo:**

1. O arquivo `static/` está servindo um build ANTIGO
2. O build foi feito com lógica de fallback para dados simulados
3. A variável `VS` (VITE_APP_MODE) está como "production"
4. A verificação `!ts.includes("http")` está forçando o uso de dados simulados

---

### 3️⃣ Configuração do Frontend (`src/config.js`)

```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://clickpassagens.onrender.com'  // ← PRODUÇÃO (Render)
  : '';  // ← DESENVOLVIMENTO (proxy)
```

**Problema:**
- Em desenvolvimento local, `API_URL` é uma string vazia
- Isso faz `ts` (API_BASE_URL) ser apenas `/api`
- A verificação `!ts.includes("http")` retorna `true`
- **Resultado:** Força o uso de dados simulados mesmo em desenvolvimento

---

## 🎯 CAUSAS RAIZ IDENTIFICADAS

### Causa #1: Build Desatualizado
- O diretório `static/` contém um build antigo com lógica de fallback
- Este build não reflete o código-fonte atual em `src/`

### Causa #2: Lógica de Fallback Incorreta
- O código compilado tem uma verificação errada:
  ```javascript
  if (VS === "production" && !ts.includes("http")) {
      // Usa dados simulados
  }
  ```
- Em desenvolvimento, a URL da API é `/api` (sem "http")
- Isso força sempre o uso de dados simulados

### Causa #3: Arquivos Servidos Errados
- O Flask está servindo arquivos de `static/`
- Esses arquivos são do build antigo, não do código atual

---

## ✅ SOLUÇÕES PROPOSTAS

### Solução 1: REBUILD DO FRONTEND (Recomendada)

**O que fazer:**
```powershell
# 1. Parar todos os servidores
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Limpar build antigo
Remove-Item -Recurse -Force static/assets
Remove-Item -Force static/index.html

# 3. Fazer novo build
npm run build

# 4. Copiar build para static/
Copy-Item -Recurse dist/* static/

# 5. Reiniciar servidores
python main.py  # Backend
npm run dev     # Frontend (desenvolvimento)
```

### Solução 2: CORRIGIR LÓGICA NO CÓDIGO-FONTE

**Arquivo:** `src/components/BuscaIntegrada.jsx` (linha ~60-135)

**Remover ou comentar:**
```javascript
// REMOVER ESTA LÓGICA:
if (ALLOW_FAKE_RESULTS) {
    const resultadosEstaticos = gerarResultadosEstaticos(searchData)
    setResultados(resultadosEstaticos)
    setBuscaRealizada(true)
    // ...
}
```

**Garantir que sempre use a API:**
```javascript
// MANTER APENAS:
if (data.success && data.data.resultados) {
    const resultadosProcessados = data.data.resultados
    setResultados(resultadosProcessados)
    setBuscaRealizada(true)
    setErrorMessage(null)
    if (onBuscaCompleta) {
        onBuscaCompleta(resultadosProcessados)
    }
} else {
    throw new Error(data.error || 'Erro na busca - nenhum voo encontrado')
}
```

### Solução 3: CORRIGIR VARIÁVEIS DE AMBIENTE

**Arquivo:** `.env`

```env
# ✅ CORRETO (manter assim):
VITE_APP_MODE=development
VITE_ENABLE_FAKE_RESULTS=false  # ← JÁ ESTÁ CORRETO
VITE_API_BASE_URL=http://127.0.0.1:5001/api
```

**Arquivo:** `src/config.js`

```javascript
// OPÇÃO 1: Usar variável de ambiente explícita
const API_URL = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
  : (import.meta.env.PROD 
      ? 'https://clickpassagens.onrender.com' 
      : 'http://localhost:5001');

// OPÇÃO 2: Simplificar (recomendado)
const API_URL = import.meta.env.PROD 
  ? 'https://clickpassagens.onrender.com'
  : 'http://localhost:5001';  // ← MUDAR de '' para 'http://localhost:5001'
```

---

## 🚀 PLANO DE AÇÃO RECOMENDADO

### Passo 1: Verificar Estado Atual
```powershell
# Ver processos rodando
Get-Process python, node -ErrorAction SilentlyContinue

# Ver se backend responde
curl http://localhost:5001/api/health

# Ver arquivos em static/
Get-ChildItem static/ -Recurse
```

### Passo 2: Corrigir Código-Fonte
1. Abrir `src/config.js` → Mudar `API_URL` para `'http://localhost:5001'`
2. Abrir `src/components/BuscaIntegrada.jsx` → Remover lógica de fallback
3. Abrir `src/components/HeroSection.jsx` → Remover lógica de fallback

### Passo 3: Rebuild e Testar
```powershell
# Rebuild
npm run build
Copy-Item -Recurse -Force dist/* static/

# Reiniciar backend
& "E:/VS Code/ClickPassagens/.venv/Scripts/python.exe" main.py

# OU usar Vite dev server (recomendado para desenvolvimento)
npm run dev
# Acessar: http://localhost:5173
```

### Passo 4: Validar
1. Abrir navegador em `http://localhost:5173` (ou `http://localhost:5001`)
2. Abrir DevTools (F12) → Aba Console
3. Fazer uma busca: GRU → GIG
4. Verificar no console:
   - ✅ Requisição para `http://localhost:5001/api/busca/buscar`
   - ✅ Resposta com voos reais (G3-2044, não G31000)
   - ✅ Preços como R$ 103,39 (não valores redondos como R$ 315,00)

---

## 📋 CHECKLIST DE VALIDAÇÃO

- [ ] Backend respondendo em `http://localhost:5001/api/health`
- [ ] Teste `python test_amadeus.py` retorna dados REAIS
- [ ] `src/config.js` com `API_URL = 'http://localhost:5001'`
- [ ] `VITE_ENABLE_FAKE_RESULTS=false` no `.env`
- [ ] Código-fonte sem lógica de `gerarResultadosEstaticos()`
- [ ] Novo build gerado: `npm run build`
- [ ] Build copiado para `static/`
- [ ] Navegador mostra voos com números REAIS (ex: G3-2044)
- [ ] Preços específicos (ex: R$ 103,39), não redondos

---

## 🎓 CONCLUSÃO

### O Problema:

O site está usando dados simulados porque:

1. **O build em `static/` é ANTIGO** e contém lógica de fallback
2. **A lógica de fallback está ATIVA** quando `API_URL` não contém "http"
3. **Em desenvolvimento**, `API_URL = ''`, disparando o fallback

### A Solução:

1. **Corrigir `src/config.js`** para usar URL completa
2. **Remover lógica de fallback** dos componentes
3. **Fazer novo build** do frontend
4. **Usar Vite dev server** para desenvolvimento (`npm run dev`)

### Backend: ✅ FUNCIONANDO
- API Amadeus: ✅ Ativa
- Dados reais: ✅ Sendo retornados
- Credenciais: ✅ Válidas

### Frontend: ⚠️ PRECISA CORREÇÃO
- Build antigo com lógica de fallback
- Verificação de URL incorreta
- Não está chamando a API corretamente

---

## 🔧 PRÓXIMOS PASSOS

1. **Implementar Solução 2 + Solução 3** (corrigir código)
2. **Fazer rebuild** do frontend
3. **Testar** com checklist de validação
4. **Documentar** mudanças no README

**Tempo estimado:** 15-30 minutos

**Nível de dificuldade:** Baixo (apenas ajustes de configuração)
