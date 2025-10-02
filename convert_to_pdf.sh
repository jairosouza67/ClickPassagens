#!/bin/bash

# Script para converter DESIGN_SCREENS.md para PDF e PowerPoint
# Requer: pandoc, wkhtmltopdf

echo "🎨 ClickPassagens - Conversor de Documentação de Design"
echo "======================================================="
echo ""

# Verificar se pandoc está instalado
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc não encontrado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y pandoc
fi

# Criar diretório de saída se não existir
mkdir -p output

echo "📄 Convertendo para PDF..."
pandoc DESIGN_SCREENS.md -o output/ClickPassagens_Design_Screens.pdf \
    --pdf-engine=wkhtmltopdf \
    --toc \
    --toc-depth=2 \
    -V geometry:margin=1in \
    -V colorlinks=true \
    -V linkcolor=blue \
    -V urlcolor=blue \
    2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ PDF gerado: output/ClickPassagens_Design_Screens.pdf"
else
    echo "⚠️  Não foi possível gerar PDF com wkhtmltopdf. Tentando método alternativo..."
    pandoc DESIGN_SCREENS.md -o output/ClickPassagens_Design_Screens.pdf \
        --toc \
        --toc-depth=2 \
        -V geometry:margin=1in \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ PDF gerado com método alternativo: output/ClickPassagens_Design_Screens.pdf"
    else
        echo "❌ Não foi possível gerar PDF. Tente instalar wkhtmltopdf ou usar ferramentas online."
    fi
fi

echo ""
echo "📊 Convertendo para PowerPoint..."
pandoc DESIGN_SCREENS.md -o output/ClickPassagens_Design_Screens.pptx \
    --slide-level=3 \
    2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ PowerPoint gerado: output/ClickPassagens_Design_Screens.pptx"
else
    echo "❌ Não foi possível gerar PowerPoint. Verifique se pandoc está instalado corretamente."
fi

echo ""
echo "📝 Convertendo para HTML..."
pandoc DESIGN_SCREENS.md -o output/ClickPassagens_Design_Screens.html \
    --standalone \
    --toc \
    --toc-depth=2 \
    --css=https://cdn.jsdelivr.net/npm/water.css@2/out/water.css \
    2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ HTML gerado: output/ClickPassagens_Design_Screens.html"
fi

echo ""
echo "✨ Conversão concluída!"
echo ""
echo "Arquivos gerados na pasta 'output/':"
ls -lh output/ 2>/dev/null || echo "Nenhum arquivo gerado."
echo ""
echo "📚 Métodos alternativos de conversão:"
echo "1. Online: https://www.markdowntopdf.com/"
echo "2. Online: https://dillinger.io/ (export para PDF)"
echo "3. VS Code: Instale a extensão 'Markdown PDF'"
echo "4. Notion: Importe o arquivo .md e exporte como PDF"
echo ""
