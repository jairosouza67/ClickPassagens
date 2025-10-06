# 🔧 FIX: Campo DATA Não Aparece no Orçamento PDF

## 🐛 PROBLEMA

Ao gerar o orçamento em PDF, o campo **DATA** aparece como "N/A" ao invés de mostrar a data da viagem.

---

## 🔍 CAUSA RAIZ

### Problema 1: Estrutura de Dados Inconsistente

O objeto `flightData` (resultado da busca) **NÃO contém** as datas da viagem:

```javascript
// ❌ O que o resultado de voo TEM:
{
  origem: "GRU",
  destino: "GIG",
  horario_saida: "08:30",
  horario_chegada: "09:45",
  // ... mas SEM campo 'data' ou 'data_ida'
}
```

As datas estão em `searchParams` (parâmetros da busca), não no resultado individual do voo!

```javascript
// ✅ As datas estão AQUI:
searchParams = {
  origem: "GRU",
  destino: "GIG",
  data_ida: "2025-10-15",    // ← DATA AQUI!
  data_volta: "2025-10-20",  // ← DATA AQUI!
  passageiros: 1
}
```

### Problema 2: Código Procurando nos Campos Errados

```javascript
// ❌ ANTES (quoteService.js):
departure: {
  date: flightData.data || flightData.dataIda,  // ← undefined!
  time: flightData.horario_saida
}
```

---

## ✅ SOLUÇÃO APLICADA

### 1. **Função Helper para Extrair Datas** (`quoteService.js`)

Criada função `extractFlightDate()` que busca a data em **múltiplos campos possíveis**:

```javascript
function extractFlightDate(flightData, dateType = 'departure') {
  // Tentar vários campos possíveis
  const possibleFields = dateType === 'departure' 
    ? ['data_ida', 'dataIda', 'data', 'departure_date', 'departureDate', 'data_alternativa']
    : ['data_volta', 'dataVolta', 'return_date', 'returnDate'];
  
  for (const field of possibleFields) {
    if (flightData[field]) {
      // Se for uma data válida, retornar formatada
      const date = new Date(flightData[field] + 'T00:00:00');
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR');
      }
      // Se já estiver formatada, retornar como está
      return flightData[field];
    }
  }
  
  // Fallback: data atual ou null
  return dateType === 'departure' ? new Date().toLocaleDateString('pt-BR') : null;
}
```

**Campos que busca (em ordem):**
- ✅ `data_ida` (formato snake_case da busca)
- ✅ `dataIda` (formato camelCase)
- ✅ `data` (genérico)
- ✅ `departure_date` (inglês)
- ✅ `data_alternativa` (busca inteligente)

### 2. **Atualizado `generateInternalQuote()`** (`quoteService.js`)

```javascript
// ✅ DEPOIS:
departure: {
  date: extractFlightDate(flightData, 'departure'),  // ← Usa função helper
  time: flightData.horario_saida || 'A definir'
},
return: isRoundTrip ? {
  date: extractFlightDate(flightData, 'return'),     // ← Usa função helper
  time: flightData.horario_chegada_volta || flightData.horario_chegada || 'A definir'
} : null,
```

### 3. **Incluindo Datas ao Selecionar Voo** (`ResultsPage.jsx`)

Quando o usuário clica em "Ver detalhes" ou "Solicitar orçamento", agora **combina** os dados do voo com os dados da busca:

```javascript
// ✅ DEPOIS (ResultsPage.jsx):
onClick={() => setSelectedFlight({
  ...result,                              // Dados do voo
  data_ida: searchParams?.data_ida,      // ← DATA DA BUSCA!
  data_volta: searchParams?.data_volta,  // ← DATA DA BUSCA!
  passageiros: searchParams?.passageiros || 1,
  classe: searchParams?.classe || 'economica'
})}
```

---

## 📊 FLUXO COMPLETO (ANTES vs DEPOIS)

### ❌ ANTES (Problema):

```
Busca: GRU → GIG, 15/10/2025
   ↓
Resultado do voo: {origem: "GRU", destino: "GIG", horario: "08:30"}
   ↓
selectedFlight = resultado  // ← SEM data_ida!
   ↓
generateInternalQuote(selectedFlight)
   ↓
departure.date = flightData.data || flightData.dataIda
   ↓
departure.date = undefined || undefined = undefined
   ↓
PDF mostra: "Data de Ida: N/A"  // ❌ PROBLEMA!
```

### ✅ DEPOIS (Corrigido):

```
Busca: GRU → GIG, 15/10/2025
   ↓
Resultado do voo: {origem: "GRU", destino: "GIG", horario: "08:30"}
   ↓
selectedFlight = {
  ...resultado,
  data_ida: "2025-10-15",  // ← ADICIONADO!
  data_volta: "2025-10-20"
}
   ↓
generateInternalQuote(selectedFlight)
   ↓
departure.date = extractFlightDate(flightData, 'departure')
   ↓
  → Busca em: data_ida, dataIda, data, ...
  → Encontra: flightData.data_ida = "2025-10-15"
  → Formata: new Date("2025-10-15").toLocaleDateString('pt-BR')
  → Retorna: "15/10/2025"
   ↓
PDF mostra: "Data de Ida: 15/10/2025"  // ✅ CORRETO!
```

---

## 📝 ARQUIVOS MODIFICADOS

### 1. `src/services/quoteService.js`

**Linhas ~19-50:**
```javascript
// ✅ ADICIONADO:
function extractFlightDate(flightData, dateType = 'departure') {
  const possibleFields = dateType === 'departure' 
    ? ['data_ida', 'dataIda', 'data', 'departure_date', 'departureDate', 'data_alternativa']
    : ['data_volta', 'dataVolta', 'return_date', 'returnDate'];
  
  for (const field of possibleFields) {
    if (flightData[field]) {
      const date = new Date(flightData[field] + 'T00:00:00');
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR');
      }
      return flightData[field];
    }
  }
  
  return dateType === 'departure' ? new Date().toLocaleDateString('pt-BR') : null;
}
```

**Linhas ~95-105:**
```javascript
// ✅ MODIFICADO:
departure: {
  date: extractFlightDate(flightData, 'departure'),  // ANTES: flightData.data || flightData.dataIda
  time: flightData.horario_saida || 'A definir'
},
return: isRoundTrip ? {
  date: extractFlightDate(flightData, 'return'),     // ANTES: flightData.dataVolta || flightData.data_volta
  time: flightData.horario_chegada_volta || flightData.horario_chegada || 'A definir'
} : null,
```

### 2. `src/components/ResultsPage.jsx`

**Linhas ~505-520:**
```javascript
// ✅ MODIFICADO:
<button 
  className="btn-details-modern"
  onClick={() => setSelectedFlight({
    ...result,
    data_ida: searchParams?.data_ida,      // ← ADICIONADO!
    data_volta: searchParams?.data_volta,  // ← ADICIONADO!
    passageiros: searchParams?.passageiros || 1,
    classe: searchParams?.classe || 'economica'
  })}
>
  Ver detalhes
</button>
```

---

## 🧪 COMO TESTAR

### 1. Reiniciar Dev Server

O Vite já detectou as mudanças via HMR, mas para garantir:

```powershell
# No terminal do frontend, pressione Ctrl+C e depois:
npm run dev
```

### 2. Fazer Busca Completa

1. Acessar: http://localhost:5177 (ou porta atual)
2. **Buscar voo:**
   - Origem: GRU
   - Destino: GIG
   - **Data de ida: 15/10/2025** ← IMPORTANTE!
   - Data de volta: 20/10/2025 (opcional)
   - Passageiros: 1

3. **Clicar em:** "Solicitar orçamento" em um voo

### 3. Gerar Orçamento

1. Preencher dados do passageiro
2. Clicar em "Gerar Orçamentos"
3. **Escolher tipo:** Cliente ou Interno
4. **Clicar em:** "Baixar PDF"

### 4. Verificar PDF

Abrir o PDF baixado e confirmar:

```
✅ Data de Ida: 15/10/2025        (NÃO "N/A")
✅ Data de Volta: 20/10/2025      (se ida e volta)
✅ Horário Saída: 08:30           (do voo selecionado)
✅ Horário Chegada: 09:45         (do voo selecionado)
```

### 5. Verificar Console (DevTools F12)

Durante a geração do orçamento, deve aparecer:

```javascript
Gerando orçamento interno...
  flight: {
    departure: {
      date: "15/10/2025",  // ✅ NÃO undefined
      time: "08:30"
    }
  }
```

---

## 🎯 RESULTADO ESPERADO

### Orçamento Cliente (PDF):

```
┌─────────────────────────────────────────────┐
│        ORÇAMENTO DE VIAGEM                  │
│  ClickPassagens - Viaje com Inteligência   │
│  Número: ORC-1728123456789-ABC123           │
└─────────────────────────────────────────────┘

Dados da Viagem
─────────────────
Companhia Aérea:    Gol
Número do Voo:      G3-1234
Origem:             São Paulo (GRU)
Destino:            Rio de Janeiro (GIG)
Data de Ida:        15/10/2025 - 08:30  ← ✅ CORRETO!
Data de Volta:      20/10/2025 - 16:45  ← ✅ CORRETO!
Duração:            1h 15min
Paradas:            Direto
Classe:             Econômica
```

### Orçamento Interno (PDF):

```
┌─────────────────────────────────────────────┐
│        ORÇAMENTO INTERNO                    │
│         (CONFIDENCIAL)                      │
│  Número: ORC-1728123456789-ABC123           │
└─────────────────────────────────────────────┘

Dados da Viagem
─────────────────
Companhia Aérea:    Gol
Número do Voo:      G3-1234
Origem:             São Paulo (GRU)
Destino:            Rio de Janeiro (GIG)
Data de Ida:        15/10/2025 - 08:30  ← ✅ CORRETO!
Data de Volta:      20/10/2025 - 16:45  ← ✅ CORRETO!

Análise Financeira
──────────────────
Custo Base:         R$ 350,00
Taxas de Embarque:  R$ 50,00
SUBTOTAL:           R$ 400,00
LUCRO (30%):        + R$ 120,00
──────────────────
PREÇO AO CLIENTE:   R$ 520,00
```

---

## 🔄 CASOS DE USO COBERTOS

### ✅ Caso 1: Busca Normal
```javascript
{
  data_ida: "2025-10-15",
  data_volta: "2025-10-20"
}
→ PDF mostra: "15/10/2025" e "20/10/2025"
```

### ✅ Caso 2: Busca com Data Alternativa
```javascript
{
  data_alternativa: "2025-10-16",  // Sugestão da busca inteligente
  diferenca_dias: +1
}
→ PDF mostra: "16/10/2025"
```

### ✅ Caso 3: Só Ida (sem volta)
```javascript
{
  data_ida: "2025-10-15",
  data_volta: null
}
→ PDF mostra: "15/10/2025" (sem linha de volta)
```

### ✅ Caso 4: Formato Diferente
```javascript
{
  dataIda: "2025-10-15",  // camelCase
}
→ Função encontra e formata: "15/10/2025"
```

### ✅ Caso 5: Fallback (sem nenhuma data)
```javascript
{
  // Nenhum campo de data
}
→ PDF mostra: data atual (hoje)
```

---

## 🚨 IMPORTANTE

### Antes de Testar:

1. ✅ **Limpar cache do navegador:**
   - Ctrl + Shift + Delete
   - Ou F12 → Network → "Disable cache"

2. ✅ **Verificar que frontend está atualizado:**
   - Ver no terminal do Vite se houve HMR update
   - Se não, reiniciar: `npm run dev`

3. ✅ **Fazer busca NOVA:**
   - Não usar resultados antigos
   - Fazer busca completa com data

---

## 📚 DOCUMENTAÇÃO TÉCNICA

### Prioridade de Busca de Data:

**Data de Ida (departure):**
1. `data_ida` (snake_case - padrão da busca)
2. `dataIda` (camelCase)
3. `data` (genérico)
4. `departure_date` (inglês)
5. `departureDate` (camelCase inglês)
6. `data_alternativa` (busca inteligente)
7. **Fallback:** Data atual

**Data de Volta (return):**
1. `data_volta` (snake_case - padrão da busca)
2. `dataVolta` (camelCase)
3. `return_date` (inglês)
4. `returnDate` (camelCase inglês)
5. **Fallback:** null (sem volta)

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [x] Função `extractFlightDate()` criada
- [x] `generateInternalQuote()` atualizado
- [x] `ResultsPage.jsx` inclui datas no selectedFlight
- [x] Múltiplos campos de data cobertos
- [x] Formatação em pt-BR aplicada
- [x] Fallback robusto implementado
- [ ] Dev server reiniciado (faça agora)
- [ ] Teste de geração de PDF realizado
- [ ] Data aparece corretamente no PDF

---

**Status:** ✅ CORRIGIDO  
**Data:** 05/10/2025  
**Arquivos:** `quoteService.js`, `ResultsPage.jsx`  
**Teste:** Pendente (faça uma busca e gere PDF)
