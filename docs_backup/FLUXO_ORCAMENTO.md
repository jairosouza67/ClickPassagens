# 📋 FLUXO DE ORÇAMENTO - ClickPassagens

## ✅ NOVA FUNCIONALIDADE IMPLEMENTADA

### 🎯 Objetivo
Quando o usuário encontrar uma passagem e clicar para finalizar, os dados do voo são **automaticamente inseridos** na página de orçamento para posterior envio ao cliente.

---

## 🔄 FLUXO COMPLETO

### 1️⃣ Busca de Passagens
```
HeroSection → Usuário busca passagens
↓
Sistema consulta API Amadeus
↓
Retorna lista de voos disponíveis
```

### 2️⃣ Resultados
```
ResultsPage → Exibe lista de voos encontrados
↓
Cada voo tem 2 botões:
  • Ver Detalhes (abre modal com info completa)
  • 📋 Solicitar Orçamento (NOVO! - vai para orçamento)
```

### 3️⃣ Solicitar Orçamento
```
Clica em "📋 Solicitar Orçamento"
↓
Sistema captura TODOS os dados do voo:
  ✓ Companhia aérea
  ✓ Origem e destino
  ✓ Datas (ida e volta)
  ✓ Horários
  ✓ Preço em dinheiro
  ✓ Preço em milhas
  ✓ Taxas de embarque
  ✓ Número do voo
  ✓ Duração
  ✓ Escalas
↓
Redireciona para QuotePage
```

### 4️⃣ QuotePage - Dados Auto-Preenchidos

#### **STEP 1: Viagem (PULADO AUTOMATICAMENTE)**
✅ **Campos preenchidos automaticamente:**
- Tipo de viagem (ida ou ida-volta)
- Origem
- Destino
- Data de ida
- Data de volta
- Número de passageiros
- Classe

**Sistema detecta que voo já foi selecionado → Pula direto para STEP 2**

#### **STEP 2: Dados do Cliente**
👤 Usuário preenche:
- Nome completo
- Email
- Telefone

**Se usuário estiver logado:**
- Nome e email são auto-preenchidos
- Só precisa confirmar os dados

#### **STEP 3: Observações (Opcional)**
📝 Campos opcionais:
- Observações adicionais
- Upload de arquivo (documentos, etc)

#### **STEP 4: Orçamentos Gerados**

O sistema gera **DOIS ORÇAMENTOS** automaticamente:

##### 📄 **Orçamento Cliente** (tema dourado)
```
✈️ ORÇAMENTO DE VIAGEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Número: ORC-1234567890-ABC123
📅 Gerado em: 04/10/2025
⏰ Válido até: 11/10/2025 (7 dias)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✈️ INFORMAÇÕES DO VOO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Companhia: GOL Airlines
Voo: G3-2044
Origem: GRU - São Paulo
Destino: GIG - Rio de Janeiro
Data: 15/01/2025
Classe: Econômica

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 VALORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passagem:               R$ 1.227,29
Taxas de Embarque:      R$    94,07
─────────────────────────────────────
TOTAL:                  R$ 1.227,29

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 FORMAS DE PAGAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Dinheiro/PIX
   Valor: R$ 1.165,93 (5% desconto)
   Desconto: 5% de desconto no PIX

💳 Cartão de Crédito
   Até 12x de R$ 102,27
   Sem juros

⭐ Milhas
   32.500 milhas + R$ 94,07 (taxas)
   Valor estimado: R$ 487,50
   Economia vs. dinheiro: R$ 739,79

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TERMOS E CONDIÇÕES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Preços sujeitos a disponibilidade
• Taxas podem sofrer alterações
• Valores em milhas são aproximados
• Orçamento válido por 7 dias

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Botão: 💾 Baixar Orçamento]
[Botão: 🖨️ Imprimir]
```

##### 💼 **Orçamento Interno** (tema verde - CONFIDENCIAL)
```
💼 ORÇAMENTO INTERNO (CONFIDENCIAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Mesmas informações do voo]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 ANÁLISE FINANCEIRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOS REAIS:
─────────────────────────────────────
Tarifa Base:              R$   850,00
Taxa GRU (Embarque):      R$    47,04
Taxa GRU (Segurança):     R$     9,41
Taxa GIG (Embarque):      R$    29,93
Taxa GIG (Segurança):     R$     7,69
─────────────────────────────────────
SUBTOTAL (CUSTO):         R$   944,07

LUCRO:
─────────────────────────────────────
Margem: 30%
Valor:                    R$   283,22
─────────────────────────────────────
PREÇO AO CLIENTE:         R$ 1.227,29

ANÁLISE EM MILHAS:
─────────────────────────────────────
Milhas necessárias (base): 25.000
Milhas cobradas (cliente): 32.500
Lucro em milhas:            7.500
Taxas (dinheiro):         R$    94,07

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 RECOMENDAÇÕES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Oferecer desconto PIX para fechar rápido
✅ Opção em milhas tem boa margem
⚠️ Conferir disponibilidade antes de confirmar

[Botão: 💾 Baixar JSON]
```

---

## 🎨 DIFERENÇAS VISUAIS

### Orçamento Cliente (Dourado)
- Cor principal: `#fbbf24` (dourado)
- Foco: Informações claras para o cliente
- **NÃO MOSTRA LUCRO**
- Mostra formas de pagamento
- Design limpo e profissional

### Orçamento Interno (Verde)
- Cor principal: `#10b981` (verde)
- Foco: Análise de lucro e custos
- **MOSTRA LUCRO DESTACADO**
- Detalhamento de taxas por aeroporto
- Recomendações estratégicas

---

## 🚀 COMO USAR

### Para Solicitar Orçamento:

1. **Faça uma busca** de passagens
2. **Visualize os resultados**
3. **Clique em "📋 Solicitar Orçamento"** no voo desejado
4. **Confirme/Preencha** seus dados (nome, email, telefone)
5. **Adicione observações** (opcional)
6. **Clique em "Enviar Solicitação"**
7. **Visualize ambos os orçamentos:**
   - Orçamento Cliente → Para enviar ao cliente
   - Orçamento Interno → Para análise interna
8. **Baixe ou imprima** conforme necessário

---

## 📊 DADOS ARMAZENADOS

Quando um orçamento é gerado, o sistema salva:

```javascript
{
  id: "ORC-1234567890-ABC123",
  tipo: "CLIENTE", // ou "INTERNO"
  voo: {
    companhia: "GOL Airlines",
    numero: "G3-2044",
    origem: "GRU",
    destino: "GIG",
    // ... todos os dados do voo
  },
  cliente: {
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 98765-4321"
  },
  valores: {
    custo: 944.07,
    lucro: 283.22,
    precoCliente: 1227.29,
    // ... detalhamento completo
  },
  geradoEm: "2025-10-04T13:30:00Z",
  validoAte: "2025-10-11T13:30:00Z",
  status: "PENDENTE" // PENDENTE | ACEITO | RECUSADO
}
```

---

## 🔧 PRÓXIMOS PASSOS (Opcional)

### Funcionalidades Adicionais que podem ser implementadas:

1. **Envio Automático por Email**
   - Botão "Enviar por Email" no orçamento
   - Email formatado com orçamento cliente
   - Cópia para vendedor

2. **Histórico de Orçamentos**
   - Dashboard com todos orçamentos gerados
   - Filtrar por status (pendente, aceito, recusado)
   - Busca por cliente ou data

3. **Status de Orçamento**
   - Cliente pode aceitar/recusar pelo email
   - Link único para cada orçamento
   - Notificação ao vendedor

4. **Exportação**
   - PDF profissional (com logo)
   - Excel para análise de dados
   - WhatsApp (compartilhamento direto)

5. **Template Personalizável**
   - Empresa pode customizar cores
   - Adicionar logo no orçamento
   - Termos e condições customizados

---

## ✅ STATUS ATUAL

- ✅ Fluxo de busca → resultados → orçamento funcionando
- ✅ Auto-preenchimento de dados do voo
- ✅ Geração de orçamento cliente e interno
- ✅ Cálculo automático de lucro (30%)
- ✅ Múltiplas formas de pagamento
- ✅ Download e impressão
- ✅ Interface responsiva
- ✅ Integração com API Amadeus

---

## 🎯 RESULTADO

**Antes:**
- Usuário buscava voo
- Clicava em "Selecionar Voo"
- Era redirecionado para checkout
- Tinha que finalizar compra direto

**Agora:**
- Usuário busca voo
- Clica em "📋 Solicitar Orçamento"
- Dados do voo são **automaticamente inseridos**
- Preenche apenas seus dados pessoais
- Sistema gera orçamento profissional
- Pode enviar ao cliente antes de fechar
- Analisa lucro internamente
- **Mais controle e profissionalismo!**

---

**🎉 Sistema pronto para uso!**

Teste agora: http://127.0.0.1:5001
