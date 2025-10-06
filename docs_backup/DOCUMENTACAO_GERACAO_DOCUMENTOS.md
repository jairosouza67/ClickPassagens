# 📄 Documentação - Geração de Documentos (PDF/Word)

## 🎯 Objetivo

Substituir a geração de orçamentos em formato JSON por documentos profissionais em **PDF** ou **Word (.docx)**, permitindo que o usuário escolha o formato desejado.

---

## 🚀 Implementação

### 1️⃣ Bibliotecas Instaladas

```bash
npm install jspdf jspdf-autotable docx file-saver
```

**Bibliotecas utilizadas:**
- `jspdf` - Geração de arquivos PDF
- `jspdf-autotable` - Criação de tabelas formatadas em PDFs
- `docx` - Geração de documentos Word (.docx)
- `file-saver` - Facilitador para download de arquivos no navegador

---

### 2️⃣ Arquivo Criado: `documentGenerator.js`

**Localização:** `src/services/documentGenerator.js`

#### Funções Principais:

##### 📄 `generatePDF(quote, quoteType)`

Gera um documento PDF profissional com:
- **Cabeçalho colorido** com logo e número do orçamento
- **Dados da viagem** em tabela formatada
- **Valores** com análise financeira (orçamento interno) ou preços ao cliente (orçamento cliente)
- **Opção em milhas** (se disponível)
- **Formas de pagamento** (orçamento cliente)
- **Observações internas** (orçamento interno)
- **Rodapé** com número de páginas, data de validade e site

**Diferenças entre tipos:**

| Orçamento Cliente | Orçamento Interno |
|-------------------|-------------------|
| Cor: Amarelo (#fbbf24) | Cor: Verde (#10b981) |
| Preço final ao cliente | Análise de custos e lucros |
| Formas de pagamento | Recomendações internas |
| Informações de contato | Dados confidenciais |

**Exemplo de uso:**
```javascript
import { generatePDF } from '../services/documentGenerator';

// Gerar PDF do orçamento ao cliente
generatePDF(clientQuote, 'client');

// Gerar PDF do orçamento interno
generatePDF(internalQuote, 'internal');
```

---

##### 📝 `generateWord(quote, quoteType)`

Gera um documento Word (.docx) profissional com:
- **Cabeçalho** com título e informações do orçamento
- **Tabelas formatadas** com dados da viagem
- **Valores e análises** financeiras
- **Formas de pagamento** (cliente) ou observações (interno)
- **Informações de contato** da agência
- **Rodapé** com data de validade e site

**Exemplo de uso:**
```javascript
import { generateWord } from '../services/documentGenerator';

// Gerar Word do orçamento ao cliente
generateWord(clientQuote, 'client');

// Gerar Word do orçamento interno
generateWord(internalQuote, 'internal');
```

---

### 3️⃣ Modificações em `QuotePage.jsx`

#### Estado adicionado:

```javascript
const [downloadFormat, setDownloadFormat] = useState('pdf'); // 'pdf' ou 'word'
```

#### Função `downloadQuote` atualizada:

**ANTES:**
```javascript
const downloadQuote = (quoteType) => {
  const quote = quoteType === 'internal' ? internalQuote : clientQuote;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quote, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `orcamento-${quoteType}-${quote.quoteNumber}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
```

**DEPOIS:**
```javascript
const downloadQuote = (quoteType) => {
  const quote = quoteType === 'internal' ? internalQuote : clientQuote;
  
  if (downloadFormat === 'pdf') {
    generatePDF(quote, quoteType);
  } else if (downloadFormat === 'word') {
    generateWord(quote, quoteType);
  }
};
```

---

#### Interface de Usuário (UI):

**Adicionado seletor de formato:**

```jsx
<div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px' }}>
  <button
    onClick={() => setDownloadFormat('pdf')}
    style={{
      padding: '8px 20px',
      background: downloadFormat === 'pdf' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
      color: downloadFormat === 'pdf' ? 'white' : '#64748b',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
  >
    📄 PDF
  </button>
  <button
    onClick={() => setDownloadFormat('word')}
    style={{
      padding: '8px 20px',
      background: downloadFormat === 'word' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
      color: downloadFormat === 'word' ? 'white' : '#64748b',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
  >
    📝 Word
  </button>
</div>
```

**Botão de download atualizado:**

```jsx
<button onClick={() => downloadQuote('client')}>
  <Download size={20} /> Baixar {downloadFormat === 'pdf' ? 'PDF' : 'Word'}
</button>
```

---

## 📦 Estrutura de Dados do Orçamento

### Orçamento Cliente (`clientQuote`)

```javascript
{
  quoteNumber: "QT-20240115-001",
  generatedAt: "2024-01-15T14:30:00Z",
  validUntil: "2024-02-15T23:59:59Z",
  
  flight: {
    airline: "Gol Linhas Aéreas",
    flightNumber: "G3 1234",
    origin: { code: "GRU", name: "São Paulo - Guarulhos" },
    destination: { code: "GIG", name: "Rio de Janeiro - Galeão" },
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
    
    milesOption: {
      totalMiles: 35000,
      savings: { percentage: "15%" }
    },
    
    paymentMethods: [
      { 
        method: "PIX/Dinheiro", 
        finalPrice: 508.54,
        discount: "5% de desconto"
      },
      { 
        method: "Cartão de Crédito", 
        installments: "3x sem juros",
        installmentValue: 178.43
      }
    ]
  },
  
  agency: {
    name: "ClickPassagens",
    phone: "(11) 99999-9999",
    email: "contato@clickpassagens.com"
  }
}
```

### Orçamento Interno (`internalQuote`)

```javascript
{
  quoteNumber: "INT-20240115-001",
  generatedAt: "2024-01-15T14:30:00Z",
  validUntil: "2024-02-15T23:59:59Z",
  
  flight: { /* mesma estrutura */ },
  
  pricing: {
    basePrice: 380.00,
    airportTaxes: {
      total: 85.30,
      origin: { code: "GRU", airport: "Guarulhos", amount: 42.65 },
      destination: { code: "GIG", airport: "Galeão", amount: 42.65 }
    },
    subtotal: 465.30,
    
    profit: {
      percentage: "15%",
      amount: 69.80
    },
    
    clientPrice: 535.10,
    
    miles: {
      baseNeeded: 30000,
      profitPercentage: "17%",
      profit: 5100,
      clientTotal: 35100
    }
  },
  
  internalNotes: {
    recommendation: "Margem de lucro adequada. Cliente frequente - considerar desconto adicional se necessário."
  }
}
```

---

## 🎨 Design dos Documentos

### PDF - Orçamento Cliente
- **Cor principal:** Azul (#3b82f6)
- **Destaque:** Amarelo (#fbbf24)
- **Seções:**
  - ✈️ Dados da Viagem (tabela)
  - 💰 Valores (destaque total)
  - ⭐ Opção em Milhas (se disponível)
  - 💳 Formas de Pagamento (lista)
  - 📞 Contato (rodapé amarelo)

### PDF - Orçamento Interno
- **Cor principal:** Verde (#10b981)
- **Destaque:** Verde claro (#34d399)
- **Seções:**
  - ✈️ Dados da Viagem (tabela)
  - 💰 Análise Financeira (custo, lucro, preço cliente)
  - ⭐ Análise em Milhas (se disponível)
  - 💡 Observações Internas (amarelo claro)

### Word - Ambos os tipos
- **Estrutura:**
  - Cabeçalho centralizado com título
  - Tabelas formatadas com bordas
  - Parágrafos com espaçamento adequado
  - Formatação bold para destaques
  - Rodapé com informações de validade

---

## 🔄 Fluxo de Uso

1. **Usuário preenche formulário** de orçamento
2. **Sistema gera** `clientQuote` e/ou `internalQuote`
3. **Usuário visualiza** orçamento na tela
4. **Usuário escolhe formato:**
   - Clica em "📄 PDF" ou "📝 Word"
   - Botão muda para indicar formato selecionado
5. **Usuário clica em "Baixar"**
   - Sistema chama `generatePDF()` ou `generateWord()`
   - Arquivo é gerado e baixado automaticamente
6. **Arquivo baixado:**
   - Nome: `orcamento-client-QT-20240115-001.pdf`
   - ou: `orcamento-internal-INT-20240115-001.docx`

---

## ✅ Vantagens da Implementação

### Para o Cliente:
- ✅ Documentos profissionais e apresentáveis
- ✅ Fácil compartilhamento (PDF/Word)
- ✅ Compatível com email e impressão
- ✅ Formato universal (todos podem abrir)

### Para a Empresa:
- ✅ Imagem profissional
- ✅ Orçamentos internos confidenciais organizados
- ✅ Fácil arquivo e organização
- ✅ Análise de lucros clara

### Técnicas:
- ✅ Código modular e reutilizável
- ✅ Separação de responsabilidades
- ✅ Biblioteca robusta (jspdf e docx)
- ✅ Fácil manutenção e extensão

---

## 🛠️ Manutenção e Extensão

### Para adicionar novos campos:

**No PDF:**
```javascript
// Adicionar linha na tabela de voo
flightData.push(['Novo Campo:', quote.flight.novoCampo]);

// Adicionar item de preço
const pricingData = [
  // ... existentes
  ['Novo Item', `R$ ${quote.pricing.novoItem.toLocaleString('pt-BR')}`]
];
```

**No Word:**
```javascript
// Adicionar nova linha na tabela
flightRows.push(
  new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ text: 'Novo Campo', bold: true })] }),
      new TableCell({ children: [new Paragraph(quote.flight.novoCampo)] })
    ]
  })
);
```

### Para mudar cores:

**PDF:**
```javascript
// Cores principais
const primaryColor = isInternal ? [16, 185, 129] : [251, 191, 36]; // RGB
doc.setFillColor(...primaryColor);
```

**Word:**
```javascript
// Use propriedades de estilo do docx
new Paragraph({
  text: 'Texto',
  color: '3B82F6', // Hexadecimal sem #
  bold: true
})
```

---

## 📚 Referências

- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- [docx Documentation](https://docx.js.org/)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/)

---

## 🐛 Troubleshooting

### Problema: PDF não baixa
**Solução:** Verificar se `jspdf` e `jspdf-autotable` estão importados corretamente

### Problema: Word gera arquivo vazio
**Solução:** Verificar se todos os campos obrigatórios do `quote` estão preenchidos

### Problema: Formatação quebrada
**Solução:** Verificar se os valores numéricos estão no formato correto (Number, não String)

### Problema: Caracteres especiais não aparecem
**Solução:** jsPDF suporta UTF-8, mas pode precisar de fonte customizada para alguns caracteres

---

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✅ Implementação inicial de geração de PDF
- ✅ Implementação de geração de Word
- ✅ Interface de seleção de formato
- ✅ Suporte a orçamentos cliente e interno
- ✅ Documentação completa

---

**Desenvolvido por:** ClickPassagens Dev Team  
**Data:** Janeiro 2024  
**Versão:** 1.0.0
