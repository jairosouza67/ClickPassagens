# 📐 Documentação de Design - ClickPassagens

Este repositório contém a documentação completa de design de todas as telas do projeto ClickPassagens.

## 📁 Arquivos

- **DESIGN_SCREENS.md**: Documentação completa com todas as 12 telas principais do sistema
- **convert_to_pdf.sh**: Script para converter a documentação para PDF/PowerPoint
- **output/**: Pasta com os arquivos convertidos (PDF, PPTX, HTML)

## 🎨 Conteúdo da Documentação

A documentação inclui especificações detalhadas para:

### Telas Principais (12 telas)
1. **Home/Landing Page** - Página inicial com hero section
2. **Busca de Passagens** - Formulário de busca avançada
3. **Resultados da Busca** - Listagem de voos com comparação de preços
4. **Planos e Preços** - Apresentação dos 4 planos disponíveis
5. **Contato e Suporte** - Canais de atendimento e FAQ
6. **Login e Cadastro** - Autenticação de usuários
7. **Dashboard do Usuário** - Painel do usuário comum
8. **Painel do Agente** - Interface para agentes de viagem
9. **Painel Administrativo** - Sistema de administração completo
10. **Orçamento Personalizado** - Editor de orçamentos com marca própria
11. **Programa de Indicações** - Sistema de afiliados e referências
12. **Histórico e Cashback** - Transações e programa de recompensas

### Elementos de Design
- 🎨 Paleta de cores completa (cores primárias, secundárias, gradientes)
- 📝 Especificações tipográficas
- 🧩 Componentes globais (Header, Footer, Botões, Cards, Inputs)
- 📱 Guia de responsividade (Mobile, Tablet, Desktop)
- 🎬 Animações e transições
- 💡 Estados e feedback (Loading, Success, Error, Empty)
- 🔄 Fluxos de usuário completos

## 🚀 Como Usar

### Método 1: Visualizar no GitHub
Simplesmente abra o arquivo `DESIGN_SCREENS.md` no GitHub para visualizar toda a documentação formatada.

### Método 2: Converter para PDF (Linux/Mac)

```bash
# Dar permissão de execução ao script
chmod +x convert_to_pdf.sh

# Executar o script
./convert_to_pdf.sh
```

Os arquivos serão gerados na pasta `output/`:
- `ClickPassagens_Design_Screens.pdf`
- `ClickPassagens_Design_Screens.pptx`
- `ClickPassagens_Design_Screens.html`

### Método 3: Ferramentas Online

#### Para PDF:
1. **Markdown to PDF**: https://www.markdowntopdf.com/
2. **Dillinger**: https://dillinger.io/ (copie o conteúdo e exporte)
3. **StackEdit**: https://stackedit.io/

#### Para PowerPoint:
1. **Pandoc Online**: https://pandoc.org/try/
2. Copie o conteúdo de DESIGN_SCREENS.md
3. Selecione formato de saída: `.pptx`
4. Clique em "Convert"

### Método 4: VS Code

1. Instale a extensão "Markdown PDF"
2. Abra `DESIGN_SCREENS.md` no VS Code
3. Pressione `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (Mac)
4. Digite "Markdown PDF: Export (pdf)"
5. Selecione o formato desejado

### Método 5: Notion

1. Crie uma nova página no Notion
2. Importe o arquivo `DESIGN_SCREENS.md`
3. Clique em "..." no canto superior direito
4. Selecione "Export" → "PDF" ou "Export" → "Markdown & CSV"

## 📦 Requisitos para Conversão Local

Para usar o script `convert_to_pdf.sh`, você precisa ter instalado:

### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install pandoc wkhtmltopdf
```

### macOS:
```bash
brew install pandoc
brew install --cask wkhtmltopdf
```

### Windows:
1. Baixe o Pandoc: https://pandoc.org/installing.html
2. Baixe o wkhtmltopdf: https://wkhtmltopdf.org/downloads.html

## 🎯 Estrutura do Documento

```
DESIGN_SCREENS.md
├── 📋 Índice
├── 🎯 Visão Geral do Projeto
├── 🎨 Paleta de Cores e Identidade Visual
├── 📱 Telas do Sistema (12 telas detalhadas)
│   ├── Layout em ASCII art
│   ├── Elementos visuais
│   ├── Funcionalidades
│   └── Animações
├── 🧩 Componentes Globais
├── 📱 Responsividade
├── 🎬 Animações e Transições
├── 🎨 Estados e Feedback
└── 🔄 Fluxos de Usuário
```

## 💡 Dicas para Apresentação

### Para PowerPoint/Apresentação:
1. Cada seção principal pode ser um slide separado
2. Use as imagens ASCII como referência para criar mockups visuais
3. Adicione screenshots do site atual (https://clickpassagens.me/)
4. Inclua exemplos de cores e tipografia em slides visuais
5. Crie protótipos interativos no Figma baseado nas especificações

### Para Documentação:
1. O PDF é ideal para compartilhar com desenvolvedores
2. O HTML pode ser hospedado para referência online
3. O Markdown original permite fácil edição e versionamento

## 🛠️ Criando Mockups Visuais

Com base nesta documentação, você pode criar mockups visuais usando:

1. **Figma** (Recomendado): https://figma.com
   - Importe as especificações de cores
   - Use os layouts ASCII como guia
   - Crie componentes reutilizáveis

2. **Adobe XD**: https://www.adobe.com/products/xd.html

3. **Sketch**: https://www.sketch.com/

4. **Penpot** (Open Source): https://penpot.app/

## 📊 Próximos Passos

1. ✅ Revisar toda a documentação
2. ⬜ Criar mockups de alta fidelidade no Figma
3. ⬜ Capturar screenshots do site atual
4. ⬜ Criar protótipo interativo
5. ⬜ Validar design com stakeholders
6. ⬜ Implementar as melhorias no código

## 📞 Suporte

Para dúvidas ou sugestões sobre a documentação:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

## 📄 Licença

Este documento faz parte do projeto ClickPassagens.

---

**Última atualização**: 2024  
**Versão**: 2.0

🚀 **ClickPassagens - Voe mais, gaste menos!** ✈️
