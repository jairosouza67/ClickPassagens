# Como Configurar APIs Reais de Voos

## Amadeus API (Recomendada)

### 1. Criar Conta Amadeus
1. Acesse: https://developers.amadeus.com/
2. Crie uma conta gratuita
3. Vá para "My Apps" e crie uma nova aplicação
4. Copie suas credenciais:
   - API Key
   - API Secret

### 2. Configurar Credenciais
No arquivo `.env`, substitua:
```
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
```

### 3. Modo de Produção
Para usar APIs reais, altere no `.env`:
```
FLIGHT_API_MODE=production
```

## SkyScanner API (Alternativa)

### 1. RapidAPI
1. Acesse: https://rapidapi.com/skyscanner/api/skyscanner-flight-search
2. Assine o plano gratuito ou pago
3. Copie sua chave da API

### 2. Configurar
No arquivo `.env`:
```
SKYSCANNER_API_KEY=your_skyscanner_key_here
```

## Modo de Desenvolvimento

Por padrão, o sistema usa dados realistas de fallback quando:
- `FLIGHT_API_MODE=development` (padrão)
- Credenciais não estão configuradas
- APIs externas estão indisponíveis

Os dados de fallback incluem:
- Preços baseados em rotas reais
- Horários realistas
- Companhias aéreas reais (Gol, Azul, LATAM, etc.)
- Cálculos de milhas baseados em preços de mercado

## Instalação de Dependências

Após configurar as credenciais, instale as novas dependências:

```bash
.venv\Scripts\activate
pip install -r requirements.txt
```

## Limitações das APIs Gratuitas

### Amadeus (Teste)
- 1000 chamadas/mês
- Dados de teste (não reservas reais)
- Ideal para desenvolvimento

### SkyScanner (RapidAPI Gratuito)  
- 100 chamadas/mês
- Dados reais de voos
- Rate limiting aplicado

## Estrutura dos Dados

O sistema normaliza todos os dados no formato:
```json
{
  "companhia": {
    "nome": "Gol",
    "codigo": "G3",
    "logo_url": "https://...",
    ...
  },
  "voo_numero": "G31234",
  "horario_saida": "08:30",
  "horario_chegada": "10:45",
  "milhas_necessarias": 15000,
  "preco_dinheiro": 280.50,
  "economia_calculada": 56.10,
  "paradas": "Direto",
  "origem": "GRU",
  "destino": "GIG"
}
```

## Próximos Passos

1. Configure as credenciais no `.env`
2. Instale as dependências
3. Reinicie o servidor Flask
4. Teste uma busca no frontend
5. Verifique os logs para confirmar que está usando dados reais