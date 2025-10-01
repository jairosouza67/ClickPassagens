# Gunicorn configuration file
import multiprocessing
import os

# Server socket
bind = f"{os.getenv('HOST', '0.0.0.0')}:{os.getenv('PORT', '5001')}"
backlog = 2048

# Worker processes - OTIMIZADO PARA RENDER FREE (512MB RAM)
# Render free tem apenas 512MB, então usamos 1 worker com threads
workers = int(os.getenv('WORKERS', 1))  # Apenas 1 worker para economizar RAM
worker_class = 'gthread'  # Usar threads ao invés de processos
threads = int(os.getenv('THREADS', 4))  # 4 threads por worker
worker_connections = 1000
timeout = 120  # Aumentado para 120s (Render pode ser lento no free tier)
keepalive = 60

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 100

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Logging - Use stdout/stderr for cloud platforms (Render, Heroku, etc)
# Em produção cloud, logs vão para o console e são capturados pelo serviço
accesslog = '-'  # stdout
errorlog = '-'   # stderr
loglevel = 'info'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = 'clickpassagens'

# Server mechanics
daemon = False
pidfile = None  # Não usar pidfile em ambientes cloud
user = None
group = None
tmp_upload_dir = None

# SSL (uncomment for HTTPS)
# keyfile = 'path/to/keyfile'
# certfile = 'path/to/certfile'
