FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
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

# Inicializar banco (como root antes de trocar de usuário)
RUN python init_db.py && chown -R clickpassagens:clickpassagens /app/database

# Trocar para usuário não-root
USER clickpassagens

# Expose port
EXPOSE 5001

# Run the application
CMD ["gunicorn", "--config", "gunicorn.conf.py", "main:app"]
