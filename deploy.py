#!/usr/bin/env python3
"""
Script de deploy para produção da aplicação ClickPassagens
Configura a aplicação para rodar em produção usando Gunicorn
"""

import os
import sys
import subprocess
from pathlib import Path

def install_production_dependencies():
    """Instala dependências de produção"""
    print("🔧 Instalando dependências de produção...")
    
    production_packages = [
        "gunicorn==21.2.0",
        "python-dotenv==1.0.0"
    ]
    
    for package in production_packages:
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
            print(f"✅ {package} instalado com sucesso")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao instalar {package}: {e}")
            return False
    
    return True

def create_production_config():
    """Cria arquivo de configuração de produção"""
    print("⚙️ Criando configuração de produção...")
    
    env_content = """# Configuração de Produção - ClickPassagens
FLASK_ENV=production
SECRET_KEY=clickpassagens_production_secret_key_change_in_production
DATABASE_URL=sqlite:///database/app.db
HOST=0.0.0.0
PORT=5001
WORKERS=4
"""
    
    with open(".env", "w", encoding="utf-8") as f:
        f.write(env_content)
    
    print("✅ Arquivo .env criado")

def create_gunicorn_config():
    """Cria configuração do Gunicorn"""
    print("🚀 Criando configuração do Gunicorn...")
    
    gunicorn_config = """# Gunicorn configuration file
import multiprocessing
import os

# Server socket
bind = f"{os.getenv('HOST', '0.0.0.0')}:{os.getenv('PORT', '5001')}"
backlog = 2048

# Worker processes
workers = int(os.getenv('WORKERS', multiprocessing.cpu_count() * 2 + 1))
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 60

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 100

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Logging
accesslog = 'logs/access.log'
errorlog = 'logs/error.log'
loglevel = 'info'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = 'clickpassagens'

# Server mechanics
daemon = False
pidfile = 'logs/gunicorn.pid'
user = None
group = None
tmp_upload_dir = None

# SSL (uncomment for HTTPS)
# keyfile = 'path/to/keyfile'
# certfile = 'path/to/certfile'
"""
    
    with open("gunicorn.conf.py", "w", encoding="utf-8") as f:
        f.write(gunicorn_config)
    
    print("✅ Configuração do Gunicorn criada")

def create_logs_directory():
    """Cria diretório de logs"""
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)
    print("✅ Diretório de logs criado")

def create_startup_script():
    """Cria script de inicialização"""
    print("📜 Criando script de inicialização...")
    
    # Script para Windows
    windows_script = """@echo off
echo Starting ClickPassagens Production Server...
echo.

REM Ativar ambiente virtual
call .venv\\Scripts\\activate.bat

REM Inicializar banco de dados se necessário
python init_db.py

REM Iniciar servidor Gunicorn
echo Starting Gunicorn with production configuration...
gunicorn --config gunicorn.conf.py main:app

pause
"""
    
    with open("start_production.bat", "w", encoding="utf-8") as f:
        f.write(windows_script)
    
    # Script para Linux/Mac
    linux_script = """#!/bin/bash
echo "Starting ClickPassagens Production Server..."
echo

# Ativar ambiente virtual
source .venv/bin/activate

# Inicializar banco de dados se necessário
python init_db.py

# Iniciar servidor Gunicorn
echo "Starting Gunicorn with production configuration..."
gunicorn --config gunicorn.conf.py main:app
"""
    
    with open("start_production.sh", "w", encoding="utf-8") as f:
        f.write(linux_script)
    
    # Tornar executável no Linux/Mac
    os.chmod("start_production.sh", 0o755)
    
    print("✅ Scripts de inicialização criados")

def create_systemd_service():
    """Cria arquivo de serviço systemd para Linux"""
    print("🐧 Criando serviço systemd...")
    
    current_dir = os.getcwd()
    service_content = f"""[Unit]
Description=ClickPassagens Production Server
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
RuntimeDirectory=clickpassagens
WorkingDirectory={current_dir}
Environment=PATH={current_dir}/.venv/bin
ExecStart={current_dir}/.venv/bin/gunicorn --config gunicorn.conf.py main:app
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
"""
    
    with open("clickpassagens.service", "w", encoding="utf-8") as f:
        f.write(service_content)
    
    print("✅ Arquivo de serviço systemd criado")
    print("   Para instalar: sudo cp clickpassagens.service /etc/systemd/system/")
    print("   Para ativar: sudo systemctl enable clickpassagens")
    print("   Para iniciar: sudo systemctl start clickpassagens")

def create_nginx_config():
    """Cria configuração do Nginx"""
    print("🌐 Criando configuração do Nginx...")
    
    nginx_config = """# Configuração Nginx para ClickPassagens
server {
    listen 80;
    server_name clickpassagens.com www.clickpassagens.com;
    
    # Redirect to HTTPS (uncomment for production)
    # return 301 https://$server_name$request_uri;
    
    # Location for Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Proxy to Gunicorn
    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files
    location /static/ {
        alias /path/to/clickpassagens/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Logs
    access_log /var/log/nginx/clickpassagens_access.log;
    error_log /var/log/nginx/clickpassagens_error.log;
}

# HTTPS configuration (uncomment for production)
# server {
#     listen 443 ssl http2;
#     server_name clickpassagens.com www.clickpassagens.com;
# 
#     ssl_certificate /etc/letsencrypt/live/clickpassagens.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/clickpassagens.com/privkey.pem;
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
#     ssl_prefer_server_ciphers off;
# 
#     location / {
#         proxy_pass http://127.0.0.1:5001;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#     }
# }
"""
    
    with open("nginx_clickpassagens.conf", "w", encoding="utf-8") as f:
        f.write(nginx_config)
    
    print("✅ Configuração do Nginx criada")

def create_docker_files():
    """Cria arquivos Docker"""
    print("🐳 Criando arquivos Docker...")
    
    # Dockerfile
    dockerfile = """FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn==21.2.0

# Copy application code
COPY . .

# Create non-root user
RUN groupadd -r clickpassagens && useradd -r -g clickpassagens clickpassagens
RUN chown -R clickpassagens:clickpassagens /app
USER clickpassagens

# Initialize database
RUN python init_db.py

# Expose port
EXPOSE 5001

# Run the application
CMD ["gunicorn", "--config", "gunicorn.conf.py", "main:app"]
"""
    
    with open("Dockerfile", "w", encoding="utf-8") as f:
        f.write(dockerfile)
    
    # Docker Compose
    docker_compose = """version: '3.8'

services:
  clickpassagens:
    build: .
    ports:
      - "5001:5001"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=clickpassagens_production_secret_key_change_in_production
    volumes:
      - ./database:/app/database
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/api/busca/companhias"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx_clickpassagens.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - clickpassagens
    restart: unless-stopped
"""
    
    with open("docker-compose.yml", "w", encoding="utf-8") as f:
        f.write(docker_compose)
    
    print("✅ Arquivos Docker criados")

def main():
    """Função principal do deploy"""
    print("🚀 DEPLOY CLICKPASSAGENS - CONFIGURAÇÃO DE PRODUÇÃO")
    print("=" * 50)
    
    try:
        # Executar todas as etapas
        if not install_production_dependencies():
            return False
        
        create_production_config()
        create_gunicorn_config()
        create_logs_directory()
        create_startup_script()
        create_systemd_service()
        create_nginx_config()
        create_docker_files()
        
        print("\n" + "=" * 50)
        print("✅ DEPLOY CONFIGURADO COM SUCESSO!")
        print("=" * 50)
        
        print("\n📋 PRÓXIMOS PASSOS:")
        print("1. Para iniciar em desenvolvimento:")
        print("   python main.py")
        print("\n2. Para iniciar em produção (Windows):")
        print("   start_production.bat")
        print("\n3. Para iniciar em produção (Linux/Mac):")
        print("   ./start_production.sh")
        print("\n4. Para deploy com Docker:")
        print("   docker-compose up -d")
        print("\n5. Para deploy em servidor Linux:")
        print("   - Instalar nginx")
        print("   - Copiar nginx_clickpassagens.conf para /etc/nginx/sites-available/")
        print("   - Ativar o serviço systemd")
        
        print("\n🌐 A aplicação estará disponível em:")
        print("   http://localhost:5001 (desenvolvimento)")
        print("   http://seu-dominio.com (produção)")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro durante o deploy: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)