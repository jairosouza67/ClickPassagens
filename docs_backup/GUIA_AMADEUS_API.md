# 🛫 Guia de Configuração - Amadeus API (Dados Reais de Voos)

## 📋 Visão Geral

A API da Amadeus fornece **dados reais de voos** de centenas de companhias aéreas ao redor do mundo. O plano gratuito (Test Environment) oferece:

- ✅ **2.000 chamadas gratuitas por mês**
- ✅ **Dados reais de voos**
- ✅ **Acesso a todas as funcionalidades**
- ✅ **Sem necessidade de cartão de crédito**

---

## 🚀 Passo a Passo - Obter Credenciais GRATUITAS

### 1. Criar Conta na Amadeus

1. Acesse: **https://developers.amadeus.com/register**
2. Preencha os dados:
   - Nome completo
   - Email
   - Senha
   - País: Brasil
3. Confirme seu email
4. Faça login em: **https://developers.amadeus.com/signin**

### 2. Criar uma Aplicação

1. No painel, clique em **"My Self-Service Workspace"**
2. Clique em **"Create new app"**
3. Preencha:
   - **App Name:** ClickPassagens (ou qualquer nome)
   - **App Description:** Sistema de busca de passagens aéreas
   - **Real-time Flight Search:** ✅ Marque esta opção
4. Clique em **"Create"**

### 3. Obter Credenciais

Após criar a aplicação, você verá:

```
API Key: xxxxxxxxxxxxxxxxxxx
API Secret: yyyyyyyyyyyyyyyy
```

### 4. Configurar no Projeto

1. Abra o arquivo **`.env`** na raiz do projeto
2. Substitua os valores:

```env
AMADEUS_API_KEY=sua_api_key_aqui
AMADEUS_API_SECRET=seu_api_secret_aqui
```

3. Mantenha as outras configurações:

```env
# Ambiente de teste (gratuito)
AMADEUS_BASE_URL=https://test.api.amadeus.com

# Modo development (permite fallback)
FLIGHT_API_MODE=development

# Permitir fallback se API falhar
FLIGHT_API_ALLOW_FALLBACK=true
```

### 5. Reiniciar o Servidor

```bash
# Parar o backend (Ctrl+C no terminal)
# Reiniciar
python main.py
```

---

## ✅ Verificar se Está Funcionando

### Método 1 - Via Terminal

```bash
# Ativar ambiente virtual
.\.venv\Scripts\Activate.ps1

# Executar teste
python -c "from src.services.flight_api import FlightAPIService; s = FlightAPIService(); print('Token:', s.get_amadeus_token())"
```

**Resultado esperado:**
```
Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Método 2 - Via Interface Web

1. Acesse: http://localhost:5173
2. Faça uma busca de voo:
   - Origem: **GRU** (São Paulo)
   - Destino: **GIG** (Rio de Janeiro)
   - Data: Qualquer data futura
3. Clique em **"Buscar Passagens"**
4. Aguarde 5-10 segundos
5. Verifique no console do navegador (F12):

**Se estiver funcionando:**
```
✅ Amadeus Response Status: 200
✅ Amadeus Response Data: X offers encontradas
```

**Se não estiver funcionando (fallback):**
```
⚠️ Usando dados de fallback realistas
```

---

## 🔍 Códigos IATA de Aeroportos Brasileiros

Use estes códigos para testar:

| Código | Cidade | Aeroporto |
|--------|--------|-----------|
| **GRU** | São Paulo | Guarulhos |
| **CGH** | São Paulo | Congonhas |
| **GIG** | Rio de Janeiro | Galeão |
| **SDU** | Rio de Janeiro | Santos Dumont |
| **BSB** | Brasília | JK |
| **SSA** | Salvador | Dep. Luís E. Magalhães |
| **FOR** | Fortaleza | Pinto Martins |
| **REC** | Recife | Guararapes |
| **POA** | Porto Alegre | Salgado Filho |
| **CWB** | Curitiba | Afonso Pena |
| **CNF** | Belo Horizonte | Confins |
| **MAO** | Manaus | Eduardo Gomes |
| **BEL** | Belém | Val de Cans |

### Aeroportos Internacionais (para testar voos internacionais):

| Código | Cidade | País |
|--------|--------|------|
| **JFK** | Nova York | EUA |
| **LHR** | Londres | Reino Unido |
| **CDG** | Paris | França |
| **MAD** | Madrid | Espanha |
| **LIS** | Lisboa | Portugal |
| **EZE** | Buenos Aires | Argentina |
| **SCL** | Santiago | Chile |
| **MEX** | Cidade do México | México |

---

## 🎯 Exemplo de Busca Real

```python
from src.services.flight_api import FlightAPIService

# Criar instância do serviço
service = FlightAPIService()

# Buscar voos reais
voos = service.search_flights(
    origem='GRU',
    destino='GIG',
    data_ida='2025-11-15',
    passageiros=1
)

# Exibir resultados
for voo in voos:
    print(f"{voo['companhia']['nome']} - {voo['voo_numero']}")
    print(f"Preço: R$ {voo['preco_dinheiro']:.2f}")
    print(f"Milhas: {voo['milhas_necessarias']:,}")
    print("---")
```

---

## 🔧 Configurações Avançadas

### Modo Production (Força Dados Reais)

Se você quiser **forçar** o uso de dados reais sem fallback:

```env
FLIGHT_API_MODE=production
FLIGHT_API_ALLOW_FALLBACK=false
```

⚠️ **Atenção:** Com esta configuração, se a API Amadeus falhar, o sistema retornará erro em vez de dados simulados.

### Usar API de Produção (Paga)

Quando seu app estiver em produção e você quiser usar o ambiente de produção da Amadeus (pago):

```env
AMADEUS_BASE_URL=https://api.amadeus.com
FLIGHT_API_MODE=production
```

⚠️ **Importante:** Você precisará de uma conta paga e credenciais de produção.

---

## 📊 Monitoramento de Uso

O sistema registra automaticamente o uso da API Amadeus no banco de dados:

```python
from src.models.milhas import AmadeusRateLimitLog

# Ver últimas requisições
logs = AmadeusRateLimitLog.query.order_by(
    AmadeusRateLimitLog.created_at.desc()
).limit(10).all()

for log in logs:
    print(f"{log.endpoint}: {log.remaining}/{log.limit} restantes")
```

Ou via API:
```
GET http://127.0.0.1:5001/api/busca/limite/amadeus
```

---

## ❓ Troubleshooting

### Problema: "Credenciais Amadeus não configuradas"

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se as variáveis `AMADEUS_API_KEY` e `AMADEUS_API_SECRET` estão preenchidas
3. Reinicie o servidor backend

### Problema: "Erro ao obter token: 401"

**Solução:**
- Suas credenciais estão incorretas
- Copie novamente do painel da Amadeus
- Certifique-se de não ter espaços antes/depois dos valores

### Problema: "Amadeus API retornou status 400"

**Solução:**
- Parâmetros da busca inválidos
- Use códigos IATA corretos (3 letras)
- Data deve estar no formato YYYY-MM-DD
- Data deve ser futura

### Problema: "Usando dados de fallback"

**Solução:**
- Isso é normal se as credenciais não estiverem configuradas
- Configure as credenciais conforme o passo a passo acima
- Verifique os logs do backend para mais detalhes

---

## 📝 Limites do Plano Gratuito

| Recurso | Limite |
|---------|--------|
| Chamadas/mês | 2.000 |
| Chamadas/segundo | 10 |
| Resultados por busca | 250 |
| Histórico | 30 dias |

⚠️ **Importante:** Monitore seu uso para não exceder o limite mensal.

---

## 🎓 Recursos Adicionais

- **Documentação Oficial:** https://developers.amadeus.com/docs
- **API Reference:** https://developers.amadeus.com/self-service/category/flights
- **Códigos IATA:** https://www.iata.org/en/publications/directories/code-search/
- **Status da API:** https://developers.amadeus.com/status

---

## ✅ Checklist Final

- [ ] Conta criada na Amadeus
- [ ] Aplicação criada no painel
- [ ] API Key copiada
- [ ] API Secret copiada
- [ ] Arquivo `.env` atualizado
- [ ] Servidor backend reiniciado
- [ ] Teste realizado com sucesso
- [ ] Dados reais sendo exibidos no frontend

---

## 🎉 Pronto!

Agora seu sistema está configurado para buscar **voos reais** de centenas de companhias aéreas!

**Próximos passos:**
1. Teste com diferentes rotas
2. Monitore seu uso mensal
3. Ajuste os filtros conforme necessário
4. Considere upgrade para produção quando necessário

---

**Dúvidas?** Verifique a documentação oficial da Amadeus ou os logs do backend.
