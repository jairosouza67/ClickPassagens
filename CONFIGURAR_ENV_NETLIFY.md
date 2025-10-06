# 🔧 CONFIGURAR VARIÁVEIS DE AMBIENTE NO NETLIFY

## 🔴 PROBLEMA:
O Netlify está usando uma API Key antiga do Firebase. Precisamos configurar as variáveis de ambiente corretamente no painel do Netlify.

---

## ✅ SOLUÇÃO PASSO A PASSO:

### 1️⃣ **Acesse o Painel do Netlify**

🔗 https://app.netlify.com/sites/clickpassagens/configuration/env

Ou manualmente:
1. Acesse: https://app.netlify.com/
2. Selecione o site: **clickpassagens**
3. Vá em: **Site configuration** → **Environment variables**

---

### 2️⃣ **Adicionar Variáveis Firebase**

Clique em **"Add a variable"** e adicione TODAS as seguintes variáveis:

#### **VITE_FIREBASE_API_KEY**
```
AIzaSyDAcLO47JOWxvEa-fpzDI02zd6C1ab6uGA
```

#### **VITE_FIREBASE_AUTH_DOMAIN**
```
clickpassagens-dee10.firebaseapp.com
```

#### **VITE_FIREBASE_PROJECT_ID**
```
clickpassagens-dee10
```

#### **VITE_FIREBASE_STORAGE_BUCKET**
```
clickpassagens-dee10.firebasestorage.app
```

#### **VITE_FIREBASE_MESSAGING_SENDER_ID**
```
334285502963
```

#### **VITE_FIREBASE_APP_ID**
```
1:334285502963:web:31fe2e939e4bf56aac3a86
```

#### **VITE_API_BASE_URL**
```
https://clickpassagens-api.onrender.com
```

#### **VITE_APP_MODE**
```
production
```

---

### 3️⃣ **Como Adicionar Cada Variável:**

Para cada variável acima:

1. Clique em **"Add a variable"** ou **"New variable"**
2. **Key:** Cole o nome da variável (ex: `VITE_FIREBASE_API_KEY`)
3. **Values:** 
   - **Production:** Cole o valor (ex: `AIzaSyDAcLO47JOWxvEa-fpzDI02zd6C1ab6uGA`)
   - **Deploy Preview:** (opcional) mesmo valor
   - **Branch deploys:** (opcional) mesmo valor
4. Clique em **"Create variable"**
5. Repita para todas as 8 variáveis acima

---

### 4️⃣ **Forçar Novo Deploy**

Após adicionar todas as variáveis:

**Opção 1: Pelo Painel do Netlify**
1. Vá em: **Deploys**
2. Clique em: **Trigger deploy** → **Clear cache and deploy site**

**Opção 2: Fazer Push (já feito)**
O próximo deploy já vai usar as novas variáveis.

---

### 5️⃣ **Aguardar Deploy**

- Aguarde 2-3 minutos
- Acompanhe em: https://app.netlify.com/sites/clickpassagens/deploys

---

### 6️⃣ **Testar Novamente**

Após o deploy:

1. **Limpe cache**: Ctrl+Shift+Delete
2. **Acesse**: https://clickpassagens.me
3. **Pressione F12** (Console)
4. **Clique em "Login com Google"**
5. **Veja console** - deve usar a API Key correta agora!

---

## 📋 CHECKLIST:

- [ ] Acessei Netlify Dashboard
- [ ] Fui em: Site configuration → Environment variables
- [ ] Adicionei VITE_FIREBASE_API_KEY
- [ ] Adicionei VITE_FIREBASE_AUTH_DOMAIN
- [ ] Adicionei VITE_FIREBASE_PROJECT_ID
- [ ] Adicionei VITE_FIREBASE_STORAGE_BUCKET
- [ ] Adicionei VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] Adicionei VITE_FIREBASE_APP_ID
- [ ] Adicionei VITE_API_BASE_URL
- [ ] Adicionei VITE_APP_MODE
- [ ] Fiz Trigger deploy ou aguardei novo deploy
- [ ] Aguardei 3 minutos
- [ ] Limpei cache do navegador
- [ ] Testei login novamente
- [ ] Funcionou! 🎉

---

## 🔍 COMO VERIFICAR SE DEU CERTO:

Após o novo deploy, no console deve aparecer:

```javascript
🔵 [Firebase] Auth: ... // objeto Auth
```

E a URL da requisição deve usar a API Key CORRETA:
```
https://identitytoolkit.googleapis.com/v1/projects?key=AIzaSyDAcLO47JOWxvEa-fpzDI02zd6C1ab6uGA
```

❌ **Errado (atual):**
```
key=AIzaSyAHGETZ-5oIu51ttPOex7gSIinQAzlnu4M
```

✅ **Correto (após configurar):**
```
key=AIzaSyDAcLO47JOWxvEa-fpzDI02zd6C1ab6uGA
```

---

## 🆘 SE TIVER DÚVIDA:

1. Tire um print da tela de Environment variables
2. Me envie
3. Te ajudo a verificar

---

**IMPORTANTE:** O arquivo `.env.production` não é usado automaticamente pelo Netlify. Você PRECISA configurar as variáveis no painel do Netlify!

---

## 🎯 LINK DIRETO:

Configure aqui:
🔗 https://app.netlify.com/sites/clickpassagens/configuration/env

**Faça isso agora e me avise quando terminar! 🚀**
