# 🎯 Sistema de Busca Inteligente com Sugestão de Datas

## 🚀 NOVA FUNCIONALIDADE IMPLEMENTADA

### ❌ ANTES (Sistema Antigo):
```
Usuário busca voo para 15/01/2025
   ↓
Não encontra voos
   ↓
Sistema mostra DADOS SIMULADOS (G31000, G31001...)
   ❌ Dados falsos
   ❌ Frustra o usuário
   ❌ Não ajuda na compra real
```

### ✅ AGORA (Sistema Inteligente):
```
Usuário busca voo para 15/01/2025
   ↓
Não encontra voos nesta data
   ↓
Sistema busca automaticamente em datas próximas (±3 dias)
   ↓
Encontra voos em 16/01, 17/01, 18/01
   ↓
Mostra sugestões de datas com:
   ✅ Preços reais
   ✅ Quantidade de voos
   ✅ Diferença de dias
   ✅ Dia da semana
   ✅ Botão para buscar cada data
```

---

## 🔧 COMO FUNCIONA

### 1. Backend - `src/services/flight_api.py`

#### Método: `search_nearby_dates()`

```python
def search_nearby_dates(self, origem, destino, data_ida, 
                       data_volta=None, passageiros=1, dias_range=3):
    """
    Busca voos na data solicitada e em datas próximas
    
    Args:
        origem: Código IATA do aeroporto de origem
        destino: Código IATA do aeroporto de destino
        data_ida: Data solicitada (YYYY-MM-DD)
        dias_range: Quantos dias antes/depois buscar (padrão: 3)
    
    Returns:
        {
            'data_solicitada': '2025-01-15',
            'voos_encontrados': True/False,
            'resultados': [...],  # Voos da data solicitada
            'datas_alternativas': [  # Se não encontrou na data original
                {
                    'data': '2025-01-16',
                    'dia_semana': 'Terça-feira',
                    'diferenca_dias': +1,
                    'quantidade_voos': 5,
                    'preco_minimo': 350.00,
                    'resultados': [...]
                },
                ...
            ]
        }
    """
```

**Fluxo:**

1. **Busca na data solicitada**
   - Se encontrar voos → Retorna imediatamente
   - Se não encontrar → Continua para passo 2

2. **Busca em datas próximas** (±3 dias)
   - Tenta: -3, -2, -1, +1, +2, +3 dias
   - Para cada data que encontrar voos, salva:
     - Data
     - Dia da semana
     - Diferença em dias
     - Quantidade de voos
     - Preço mínimo
     - Lista de voos

3. **Ordena resultados**
   - Por proximidade da data solicitada
   - Mais próximo primeiro

4. **Retorna sugestões**
   - Lista de até 5 datas alternativas
   - Com todos os detalhes para o usuário escolher

---

### 2. Backend - `src/routes/busca.py`

#### Endpoint: `POST /api/busca/buscar`

**Antes:**
```json
{
  "success": true,
  "data": {
    "resultados": [...]
  }
}
```

**Agora:**
```json
{
  "success": true,
  "data": {
    "busca_id": 123,
    "resultados": [...],
    "data_solicitada": "2025-01-15",
    "data_utilizada": "2025-01-16",  // Se usou data alternativa
    "mensagem": "Não encontramos voos para 15/01, mas encontramos 5 voos em 16/01 (+1 dia).",
    "datas_alternativas": [  // Se não encontrou na data original
      {
        "data": "2025-01-16",
        "dia_semana": "Terça-feira",
        "diferenca_dias": 1,
        "quantidade_voos": 5,
        "preco_minimo": 350.00
      },
      {
        "data": "2025-01-17",
        "dia_semana": "Quarta-feira",
        "diferenca_dias": 2,
        "quantidade_voos": 8,
        "preco_minimo": 320.00
      }
    ]
  }
}
```

---

### 3. Frontend - `src/components/BuscaIntegrada.jsx`

#### Novos Estados:

```javascript
const [datasAlternativas, setDatasAlternativas] = useState([])
const [dataUtilizada, setDataUtilizada] = useState(null)
const [dataSolicitada, setDataSolicitada] = useState(null)
```

#### Nova Função: `buscarDataAlternativa()`

```javascript
const buscarDataAlternativa = async (dataAlternativa) => {
  // Atualiza a data de busca
  setSearchData(prev => ({ ...prev, data_ida: dataAlternativa }))
  
  // Realiza nova busca com a data escolhida
  // ...
}
```

#### Nova UI: Cards de Datas Alternativas

```jsx
{datasAlternativas && datasAlternativas.length > 0 && (
  <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
    <h3>Datas Disponíveis Próximas</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {datasAlternativas.map((dataAlt, index) => (
        <button onClick={() => buscarDataAlternativa(dataAlt.data)}>
          <span>{dataAlt.data}</span>
          <span>{dataAlt.quantidade_voos} voos</span>
          <span>R$ {dataAlt.preco_minimo}</span>
        </button>
      ))}
    </div>
  </div>
)}
```

---

## 🎨 INTERFACE DO USUÁRIO

### Cenário 1: Voos Encontrados na Data Solicitada

```
┌─────────────────────────────────────────┐
│ ✅ 12 voos encontrados para 15/01/2025 │
│                                         │
│ [Voo 1] GOL - R$ 350,00 | 5.000 milhas │
│ [Voo 2] AZUL - R$ 380,00 | 5.500 milhas│
│ ...                                     │
└─────────────────────────────────────────┘
```

### Cenário 2: Sem Voos, Com Datas Alternativas

```
┌─────────────────────────────────────────────────┐
│ ⚠️ Não encontramos voos para 15/01/2025        │
│                                                 │
│ 📅 Datas Disponíveis Próximas:                 │
│                                                 │
│ ┌─────────────┐  ┌─────────────┐  ┌──────────┐│
│ │ 16 Jan      │  │ 17 Jan      │  │ 18 Jan   ││
│ │ Terça       │  │ Quarta      │  │ Quinta   ││
│ │ +1 dia      │  │ +2 dias     │  │ +3 dias  ││
│ │ 5 voos      │  │ 8 voos      │  │ 3 voos   ││
│ │ R$ 350,00   │  │ R$ 320,00   │  │ R$ 400,00││
│ │ [Ver voos→] │  │ [Ver voos→] │  │ [Ver voos││
│ └─────────────┘  └─────────────┘  └──────────┘│
└─────────────────────────────────────────────────┘
```

### Cenário 3: Sem Voos em Nenhuma Data

```
┌─────────────────────────────────────────────────┐
│ ❌ Nenhum voo disponível                        │
│                                                 │
│ Não encontramos voos de GRU para GIG           │
│ entre 12/01 e 18/01.                           │
│                                                 │
│ Sugestões:                                      │
│ • Tente outro aeroporto (CGH, SDU)             │
│ • Escolha outra data mais distante             │
│ • Verifique a disponibilidade para ida e volta │
└─────────────────────────────────────────────────┘
```

---

## 🧪 EXEMPLOS DE USO

### Exemplo 1: Busca Simples (Encontra na Data)

**Requisição:**
```json
POST /api/busca/buscar
{
  "origem": "GRU",
  "destino": "GIG",
  "data_ida": "2025-02-15",
  "passageiros": 1
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "data_solicitada": "2025-02-15",
    "data_utilizada": "2025-02-15",
    "voos_encontrados": true,
    "mensagem": "12 voos encontrados para a data solicitada.",
    "resultados": [
      {
        "voo_numero": "G3-1234",
        "companhia": {...},
        "preco_dinheiro": 350.00,
        "milhas_necessarias": 5000,
        ...
      }
    ]
  }
}
```

### Exemplo 2: Não Encontra, Sugere Alternativas

**Requisição:**
```json
POST /api/busca/buscar
{
  "origem": "GRU",
  "destino": "SSA",
  "data_ida": "2025-03-10",
  "passageiros": 1
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "data_solicitada": "2025-03-10",
    "data_utilizada": null,
    "voos_encontrados": false,
    "mensagem": "Nenhum voo encontrado para 10/03, mas há opções próximas.",
    "resultados": [],
    "datas_alternativas": [
      {
        "data": "2025-03-11",
        "dia_semana": "Terça-feira",
        "diferenca_dias": 1,
        "quantidade_voos": 6,
        "preco_minimo": 420.00
      },
      {
        "data": "2025-03-09",
        "dia_semana": "Domingo",
        "diferenca_dias": -1,
        "quantidade_voos": 4,
        "preco_minimo": 480.00
      }
    ]
  }
}
```

### Exemplo 3: Usuário Clica em Data Alternativa

**Frontend faz nova requisição:**
```json
POST /api/busca/buscar
{
  "origem": "GRU",
  "destino": "SSA",
  "data_ida": "2025-03-11",  // ← Data escolhida
  "passageiros": 1
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "data_solicitada": "2025-03-11",
    "data_utilizada": "2025-03-11",
    "voos_encontrados": true,
    "resultados": [...]
  }
}
```

---

## ⚙️ CONFIGURAÇÕES

### Arquivo: `.env`

```bash
# Quantidade de dias para buscar antes/depois
# Padrão: 3 (busca ±3 dias)
FLIGHT_SEARCH_DATE_RANGE=3

# Desabilitar dados simulados (IMPORTANTE!)
FLIGHT_API_MODE=production
FLIGHT_API_ALLOW_FALLBACK=false
VITE_ENABLE_FAKE_RESULTS=false
```

### Customização:

No código `src/routes/busca.py`, você pode ajustar:

```python
resultado_busca = flight_service.search_nearby_dates(
    origem=data['origem'],
    destino=data['destino'], 
    data_ida=data['data_ida'],
    data_volta=data.get('data_volta'),
    passageiros=data.get('passageiros', 1),
    dias_range=3  # ← Altere aqui para buscar mais/menos dias
)
```

---

## 📊 VANTAGENS

### ✅ Para o Usuário:

1. **Transparência Total**
   - Sabe exatamente quando há voos
   - Vê preços reais
   - Pode comparar datas próximas

2. **Economia de Tempo**
   - Não precisa fazer várias buscas manuais
   - Sistema sugere as melhores datas automaticamente

3. **Melhor Decisão**
   - Vê todas as opções próximas
   - Compara preços entre datas
   - Escolhe a melhor custo-benefício

4. **Sem Frustrações**
   - Não vê dados falsos
   - Sabe quando realmente não há voos
   - Recebe sugestões úteis

### ✅ Para o Sistema:

1. **Credibilidade**
   - Apenas dados reais
   - Informações confiáveis
   - Usuário confia no sistema

2. **Melhor UX**
   - Interface intuitiva
   - Sugestões inteligentes
   - Processo simplificado

3. **SEO e Marketing**
   - "Busca inteligente"
   - "Sugestão de datas"
   - Diferencial competitivo

---

## 🔄 FLUXO COMPLETO

```
┌────────────────────────────────────────────────────┐
│ 1. Usuário preenche formulário                    │
│    - Origem: GRU                                   │
│    - Destino: GIG                                  │
│    - Data: 15/01/2025                             │
│    - Passageiros: 1                               │
└─────────────────┬──────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────┐
│ 2. Frontend envia para API                        │
│    POST /api/busca/buscar                         │
└─────────────────┬──────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────┐
│ 3. Backend: search_nearby_dates()                 │
│    a. Busca em 15/01 → Não encontrou             │
│    b. Busca em 14/01 → Não encontrou             │
│    c. Busca em 13/01 → Não encontrou             │
│    d. Busca em 16/01 → ✅ 5 voos!                │
│    e. Busca em 17/01 → ✅ 8 voos!                │
│    f. Busca em 18/01 → ✅ 3 voos!                │
└─────────────────┬──────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────┐
│ 4. Backend retorna datas alternativas             │
│    {                                              │
│      "datas_alternativas": [16/01, 17/01, 18/01] │
│    }                                              │
└─────────────────┬──────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────┐
│ 5. Frontend mostra cards de datas                │
│    ┌──────┐  ┌──────┐  ┌──────┐                 │
│    │16 Jan│  │17 Jan│  │18 Jan│                 │
│    │5 voos│  │8 voos│  │3 voos│                 │
│    └──────┘  └──────┘  └──────┘                 │
└─────────────────┬──────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────┐
│ 6. Usuário clica em "17 Jan"                     │
└─────────────────┬──────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────┐
│ 7. Frontend faz nova busca com data escolhida    │
│    POST /api/busca/buscar                         │
│    { "data_ida": "2025-01-17" }                   │
└─────────────────┬──────────────────────────────────┘
                  ↓
┌────────────────────────────────────────────────────┐
│ 8. Mostra resultados da data escolhida           │
│    ✅ 8 voos encontrados para 17/01/2025         │
│    [Lista de voos com preços reais]              │
└────────────────────────────────────────────────────┘
```

---

## 🚨 IMPORTANTE

### ❌ REMOVIDO COMPLETAMENTE:

- ❌ Método `search_flights_fallback()` - Dados simulados
- ❌ Método `calculate_base_price()` - Cálculos fictícios
- ❌ Método `calculate_flight_duration()` - Estimativas
- ❌ Variável `FLIGHT_API_ALLOW_FALLBACK` - Agora sempre `false`

### ✅ AGORA:

- ✅ **100% DADOS REAIS** da API Amadeus
- ✅ **BUSCA INTELIGENTE** em datas próximas
- ✅ **TRANSPARÊNCIA** total para o usuário
- ✅ **SUGESTÕES ÚTEIS** ao invés de dados falsos

---

## 📝 CHANGELOG

### Versão 2.0 - Busca Inteligente (05/10/2025)

**REMOVIDO:**
- ❌ Sistema de dados simulados/fallback
- ❌ Geração de voos fictícios
- ❌ Números de voo falsos (G31000, G31001...)

**ADICIONADO:**
- ✅ Busca automática em datas próximas (±3 dias)
- ✅ Sugestão visual de datas alternativas
- ✅ Interface com cards clicáveis de datas
- ✅ Informações de preço mínimo por data
- ✅ Dia da semana e diferença em dias
- ✅ Mensagens claras quando não há voos

**MELHORADO:**
- ✅ UX mais intuitiva e útil
- ✅ Credibilidade do sistema
- ✅ Transparência nas informações
- ✅ Processo de busca mais inteligente

---

## 🎯 PRÓXIMOS PASSOS

### Melhorias Futuras:

1. **Filtro de Preço por Data**
   - Gráfico mostrando variação de preço
   - Destacar data mais barata

2. **Calendário Visual**
   - Mostrar todas as datas em um calendário
   - Código de cores por disponibilidade/preço

3. **Alertas de Preço**
   - Notificar quando preço baixar
   - Sugerir melhor dia da semana para comprar

4. **Análise de Tendências**
   - "Sexta-feira costuma ser mais caro"
   - "Melhor dia para voar: Terça"

5. **Busca Flexível**
   - "Buscar qualquer data no final de semana"
   - "Melhor preço nos próximos 30 dias"

---

**Status:** ✅ IMPLEMENTADO E FUNCIONANDO  
**Data:** 05/10/2025  
**Versão:** 2.0 - Busca Inteligente  
**Teste:** Pendente em produção
