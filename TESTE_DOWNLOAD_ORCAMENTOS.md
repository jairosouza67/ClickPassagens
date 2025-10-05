# 🔧 Guia de Teste - Download de Orçamentos (PDF/Word)

## ✅ Checklist de Teste

### 1️⃣ Abrir a Página de Orçamentos
- Acesse: `http://localhost:5173` (ou a porta que estiver rodando)
- Navegue até a página de orçamentos
- Preencha o formulário com dados de teste

### 2️⃣ Gerar Orçamento
- Complete todos os passos do formulário
- Chegue até a etapa 4 (Confirmação)
- Você deve ver dois painéis:
  - **Orçamento Cliente** (painel azul)
  - **Orçamento Interno** (painel verde)

### 3️⃣ Selecionar Formato
- **Botões de formato** devem estar visíveis:
  - `📄 PDF` (fundo azul quando selecionado)
  - `📝 Word` (fundo azul quando selecionado)
- Clique em um dos formatos
- O botão deve mudar de cor indicando seleção

### 4️⃣ Baixar Documento
- Clique no botão **"Baixar PDF"** ou **"Baixar Word"**
- O download deve iniciar automaticamente
- Verifique a pasta de Downloads

---

## 🐛 Troubleshooting

### Problema 1: Botões não aparecem
**Solução:**
1. Abra o Console do Navegador (F12)
2. Verifique se há erros JavaScript
3. Procure por erros relacionados a imports

### Problema 2: Clique não faz nada
**Verifique no Console:**
```javascript
// Deve aparecer:
generatePDF chamado: {quote: {...}, quoteType: "client"}
Salvando PDF: orcamento-client-XXX.pdf
PDF gerado com sucesso!
```

**Se não aparecer:**
- A função não está sendo chamada
- Verifique se `downloadFormat` está definido

### Problema 3: Erro ao gerar documento
**Erros comuns:**

#### Erro: "Cannot read property 'flight' of undefined"
```javascript
// Solução: Orçamento não foi gerado corretamente
// Verifique no console:
console.log(clientQuote);
console.log(internalQuote);
```

#### Erro: "jsPDF is not defined"
```bash
# Solução: Reinstalar dependências
npm install jspdf jspdf-autotable docx file-saver
```

#### Erro: "Cannot find module 'docx'"
```bash
# Solução: Limpar cache e reinstalar
npm cache clean --force
npm install
```

### Problema 4: PDF/Word vazio ou mal formatado
**Verifique os dados:**
1. Abra o Console (F12)
2. Digite:
```javascript
// No console do navegador
console.log(clientQuote);
```
3. Verifique se tem os campos:
   - `quote.flight.airline`
   - `quote.pricing.total`
   - `quote.agency.name`

---

## 📋 Estrutura Esperada do Orçamento

### Orçamento Cliente
```javascript
{
  quoteNumber: "QT-...",
  quoteType: "CLIENT",
  flight: {
    airline: "Gol",
    flightNumber: "G3 1234",
    origin: { code: "GRU", name: "São Paulo" },
    destination: { code: "GIG", name: "Rio de Janeiro" },
    departure: { date: "2024-02-10", time: "08:30" },
    return: { date: "2024-02-15", time: "18:00" },
    duration: "1h 15min",
    stops: "Direto",
    class: "Econômica"
  },
  pricing: {
    flightPrice: 450.00,
    taxes: { airportTaxes: 85.30 },
    total: 535.30,
    paymentMethods: [...]
  },
  agency: {
    name: "ClickPassagens",
    phone: "(11) 99999-9999",
    email: "contato@clickpassagens.com"
  }
}
```

---

## 🔍 Verificação Passo a Passo

### Teste Manual no Console

1. **Abra o Console do Navegador** (F12)

2. **Importe a função:**
```javascript
import { generatePDF } from './src/services/documentGenerator.js';
```

3. **Crie um orçamento de teste:**
```javascript
const testQuote = {
  quoteNumber: "TESTE-001",
  quoteType: "CLIENT",
  flight: {
    airline: "GOL",
    flightNumber: "G3 1234",
    origin: { code: "GRU", name: "São Paulo - Guarulhos" },
    destination: { code: "GIG", name: "Rio de Janeiro - Galeão" },
    departure: { date: "2024-10-10", time: "08:00" },
    duration: "1h 10min",
    stops: "Direto",
    class: "Econômica"
  },
  pricing: {
    flightPrice: 500.00,
    taxes: { airportTaxes: 100.00 },
    total: 600.00,
    paymentMethods: [
      { method: "PIX", finalPrice: 570.00, discount: "5% desconto" }
    ]
  },
  agency: {
    name: "ClickPassagens",
    phone: "(11) 99999-9999",
    email: "teste@clickpassagens.com"
  },
  validUntil: "2024-10-17"
};
```

4. **Gere o PDF:**
```javascript
generatePDF(testQuote, 'client');
```

5. **Verifique:**
- O download deve iniciar
- Arquivo: `orcamento-client-TESTE-001.pdf`

---

## 🎯 Pontos de Verificação

### ✅ O que deve funcionar:

1. **Seletor de Formato:**
   - [ ] Botões "PDF" e "Word" visíveis
   - [ ] Mudança de cor ao clicar
   - [ ] Estado persiste entre cliques

2. **Download de PDF:**
   - [ ] Clique no botão inicia download
   - [ ] Arquivo .pdf gerado
   - [ ] PDF abre corretamente
   - [ ] Dados corretos no documento

3. **Download de Word:**
   - [ ] Clique no botão inicia download
   - [ ] Arquivo .docx gerado
   - [ ] Word abre corretamente (ou LibreOffice/Google Docs)
   - [ ] Dados corretos no documento

4. **Console Limpo:**
   - [ ] Sem erros JavaScript
   - [ ] Logs de sucesso aparecem
   - [ ] Sem warnings críticos

---

## 📞 Próximos Passos se Não Funcionar

### 1. Capture os Logs
Abra o Console e copie TODOS os erros que aparecerem.

### 2. Verifique a Rede
Na aba "Network" (Rede) do DevTools, verifique se:
- Arquivo `documentGenerator.js` foi carregado
- Status: 200 OK

### 3. Verifique as Importações
No arquivo `QuotePage.jsx`, confirme:
```javascript
import { generatePDF, generateWord } from '../services/documentGenerator.js';
```

### 4. Estado do React
Adicione logs temporários:
```javascript
const downloadQuote = async (quoteType) => {
  console.log('downloadQuote chamado');
  console.log('quoteType:', quoteType);
  console.log('downloadFormat:', downloadFormat);
  console.log('quote:', quoteType === 'internal' ? internalQuote : clientQuote);
  // ... resto do código
};
```

---

## ✨ Resultado Esperado

### PDF Cliente:
- Cabeçalho azul
- Título: "ORÇAMENTO DE VIAGEM"
- Tabela com dados do voo
- Valores formatados em R$
- Formas de pagamento
- Informações de contato

### PDF Interno:
- Cabeçalho verde
- Título: "ORÇAMENTO INTERNO"
- Análise financeira (custos + lucro)
- Preço ao cliente destacado
- Observações internas

### Word (ambos):
- Estrutura similar ao PDF
- Tabelas formatadas
- Texto centralizado
- Rodapé com validade

---

**Se tudo estiver OK mas ainda não funcionar, me informe os erros do console! 🚀**
