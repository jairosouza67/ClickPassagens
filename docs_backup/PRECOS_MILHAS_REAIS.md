# 🎯 Sistema de Preços Reais de Milhas - Implementação

## 📋 Visão Geral

Implementamos um sistema inteligente para calcular e exibir preços em milhas com indicadores de confiabilidade, preparado para integração futura com APIs de milheiros.

## ✅ O Que Foi Implementado

### 🔧 Backend (Python/Flask)

#### 1. **Método de Cálculo Inteligente de Milhas** (`flight_api.py`)

```python
def calculate_miles_price(cash_price, carrier_code, route_distance)
```

**Funcionalidades:**
- ✅ Calcula milhas baseado em cotações de mercado de cada programa
- ✅ Usa distância da rota quando disponível (maior precisão)
- ✅ Estima taxas de embarque (12% do valor em dinheiro)
- ✅ Calcula economia real (diferença entre dinheiro e milhas+taxas)
- ✅ Retorna nível de confiabilidade do cálculo

**Níveis de Confiabilidade:**
- **HIGH**: Baseado em distância + cotação de mercado
- **MEDIUM**: Baseado apenas em cotação de mercado
- **LOW**: Estimativa aproximada (fallback)

#### 2. **Base de Dados de Programas de Fidelidade** (`get_loyalty_program_info`)

Programas configurados:
- **Smiles (GOL)**: R$ 20,00/1000 milhas
- **TudoAzul (Azul)**: R$ 22,00/1000 milhas
- **LATAM Pass**: R$ 25,00/1000 milhas
- **LifeMiles (Avianca)**: R$ 18,00/1000 milhas
- **TAP Miles&Go**: R$ 24,00/1000 milhas
- **Flying Blue (Air France/KLM)**: R$ 23,00/1000 milhas
- **AAdvantage (American)**: R$ 26,00/1000 milhas
- **SkyMiles (Delta)**: R$ 25,00/1000 milhas
- **MileagePlus (United)**: R$ 24,00/1000 milhas

#### 3. **Parse Amadeus Atualizado**

```python
def parse_amadeus_response(data)
```

Novos campos retornados:
```python
{
  'milhas_necessarias': 25000,
  'taxas_milhas': 89.50,
  'custo_total_milhas': 589.50,
  'economia_calculada': 410.50,
  'preco_real_milhas': False,  # True quando tiver API real
  'nivel_confianca': 'medium',
  'programa_fidelidade': 'Smiles',
  'metodo_calculo': 'market_rate_based'
}
```

### 🎨 Frontend (React)

#### 1. **Badges de Confiabilidade** (`ResultsPage.jsx`)

**4 Tipos de Badge:**

```jsx
// ✅ Preço Real (verde) - Quando tiver API dos milheiros
<span className="confidence-badge confidence-real">
  <ShieldCheck /> Real
</span>

// 🔵 Alta Confiança (azul) - Baseado em distância
<span className="confidence-badge confidence-high">
  <Shield /> Alta confiança
</span>

// 🟡 Estimado (amarelo) - Baseado em cotação
<span className="confidence-badge confidence-medium">
  <Shield /> Estimado
</span>

// 🔴 Aproximado (vermelho) - Estimativa básica
<span className="confidence-badge confidence-low">
  <ShieldAlert /> Aproximado
</span>
```

#### 2. **Exibição Melhorada de Preços**

**Lista de Resultados:**
- ✅ Badge de confiabilidade ao lado de "Milhas"
- ✅ Nome do programa de fidelidade
- ✅ Taxas de embarque estimadas
- ✅ Economia em R$ (não mais em %)

**Modal de Detalhes:**
- ✅ Badge de confiabilidade destacado
- ✅ Informações detalhadas do programa
- ✅ Breakdown completo: milhas + taxas = custo total
- ✅ Comparação clara com preço em dinheiro

#### 3. **Estilos CSS**

```css
/* Badges coloridos por confiabilidade */
.confidence-real { background: #dcfce7; color: #166534; }
.confidence-high { background: #dbeafe; color: #1e40af; }
.confidence-medium { background: #fef3c7; color: #92400e; }
.confidence-low { background: #fee2e2; color: #991b1b; }
```

## 🚀 Próximos Passos - Integração com APIs Reais

### Fase 2: APIs de Milheiros (Futuro)

#### Opções disponíveis:

1. **MaxMilhas API** (Recomendado)
   - Endpoint: `GET /api/v1/cotacao`
   - Retorna preços reais de compra/venda de milhas
   
2. **Hotmilhas Web Scraping** (Legal com permissão)
   - Scraping responsável da página de cotações
   - Atualizar cache a cada 1 hora

3. **123Milhas API** (Comercial)
   - Precisa de parceria comercial
   - Acesso a preços consolidados

#### Implementação futura:

```python
# Adicionar em flight_api.py
def get_real_miles_price(carrier_code, route, cabin_class):
    """
    Busca preço real de milhas via API de milheiros
    """
    # 1. Verificar cache (Redis/Memcached)
    cached = redis.get(f'miles:{carrier_code}:{route}')
    if cached:
        return cached
    
    # 2. Chamar API do milheiro
    response = requests.get(
        'https://api.maxmilhas.com.br/v1/cotacao',
        headers={'Authorization': f'Bearer {API_KEY}'},
        params={
            'program': carrier_code,
            'route': route,
            'cabin': cabin_class
        }
    )
    
    # 3. Processar resposta
    real_price = response.json()
    
    # 4. Cachear por 1 hora
    redis.setex(f'miles:{carrier_code}:{route}', 3600, real_price)
    
    return {
        'estimated_miles': real_price['miles'],
        'is_real_price': True,
        'confidence_level': 'high',
        'source': 'maxmilhas_api'
    }
```

## 📊 Como Funciona Agora

### Fluxo de Cálculo

```
1. Amadeus retorna voo com preço em R$ 1.000,00
   ↓
2. Sistema identifica companhia: GOL (Smiles)
   ↓
3. Busca valor do milheiro: R$ 20,00/1000
   ↓
4. Calcula milhas: (1000 / 20) * 1000 = 50.000 milhas
   ↓
5. Estima taxas: 1000 * 0.12 = R$ 120,00
   ↓
6. Custo total milhas: (50000/1000)*20 + 120 = R$ 1.120,00
   ↓
7. Economia: R$ 0,00 (neste caso não compensa usar milhas!)
   ↓
8. Define confiabilidade: MEDIUM (sem distância exata)
   ↓
9. Exibe com badge amarelo "Estimado"
```

### Exemplo Real

**Voo GRU → GIG**
- **Preço em dinheiro**: R$ 450,00
- **Programa**: Smiles (GOL)
- **Milhas estimadas**: 22.500
- **Taxas**: R$ 54,00
- **Custo total (milhas)**: R$ 504,00
- **Economia**: -R$ 54,00 (não compensa)
- **Badge**: 🟡 Estimado

## 🎯 Indicadores para o Usuário

### Quando usar milhas?
✅ **Economia > R$ 100,00** - Vale muito a pena
⚠️ **Economia R$ 50-100** - Compensa se tiver milhas sobrando
❌ **Economia < R$ 50** - Melhor pagar em dinheiro

### Níveis de confiança:
- **✅ Real**: Preço confirmado da companhia aérea
- **🔵 Alta**: Calculado com distância real da rota
- **🟡 Estimado**: Baseado em cotação de mercado
- **🔴 Aproximado**: Estimativa básica, pode variar

## 🔄 Atualizações Futuras

### Curto Prazo (1-2 semanas)
- [ ] Integrar API do MaxMilhas
- [ ] Adicionar cache Redis para cotações
- [ ] Implementar histórico de preços de milhas

### Médio Prazo (1 mês)
- [ ] Machine Learning para prever disponibilidade
- [ ] Sistema de alertas de preço
- [ ] Comparação entre múltiplos programas

### Longo Prazo (3 meses)
- [ ] Integração com todas as companhias
- [ ] Sistema de resgate automático
- [ ] Otimização de transferências entre programas

## 📝 Variáveis de Ambiente

Adicionar no `.env` para futuras integrações:

```bash
# APIs de Milheiros (Futuro)
MAXMILHAS_API_KEY=your_key_here
MAXMILHAS_API_SECRET=your_secret_here
HOTMILHAS_API_KEY=your_key_here

# Cache
REDIS_URL=redis://localhost:6379
CACHE_MILES_TTL=3600  # 1 hora
```

## 🐛 Troubleshooting

### Problema: Milhas muito altas
**Solução**: Verificar se valor do milheiro está correto em `get_loyalty_program_info()`

### Problema: Economia negativa
**Causa**: Normal! Nem sempre compensa usar milhas
**Ação**: Sistema mostra que é melhor pagar em dinheiro

### Problema: Badge sempre "Aproximado"
**Causa**: Falta dados de distância da rota
**Solução**: Amadeus nem sempre retorna, é esperado

## 📚 Referências

- [Amadeus Flight Offers API](https://developers.amadeus.com/self-service/category/flights)
- [MaxMilhas - Cotação de Milhas](https://www.maxmilhas.com.br/)
- [Melhor Destino - Guia de Programas](https://www.melhordestino.com.br/programas-de-milhass)

---

**Status**: ✅ Implementado e funcionando
**Última atualização**: Outubro 2025
**Responsável**: Sistema ClickPassagens
