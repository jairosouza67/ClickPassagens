# 🎯 DADOS REAIS vs SIMULADOS - Como Identificar

## ✅ CONFIGURAÇÃO ATUAL: DADOS REAIS ATIVADOS

---

## 📊 COMO DIFERENCIAR

### 🟢 DADOS REAIS (Amadeus API)

**Características:**
- ✅ **Números de voo reais** (ex: G3-2044, AD-4256)
- ✅ **Preços específicos** (ex: R$ 103,39 - não são valores redondos)
- ✅ **Horários reais** obtidos da companhia aérea
- ✅ **Disponibilidade real** do dia da consulta
- ✅ **Variação de preços** a cada busca (dinâmico)

**Exemplo de voo real:**
```json
{
  "companhia": {
    "nome": "Gol",
    "codigo": "G3"
  },
  "voo_numero": "2044",           ← REAL (não G31000, G31100, etc.)
  "horario_saida": "06:00",
  "horario_chegada": "07:05",
  "preco_dinheiro": 103.39,       ← REAL (valor específico, não redondo)
  "milhas_necessarias": 5169,     ← CALCULADO do preço real
  "paradas": "Direto"
}
```

### 🔴 DADOS SIMULADOS (Fallback)

**Características:**
- ⚠️ **Números de voo gerados** (ex: G31000, G31100, AD2000)
- ⚠️ **Preços calculados** baseados em fórmula (mais redondos)
- ⚠️ **Horários gerados** em intervalos (8:00, 10:00, 14:00, etc.)
- ⚠️ **Sempre disponíveis** (não reflete disponibilidade real)
- ⚠️ **Mesmos resultados** para a mesma rota

**Exemplo de voo simulado:**
```json
{
  "companhia": {
    "nome": "Gol",
    "codigo": "G3"
  },
  "voo_numero": "G31000",         ← SIMULADO (padrão G3 + 1000)
  "horario_saida": "06:00",
  "horario_chegada": "08:30",
  "preco_dinheiro": 315.00,       ← SIMULADO (valor redondo)
  "milhas_necessarias": 14175,    ← CALCULADO (preco * 45)
  "paradas": "Direto"
}
```

---

## 🔧 CONFIGURAÇÃO ATUAL

### `.env`
```env
FLIGHT_API_MODE=production
FLIGHT_API_ALLOW_FALLBACK=false  ← DESABILITADO = SÓ DADOS REAIS
```

**O que significa:**
- ✅ **Sempre** tenta buscar da API Amadeus primeiro
- ✅ **Se Amadeus falhar**, retorna ERRO (não usa dados falsos)
- ✅ **Garantia** de que todos os dados são reais ou nenhum dado

---

## 🧪 TESTE ATUAL

### Resultado do Teste (03/10/2025 19:40):
```
✅ Status: True
✅ Resultados: 20 voos

📍 PRIMEIRO VOO (DADOS REAIS):
   Companhia: Gol (G3)
   Voo: 2044                    ← NÚMERO REAL
   Horário: 06:00 → 07:05
   Preço: R$ 103.39             ← PREÇO REAL (não redondo)
   Milhas: 5169
   Paradas: Direto

🎉 DADOS REAIS DA AMADEUS!
```

**Confirmação:** Voo 2044 é um **voo real da Gol**, não simulado!

---

## 🔍 COMO VERIFICAR NO NAVEGADOR

### 1. Abra o Console (F12)
```
http://localhost:5173
Pressione F12
Aba "Console"
```

### 2. Faça uma busca
```
GRU → GIG em 15/10/2025
```

### 3. Veja os logs
```javascript
📥 Dados recebidos: {success: true, data: {...}}
📥 Resultados count: 20
```

### 4. Inspecione um resultado
```javascript
// Abra o objeto no console e veja:
resultados[0].voo_numero  // Se for "2044" = REAL
                          // Se for "G31000" = SIMULADO

resultados[0].preco_dinheiro  // Se for 103.39 = REAL
                              // Se for 315.00 = SIMULADO
```

---

## ⚙️ MODOS DE OPERAÇÃO

### Modo 1: SOMENTE DADOS REAIS (Atual)
```env
FLIGHT_API_MODE=production
FLIGHT_API_ALLOW_FALLBACK=false
```
**Comportamento:**
- ✅ Busca na Amadeus
- ❌ Se falhar → ERRO (não retorna nada)
- 👍 **Garantia de dados reais**
- 👎 **Pode falhar** se API estiver indisponível

**Quando usar:** Produção, quando precisar de 100% dados reais

### Modo 2: DADOS REAIS COM FALLBACK
```env
FLIGHT_API_MODE=production
FLIGHT_API_ALLOW_FALLBACK=true
```
**Comportamento:**
- ✅ Busca na Amadeus primeiro
- ✅ Se falhar → Usa dados simulados
- 👍 **Sempre retorna resultados**
- 👎 **Pode retornar dados falsos** se API falhar

**Quando usar:** Desenvolvimento, demonstrações, testes

### Modo 3: APENAS SIMULADOS (Development)
```env
FLIGHT_API_MODE=development
FLIGHT_API_ALLOW_FALLBACK=true
```
**Comportamento:**
- ❌ Não tenta Amadeus
- ✅ Sempre usa dados simulados
- 👍 **Rápido, sem depender de API externa**
- 👎 **Dados completamente falsos**

**Quando usar:** Desenvolvimento inicial, testes de UI

---

## 🎯 VERIFICAÇÃO RÁPIDA

### Comando 1: Ver configuração atual
```powershell
Get-Content .env | Select-String "FLIGHT_API"
```

**Resultado esperado:**
```
FLIGHT_API_MODE=production
FLIGHT_API_ALLOW_FALLBACK=false  ← Se false = SÓ DADOS REAIS
```

### Comando 2: Testar API diretamente
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5001/api/busca/buscar" -Method POST -ContentType "application/json" -Body '{"origem":"GRU","destino":"GIG","data_ida":"2025-10-15","passageiros":1}'
$response.data.resultados[0].voo_numero
```

**Se retornar:**
- `"2044"` ou similar (4 dígitos) → **DADOS REAIS** ✅
- `"G31000"` ou similar (letra+5 dígitos) → **DADOS SIMULADOS** ❌

---

## 📝 LOGS DE CONFIRMAÇÃO

### No Backend (Janela PowerShell):
```
Buscando voos reais: GRU -> GIG em 2025-10-15
Modo: production, Allow Fallback: False
Credenciais Amadeus configuradas, tentando busca...
Solicitando novo token Amadeus...
Token Response Status: 200
Token Amadeus obtido com sucesso (expira em 1799s)
Chamando Amadeus API: GRU -> GIG em 2025-10-15
Amadeus Response Status: 200
Amadeus Response Data: 20 offers encontradas
Parse resultou em 20 voos
Encontrados 20 voos via Amadeus
```

**Se ver isso → DADOS REAIS!** ✅

### No Frontend (Console F12):
```javascript
📥 Dados recebidos: {success: true, data: {resultados: Array(20), ...}}
```

**Abra `resultados[0]` e veja:**
```javascript
{
  voo_numero: "2044",              // ← 4 dígitos = REAL
  preco_dinheiro: 103.39,          // ← Não redondo = REAL
  companhia: {codigo: "G3", ...}
}
```

---

## 🆘 SE APARECER DADOS SIMULADOS

### Possíveis causas:

1. **Backend não reiniciou após mudar .env**
   ```powershell
   taskkill /F /IM python.exe
   python main.py
   ```

2. **Arquivo .env não foi salvo**
   - Verifique se salvou (Ctrl+S)
   - Veja conteúdo:
     ```powershell
     Get-Content .env | Select-String "FALLBACK"
     ```

3. **API Amadeus temporariamente indisponível**
   ```powershell
   python test_amadeus.py
   ```
   - Se falhar → Credenciais inválidas ou API offline

4. **Cache do navegador**
   - Pressione Ctrl+Shift+R (hard reload)
   - Ou limpe cache

---

## ✅ CONFIRMAÇÃO ATUAL

**Teste realizado:** 03/10/2025 19:40  
**Resultado:** ✅ **DADOS REAIS DA AMADEUS**

**Evidências:**
- Voo número: `2044` (real, não simulado)
- Preço: `103.39` (específico, não redondo)
- Fonte: API Amadeus (não fallback)

---

## 🎉 CONCLUSÃO

**Status:** ✅ **DADOS 100% REAIS**

O sistema está configurado e funcionando com dados reais da API Amadeus. Todos os voos, preços e horários são obtidos diretamente das companhias aéreas através da Amadeus.

**Acesse e teste:**
```
http://localhost:5173
```

**Faça uma busca e veja os dados reais!** 🚀
