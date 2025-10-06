# Deploy ClickPassagens - Guia Completo

## 🌐 Arquitetura para Produção

### Frontend (Netlify)
- Site estático React
- Deploy automático via Git
- CDN global

### Backend (Heroku/Railway/Render)  
- API Flask separada
- Banco de dados PostgreSQL
- APIs de voos reais

## 🚀 Deploy Frontend no Netlify

### 1. Preparar Build de Produção

Criar `vite.config.js` otimizado:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-select']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
```

### 2. Configurar Variáveis de Ambiente

Criar `.env.production`:
```env
VITE_API_BASE_URL=https://sua-api.herokuapp.com/api
VITE_APP_MODE=production
```

### 3. Build Script
```bash
npm run build
```

### 4. Netlify Configuration

Criar `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

## 🔧 Deploy Backend (Heroku)

### 1. Preparar Backend

Criar `Procfile`:
```
web: gunicorn main:app
```

Atualizar `requirements.txt`:
```txt
gunicorn==21.2.0
psycopg2-binary==2.9.7
# ... outras dependências
```

### 2. Configurar PostgreSQL
```python
# main.py
import os
from urllib.parse import urlparse

if os.environ.get('DATABASE_URL'):
    # Produção (Heroku)
    url = urlparse(os.environ['DATABASE_URL'])
    app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{url.username}:{url.password}@{url.hostname}:{url.port}{url.path}"
else:
    # Desenvolvimento
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/app.db'
```

### 3. Deploy Commands
```bash
# Instalar Heroku CLI
# Fazer login: heroku login
heroku create clickpassagens-api
heroku addons:create heroku-postgresql:mini
git push heroku main
```

## 🛡️ Opção 2: Backend Serverless (Vercel)

Se preferir tudo em um lugar, usar Vercel Functions:

Criar `api/busca.py`:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/busca/buscar', methods=['POST'])
def buscar_voos():
    # Lógica da busca aqui
    return jsonify({'success': True, 'data': []})

# Para Vercel
if __name__ == '__main__':
    app.run()
```

Criar `vercel.json`:
```json
{
  "functions": {
    "api/*.py": {
      "runtime": "python3.9"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 📱 Opção 3: Full Static (Dados Mock)

Para demo rápida, usar apenas dados estáticos:

Criar `src/data/flights.json`:
```json
{
  "flights": [
    {
      "companhia": {"nome": "Gol", "codigo": "G3"},
      "origem": "GRU",
      "destino": "GIG",
      "preco_dinheiro": 350,
      "milhas_necessarias": 15750
    }
  ]
}
```

Atualizar `BuscaIntegrada.jsx`:
```javascript
import flightsData from '../data/flights.json'

const realizarBusca = async () => {
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const resultados = flightsData.flights.filter(flight => 
    flight.origem === searchData.origem && 
    flight.destino === searchData.destino
  )
  
  setResultados(resultados)
  onBuscaCompleta?.(resultados)
}
```

## 🎯 Recomendação Final

Para o Netlify, recomendo:

1. **Deploy rápido**: Usar Opção 3 (dados estáticos) para demonstração
2. **Deploy profissional**: Usar Opção 1 (Backend no Heroku)
3. **Deploy full-stack**: Usar Opção 2 (Vercel com serverless)

## 📋 Próximos Passos

Qual opção prefere? Posso configurar automaticamente:
- [ ] Demo rápida (só frontend + dados estáticos)
- [ ] Profissional (frontend Netlify + backend Heroku)  
- [ ] Full-stack (tudo no Vercel)