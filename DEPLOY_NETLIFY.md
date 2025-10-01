# 🚀 Deploy Rápido - Netlify + Render (100% Grátis)

## 🎯 Estratégia:
- **Frontend (React):** Netlify
- **Backend (Flask):** Render
- **Domínio:** clickpassagens.me (Namecheap)

**Tempo estimado:** 15-20 minutos ⏱️

---

## 📦 **PARTE 1: Preparar o Projeto**

### 1️⃣ **Separar Frontend e Backend (Importante!)**

Vamos configurar para fazer build correto do frontend:

#### Criar arquivo de configuração do Netlify:

Crie `netlify.toml` na raiz do projeto:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://clickpassagens-api.onrender.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Atualizar `.gitignore`:
```gitignore
# Python
.venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
ENV/
database/*.db

# Node
node_modules/
dist/
.env
.env.local

# IDEs
.vscode/
.idea/
*.swp
*.swo
```

---

## 🌐 **PARTE 2: Deploy do Backend (Render)**

### 2️⃣ **Criar conta no Render**

1. Acesse: https://render.com
2. Clique em **"Get Started for Free"**
3. Conecte com GitHub

### 3️⃣ **Criar Web Service**

1. No dashboard, clique **"New +"** → **"Web Service"**
2. Conecte seu repositório: `ClickPassagens`
3. Configure:

**Settings:**
```
Name: clickpassagens-api
Region: Oregon (US West) - mais próximo
Branch: master
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn -c gunicorn.conf.py main:app
```

**Environment Variables:**
```
FLASK_ENV=production
SECRET_KEY=sua_chave_secreta_aqui_123456
PYTHON_VERSION=3.11.0
```

4. Clique **"Create Web Service"**
5. Aguarde o deploy (~2-3 minutos)
6. **Copie a URL** (será algo como: `https://clickpassagens-api.onrender.com`)

### ⚠️ **Importante: Atualizar gunicorn.conf.py para Render**

O Render usa a porta dinâmica via variável de ambiente:

```python
# gunicorn.conf.py
import os

# Render define a porta via $PORT
bind = f"0.0.0.0:{os.environ.get('PORT', '5001')}"
workers = 2
threads = 4
worker_class = 'sync'
timeout = 120
```

---

## 🎨 **PARTE 3: Deploy do Frontend (Netlify)**

### 4️⃣ **Criar conta no Netlify**

1. Acesse: https://app.netlify.com/signup
2. Conecte com GitHub

### 5️⃣ **Criar novo site**

1. Clique **"Add new site"** → **"Import an existing project"**
2. Escolha **"Deploy with GitHub"**
3. Selecione o repositório: `ClickPassagens`
4. Configure:

**Build settings:**
```
Base directory: (deixe vazio)
Build command: npm run build
Publish directory: dist
```

5. Clique **"Deploy site"**
6. Aguarde o build (~1-2 minutos)

### 6️⃣ **Atualizar API URL no Frontend**

Vamos criar um arquivo de configuração para apontar para o backend no Render:

Crie `src/config.js`:
```javascript
// Configuração da API
const API_URL = import.meta.env.PROD 
  ? 'https://clickpassagens-api.onrender.com'
  : 'http://localhost:5001';

export { API_URL };
```

Agora atualize `src/components/BuscaIntegrada.jsx` para usar essa configuração:

```javascript
import { API_URL } from '../config';

// No fetch, substitua a URL:
const response = await fetch(`${API_URL}/api/busca/buscar`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(searchData)
});
```

**Commit e push:**
```bash
git add .
git commit -m "Configure API URL for production"
git push origin master
```

Netlify fará redeploy automático!

---

## 🌍 **PARTE 4: Configurar Domínio .me**

### 7️⃣ **No Netlify:**

1. Vá em **"Domain settings"** do seu site
2. Clique **"Add custom domain"**
3. Digite: `clickpassagens.me`
4. Clique **"Verify"**
5. Netlify mostrará os **DNS records** necessários

### 8️⃣ **No Namecheap:**

1. Faça login no Namecheap
2. Vá em **"Domain List"** → **"Manage"** (clickpassagens.me)
3. Em **"Advanced DNS"**, adicione:

**OPÇÃO A - Netlify DNS (Recomendado):**
```
Type: NETLIFY (alias record)
Host: @
Value: [seu-site].netlify.app
TTL: Automatic
```

**OPÇÃO B - DNS Tradicional:**
```
Type: A Record
Host: @
Value: 75.2.60.5
TTL: Automatic

Type: CNAME
Host: www
Value: [seu-site].netlify.app
TTL: Automatic
```

4. Aguarde propagação (5-30 minutos)

### 9️⃣ **Ativar HTTPS no Netlify:**

1. Volte no Netlify → **"Domain settings"**
2. Clique **"Verify DNS configuration"**
3. Aguarde ~1 minuto
4. HTTPS será ativado automaticamente! 🔒

---

## 🔄 **PARTE 5: Atualizações Futuras (Automáticas!)**

### Como funciona:

1. **Faz alteração no código**
2. **Commit e push no GitHub:**
   ```bash
   git add .
   git commit -m "Sua mensagem"
   git push origin master
   ```
3. **Netlify e Render fazem deploy automaticamente!** 🎉

Não precisa fazer nada além do push!

---

## ✅ **Checklist de Deploy:**

### Backend (Render):
- [ ] Conta Render criada
- [ ] Web Service configurado
- [ ] Environment variables definidas
- [ ] Deploy concluído
- [ ] URL da API anotada

### Frontend (Netlify):
- [ ] Conta Netlify criada
- [ ] Site importado do GitHub
- [ ] Build bem-sucedido
- [ ] `src/config.js` criado
- [ ] API URL configurada

### Domínio:
- [ ] Domínio .me registrado
- [ ] DNS configurado no Namecheap
- [ ] Domínio adicionado no Netlify
- [ ] DNS propagado
- [ ] HTTPS ativo

---

## 🆓 **Limites dos Planos Gratuitos:**

### **Netlify (Free):**
- ✅ 100 GB bandwidth/mês
- ✅ 300 build minutes/mês
- ✅ Deploy ilimitados
- ✅ HTTPS automático
- ✅ CDN global
- **Suficiente para milhares de visitantes!**

### **Render (Free):**
- ✅ 750 horas/mês
- ⚠️ **Dorme após 15 min de inatividade** (primeira requisição leva ~30s)
- ✅ 100 GB bandwidth/mês
- ✅ Deploy automático
- **Ótimo para começar!**

### **💡 Dica:** Se o backend adormecer incomodar, use:
- **Railway.app** (também grátis, não dorme)
- **Ou DigitalOcean** ($6/mês, sempre ativo)

---

## 🔧 **Comandos Úteis:**

### Testar build local:
```bash
npm run build
npm run preview
```

### Ver logs do Render:
- Acesse o dashboard do Render
- Clique no seu serviço
- Vá em **"Logs"**

### Ver logs do Netlify:
- Dashboard → Seu site → **"Deploys"**
- Clique em um deploy para ver logs

---

## 🆘 **Troubleshooting:**

### Frontend não conecta com Backend:
1. Verifique a URL da API no `src/config.js`
2. Certifique-se que o backend está rodando no Render
3. Veja logs do Render para erros

### Backend retorna erro 500:
1. Veja os logs no Render
2. Verifique se `requirements.txt` está completo
3. Teste local antes de fazer deploy

### Domínio não funciona:
1. Aguarde até 48h de propagação DNS
2. Verifique configuração no Namecheap
3. Use https://dnschecker.org para verificar

### Site carrega mas sem dados:
1. Backend pode estar "dormindo" (primeiro acesso lento)
2. Aguarde 30s e recarregue
3. Veja console do navegador (F12) para erros

---

## 🎁 **Bônus: Melhorias Recomendadas**

### 1. **Loading durante wake-up do backend:**

No `BuscaIntegrada.jsx`, adicione mensagem:
```javascript
const [isWakingUp, setIsWakingUp] = useState(false);

// No início do handleSubmit:
setIsWakingUp(true);
setTimeout(() => setIsWakingUp(false), 30000);

// Exibir mensagem se demorar:
{isWakingUp && (
  <div className="text-center text-gray-600">
    ⏳ Ativando servidor... pode levar até 30 segundos
  </div>
)}
```

### 2. **Health check endpoint:**

No `main.py`, adicione:
```python
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})
```

### 3. **Ping automático para manter ativo:**

Use serviços gratuitos como:
- **UptimeRobot** (https://uptimerobot.com)
- **Cron-job.org** (https://cron-job.org)

Configure para fazer ping a cada 10 minutos no endpoint de health.

---

## 📊 **Comparação com Outras Opções:**

| Serviço | Custo | Setup | Auto-deploy | Sempre Ativo |
|---------|-------|-------|-------------|--------------|
| **Netlify + Render** | 🆓 Grátis | ⭐⭐ Fácil | ✅ Sim | ⚠️ Backend dorme |
| **Vercel + Railway** | 🆓 Grátis | ⭐ Muito fácil | ✅ Sim | ✅ Sim |
| **DigitalOcean** | 💰 $6/mês | ⭐⭐⭐ Médio | ❌ Manual | ✅ Sim |
| **Heroku** | 💰 $7/mês | ⭐⭐ Fácil | ✅ Sim | ✅ Sim |

**Para seu caso (momentâneo):** Netlify + Render é perfeito! 🎯

---

## 🚀 **Resultado Final:**

Após seguir este guia:

✅ Site no ar em **clickpassagens.me**  
✅ HTTPS ativado automaticamente  
✅ PWA funcionando perfeitamente  
✅ Deploy automático via Git  
✅ **100% GRÁTIS!**  
✅ Escalável para milhares de usuários  

---

## 📚 **Links Úteis:**

- **Netlify Docs:** https://docs.netlify.com/
- **Render Docs:** https://render.com/docs
- **Namecheap DNS:** https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/

---

**🎉 Pronto para começar? Qualquer dúvida é só chamar!**

**Boa sorte com o deploy! 🚀✈️**
