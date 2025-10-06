# 🎯 COMO TESTAR O DOWNLOAD DE ORÇAMENTOS

## 📝 Status Atual

✅ Bibliotecas instaladas:
- jspdf
- jspdf-autotable  
- docx
- file-saver

✅ Código implementado:
- `src/services/documentGenerator.js` - Gerador de PDF e Word
- `src/components/QuotePage.jsx` - Interface com seletores
- `src/components/TestDocumentGenerator.jsx` - Componente de teste

---

## 🚀 TESTE RÁPIDO (Recomendado)

### Opção 1: Usando o Componente de Teste

1. **Adicione a rota de teste** temporariamente no `App.jsx`:

```jsx
// Adicione o import no topo do arquivo
import TestDocumentGenerator from './components/TestDocumentGenerator.jsx'

// Dentro do return, adicione uma nova aba:
<TabsContent value="teste">
  <TestDocumentGenerator />
</TabsContent>

// E adicione o trigger no TabsList:
<TabsTrigger value="teste">Teste Docs</TabsTrigger>
```

2. **Acesse a aba "Teste Docs"**
3. **Clique nos botões** para testar cada tipo de documento
4. **Verifique o console** (F12) - deve mostrar logs de sucesso
5. **Verifique sua pasta Downloads** - os arquivos devem estar lá

---

## 🔍 TESTE COMPLETO (Usando o Fluxo Real)

### Passo 1: Abrir a Aplicação
```
http://localhost:5173
```

### Passo 2: Ir para "Orçamentos"
- Clique na aba "Orçamentos" no menu

### Passo 3: Preencher o Formulário

**Etapa 1 - Dados da Viagem:**
- Tipo: Ida e Volta
- Origem: São Paulo (GRU)
- Destino: Rio de Janeiro (GIG)  
- Data Ida: Qualquer data futura
- Data Volta: Uma semana depois
- Passageiros: 1
- Classe: Econômica

**Etapa 2 - Seus Dados:**
- Nome: Seu nome
- Email: seu@email.com
- Telefone: (11) 99999-9999

**Etapa 3 - Detalhes:**
- Observações: (opcional)
- Clique em "Próximo"

**Etapa 4 - Confirmação:**
- Clique em "Gerar Orçamentos"
- Aguarde os orçamentos serem gerados

### Passo 4: Testar o Download

**Você verá dois painéis:**

#### Painel Azul (Orçamento Cliente):
1. Veja os seletores de formato: `📄 PDF` | `📝 Word`
2. Clique em **PDF**
3. Clique em **"Baixar PDF"**
4. ✅ O arquivo deve baixar automaticamente
5. Abra o PDF e verifique o conteúdo

6. Volte e clique em **Word**
7. Clique em **"Baixar Word"**
8. ✅ O arquivo .docx deve baixar
9. Abra no Word/LibreOffice e verifique

#### Painel Verde (Orçamento Interno):
1. Repita os mesmos passos acima
2. Verifique que o conteúdo é diferente (análise de lucros)

---

## 🐛 SE NÃO FUNCIONAR

### Checklist de Debugging:

#### 1. Abra o Console do Navegador (F12)

Você deve ver logs como:
```
=== DOWNLOAD QUOTE INICIADO ===
quoteType: "client"
downloadFormat: "pdf"
quote selecionado: {quoteNumber: "...", ...}
Iniciando geração de pdf...
Chamando generatePDF...
generatePDF chamado: {quote: {...}, quoteType: "client"}
Salvando PDF: orcamento-client-XXX.pdf
PDF gerado com sucesso!
=== DOWNLOAD CONCLUÍDO ===
```

#### 2. Verifique Erros Comuns:

**Erro: "Cannot read property 'flight' of undefined"**
```
Causa: O orçamento não foi gerado
Solução: Clique em "Gerar Orçamentos" primeiro
```

**Erro: "generatePDF is not a function"**
```
Causa: Import incorreto
Solução: Verifique se o arquivo documentGenerator.js existe
```

**Erro: "jsPDF is not defined"**
```
Causa: Biblioteca não instalada
Solução: Execute: npm install jspdf jspdf-autotable
```

**Nenhum erro, mas não baixa:**
```
Causa: Bloqueador de pop-ups
Solução: Desabilite bloqueadores de download no navegador
```

#### 3. Teste Manual no Console:

Cole isso no Console do navegador:

```javascript
// Teste 1: Verificar se a função existe
import('./src/services/documentGenerator.js').then(module => {
  console.log('generatePDF existe?', typeof module.generatePDF);
  console.log('generateWord existe?', typeof module.generateWord);
});

// Teste 2: Criar orçamento de teste
const testQuote = {
  quoteNumber: "MANUAL-001",
  flight: {
    airline: "GOL",
    flightNumber: "G3 1234",
    origin: { code: "GRU", name: "São Paulo" },
    destination: { code: "GIG", name: "Rio de Janeiro" },
    departure: { date: "2024-10-10", time: "08:00" },
    duration: "1h 10min",
    stops: "Direto",
    class: "Econômica"
  },
  pricing: {
    flightPrice: 500,
    taxes: { airportTaxes: 100 },
    total: 600
  },
  agency: {
    name: "ClickPassagens",
    phone: "(11) 99999-9999",
    email: "teste@clickpassagens.com"
  },
  validUntil: "2024-10-17"
};

// Teste 3: Gerar PDF
import('./src/services/documentGenerator.js').then(module => {
  module.generatePDF(testQuote, 'client');
});
```

---

## 📊 Verificação de Instalação

Execute no terminal:

```bash
# Verificar se os pacotes estão instalados
npm list jspdf jspdf-autotable docx file-saver
```

Deve mostrar:
```
├── jspdf@2.5.2
├── jspdf-autotable@3.8.4
├── docx@8.5.0
└── file-saver@2.0.5
```

Se não mostrar, instale:
```bash
npm install jspdf jspdf-autotable docx file-saver
```

---

## 📸 Como Deve Parecer

### Interface:

```
┌────────────────────────────────────────┐
│   ORÇAMENTO CLIENTE                    │
├────────────────────────────────────────┤
│   [Dados do voo exibidos aqui]         │
│                                        │
│   ┌─────────────────────────────┐     │
│   │  📄 PDF  │  📝 Word         │     │
│   └─────────────────────────────┘     │
│                                        │
│   [📥 Baixar PDF]  [🖨️ Imprimir]      │
└────────────────────────────────────────┘
```

### Console (F12):
```
=== DOWNLOAD QUOTE INICIADO ===
quoteType: "client"
downloadFormat: "pdf"
generatePDF chamado: {quote: {...}, quoteType: "client"}
Salvando PDF: orcamento-client-QT-20241004-001.pdf
PDF gerado com sucesso!
=== DOWNLOAD CONCLUÍDO ===
```

### Pasta Downloads:
```
Downloads/
  ├── orcamento-client-QT-20241004-001.pdf
  └── orcamento-client-QT-20241004-001.docx
```

---

## ✅ Lista de Verificação Final

Marque cada item após testar:

- [ ] Servidor rodando (`npm run dev`)
- [ ] Página de orçamentos acessível
- [ ] Formulário preenchido completamente
- [ ] Botão "Gerar Orçamentos" clicado
- [ ] Orçamentos gerados (painéis azul e verde visíveis)
- [ ] Seletores PDF/Word funcionando
- [ ] Botão "Baixar PDF" funciona (cliente)
- [ ] Botão "Baixar Word" funciona (cliente)
- [ ] Botão "Baixar PDF" funciona (interno)
- [ ] Botão "Baixar Word" funciona (interno)
- [ ] PDFs abrem corretamente
- [ ] Words abrem corretamente
- [ ] Dados corretos nos documentos
- [ ] Console sem erros críticos

---

## 💡 Dicas Extras

### Atalhos Úteis:
- `F12` - Abrir DevTools
- `Ctrl + Shift + C` - Inspetor de elementos
- `Ctrl + Shift + J` - Console direto
- `Ctrl + J` - Baixar últimos downloads (Chrome)

### Arquivos para Verificar:
1. `src/services/documentGenerator.js` - Geradores
2. `src/components/QuotePage.jsx` - Interface
3. `node_modules/jspdf` - Lib instalada?
4. `node_modules/docx` - Lib instalada?

### Comandos Úteis:
```bash
# Limpar cache e reinstalar
npm cache clean --force
npm install

# Verificar erros de build
npm run build

# Reiniciar servidor
npm run dev
```

---

## 🆘 Ainda Não Funciona?

### Me envie estas informações:

1. **Screenshot do erro** no console
2. **Versão do navegador**: Chrome/Firefox/Edge
3. **Output do comando**: `npm list jspdf docx`
4. **Logs do console** quando clica em "Baixar"

### Informações do Sistema:
```
Sistema: Windows
Node: (versão do seu Node.js)
NPM: (versão do seu NPM)
Navegador: Chrome/Firefox/Edge (versão)
```

---

**Última atualização:** 04/10/2024
**Versão:** 1.0.0
