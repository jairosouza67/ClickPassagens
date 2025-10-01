# ⚡ Deploy Rápido - Netlify (5 Passos)

## 🎯 **O que você vai conseguir:**
- ✅ Site no ar em **clickpassagens.me**
- ✅ HTTPS automático
- ✅ Deploy automático via GitHub
- ✅ **100% GRÁTIS**

---

## 📋 **Passo a Passo:**

### **1️⃣ Registrar Domínio (5 min)**
🔗 https://www.namecheap.com/github-student-developer-pack/

- Registre: **clickpassagens.me** (grátis por 1 ano com GitHub Student)
- Anote as credenciais

### **2️⃣ Deploy Backend no Render (5 min)**
🔗 https://render.com

1. Criar conta (conectar GitHub)
2. **New + → Web Service**
3. Selecionar repositório `ClickPassagens`
4. Configurar:
   ```
   Name: clickpassagens-api
   Runtime: Python 3
   Build: pip install -r requirements.txt
   Start: gunicorn -c gunicorn.conf.py main:app
   ```
5. **Environment Variables:**
   ```
   FLASK_ENV=production
   SECRET_KEY=sua_chave_secreta_123456
   ```
6. **Create Web Service**
7. **Copiar URL** (ex: `https://clickpassagens-api.onrender.com`)

### **3️⃣ Deploy Frontend no Netlify (3 min)**
🔗 https://app.netlify.com

1. Criar conta (conectar GitHub)
2. **Add new site → Import from GitHub**
3. Selecionar `ClickPassagens`
4. **Build settings** (já configurado via `netlify.toml`):
   - Build: `npm run build`
   - Publish: `dist`
5. **Environment variables:**
   ```
   VITE_API_BASE_URL=https://clickpassagens-api.onrender.com/api
   VITE_APP_MODE=production
   ```
   ⚠️ **Substitua pela sua URL do Render!**
6. **Deploy site**

### **4️⃣ Conectar Domínio (2 min)**

#### No Netlify:
1. **Domain settings → Add custom domain**
2. Digite: `clickpassagens.me`
3. **Verify**

#### No Namecheap:
1. **Domain List → Manage**
2. **Advanced DNS → Add New Record:**
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

### **5️⃣ Ativar HTTPS (Automático)**

No Netlify:
1. **Domain settings → Verify DNS**
2. Aguardar ~5 minutos
3. HTTPS ativado automaticamente! ✅

---

## 🔄 **Atualizações (Automáticas):**

Faça push no GitHub:
```bash
git add .
git commit -m "Sua alteração"
git push origin master
```

Netlify e Render fazem deploy automaticamente! 🎉

---

## ⚠️ **Notas Importantes:**

### Backend no Render (Plano Free):
- **Dorme após 15 min de inatividade**
- Primeiro acesso demora ~30s para "acordar"
- 750 horas grátis/mês (suficiente!)

### Solução para "acordar" backend:
Use **UptimeRobot** (grátis):
1. Acesse: https://uptimerobot.com
2. Crie monitor HTTP
3. URL: `https://clickpassagens-api.onrender.com/api/health`
4. Intervalo: 5 minutos

### Alternativa sem "sono":
- **Railway.app** (também grátis, não dorme)
- **Fly.io** (grátis, sempre ativo)

---

## ✅ **Checklist Final:**

- [ ] Backend no Render rodando
- [ ] Frontend no Netlify buildado
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio .me registrado
- [ ] DNS configurado
- [ ] Site acessível via clickpassagens.me
- [ ] HTTPS ativo (cadeado verde)
- [ ] PWA instalável no mobile

---

## 🎉 **Pronto!**

Seu site está no ar em: **https://clickpassagens.me**

**Tempo total:** ~15-20 minutos
**Custo:** **R$ 0,00** (100% grátis!)

---

## 🆘 **Problemas?**

### Site não carrega:
- Verifique console do navegador (F12)
- Veja logs no Netlify/Render

### API não responde:
- Backend pode estar "acordando" (aguarde 30s)
- Verifique URL da API nas env vars do Netlify

### Domínio não funciona:
- Aguarde propagação DNS (até 48h)
- Use https://dnschecker.org para verificar

---

**🚀 Boa sorte! Qualquer dúvida, me chame!**
