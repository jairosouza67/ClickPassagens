# 🔧 CONFIGURAÇÃO FIREBASE PARA clickpassagens.me

## 📋 INFORMAÇÕES DO SEU PROJETO:

- **Domínio Frontend:** https://clickpassagens.me
- **Backend API:** https://clickpassagens-api.onrender.com
- **Firebase Project:** clickpassagens-dee10

---

## ✅ PASSO A PASSO - CONFIGURAR FIREBASE

### 1️⃣ **Adicionar Domínios Autorizados no Firebase**

#### Acesse diretamente:
🔗 https://console.firebase.google.com/project/clickpassagens-dee10/authentication/settings

#### Ou manualmente:
1. Vá em: https://console.firebase.google.com/
2. Selecione: **clickpassagens-dee10**
3. Menu lateral: **Authentication**
4. Aba: **Settings** (Configurações)
5. Role até: **Authorized domains** (Domínios autorizados)

#### Clique em "Add domain" e adicione OS SEGUINTES:

✅ **Domínios para adicionar:**

```
clickpassagens.me
www.clickpassagens.me
localhost
```

**⚠️ IMPORTANTE:** Adicione **todos** os 3 domínios acima!

#### Como adicionar:
1. Clique em **"Add domain"**
2. Digite: `clickpassagens.me`
3. Clique em **"Add"**
4. Repita para: `www.clickpassagens.me`
5. Verifique se `localhost` já está (para desenvolvimento)

---

### 2️⃣ **Verificar Métodos de Login Ativos**

Ainda no Firebase Console:

1. **Authentication** → **Sign-in method**
2. Verifique se estão **ATIVADOS:**
   - ✅ **Email/Password** (Status: Enabled)
   - ✅ **Google** (Status: Enabled)

Se não estiverem ativos:
- Clique no método
- Clique em **"Enable"** (Ativar)
- Para Google: preencha o email de suporte
- Clique em **"Save"**

---

### 3️⃣ **Verificar Configurações do Render**

Já que você está usando Render, verifique se o CORS está configurado no backend.

No arquivo `main.py` (backend), deve ter algo assim:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://clickpassagens.me",
    "https://www.clickpassagens.me",
    "http://localhost:5173"
])
```

---

### 4️⃣ **Atualizar Variáveis de Ambiente (se necessário)**

Verifique se seu `.env.production` tem as URLs corretas:

```env
VITE_API_BASE_URL=https://clickpassagens-api.onrender.com
VITE_APP_MODE=production
```

---

## 🚀 DEPLOY E TESTE

### Passo 1: Verificar se o push foi feito
```powershell
git log --oneline -1
```
Deve mostrar: `fix: melhorar login Google...`

### Passo 2: Build de produção
```powershell
npm run build
```

### Passo 3: Onde está hospedado o frontend?
Como seu domínio é `clickpassagens.me`, me diga:
- Está no **Netlify**?
- Está no **Vercel**?  
- Está no **Render** também?
- Outro provedor?

Isso define como fazer o deploy.

---

## 🧪 TESTE APÓS CONFIGURAR

### 1. **Aguarde 2-3 minutos** após adicionar domínios no Firebase

### 2. **Limpe cache do navegador:**
- Pressione: `Ctrl + Shift + Delete`
- Marque: "Cache" e "Cookies"
- Clique em: "Limpar dados"

### 3. **Acesse:** https://clickpassagens.me

### 4. **Abra Console (F12):**
- Clique na aba "Console"

### 5. **Tente Login com Google:**
- Clique no botão "Login com Google"
- Veja o que acontece

### 6. **Verifique mensagens no Console:**

**✅ SUCESSO - Desktop:**
```
📱 [Firebase] Dispositivo: DESKTOP
🖥️ [Firebase] Desktop - usando POPUP...
✅ [Firebase] Popup retornou resultado
```

**✅ SUCESSO - Mobile:**
```
📱 [Firebase] Dispositivo: MOBILE
📱 [Firebase] Mobile detectado - usando REDIRECT...
🔄 [App] Detectado redirect Google em andamento...
```

**❌ ERRO - Domínio não autorizado:**
```
❌ [Firebase] Código: auth/unauthorized-domain
❌ [Firebase] Mensagem: Domain not whitelisted
```
**→ Solução:** Volte ao Firebase Console e adicione `clickpassagens.me`

**❌ ERRO - Popup bloqueado:**
```
❌ [Firebase] Código: auth/popup-blocked
```
**→ Solução:** Permita popups no navegador

---

## 📱 TESTE EM MOBILE

### Teste no celular:
1. Acesse pelo celular: https://clickpassagens.me
2. Clique em "Login com Google"
3. Deve **redirecionar** para página do Google
4. Escolha conta Google
5. Deve **voltar** para o site já logado

### Se não funcionar:
1. Abra Console no mobile (Chrome: chrome://inspect)
2. Veja mensagens de erro
3. Me envie o erro

---

## 🔍 CHECKLIST FINAL:

- [ ] Firebase Console aberto
- [ ] Domínios adicionados:
  - [ ] `clickpassagens.me`
  - [ ] `www.clickpassagens.me`
  - [ ] `localhost`
- [ ] Email/Password ativado
- [ ] Google ativado
- [ ] Aguardado 2-3 minutos
- [ ] Cache do navegador limpo
- [ ] Testado em Desktop
- [ ] Testado em Mobile
- [ ] Login funcionando! 🎉

---

## 🆘 SE NÃO FUNCIONAR:

**Me envie:**
1. ✅ Print dos domínios autorizados no Firebase
2. ✅ Mensagens de erro do Console (F12)
3. ✅ Onde está hospedado o frontend (Netlify/Vercel/Render/outro)
4. ✅ Desktop ou Mobile?

---

## 📝 PRÓXIMA AÇÃO:

**AGORA MESMO:**
1. Acesse: https://console.firebase.google.com/project/clickpassagens-dee10/authentication/settings
2. Adicione os domínios: `clickpassagens.me` e `www.clickpassagens.me`
3. Aguarde 2-3 minutos
4. Acesse: https://clickpassagens.me
5. Teste o login!

**Me avise quando fizer isso para eu te ajudar com os próximos passos! 🚀**
