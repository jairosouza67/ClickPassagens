# 🎓 Guia GitHub Student Pack - Deploy ClickPassagens

## 🚀 **RECOMENDAÇÃO: Use DigitalOcean!**

Com o GitHub Student Pack você tem **$200 em créditos** na DigitalOcean, o que te dá **mais de 30 meses de hospedagem GRÁTIS** no plano de $6/mês!

---

## 📝 **Passo a Passo Completo:**

### **FASE 1: Preparar Recursos Grátis**

#### 1️⃣ **Ativar Domínio .me (Namecheap)**
🔗 https://www.namecheap.com/github-student-developer-pack/

- Registre: **clickpassagens.me**
- Grátis por 1 ano
- Renove depois por ~$20/ano

#### 2️⃣ **Ativar Créditos DigitalOcean**
🔗 https://www.digitalocean.com/github-students

- Conecte sua conta GitHub
- Receba **$200 em créditos**
- Válido por 1 ano

---

### **FASE 2: Criar Servidor**

#### 3️⃣ **Criar Droplet na DigitalOcean**

1. **Escolher Imagem:**
   - Ubuntu 22.04 LTS x64

2. **Plano:**
   - Basic Shared CPU
   - **$6/mês**: 1 GB RAM, 1 vCPU, 25 GB SSD
   - Perfeito para seu projeto!

3. **Datacenter:**
   - **São Paulo** (melhor para Brasil)
   - Alternativa: New York

4. **Autenticação:**
   - Crie uma senha forte
   - Ou use SSH key (mais seguro)

5. **Finalizar:**
   - Hostname: `clickpassagens-prod`
   - Click **Create Droplet**
   - Anote o **IP do servidor**

---

### **FASE 3: Configurar DNS**

#### 4️⃣ **No DigitalOcean:**

1. Vá em **Networking → Domains**
2. Adicione: `clickpassagens.me`
3. Crie registros A:
   ```
   Type: A
   Hostname: @
   Value: [IP_DO_SEU_DROPLET]
   
   Type: A
   Hostname: www
   Value: [IP_DO_SEU_DROPLET]
   ```

#### 5️⃣ **No Namecheap:**

1. Vá em **Domain List → Manage**
2. Em **Nameservers**, escolha **Custom DNS**
3. Adicione:
   ```
   ns1.digitalocean.com
   ns2.digitalocean.com
   ns3.digitalocean.com
   ```
4. Aguarde propagação (5-48 horas, geralmente 1-2 horas)

---

### **FASE 4: Deploy da Aplicação**

#### 6️⃣ **Conectar ao Servidor**

Abra PowerShell ou terminal e conecte:
```bash
ssh root@[SEU_IP_AQUI]
```

#### 7️⃣ **Script Automático de Instalação**

Cole este script no servidor (vai instalar tudo automaticamente):

```bash
#!/bin/bash

echo "🚀 Instalando ClickPassagens..."

# 1. Atualizar sistema
apt update && apt upgrade -y

# 2. Instalar dependências
apt install -y python3-pip python3-venv nginx git certbot python3-certbot-nginx

# 3. Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 4. Criar usuário
adduser --disabled-password --gecos "" clickpassagens
usermod -aG sudo clickpassagens

# 5. Configurar aplicação
su - clickpassagens << 'EOF'
cd ~
git clone https://github.com/jairosouza67/ClickPassagens.git
cd ClickPassagens

# Python setup
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Criar .env
cat > .env << 'ENVEOF'
FLASK_ENV=production
SECRET_KEY=mude_esta_chave_secreta_123456789
DATABASE_URL=sqlite:///database/app.db
ENVEOF

# Frontend build
npm install
npm run build

# Inicializar banco
python3 init_db.py
EOF

echo "✅ Aplicação configurada!"

# 6. Criar serviço systemd
cat > /etc/systemd/system/clickpassagens.service << 'SERVICEEOF'
[Unit]
Description=ClickPassagens Flask App
After=network.target

[Service]
User=clickpassagens
WorkingDirectory=/home/clickpassagens/ClickPassagens
Environment="PATH=/home/clickpassagens/ClickPassagens/.venv/bin"
ExecStart=/home/clickpassagens/ClickPassagens/.venv/bin/gunicorn -c gunicorn.conf.py main:app

[Install]
WantedBy=multi-user.target
SERVICEEOF

# 7. Ativar serviço
systemctl daemon-reload
systemctl start clickpassagens
systemctl enable clickpassagens

# 8. Configurar Nginx
cat > /etc/nginx/sites-available/clickpassagens << 'NGINXEOF'
server {
    listen 80;
    server_name clickpassagens.me www.clickpassagens.me;

    location / {
        root /home/clickpassagens/ClickPassagens/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static {
        alias /home/clickpassagens/ClickPassagens/static;
    }
}
NGINXEOF

ln -s /etc/nginx/sites-available/clickpassagens /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "✅ Nginx configurado!"
echo ""
echo "🎉 Deploy concluído!"
echo "📍 Acesse: http://[SEU_IP_AQUI]"
echo ""
echo "⚠️  Próximo passo: Configurar SSL após DNS propagar"
```

Salve como `install.sh` e execute:
```bash
chmod +x install.sh
./install.sh
```

#### 8️⃣ **Configurar HTTPS (Após DNS Propagar)**

Aguarde 1-2 horas para o DNS propagar, depois:
```bash
certbot --nginx -d clickpassagens.me -d www.clickpassagens.me
```

Siga as instruções:
- Digite seu email
- Aceite os termos
- Escolha redirecionar HTTP para HTTPS

---

## 🔄 **Atualizar Site (Futuras Atualizações)**

No servidor, crie um script:
```bash
su - clickpassagens
nano ~/update.sh
```

Cole:
```bash
#!/bin/bash
cd ~/ClickPassagens
git pull origin master
source .venv/bin/activate
pip install -r requirements.txt
npm install
npm run build
sudo systemctl restart clickpassagens
sudo systemctl reload nginx
echo "✅ Atualização concluída!"
```

Tornar executável:
```bash
chmod +x ~/update.sh
```

**Para atualizar no futuro:**
```bash
ssh clickpassagens@[SEU_IP]
./update.sh
```

---

## 🎯 **Alternativa Mais Simples: Vercel (Frontend) + Render (Backend)**

Se achar muito complexo, pode usar serviços mais simples:

### **Frontend no Vercel (Grátis):**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### **Backend no Render (Grátis):**
1. Acesse: https://render.com
2. Conecte seu GitHub
3. Escolha o repositório
4. Configure como **Web Service**
5. Build: `pip install -r requirements.txt`
6. Start: `gunicorn -c gunicorn.conf.py main:app`

---

## 📊 **Comparação de Opções:**

| Opção | Custo (após créditos) | Dificuldade | Controle |
|-------|----------------------|-------------|----------|
| **DigitalOcean** | $6/mês (~R$30) | Média ⭐⭐⭐ | Total ✅ |
| **Vercel + Render** | Grátis (limitado) | Fácil ⭐ | Médio |
| **Heroku** | $7/mês | Fácil ⭐ | Médio |

---

## ✅ **Checklist de Deploy:**

### Antes:
- [ ] Código atualizado no GitHub
- [ ] `npm run build` funciona local
- [ ] Backend funciona local
- [ ] `.env` configurado

### Durante:
- [ ] Droplet criado na DigitalOcean
- [ ] DNS configurado no Namecheap
- [ ] Script de instalação executado
- [ ] Serviços rodando

### Depois:
- [ ] Site acessível pelo domínio
- [ ] HTTPS funcionando
- [ ] API respondendo
- [ ] PWA instalável no mobile
- [ ] Navegação mobile funcionando

---

## 🆘 **Troubleshooting:**

### Site não carrega:
```bash
# Verificar serviço
sudo systemctl status clickpassagens

# Ver logs
sudo journalctl -u clickpassagens -f
```

### Nginx com erro:
```bash
# Testar configuração
sudo nginx -t

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

### DNS não propagou:
```bash
# Verificar DNS
nslookup clickpassagens.me
```

---

## 💡 **Dicas Importantes:**

1. **Segurança:**
   - Mude a `SECRET_KEY` no `.env`
   - Configure firewall UFW
   - Mantenha o sistema atualizado

2. **Backup:**
   - Faça backup do banco de dados regularmente
   - Use DigitalOcean Snapshots (grátis)

3. **Monitoramento:**
   - Configure alertas de uptime
   - Use UptimeRobot (grátis)

4. **Custos:**
   - $200 de crédito = **33+ meses grátis**
   - Depois: apenas $6/mês (R$~30)

---

## 📚 **Recursos Úteis:**

- 🎓 **GitHub Student Pack:** https://education.github.com/pack
- 🌊 **DigitalOcean Tutorials:** https://www.digitalocean.com/community/tutorials
- 🔒 **Let's Encrypt:** https://letsencrypt.org/
- 📖 **Gunicorn Docs:** https://docs.gunicorn.org/
- 🚀 **Nginx Docs:** https://nginx.org/en/docs/

---

## 🎉 **Resultado Final:**

Após seguir este guia você terá:

✅ Site profissional com HTTPS  
✅ Domínio personalizado (.me)  
✅ PWA instalável no mobile  
✅ Backend robusto e escalável  
✅ Monitoramento e logs  
✅ Fácil de atualizar  
✅ **33+ meses de hospedagem GRÁTIS!**

---

**🚀 Qualquer dúvida durante o processo, me chame!**

**Boa sorte com o deploy! 🎓✈️**
