# 🔧 FIX: Erro "doc.autoTable is not a function"

## 🐛 PROBLEMA

```
Erro ao gerar PDF: doc.autoTable is not a function
```

Este erro aparece ao tentar gerar PDF de orçamentos no sistema.

---

## 🔍 CAUSA

### Importação Incorreta:

```javascript
// ❌ ANTES (ERRADO):
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // ← Side-effect import não funciona em todas versões
```

Com a versão 3.x do jsPDF e versão 5.x do jspdf-autotable, o método `autoTable` não fica disponível automaticamente em `doc.autoTable()`.

---

## ✅ SOLUÇÃO

### 1. Importação Correta:

```javascript
// ✅ DEPOIS (CORRETO):
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';  // ← Named import
```

### 2. Uso Correto:

```javascript
// ❌ ANTES (ERRADO):
doc.autoTable({
  startY: yPos,
  body: data,
  // ...
});

// ✅ DEPOIS (CORRETO):
autoTable(doc, {
  startY: yPos,
  body: data,
  // ...
});
```

### 3. Acesso ao lastAutoTable:

```javascript
// Proteção para evitar erros se autoTable falhar:
yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 60;
```

---

## 📝 ALTERAÇÕES APLICADAS

### Arquivo: `src/services/documentGenerator.js`

#### Linha 1-2 (Import):
```javascript
// ANTES:
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// DEPOIS:
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
```

#### Linha ~85 (Tabela de Informações do Voo):
```javascript
// ANTES:
doc.autoTable({
  startY: yPos,
  body: flightData,
  // ...
});
yPos = doc.lastAutoTable.finalY + 10;

// DEPOIS:
autoTable(doc, {
  startY: yPos,
  body: flightData,
  // ...
});
yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 60;
```

#### Linha ~117 (Tabela de Pricing Interno):
```javascript
// ANTES:
doc.autoTable({
  startY: yPos,
  body: pricingData,
  // ...
});
yPos = doc.lastAutoTable.finalY + 5;

// DEPOIS:
autoTable(doc, {
  startY: yPos,
  body: pricingData,
  // ...
});
yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : yPos + 40;
```

#### Linha ~155 (Tabela de Milhas):
```javascript
// ANTES:
doc.autoTable({
  startY: yPos,
  body: milesData,
  // ...
});
yPos = doc.lastAutoTable.finalY + 8;

// DEPOIS:
autoTable(doc, {
  startY: yPos,
  body: milesData,
  // ...
});
yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : yPos + 40;
```

#### Linha ~185 (Tabela de Pricing Cliente):
```javascript
// ANTES:
doc.autoTable({
  startY: yPos,
  body: pricingData,
  // ...
});
yPos = doc.lastAutoTable.finalY + 5;

// DEPOIS:
autoTable(doc, {
  startY: yPos,
  body: pricingData,
  // ...
});
yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : yPos + 30;
```

---

## 🧪 COMO TESTAR

### 1. Reiniciar o Dev Server

```powershell
# Se o frontend estiver rodando, pare com Ctrl+C e reinicie:
npm run dev
```

### 2. Testar Geração de PDF

1. Acessar: http://localhost:5176
2. Fazer uma busca de voo
3. Selecionar um voo
4. Clicar em "Gerar Orçamento"
5. Escolher tipo (Cliente ou Interno)
6. Clicar em "Gerar PDF"

**Resultado Esperado:**
```
✅ PDF baixado com sucesso
✅ Nome: orcamento-client-[timestamp].pdf ou orcamento-internal-[timestamp].pdf
✅ Conteúdo: Tabelas formatadas corretamente
```

### 3. Verificar no Console

Abrir DevTools (F12) → Console

**Deve mostrar:**
```
generatePDF chamado: {...}
Salvando PDF: orcamento-client-1234567890.pdf
PDF gerado com sucesso!
```

**NÃO deve mostrar:**
```
❌ Erro ao gerar PDF: doc.autoTable is not a function
```

---

## 📊 VERSÕES DAS BIBLIOTECAS

Verificar em `package.json`:

```json
{
  "dependencies": {
    "jspdf": "^3.0.3",           // ← Versão 3.x
    "jspdf-autotable": "^5.0.2"  // ← Versão 5.x
  }
}
```

**Compatibilidade:**
- ✅ jsPDF 3.x + jspdf-autotable 5.x = Named import (`autoTable`)
- ❌ jsPDF 2.x + jspdf-autotable 3.x = Side-effect import (`import 'jspdf-autotable'`)

---

## 🔄 ALTERNATIVA (Se o problema persistir)

Se mesmo após as correções o erro continuar, pode ser cache do navegador ou do Vite:

### Opção 1: Limpar Cache do Vite

```powershell
# Parar o dev server (Ctrl+C)
Remove-Item -Recurse -Force node_modules/.vite
npm run dev
```

### Opção 2: Reinstalar Dependências

```powershell
# Parar o dev server (Ctrl+C)
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Opção 3: Limpar Cache do Navegador

```
1. Abrir DevTools (F12)
2. Clicar com botão direito no botão "Reload"
3. Escolher "Empty Cache and Hard Reload"
```

---

## 📚 DOCUMENTAÇÃO OFICIAL

### jsPDF:
https://github.com/parallax/jsPDF

### jspdf-autotable:
https://github.com/simonbengtsson/jsPDF-AutoTable

**Exemplo de uso correto (v5.x):**
```javascript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const doc = new jsPDF();

autoTable(doc, {
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain'],
  ],
});

doc.save('table.pdf');
```

---

## ✅ RESULTADO

### ANTES:
```
Usuário clica em "Gerar PDF"
   ↓
❌ Erro: doc.autoTable is not a function
   ↓
PDF não é gerado
```

### DEPOIS:
```
Usuário clica em "Gerar PDF"
   ↓
✅ autoTable(doc, {...}) funciona corretamente
   ↓
✅ PDF gerado com tabelas formatadas
   ↓
✅ Download automático do arquivo
```

---

## 🎯 CHECKLIST DE VALIDAÇÃO

Após aplicar as correções:

- [x] Import alterado: `import autoTable from 'jspdf-autotable'`
- [x] Todas chamadas `doc.autoTable()` → `autoTable(doc, ...)`
- [x] Proteção `doc.lastAutoTable ? ... : fallback` adicionada
- [ ] Dev server reiniciado
- [ ] Teste de geração de PDF realizado
- [ ] PDF baixado com sucesso
- [ ] Tabelas aparecendo corretamente no PDF

---

**Status:** ✅ CORRIGIDO  
**Data:** 05/10/2025  
**Arquivo:** `src/services/documentGenerator.js`  
**Teste:** Pendente (reinicie o dev server para testar)
