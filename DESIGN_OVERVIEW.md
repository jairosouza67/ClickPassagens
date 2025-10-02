# 🎨 ClickPassagens - Documentação de Design e Telas

## 📖 Visão Geral

Esta pasta contém a documentação completa de design visual e funcional de todas as telas do sistema ClickPassagens. O documento foi criado para servir como base para apresentações, desenvolvimento e validação com stakeholders.

## 📁 Arquivos Principais

### 1. DESIGN_SCREENS.md (Principal)
**Conteúdo**: Documento completo em Markdown com especificações detalhadas de:
- 12 telas principais do sistema
- Paleta de cores e identidade visual
- Componentes globais (Header, Footer, Buttons, Cards)
- Guia de responsividade
- Animações e transições
- Fluxos de usuário

**Como usar**: Abra no GitHub ou em qualquer visualizador de Markdown

### 2. DESIGN_README.md
**Conteúdo**: Guia de como usar a documentação e converter para diferentes formatos

### 3. convert_to_pdf.sh
**Conteúdo**: Script bash para converter automaticamente a documentação para:
- PDF
- PowerPoint (.pptx)
- HTML

**Como usar**:
```bash
chmod +x convert_to_pdf.sh
./convert_to_pdf.sh
```

### 4. output/ (Pasta gerada)
**Conteúdo**: Arquivos convertidos prontos para apresentação
- `ClickPassagens_Design_Screens.pptx` - Para apresentações
- `ClickPassagens_Design_Screens.html` - Para visualização web
- `ClickPassagens_Design_Screens.pdf` - Para documentação (requer wkhtmltopdf)

## 🎯 Telas Documentadas

1. **Home/Landing Page** - Página de entrada com hero section impactante
2. **Busca de Passagens** - Interface de busca avançada com filtros
3. **Resultados** - Comparação visual de passagens em milhas vs dinheiro
4. **Planos e Preços** - Apresentação dos 4 planos (Free, Básico, Premium, Agente)
5. **Contato e Suporte** - Canais de atendimento e FAQ
6. **Login/Cadastro** - Autenticação com opções sociais (Google, Facebook)
7. **Dashboard Usuário** - Painel com estatísticas e últimas buscas
8. **Painel do Agente** - Interface profissional para agentes de viagem
9. **Painel Admin** - Sistema de administração completo
10. **Orçamento Personalizado** - Editor com marca própria
11. **Programa de Indicações** - Sistema de afiliados e referências
12. **Histórico e Cashback** - Gestão de transações e recompensas

## 🎨 Elementos de Design

### Cores Principais
```
Azul Aviação: #0066CC
Azul Claro: #4A90E2
Dourado: #FFC107
```

### Tipografia
- Fonte: Inter, sans-serif
- Títulos: 600-700 (Semi-bold a Bold)
- Corpo: 400-500 (Regular a Medium)

### Breakpoints
- Mobile: 0-639px
- Tablet: 640px-1023px
- Desktop: 1024px+

## 🚀 Como Apresentar

### Para PowerPoint/Apresentação:
1. Abra `output/ClickPassagens_Design_Screens.pptx`
2. Revise e ajuste os slides conforme necessário
3. Adicione screenshots do site atual (https://clickpassagens.me/)
4. Inclua mockups visuais criados no Figma

### Para Documentação Técnica:
1. Use o arquivo HTML para referência online
2. Compartilhe o PDF com desenvolvedores
3. Mantenha o Markdown original para versionamento

### Para Mockups Visuais:
1. Use Figma, Adobe XD ou Sketch
2. Siga as especificações de cores e tipografia
3. Use os layouts ASCII como referência de estrutura

## 📊 Próximos Passos Recomendados

1. ✅ **Revisão**: Revisar toda a documentação com a equipe
2. ⬜ **Mockups**: Criar mockups de alta fidelidade no Figma
3. ⬜ **Screenshots**: Capturar telas do site atual para comparação
4. ⬜ **Protótipo**: Criar protótipo interativo
5. ⬜ **Validação**: Apresentar para stakeholders
6. ⬜ **Implementação**: Desenvolver melhorias com base no design aprovado

## 🛠️ Ferramentas Recomendadas

### Para Criar Mockups:
- **Figma** (Recomendado): https://figma.com - Gratuito para uso pessoal
- **Penpot** (Open Source): https://penpot.app - Totalmente gratuito
- **Adobe XD**: https://www.adobe.com/products/xd.html

### Para Converter Markdown:
- **Online**: https://www.markdowntopdf.com/
- **Online**: https://dillinger.io/
- **VS Code**: Extensão "Markdown PDF"
- **Notion**: Import e export

## 📞 Informações Adicionais

### Site Atual
- URL: https://clickpassagens.me/
- Use como referência para o estado atual

### Repositório
- GitHub: jairosouza67/ClickPassagens

### Documentação Técnica
- `Arquitetura do Site de Milhas.md` - Arquitetura técnica completa
- `README.md` - Documentação geral do projeto

## ⚡ Atalhos Rápidos

```bash
# Visualizar a documentação
cat DESIGN_SCREENS.md | less

# Converter tudo
./convert_to_pdf.sh

# Abrir HTML no navegador
xdg-open output/ClickPassagens_Design_Screens.html

# Abrir PowerPoint
xdg-open output/ClickPassagens_Design_Screens.pptx
```

## 💡 Dicas

1. **Para Apresentação**: Use o PowerPoint gerado como base e adicione imagens visuais
2. **Para Desenvolvimento**: O Markdown original é a fonte da verdade
3. **Para Validação**: Crie mockups no Figma seguindo as especificações
4. **Para Stakeholders**: Combine PowerPoint + screenshots + mockups Figma

## 📝 Notas

- Todos os layouts usam ASCII art para facilitar o entendimento da estrutura
- As cores são especificadas em hexadecimal
- Os componentes são reutilizáveis entre telas
- O design é mobile-first e completamente responsivo

---

**Criado em**: 2024  
**Versão**: 2.0 - Design Sofisticado e Moderno  
**Última atualização**: Outubro 2024

🚀 **ClickPassagens - Voe mais, gaste menos!** ✈️
