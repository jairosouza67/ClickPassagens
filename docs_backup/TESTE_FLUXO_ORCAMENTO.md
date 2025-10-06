# 🧪 TESTE DO NOVO FLUXO DE ORÇAMENTO

## ✅ O QUE FOI ALTERADO

### ANTES (Fluxo Antigo - Checkout Direto)
```
1. Buscar passagens
2. Ver resultados
3. Clicar em "Selecionar Voo"
4. ❌ Ia direto para CHECKOUT (pagamento)
5. Cliente tinha que pagar na hora
```

### AGORA (Novo Fluxo - Orçamento Primeiro)
```
1. Buscar passagens
2. Ver resultados
3. Clicar em "📋 Solicitar Orçamento"
4. ✅ Vai para PÁGINA DE ORÇAMENTO
5. Dados do voo JÁ PREENCHIDOS automaticamente
6. Preencher só seus dados (nome, email, telefone)
7. Gerar 2 orçamentos:
   - Cliente (enviar ao cliente)
   - Interno (ver seu lucro)
8. Baixar/Imprimir
```

---

## 🧪 COMO TESTAR - PASSO A PASSO

### 1️⃣ Abra o Site
```
http://127.0.0.1:5001
```

### 2️⃣ Faça uma Busca
- Origem: `São Paulo` ou `GRU`
- Destino: `Rio de Janeiro` ou `GIG`
- Data: Qualquer data futura
- Clique em **"🔍 Buscar Passagens"**

### 3️⃣ Aguarde os Resultados
Você verá uma lista de voos, exemplo:
```
┌─────────────────────────────────────────┐
│ GOL Airlines                            │
│ Voo G3-2044 • Econômica                │
│                                         │
│ GRU → GIG                              │
│ 08:00 → 09:45                          │
│                                         │
│ 💵 R$ 850,00                           │
│ ⭐ 25.000 milhas                       │
│                                         │
│ [Ver Detalhes] [📋 Solicitar Orçamento]│
└─────────────────────────────────────────┘
```

### 4️⃣ Clique em "📋 Solicitar Orçamento"

**O QUE ACONTECE:**
- ✅ Sistema captura TODOS os dados do voo
- ✅ Redireciona para página de orçamento
- ✅ Campos já preenchidos automaticamente:
  - ✓ Origem: GRU
  - ✓ Destino: GIG
  - ✓ Data de ida
  - ✓ Data de volta (se ida e volta)
  - ✓ Classe: Econômica
  - ✓ Passageiros: 1

### 5️⃣ Sistema Pula Automaticamente para STEP 2

**TELA QUE VOCÊ VERÁ:**
```
┌─────────────────────────────────────────┐
│ SOLICITAR ORÇAMENTO                     │
│                                         │
│ [✅ Viagem] → [👤 Dados] → [📋] → [✅] │
│              ↑ VOCÊ ESTÁ AQUI          │
│                                         │
│ 👤 Dados do Cliente                    │
│                                         │
│ Nome Completo: ___________________     │
│ Email:         ___________________     │
│ Telefone:      ___________________     │
│                                         │
│ [Continuar →]                          │
└─────────────────────────────────────────┘
```

**Se você estiver logado:**
- Nome e email já vêm preenchidos
- Só precisa confirmar/ajustar

### 6️⃣ Preencha e Continue

Digite:
- **Nome:** Seu nome ou "Teste Cliente"
- **Email:** seu@email.com
- **Telefone:** (11) 98765-4321

Clique em **"Continuar"**

### 7️⃣ STEP 3 - Observações (Opcional)

```
┌─────────────────────────────────────────┐
│ 📋 Observações Adicionais               │
│                                         │
│ Observações (opcional):                 │
│ ┌─────────────────────────────────────┐│
│ │ Ex: Preciso de assento na janela   ││
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
│ 📎 Anexar arquivo (opcional)           │
│ [Escolher arquivo]                      │
│                                         │
│ [← Voltar] [Enviar Solicitação →]     │
└─────────────────────────────────────────┘
```

Pode pular ou adicionar observações.

Clique em **"Enviar Solicitação"**

### 8️⃣ ORÇAMENTOS GERADOS! 🎉

Você verá 2 abas:

#### 📄 Orçamento Cliente (Dourado)
```
┌─────────────────────────────────────────┐
│ ✈️ ORÇAMENTO DE VIAGEM                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 📋 Número: ORC-1234567890-ABC123       │
│ 📅 Gerado em: 04/10/2025               │
│ ⏰ Válido até: 11/10/2025              │
│                                         │
│ ✈️ INFORMAÇÕES DO VOO                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ Companhia: GOL Airlines                │
│ Voo: G3-2044                           │
│ Origem: GRU - São Paulo                │
│ Destino: GIG - Rio de Janeiro          │
│ Data: 15/01/2025                       │
│                                         │
│ 💰 VALORES                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ Passagem:          R$ 1.227,29         │
│ Taxas:             R$    94,07         │
│ ─────────────────────────────────      │
│ TOTAL:             R$ 1.227,29         │
│                                         │
│ 💳 FORMAS DE PAGAMENTO                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 💰 PIX: R$ 1.165,93 (5% desc.)        │
│ 💳 12x R$ 102,27 sem juros            │
│ ⭐ 32.500 milhas + R$ 94,07           │
│                                         │
│ [💾 Baixar] [🖨️ Imprimir]            │
└─────────────────────────────────────────┘
```

#### 💼 Orçamento Interno (Verde - Confidencial)
```
┌─────────────────────────────────────────┐
│ 💼 ORÇAMENTO INTERNO (CONFIDENCIAL)    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ [Mesmas informações do voo]            │
│                                         │
│ 💰 ANÁLISE FINANCEIRA                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ CUSTOS REAIS:                          │
│ ─────────────────────────────────      │
│ Tarifa Base:       R$   850,00         │
│ Taxas GRU:         R$    56,45         │
│ Taxas GIG:         R$    37,62         │
│ ─────────────────────────────────      │
│ SUBTOTAL:          R$   944,07         │
│                                         │
│ 💚 LUCRO (30%):    R$   283,22 ⭐      │
│ ─────────────────────────────────      │
│ PREÇO CLIENTE:     R$ 1.227,29         │
│                                         │
│ MILHAS:                                │
│ Base:              25.000              │
│ Cliente:           32.500              │
│ Lucro:              7.500 ⭐           │
│                                         │
│ [💾 Baixar JSON]                       │
└─────────────────────────────────────────┘
```

---

## 🎯 O QUE TESTAR

### ✅ Checklist de Testes

- [ ] **Busca funciona?**
  - Coloca origem e destino
  - Retorna voos da API Amadeus
  
- [ ] **Botão "Solicitar Orçamento" aparece?**
  - Está em TODOS os voos da lista
  - Tem ícone 📋
  - Cor dourada/amarela
  
- [ ] **Dados auto-preenchidos?**
  - Origem já preenchida
  - Destino já preenchido
  - Data já preenchida
  - Classe já preenchida
  
- [ ] **Sistema pula para Step 2?**
  - Não pede para preencher dados da viagem novamente
  - Já está no formulário de dados pessoais
  
- [ ] **Se logado, auto-preenche nome/email?**
  - Login com Google ou email
  - Nome aparece automaticamente
  - Email aparece automaticamente
  
- [ ] **Orçamentos são gerados?**
  - Orçamento Cliente (dourado)
  - Orçamento Interno (verde)
  - Dados corretos do voo
  - Valores corretos
  
- [ ] **Cálculo de lucro está correto?**
  - Orçamento interno mostra 30% de lucro
  - Valores batem (custo + 30% = preço cliente)
  
- [ ] **Formas de pagamento aparecem?**
  - PIX (5% desconto)
  - Cartão (12x sem juros)
  - Milhas + taxas
  
- [ ] **Pode baixar/imprimir?**
  - Botão de download funciona
  - Botão de impressão funciona

---

## 🐛 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### ❌ Problema: Botão "Solicitar Orçamento" não aparece
**Solução:**
```bash
# Limpar cache e rebuild
cd "e:\VS Code\ClickPassagens"
npm run build
Copy-Item -Recurse -Force dist/* static/
```

### ❌ Problema: Dados não são auto-preenchidos
**Verificar:**
1. Console do navegador (F12)
2. Procurar por: `🎯 Selecionando voo para orçamento:`
3. Deve mostrar o objeto do voo completo

**Se não aparecer:**
```javascript
// Abrir console e testar:
console.log('selectedFlight:', selectedFlight);
```

### ❌ Problema: Orçamentos não são gerados
**Verificar:**
1. Console deve mostrar:
   ```
   ✅ Orçamento Interno gerado
   ✅ Orçamento Cliente gerado
   ```
2. Se não aparecer, verificar arquivo `quoteService.js`

### ❌ Problema: Valores errados nos orçamentos
**Verificar:**
1. API Amadeus está retornando preços corretos
2. Cálculo de 30% está sendo aplicado
3. Taxas de aeroporto estão corretas

---

## 📊 CONSOLE LOGS ESPERADOS

Quando você clicar em "Solicitar Orçamento", deve ver:

```javascript
🎯 Selecionando voo para orçamento: {
  id: "...",
  companhia: { nome: "GOL", codigo: "G3" },
  voo_numero: "G3-2044",
  origem: "GRU",
  destino: "GIG",
  data: "2025-01-15",
  horario_saida: "08:00",
  horario_chegada: "09:45",
  preco_dinheiro: 850.00,
  preco_milhas: 25000,
  // ... outros dados
}

// Depois, na página de orçamento:
✅ Dados do voo detectados, auto-preenchendo...
📋 Origem: GRU
📋 Destino: GIG
📋 Data: 2025-01-15
⏭️ Pulando para Step 2 (dados já preenchidos)

// Quando gerar orçamentos:
💰 Calculando custos...
💰 Custo base: R$ 850.00
💰 Taxas: R$ 94.07
💰 Subtotal: R$ 944.07
💚 Lucro (30%): R$ 283.22
💵 Preço cliente: R$ 1,227.29

✅ Orçamento Interno gerado
✅ Orçamento Cliente gerado
```

---

## 🎉 RESULTADO ESPERADO

**TESTE COMPLETO (3 minutos):**

1. ⏱️ **0:00** - Abre site, faz busca (GRU → GIG)
2. ⏱️ **0:30** - Vê lista de 20 voos
3. ⏱️ **0:45** - Clica em "📋 Solicitar Orçamento" no primeiro voo
4. ⏱️ **0:46** - Já está na página de orçamento com dados preenchidos
5. ⏱️ **1:00** - Preenche nome, email, telefone (ou já preenchido se logado)
6. ⏱️ **1:15** - Clica "Continuar"
7. ⏱️ **1:30** - Pula observações (opcional), clica "Enviar Solicitação"
8. ⏱️ **1:45** - Orçamentos gerados! 🎉
9. ⏱️ **2:00** - Visualiza orçamento cliente (dourado)
10. ⏱️ **2:30** - Visualiza orçamento interno (verde) - **vê lucro de 30%**
11. ⏱️ **3:00** - Baixa orçamento cliente para enviar ao cliente

**✅ SUCESSO!**

---

## 💡 DICAS DE USO

### Para Vendedores:
1. **Sempre use orçamento CLIENTE** para enviar ao cliente
   - Não mostra seu lucro
   - Design profissional
   - Formas de pagamento claras

2. **Use orçamento INTERNO** para sua análise
   - Ver quanto vai ganhar
   - Analisar viabilidade
   - Decidir descontos

3. **Estratégia de Vendas:**
   - Ofereça desconto PIX para fechar rápido
   - Mostre economia em milhas
   - Destaque parcelamento sem juros

### Para Clientes:
- Receberá orçamento limpo e profissional
- Vê todas formas de pagamento
- Pode comparar dinheiro vs milhas
- Orçamento válido por 7 dias

---

**🚀 TESTE AGORA!**

http://127.0.0.1:5001

Se tiver algum problema, abra o console (F12) e me envie os logs! 📊
