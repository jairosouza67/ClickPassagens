# 🧪 COMO TESTAR A BUSCA DE VOOS

## ✅ Status Atual

### Backend (API):
- ✅ **FUNCIONANDO PERFEITAMENTE**
- ✅ Porta: `http://localhost:5001`
- ✅ Credenciais Amadeus: **VÁLIDAS**
- ✅ Teste realizado: **20 voos reais retornados**

### Frontend (Interface):
- ✅ **FUNCIONANDO**
- ✅ Porta: `http://localhost:5175`
- ✅ CORS: **Habilitado**
- ✅ Conexão com backend: **Configurada**

---

## 📝 COMO FAZER UMA BUSCA

### Passo 1: Acessar o Site
Abra no navegador:
```
http://localhost:5175
```

### Passo 2: Ir para Busca
1. Clique na aba "**Busca**" (ou no ícone de avião)
2. Ou clique no botão "**Fazer Busca**" na tela inicial

### Passo 3: Preencher o Formulário
Use estes dados de teste (GARANTIDO que funcionam):

```
Origem: GRU
Destino: GIG
Data de Ida: 2025-10-15
Passageiros: 1
Classe: Econômica
```

**Explicação:**
- `GRU` = Aeroporto de Guarulhos (São Paulo)
- `GIG` = Aeroporto do Galeão (Rio de Janeiro)
- Data: 15 de outubro de 2025 (data futura válida)

### Passo 4: Clicar em "Buscar Passagens"
- Aguarde alguns segundos (a API Amadeus pode levar 5-10 segundos)
- Você verá um loading (indicador de carregamento)

### Passo 5: Ver os Resultados
Você deve ver uma lista com **até 20 voos reais** mostrando:
- ✈️ Companhia aérea (Gol, Azul, LATAM, etc.)
- 🕐 Horários de saída e chegada
- 💰 Preço em dinheiro (ex: R$ 103,39)
- 🎫 Quantidade de milhas necessárias
- 🛑 Número de paradas (Direto, 1 parada, etc.)

---

## 🔍 EXEMPLOS DE ROTAS PARA TESTAR

### Rotas Domésticas (Brasil):
```
GRU → GIG  (São Paulo → Rio)
GRU → BSB  (São Paulo → Brasília)
GIG → SSA  (Rio → Salvador)
CGH → FOR  (Congonhas → Fortaleza)
GRU → POA  (São Paulo → Porto Alegre)
```

### Rotas Internacionais:
```
GRU → EZE  (São Paulo → Buenos Aires)
GRU → SCL  (São Paulo → Santiago)
GRU → LIM  (São Paulo → Lima)
GRU → BOG  (São Paulo → Bogotá)
```

**⚠️ IMPORTANTE:** Use datas **futuras** (após 03/10/2025)

---

## 🐛 SE NÃO FUNCIONAR

### Problema 1: "Nenhum voo encontrado"
**Solução:**
- Verifique se a data é **futura**
- Tente outra rota (GRU → GIG é garantida)
- Verifique se os códigos dos aeroportos estão corretos (3 letras maiúsculas)

### Problema 2: Erro de conexão
**Verificar:**
1. Backend está rodando?
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 5001 -InformationLevel Quiet
   ```
   Deve retornar: `True`

2. Frontend está rodando?
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 5175 -InformationLevel Quiet
   ```
   Deve retornar: `True`

### Problema 3: Loading infinito
**Solução:**
1. Abra o Console do Navegador (F12)
2. Vá na aba "Console"
3. Verifique se há erros em vermelho
4. Copie a mensagem de erro

### Problema 4: Erro 401 ou "Credenciais inválidas"
**Solução:**
```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" test_amadeus.py
```
Se falhar, as credenciais precisam ser atualizadas novamente.

---

## 🧪 TESTES AUTOMATIZADOS

### Teste 1: Backend Funciona?
```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" test_amadeus.py
```
**Resultado esperado:**
```
✓ Token obtido com sucesso
✓ Busca retornou 20 resultados
✓ TESTE CONCLUÍDO COM SUCESSO!
```

### Teste 2: API HTTP Funciona?
```powershell
$response = Invoke-RestMethod -Uri "http://127.0.0.1:5001/api/busca/buscar" -Method POST -ContentType "application/json" -Body '{"origem":"GRU","destino":"GIG","data_ida":"2025-10-15","passageiros":1}'
Write-Host "Resultados: $($response.data.resultados.Count)"
```
**Resultado esperado:**
```
Resultados: 20
```

### Teste 3: CORS Funciona?
```powershell
curl -X OPTIONS http://127.0.0.1:5001/api/busca/buscar -H "Origin: http://localhost:5175" -H "Access-Control-Request-Method: POST" -i
```
**Resultado esperado:**
```
Access-Control-Allow-Origin: *
```

---

## 📊 O QUE ESPERAR

### Tempo de Resposta:
- **Backend → Amadeus:** 3-8 segundos
- **Amadeus → Backend:** 1-3 segundos  
- **Total:** 5-12 segundos (normal)

### Quantidade de Resultados:
- **Rotas populares:** 10-20 voos
- **Rotas menos populares:** 2-10 voos
- **Rotas sem disponibilidade:** 0 voos (com mensagem de erro)

### Dados Retornados:
Cada voo terá:
```json
{
  "companhia": {
    "nome": "Gol",
    "codigo": "G3",
    "logo_url": "https://..."
  },
  "voo_numero": "2044",
  "horario_saida": "06:00",
  "horario_chegada": "07:05",
  "preco_dinheiro": 103.39,
  "milhas_necessarias": 5169,
  "paradas": "Direto",
  "disponivel": true
}
```

---

## 🎯 CHECKLIST DE VERIFICAÇÃO

Antes de reportar problema, verifique:

- [ ] Backend rodando na porta 5001
- [ ] Frontend rodando na porta 5175
- [ ] Credenciais Amadeus válidas (rodar test_amadeus.py)
- [ ] Dados do formulário preenchidos corretamente
- [ ] Data é futura (após 03/10/2025)
- [ ] Códigos de aeroporto com 3 letras maiúsculas
- [ ] Conexão com internet funcionando
- [ ] Console do navegador sem erros (F12)

---

## 📸 COMO DEVE PARECER

### Tela Inicial (Antes da Busca):
```
┌─────────────────────────────────────┐
│   🛩️  ClickPassagens                │
│                                     │
│   [Busca] [Resultados] [Planos]    │
│                                     │
│   ✈️  Nenhuma busca realizada       │
│   Faça uma busca para ver os        │
│   resultados aqui                    │
│                                     │
│   [🔍 Fazer Busca]                  │
└─────────────────────────────────────┘
```

### Durante a Busca (Loading):
```
┌─────────────────────────────────────┐
│   📝 Buscando voos...               │
│   [━━━━━━━━━━] Carregando...       │
└─────────────────────────────────────┘
```

### Após a Busca (Resultados):
```
┌─────────────────────────────────────┐
│   ✅ 20 voos encontrados             │
│                                     │
│   ✈️  Gol - Voo G3-2044             │
│   🕐 06:00 → 07:05 (Direto)         │
│   💰 R$ 103,39 | 🎫 5.169 milhas    │
│   [Ver Detalhes] [Reservar]         │
│                                     │
│   ✈️  Azul - Voo AD-4256            │
│   🕐 08:30 → 09:40 (Direto)         │
│   💰 R$ 150,00 | 🎫 7.500 milhas    │
│   [Ver Detalhes] [Reservar]         │
│                                     │
│   ... (mais 18 voos)                │
└─────────────────────────────────────┘
```

---

## 💡 DICAS

1. **Use sempre GRU → GIG** para testar - é a rota com mais voos
2. **Aguarde até 15 segundos** - APIs externas podem ser lentas
3. **Verifique o Console (F12)** se algo der errado
4. **Teste primeiro com o script Python** antes do frontend

---

## 🆘 SUPORTE RÁPIDO

**Backend não inicia:**
```powershell
& "E:/VS Code/ClickPassagens/.venv/Scripts/python" main.py
```

**Frontend não inicia:**
```powershell
npm run dev
```

**Credenciais inválidas:**
- Verifique o arquivo `.env`
- Rode `test_amadeus.py` para validar
- Gere novas credenciais em https://developers.amadeus.com/

**Sem resultados:**
- Tente GRU → GIG com data futura
- Verifique logs do backend
- Rode teste HTTP manual

---

**✅ RESUMO: O sistema está funcionando! Você só precisa fazer uma busca para ver os resultados.**

**Acesse:** http://localhost:5175 → Busca → GRU para GIG → 15/10/2025 → Buscar
