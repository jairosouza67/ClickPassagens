# 🌐 Guia Rápido: Conectar Domínio .me ao Netlify

## ✅ **Passo a Passo Simplificado**

---

## 🎯 **PARTE 1: Netlify (5 minutos)**

### **1. Adicionar Domínio:**
1. https://app.netlify.com
2. Seu site → **"Domain settings"**
3. **"Add custom domain"**
4. Digite: `clickpassagens.me`
5. **"Verify"** → **"Yes, add domain"**

### **2. Adicionar www (opcional):**
1. **"Add domain"** novamente
2. Digite: `www.clickpassagens.me`
3. **"Verify"** → **"Yes, add domain"**

### **3. Anote os DNS Records:**
O Netlify vai mostrar algo como:
```
A Record:  @    → 75.2.60.5
CNAME:     www  → seu-site.netlify.app
```

---

## 📝 **PARTE 2: Namecheap (5 minutos)**

### **1. Acessar DNS:**
1. https://www.namecheap.com → Login
2. **Domain List** → **Manage** (clickpassagens.me)
3. Aba **"Advanced DNS"**

### **2. Remover Registros Antigos:**
Delete qualquer:
- Parking redirects
- URL Redirects
- CNAME com @

### **3. Adicionar Novos Registros:**

**Add New Record → A Record:**
```
Type:  A Record
Host:  @
Value: 75.2.60.5
TTL:   Automatic
```
Clique no ✓ para salvar

**Add New Record → CNAME:**
```
Type:  CNAME Record  
Host:  www
Value: seu-site.netlify.app
TTL:   Automatic
```
Clique no ✓ para salvar

---

## ⏰ **PARTE 3: Aguardar (1-2 horas)**

### **Verificar Propagação:**
- https://dnschecker.org
- Digite: `clickpassagens.me`
- Espere aparecer: `75.2.60.5`

---

## 🔒 **PARTE 4: Ativar HTTPS (5 minutos)**

### **Após DNS Propagar:**

1. Volte no Netlify → **"Domain settings"**
2. Seção **"HTTPS"** → **"Verify DNS configuration"**
3. Aguarde 5 minutos
4. HTTPS será ativado automaticamente! ✅

### **Ativar Redirecionamentos:**
1. ✅ **"Force HTTPS"** (HTTP → HTTPS)
2. ✅ **"Redirect www to apex"** (www → domínio principal)

---

## 🧪 **PARTE 5: Testar**

### **Teste 1: DNS**
```bash
nslookup clickpassagens.me
# Deve retornar: 75.2.60.5
```

### **Teste 2: Site**
Abra no navegador:
- `http://clickpassagens.me` → Redireciona para HTTPS
- `https://clickpassagens.me` → Site carrega! ✅
- `https://www.clickpassagens.me` → Redireciona para acima

### **Teste 3: HTTPS**
- Cadeado verde na barra 🔒
- Certificado válido

---

## 📊 **Resumo dos Registros DNS**

```
┌──────────┬──────┬─────────────────────────┐
│ Type     │ Host │ Value                   │
├──────────┼──────┼─────────────────────────┤
│ A Record │ @    │ 75.2.60.5              │
│ CNAME    │ www  │ seu-site.netlify.app   │
└──────────┴──────┴─────────────────────────┘
```

---

## 🚨 **Problemas Comuns**

### **"DNS não propagou"**
⏰ Normal! Aguarde 1-2 horas
🌍 Verifique em: https://dnschecker.org

### **"HTTPS não ativa"**
1. DNS precisa estar propagado primeiro
2. Clique "Verify DNS configuration"
3. Aguarde 5-10 minutos

### **"Site não abre"**
1. Limpe cache: Ctrl+Shift+Delete
2. Tente modo anônimo
3. Verifique DNS com `nslookup clickpassagens.me`

---

## ⏱️ **Timeline**

```
Agora → Configurar Netlify (5 min)
  ↓
     → Configurar Namecheap (5 min)
  ↓
     → AGUARDAR propagação (1-2h) ☕
  ↓
     → Ativar HTTPS no Netlify (5 min)
  ↓
✅ PRONTO! clickpassagens.me funcionando!
```

---

## 🎉 **Resultado Final**

✅ `clickpassagens.me` → Seu site  
✅ `www.clickpassagens.me` → Redireciona  
✅ HTTPS ativo 🔒  
✅ Domínio profissional!  
✅ Grátis por 1 ano!  

---

## 🔗 **Links Úteis**

- **Netlify:** https://app.netlify.com
- **Namecheap:** https://www.namecheap.com
- **DNS Checker:** https://dnschecker.org
- **What's My DNS:** https://www.whatsmydns.net

---

## 💡 **Dica: Netlify DNS (Alternativa)**

Para simplificar, use Netlify DNS:

1. Netlify → **"Use Netlify DNS"**
2. Copie os nameservers
3. Namecheap → Mude para nameservers do Netlify
4. Netlify gerencia tudo automaticamente!

**Mais fácil, mas perde controle do DNS.**

---

**🚀 Boa sorte com seu domínio personalizado!**
