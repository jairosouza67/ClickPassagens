#!/bin/bash
# Script de inicialização para Render.com
# Este script garante que o banco de dados seja inicializado antes de iniciar o servidor

echo "🚀 Iniciando ClickPassagens..."

# Criar diretório de database se não existir
mkdir -p database

# Inicializar banco de dados se necessário
echo "📦 Verificando banco de dados..."
python init_db.py

# Iniciar servidor Gunicorn
echo "🌐 Iniciando servidor..."
exec gunicorn --config gunicorn.conf.py main:app
