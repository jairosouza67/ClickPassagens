#!/bin/bash
# Script de inicialização para Render.com
# Este script garante que o banco de dados seja inicializado antes de iniciar o servidor

set -e  # Para na primeira falha

echo "🚀 Iniciando ClickPassagens..."

# Criar diretório de database se não existir
echo "📁 Criando diretórios..."
mkdir -p database
mkdir -p logs

# Verificar Python
echo "🐍 Verificando Python..."
python --version || python3 --version

# Inicializar banco de dados se necessário
echo "📦 Inicializando banco de dados..."
if [ -f "init_db.py" ]; then
    python init_db.py || python3 init_db.py || echo "⚠️  Aviso: Não foi possível inicializar o banco, mas continuando..."
else
    echo "⚠️  init_db.py não encontrado, pulando inicialização do banco"
fi

# Verificar se o Gunicorn está instalado
echo "🔍 Verificando Gunicorn..."
which gunicorn || pip install gunicorn

# Iniciar servidor Gunicorn
echo "🌐 Iniciando servidor Gunicorn..."
exec gunicorn --config gunicorn.conf.py main:app
