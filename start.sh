#!/bin/bash
# Script de inicialização otimizado para Render Free Tier (512MB RAM)

set -e  # Para na primeira falha

echo "🚀 Iniciando ClickPassagens (Render Free Tier)..."

# Criar diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p database

# Inicializar banco de dados (simples, sem logs excessivos)
echo "📦 Inicializando banco..."
python init_db.py 2>/dev/null || echo "⚠️  Banco já inicializado ou erro não crítico"

# Iniciar servidor Gunicorn com configuração otimizada para pouca RAM
echo "🌐 Iniciando servidor (1 worker, 4 threads)..."
exec gunicorn --config gunicorn.conf.py main:app
