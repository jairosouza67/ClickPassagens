#!/bin/bash
echo "Starting ClickPassagens Production Server..."
echo

# Ativar ambiente virtual
source .venv/bin/activate

# Inicializar banco de dados se necessário
python init_db.py

# Iniciar servidor Gunicorn
echo "Starting Gunicorn with production configuration..."
gunicorn --config gunicorn.conf.py main:app
